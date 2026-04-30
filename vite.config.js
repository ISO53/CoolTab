import {fileURLToPath, URL} from "node:url";

import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        proxy: {
            "/yahoo-query1": {
                target: "https://query1.finance.yahoo.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/yahoo-query1/, ""),
            },
            "/yahoo-query2": {
                target: "https://query2.finance.yahoo.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/yahoo-query2/, ""),
            },
        },
    },
});
