// Host-service instantiation test for dsh-qwen-think-toggle.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const req = createRequire('C:/Users/momol/.dsh/profiles/web/noop.js');

const pluginUrl = pathToFileURL(req.resolve('dsh-qwen-think-toggle')).href;
const cordisUrl = pathToFileURL(req.resolve('@deepseek-ai/cordis')).href;
const typertUrl = pathToFileURL(req.resolve('@deepseek-ai/dsh-typert-protocol')).href;

const { default: Svc } = await import(pluginUrl);
const { Context } = await import(cordisUrl);
const { remoteMethods } = await import(typertUrl);

const ctx = new Context();
const svc = new Svc(ctx, {});
console.log('service name:', svc.name);
console.log('typertRemote.serviceKey:', svc.typertRemote?.serviceKey);
console.log('remoteMethods:', JSON.stringify(remoteMethods(svc)));

const g = await svc.get();
console.log('host.get() ->', JSON.stringify(g));
const s = await svc.set(false);
console.log('host.set(false) ->', JSON.stringify(s));
const s2 = await svc.set(true);
console.log('host.set(true) ->', JSON.stringify(s2));
const contractsUrl = pathToFileURL(req.resolve('dsh-qwen-think-toggle/typert')).href;
const contracts = await import(contractsUrl);
console.log('TYPERT.face:', contracts.TYPERT.face, 'descriptors:', contracts.TYPERT_REMOTE.descriptors.length);
console.log('ALL HOST CHECKS DONE');
