// esbuild 打包客户端到 lib/client.js（提交产物，安装不自动构建）
import { buildSync } from 'esbuild';
import fs from "node:fs";
const PLUGIN_ID = 'dsh-qwen-think-toggle';
const result = buildSync({
  entryPoints: ['src/client/index.jsx'],
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: 'es2020',
  external: ['react', '@deepseek-ai/dsh-client-ui-primitives'],
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  write: false,
});
const code = `window.__ModuleLoader__.load({ id: ${JSON.stringify(PLUGIN_ID)}, factory: (require) => {
  var module = { exports: {} }; var exports = module.exports;
  ${result.outputFiles[0].text}
  return module.exports; } });`;
if (process.argv.includes('--check')) {
  console.log('client bundle built (check):', code.length, 'bytes');
} else {
  fs.mkdirSync('lib', { recursive: true });
  fs.writeFileSync('lib/client.js', code);
  console.log('built lib/client.js:', code.length, 'bytes');
}
