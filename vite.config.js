import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from 'vite-plugin-vue-devtools'

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
    plugins: [vue(), vueDevTools(),],

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent Vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
        host: host || "0.0.0.0",
        hmr: host
            ? {
                protocol: "ws",
                host,
                port: 1421,
            }
            : undefined,
        watch: {
            // 3. tell Vite to ignore watching `src-tauri`
            ignored: ["**/src-tauri/**"],
        },
        proxy: {
            '/preview': {
                target: 'http://127.0.0.1:8090',
                changeOrigin: true,
            },
            '/web/': {
                target: 'http://127.0.0.1:37891',
                changeOrigin: true,
                configure: (proxy) => {
                    proxy.on('proxyReq', (proxyReq) => {
                        proxyReq.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
                        proxyReq.setHeader('Pragma', 'no-cache')
                        proxyReq.setHeader('Expires', '0')
                    })
                },
            },
        },
    },
}));
