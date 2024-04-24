import '@endo/init/legacy.js'; // UNTIL https://github.com/endojs/endo/issues/1686
import { expect, test } from 'vitest';
import { makeClientMarshaller } from '../src/marshal.js';

test('inclue boardIDs in string version of synthetic remotables', () => {
  const m = makeClientMarshaller();
  const capData = { body: '#"$0.Brand"', slots: ['board0123'] };
  const str = String(m.fromCapData(capData));
  expect(str).toBe('[object Alleged: Brand#board0123]');
});
