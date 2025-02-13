import { defineConfig, loadEnv } from 'vite'
// import react from '@vitejs/plugin-react-swc'
import preact from '@preact/preset-vite';
import { splitVendorChunkPlugin } from 'vite'
import { existsSync } from 'fs'

const loaded_env = loadEnv("development", process.cwd(), "");

const buildTarget = loaded_env.BUILD_TARGET;
const isBuildLocal = loaded_env.BUILD_LOCAL === "1";

if (buildTarget === undefined) {
  throw new Error(`MISSING env BUILD_TARGET`);
}

if (isBuildLocal === undefined) {
  throw new Error(`MISSING env BUILD_LOCAL`);
}

const indexPath = `./src/packages/${buildTarget}/index.ts`;
const fileExists = existsSync(indexPath);

if (fileExists === false) {
  throw new Error(`File ${indexPath} does not exist`);
}

console.log("vite.config.ts => ", JSON.stringify({ buildTarget, indexPath, fileExists }));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    splitVendorChunkPlugin(),
  ],
  css: {},
  base: isBuildLocal ? undefined : `https://tapit.mhub.se/cdn/${buildTarget}/`,
  root: '.',
  build: {
    rollupOptions: {
      input: indexPath,
      plugins: [
      ],
    },
    cssMinify: true,
    outDir: `./build/${buildTarget}`,
    manifest: true,
    reportCompressedSize: true,
    sourcemap: false,
    minify: true
  },
  server: {
    watch: {
      usePolling: true
    },
    hmr: true,
    host: "localhost",
    port: 5173
  }
})
