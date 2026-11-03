import type { BuildOptions } from "esbuild";

export function appConfig(production: boolean): BuildOptions {
  return {
    entryPoints: { app: "app/index.ts" },
    outdir: "dist",
    entryNames: "[name]",
    chunkNames: "chunks/[name]-[hash]",
    bundle: true,
    splitting: true,
    format: "esm",
    platform: "browser",
    target: ["es2022"],
    minify: production,
    sourcemap: true,
    treeShaking: true,
    metafile: true,
  };
}
