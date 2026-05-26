import {fileURLToPath, URL} from "node:url";
import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "node:fs";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        {
            name: "build-extension",
            closeBundle() {
                const distPath = fileURLToPath(new URL("./dist", import.meta.url));
                const chromePath = path.join(distPath, "chrome");
                const firefoxPath = path.join(distPath, "firefox");

                // Get all files currently in dist (the fresh build)
                const files = fs.readdirSync(distPath);

                if (!fs.existsSync(chromePath)) fs.mkdirSync(chromePath, {recursive: true});
                if (!fs.existsSync(firefoxPath)) fs.mkdirSync(firefoxPath, {recursive: true});

                for (const file of files) {
                    const src = path.join(distPath, file);
                    // Skip the folders we just created if they somehow existed
                    if (file === "chrome" || file === "firefox") continue;

                    const chromeDest = path.join(chromePath, file);
                    const firefoxDest = path.join(firefoxPath, file);

                    fs.cpSync(src, chromeDest, {recursive: true});
                    fs.cpSync(src, firefoxDest, {recursive: true});

                    // Remove original from dist root
                    fs.rmSync(src, {recursive: true, force: true});
                }

                // Copy background.js from src
                const bgSrc = fileURLToPath(new URL("./src/background.js", import.meta.url));
                fs.copyFileSync(bgSrc, path.join(chromePath, "background.js"));
                fs.copyFileSync(bgSrc, path.join(firefoxPath, "background.js"));

                // Copy manifests from src
                const chromeManifestSrc = fileURLToPath(new URL("./src/manifest.json", import.meta.url));
                const firefoxManifestSrc = fileURLToPath(new URL("./src/firefox_manifest.json", import.meta.url));

                fs.copyFileSync(chromeManifestSrc, path.join(chromePath, "manifest.json"));
                fs.copyFileSync(firefoxManifestSrc, path.join(firefoxPath, "manifest.json"));

                console.log("Build organized into dist/chrome and dist/firefox. Root cleaned.");
            },
        },
    ],
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
