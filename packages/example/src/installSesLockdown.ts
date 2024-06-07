/* global lockdown */
import 'ses';
import '@endo/eventual-send/shim.js';
import { Buffer } from 'buffer';

globalThis.Buffer = Buffer;
 const consoleTaming = import.meta.env.PROD ? 'safe' : 'unsafe';

lockdown({
  errorTaming: 'unsafe',
  overrideTaming: 'severe',
  consoleTaming,
});

Error.stackTraceLimit = Infinity;