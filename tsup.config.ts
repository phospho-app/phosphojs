import { defineConfig } from "tsup"

// Split in two folders, otherwise because of bundle: false it will pick the wrong file during require
export default defineConfig({
    entry: [
        "src/index.ts"
    ],
    format: ["cjs", "esm"],
    bundle: true,
    outDir: "dist",
    splitting: true,
    dts: true,
    sourcemap: false,
    cjsInterop: true,
    keepNames: true,
    minifyIdentifiers: false,
    minify: false,
    clean: true,
})