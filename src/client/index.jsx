/**
 * dsh-qwen-think-toggle browser half: an input-bar button to the RIGHT of the
 * restart button (`conversation.input.left` slot, order 11 — restart is 10).
 * It toggles thinking for Qwen local models via the host's dshQwenThink Remote
 * (which reaches the local proxy's /toggle endpoint through the api gateway).
 */

const React = require('react');
const primitives = require('@deepseek-ai/dsh-client-ui-primitives');
const { Button, Tooltip } = primitives;
const { TYPERT_REMOTE } = require('../../lib/contracts.js');

export const name = 'dsh-qwen-think-toggle';
export const inject = ['slots', 'locale', 'remote'];

const NS = 'dsh-qwen-think-toggle';

const zh = {
  on: 'local思考 开',
  off: 'local思考 关',
  loading: '…',
  title: '切换本地千问模型的思考开关',
};
const en = {
  on: 'local Think ON',
  off: 'local Think OFF',
  loading: '…',
  title: 'Toggle Qwen thinking',
};

function makeApi(remote) {
  const r = remote.dshQwenThink;
  // 网关返回值形如 { ok, value }，必须解包 value 才是宿主方法的返回体
  const unwrap = (x) => (x && typeof x === 'object' && 'value' in x ? x.value : x);
  return {
    get: async () => unwrap(await r.get()),
    toggle: async () => unwrap(await r.toggle()),
  };
}

function ThinkToggle({ api }) {
  const [think, setThink] = React.useState(null);
  React.useEffect(() => {
    api.get().then((res) => setThink(res && res.ok ? res.think : null)).catch(() => setThink(null));
  }, [api]);
  const label = think === null ? zh.loading : think ? zh.on : zh.off;
  const onClick = async () => {
    try {
      const res = await api.toggle();
      setThink(res && res.ok ? res.think : null);
    } catch (e) {
      console.error('[dsh-qwen-think-toggle] toggle failed:', e);
    }
  };
  const color = think === true ? 'var(--dsw-alias-state-success-primary)' : 'var(--dsw-alias-label-tertiary)';
  return React.createElement(
    Tooltip,
    { label: zh.title, side: 'top', delayMs: 500 },
    React.createElement(
      Button,
      {
        type: 'button',
        variant: 'ghost',
        size: 'md',
        'aria-label': label,
        disabled: think === null,
        onClick,
        className: 'dsh-qwen-think-toggle',
      },
      React.createElement('span', {
        style: { display: 'inline-flex', alignItems: 'center', gap: 4, color, fontSize: 12 },
      }, [
        React.createElement('span', {
          style: { width: 8, height: 8, borderRadius: 4, background: color, display: 'inline-block' },
        }),
        label,
      ]),
    ),
  );
}

async function apply(ctx) {
  const disposeRemote = await ctx.remote.$mount(TYPERT_REMOTE);
  const disposeLocale = ctx.locale.register(NS, { zh, en });
  const feature = ctx.inject(['remote.dshQwenThink'], (scope) => {
    const api = makeApi(scope.remote);
    scope.slots.inject('conversation.input.left', () => scope.slots.register({
      name: 'conversation.input.left',
      id: NS,
      order: 11, // 排在 dsh-restart-button(order 10) 右边
      locale: NS,
      inject: () => ({ api }),
    }, ThinkToggle));
    return () => {};
  });
  return async () => {
    await feature.dispose();
    disposeLocale();
    await disposeRemote();
  };
}

export default { apply, inject };
