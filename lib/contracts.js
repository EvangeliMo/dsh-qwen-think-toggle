import { z } from 'zod';

const strict = (t, s) => ({ mode: 'strict', typeSymbol: t, schema: s });
const descriptor = (method, params, result, symbol) => ({
  id: `dsh-qwen-think-toggle#dshQwenThink/${method}`,
  service: 'dshQwenThink',
  namespace: 'dshQwenThink',
  method,
  invocation: { kind: 'direct' },
  parameters: params,
  result: strict(`dsh-qwen-think-toggle/types#${symbol}`, result),
});

const booleanSchema = z.boolean();
const boolOrNull = z.union([z.boolean(), z.null()]);
const stateObj = z.object({ ok: z.boolean(), think: boolOrNull });

export const descriptors = [
  descriptor('get', [], stateObj, 'State'),
  descriptor('toggle', [], stateObj, 'State'),
];

export const TYPERT_REMOTE = { package: 'dsh-qwen-think-toggle', descriptors };
export const TYPERT = {
  package: 'dsh-qwen-think-toggle',
  face: 'host',
  schemas: [],
  invocations: descriptors,
  model: { services: [], events: [], objects: [] },
};
