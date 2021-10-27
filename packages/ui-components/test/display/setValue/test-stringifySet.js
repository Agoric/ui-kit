// eslint-disable-next-line import/no-extraneous-dependencies
import { test } from '@agoric/swingset-vat/tools/prepare-test-env-ava.js';

import { stringifySet } from '../../../src/display/setValue/stringifySet.js';

test('stringifySet', t => {
  t.is(stringifySet(['foo', 'bar']), '2');
});
