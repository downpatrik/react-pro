import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build, context, type BuildContext, type BuildOptions, type Plugin } from "esbuild";
import { appConfig } from "./configs/esbuild.app.config.js";
import { libConfig } from "./configs/esbuild.lib.config.js";

process.chdir(fileURLToPath(new URL(".", import.meta.url)));
const mode = process.argv[2] ?? "prod";
const target = process.argv[3] ?? "all";
if (!["dev", "prod"].includes(mode) || !["all", "app", "lib"].includes(target)) {
  throw new Error("Использование: node --import tsx build.ts <dev|prod> [all|app|lib]");
}
const production = mode === "prod";
const includeApp = target !== "lib";

const report: Plugin = {
  name: "build-report",
  setup(builder) {
    builder.onEnd(async (result) => {
      if (result.errors.length || !result.metafile) return;
      if (builder.initialOptions.entryPoints && builder.initialOptions.outdir === "dist") {
        await cp("app/index.html", "dist/index.html");
      }
      const name = builder.initialOptions.outdir === "dist" ? "app" : builder.initialOptions.format;
      await mkdir("dist/meta", { recursive: true });
      await writeFile(`dist/meta/${name}.json`, JSON.stringify(result.metafile, null, 2));
      console.log(`[${mode}] ${name}: сборка завершена`);
    });
  },
};

if (target === "all") await rm("dist", { recursive: true, force: true });
else if (target === "lib") await rm("dist/lib", { recursive: true, force: true });
else await rm("dist/chunks", { recursive: true, force: true });

const options: BuildOptions[] = [];
if (includeApp) options.push(appConfig(production));
if (target !== "app") options.push(libConfig("esm", production), libConfig("cjs", production));
for (const option of options) {
  option.absWorkingDir = process.cwd();
  option.plugins = [report];
}

if (production) {
  await Promise.all(options.map((option) => build(option)));
} else {
  const contexts: BuildContext[] = [];
  try {
    for (const option of options) contexts.push(await context(option));
    for (const ctx of contexts) await ctx.watch();
    if (includeApp) {
      const server = await contexts[0].serve({ servedir: "dist", host: "127.0.0.1", port: 4177 });
      console.log(`Dev: http://127.0.0.1:${server.port} (watch, без минификации)`);
    }
    const stop = async () => {
      await Promise.all(contexts.map((ctx) => ctx.dispose()));
      process.exit(0);
    };
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  } catch (error) {
    await Promise.all(contexts.map((ctx) => ctx.dispose()));
    throw error;
  }
}
