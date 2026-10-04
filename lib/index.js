/**
 * dsh-qwen-think-toggle host service.
 * Exposes one Typert Remote, `dshQwenThink/get` + `dshQwenThink/set`, callable
 * from the web client through the api gateway. The methods talk to the local
 * Ollama-compatible proxy's /toggle endpoint, which flips the proxy's
 * persisted think default for Qwen models.
 */

var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};

import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import fs from 'node:fs';

const PROXY_TOGGLE = 'http://127.0.0.1:8000/toggle';
const RPC_LOG = 'D:/ollama/think-rpc.log';
function rpcLog(msg) {
  try { fs.appendFileSync(RPC_LOG, `${new Date().toISOString()} ${msg}\n`); } catch {}
}

let QwenThinkService = (() => {
    let _classSuper = TypertRemoteService;
    let _instanceExtraInitializers = [];
    let _get_decorators, _toggle_decorators;
    return class QwenThinkService extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_decorators = [Remote('get')];
            _toggle_decorators = [Remote('toggle')];
            __esDecorate(this, null, _get_decorators, { kind: "method", name: "get", static: false, private: false, access: { has: obj => "get" in obj, get: obj => obj.get }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _toggle_decorators, { kind: "method", name: "toggle", static: false, private: false, access: { has: obj => "toggle" in obj, get: obj => obj.toggle }, metadata: _metadata }, null, _instanceExtraInitializers);
        }
        static inject = [];

        constructor(ctx, config = {}) {
            super(ctx, 'dshQwenThink');
            __runInitializers(this, _instanceExtraInitializers);
            void config;
        }

        async probe() {
            const r = await fetch(PROXY_TOGGLE);
            const j = await r.json();
            return { ok: true, think: j.think === null ? null : !!j.think };
        }

        async write(think) {
            const r = await fetch(PROXY_TOGGLE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ think: !!think }),
            });
            const j = await r.json();
            return { ok: true, think: !!j.think };
        }

        async get() {
            rpcLog('get() called');
            try { return await this.probe(); } catch (e) { return { ok: false, think: null }; }
        }

        async toggle() {
            rpcLog('toggle() called');
            try {
                const cur = await this.probe();
                const target = !(cur.think ?? true);
                rpcLog(`toggle() target=${target}`);
                return await this.write(target);
            } catch (e) {
                rpcLog(`toggle() ERROR ${e?.message}`);
                return { ok: false, think: null };
            }
        }
    };
})();
export { QwenThinkService };
export default QwenThinkService;
