import type { BuildOptions, Format } from "esbuild";

export function libConfig(
  format: Extract<Format, "esm" | "cjs">,
  production: boolean,
): BuildOptions {
  return {
    entryPoints: ["lib/index.ts", "lib/math.ts", "lib/string.ts"],
    outdir: `dist/lib/${format}`,
    outExtension: { ".js": format === "cjs" ? ".cjs" : ".js" },
    bundle: true,
    external: ["react", "react/*", "lodash", "lodash/*"],
    format,
    platform: "neutral",
    target: ["es2022"],
    minify: production,
    sourcemap: true,
    treeShaking: true,
    metafile: true,
  };
}
