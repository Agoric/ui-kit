import 'ses';
import '@endo/eventual-send/shim.js';

const consoleTaming = import.meta.env.PROD ? 'safe' : 'unsafe';

lockdown({
  errorTaming: 'unsafe',
  overrideTaming: 'severe',
  consoleTaming,
});

Error.stackTraceLimit = Infinity;
