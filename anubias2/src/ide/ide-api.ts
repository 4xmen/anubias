import { lstat } from 'node:fs/promises';
import { cwd } from 'node:process';
import { ipcRenderer } from 'electron';
import router from "./router";
import Store from 'electron-store';
const storage = new Store();

// ipcRenderer.on('main-process-message', (_event, ...args) => {
//   console.log('[Receive Main-process message]:', ...args)
// })
// ipcRenderer.on('hello-world', (_event, ...args) => {
//   console.log('Hello world:', ...args)
// });
ipcRenderer.on('redirect', (_event, ...args) => {
  console.log('redirect:', ...args);
  router.push(args[0]);
});

//Listen for async message from main process to get data
ipcRenderer.on('electron-store-get-data', (_event, key) => {
  _event.sender.send('electron-store-send-data', storage.get(key));
})

//Listen for async message from main process to set data
ipcRenderer.on('electron-store-set-data', (_event, key, data) => {
  _event.sender.send('electron-store-send-data', storage.set(key, data));
})


lstat(cwd()).then(stats => {
  console.log('[fs.lstat]', stats)
}).catch(err => {
  console.error(err)
});

// ipcRenderer.send('close',true);