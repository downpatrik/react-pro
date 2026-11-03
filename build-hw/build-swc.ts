import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { transformFile } from "@swc/core";
import { swcLibConfig } from "./configs/swc.lib.config.js";

process.chdir(fileURLToPath(new URL(".", import.meta.url)));
await rm("dist/swc", { recursive: true, force: true });
const sources = (await readdir("lib")).filter((file) => file.endsWith(".ts"));

for (const type of ["es6", "commonjs"] as const) {
  const outdir = `dist/swc/${type === "es6" ? "esm" : "cjs"}`;
  await mkdir(outdir, { recursive: true });
  await writeFile(
    `${outdir}/package.json`,
    JSON.stringify({ type: type === "es6" ? "module" : "commonjs" }, null, 2),
  );
  for (const source of sources) {
    const outputName = source.replace(/\.ts$/, ".js");
    const outputPath = `${outdir}/${outputName}`;
    const result = await transformFile(`lib/${source}`, {
      ...swcLibConfig(type),
      sourceFileName: `../../../lib/${source}`,
      outputPath,
    });
    if (!result.map) throw new Error(`SWC не создал source map: ${source}`);
    await writeFile(outputPath, `${result.code}\n//# sourceMappingURL=${outputName}.map\n`);
    await writeFile(`${outputPath}.map`, result.map);
  }
  console.log(`[swc] ${type}: ${sources.length} модулей, minify + sourceMaps`);
}
