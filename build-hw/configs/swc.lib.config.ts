import type { Options } from "@swc/core";

export function swcLibConfig(type: "es6" | "commonjs"): Options {
  return {
    swcrc: false,
    configFile: false,
    jsc: {
      parser: { syntax: "typescript" },
      target: "es2022",
      minify: { compress: true, mangle: true },
    },
    module: { type },
    minify: true,
    sourceMaps: true,
    inlineSourcesContent: true,
  };
}
