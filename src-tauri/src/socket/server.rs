//! Simple local-only WebSocket broadcast server for Tauri 2.
//!
//! - Binds exclusively to 127.0.0.1
//! - Tries a fixed list of high, uncommon ports
//! - Starts automatically in .setup()
//! - Clean shutdown is guaranteed via Drop (no orphan sockets)
//! - Only supports broadcasting a payload from a Tauri command to all clients

use futures_util::{SinkExt, StreamExt};
use std::net::SocketAddr;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use tauri::State;
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::{broadcast, Mutex};
use tokio_tungstenite::accept_async;
use tokio_tungstenite::tungstenite::Message;

/// Fixed list of high, uncommon ports (very low chance of conflict).
const CANDIDATE_PORTS: &[u16] = &[
    38473, 39127, 40291, 41753, 42819, 43967, 45103, 46241, 47389, 48527,
];

/// Shared state of the WebSocket server.
/// When this struct is dropped (app exit), the server is cleanly stopped.
pub struct WsServerState {
    pub tx: broadcast::Sender<String>,
    pub port: Mutex<Option<u16>>,
    accept_task: Mutex<Option<tokio::task::JoinHandle<()>>>,
    shutting_down: AtomicBool,
}

impl WsServerState {
    pub fn new() -> Self {
        let (tx, _) = broadcast::channel(64);
        Self {
            tx,
            port: Mutex::new(None),
            accept_task: Mutex::new(None),
            shutting_down: AtomicBool::new(false),
        }
    }
}

impl Drop for WsServerState {
    fn drop(&mut self) {
        // This runs only when the App really exits and the managed state is dropped.
        if self.shutting_down.swap(true, Ordering::SeqCst) {
            return;
        }

        println!("[ws-server] Shutting down (Drop)…");

        // Abort the accept loop if it is still running
        if let Some(handle) = self.accept_task.get_mut().take() {
            handle.abort();
        }

        println!("[ws-server] Shutdown complete – no orphan sockets left.");
    }
}

/// Try to bind to one of the candidate ports on 127.0.0.1.
async fn bind_listener() -> Result<(TcpListener, u16), String> {
    for &port in CANDIDATE_PORTS {
        let addr = SocketAddr::from(([127, 0, 0, 1], port));
        match TcpListener::bind(addr).await {
            Ok(listener) => {
                println!("[ws-server] Listening on ws://127.0.0.1:{}", port);
                return Ok((listener, port));
            }
            Err(e) => {
                println!("[ws-server] Port {} busy ({}) – trying next…", port, e);
            }
        }
    }
    Err("Could not bind any of the candidate ports".into())
}

/// Handle a single WebSocket connection.
async fn handle_connection(
    stream: TcpStream,
    addr: SocketAddr,
    tx: broadcast::Sender<String>,
) {
    let ws_stream = match accept_async(stream).await {
        Ok(ws) => ws,
        Err(e) => {
            eprintln!("[ws-server] Handshake failed from {}: {}", addr, e);
            return;
        }
    };

    println!("[ws-server] Client connected: {}", addr);

    let (mut sink, mut stream) = ws_stream.split();
    let mut rx = tx.subscribe();

    let write_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if sink.send(Message::Text(msg.into())).await.is_err() {
                break;
            }
        }
    });

    // Ignore any messages coming from the client
    while let Some(Ok(_)) = stream.next().await {}

    write_task.abort();
    println!("[ws-server] Client disconnected: {}", addr);
}

/// Start the WebSocket server. Call this from `.setup()`.
pub async fn start_ws_server(state: Arc<WsServerState>) -> Result<(), String> {
    if state.shutting_down.load(Ordering::SeqCst) {
        return Err("Server is already shutting down".into());
    }

    let (listener, port) = bind_listener().await?;

    {
        let mut p = state.port.lock().await;
        *p = Some(port);
    }

    let tx = state.tx.clone();
    let state_clone = state.clone();

    let accept_handle = tokio::spawn(async move {
        loop {
            if state_clone.shutting_down.load(Ordering::SeqCst) {
                break;
            }

            match listener.accept().await {
                Ok((stream, addr)) => {
                    let tx = tx.clone();
                    tokio::spawn(handle_connection(stream, addr, tx));
                }
                Err(e) => {
                    if !state_clone.shutting_down.load(Ordering::SeqCst) {
                        eprintln!("[ws-server] Accept error: {}", e);
                    }
                    break;
                }
            }
        }
        println!("[ws-server] Accept loop finished");
    });

    {
        let mut task = state.accept_task.lock().await;
        *task = Some(accept_handle);
    }

    Ok(())
}

/// Tauri command: broadcast a payload to all connected clients.
#[tauri::command]
pub async fn broadcast_to_clients(
    payload: String,
    state: State<'_, Arc<WsServerState>>,
) -> Result<(), String> {
    let _ = state.tx.send(payload);
    Ok(())
}

/// Optional helper: return the port the server is currently listening on.
#[tauri::command]
pub async fn get_ws_port(state: State<'_, Arc<WsServerState>>) -> Result<Option<u16>, String> {
    Ok(*state.port.lock().await)
}