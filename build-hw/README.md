# Современная сборка фронтенд-приложений

Настройки и логика находятся в `configs/`, короткие команды запуска - в
`package.json`. Требуется Node.js 20.19+.

## Запуск

```bash
cd build-hw
npm ci
npm run dev # http://localhost:4177
```

Из корня репозитория команды доступны через `npm --prefix build-hw run ...`.
Dev и production используют одну папку dist; запускайте их последовательно.

## Конфиги

- `configs/esbuild.config.ts` запускает сборки через API esbuild, переключает
  dev/prod, очищает результаты, копирует HTML, сохраняет metafile и управляет watch.
- `configs/esbuild.app.config.ts` задаёт entry point SPA, чанки, минификацию,
  tree shaking и source maps.
- `configs/esbuild.lib.config.ts` задаёт три entry points, внешние React/lodash,
  форматы ESM/CJS и карты.
- `configs/swc.esm.json` и `configs/swc.cjs.json` задают TypeScript-парсер,
  target ES2022, формат модулей, минификацию и source maps.

## Результаты

- `dist/app.js`, `dist/index.html`, `dist/chunks/*.js` - SPA и ленивые страницы.
- `dist/lib/esm/*.js`, `dist/lib/cjs/*.cjs` - три entry points esbuild.
- `dist/swc/esm/*.js`, `dist/swc/cjs/*.js` - три модуля SWC.
- `dist/meta/{app,esm,cjs}.json` - графы сборки esbuild.
- Для всех JS-файлов создаются source maps.

ESM наследует type module из пакета. Команда `postswc:cjs` записывает package.json
с type commonjs в дерево SWC, чтобы относительные импорты .js работали без замены.
Очистка SWC-результатов выполняется через prebuild:swc.