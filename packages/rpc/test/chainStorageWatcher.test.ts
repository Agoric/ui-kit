/* eslint-disable no-use-before-define */
/* eslint-disable import/extensions */
import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest';
import { makeAgoricChainStorageWatcher } from '../src/chainStorageWatcher';
import { AgoricChainStoragePathKind } from '../src/types';

const fetch = vi.fn();
global.fetch = fetch;
global.harden = val => val;

const fakeRpcAddr = 'https://agoric-rpc.vitest-nodes.com:443';
const fakeChainId = 'agoric-unit-test-1';
const marshal = (val: unknown) => val;
const unmarshal = (val: unknown) => val;

let watcher: ReturnType<typeof makeAgoricChainStorageWatcher>;

vi.mock('../src/marshal', () => ({ makeMarshal: () => {} }));

describe('makeAgoricChainStorageWatcher', () => {
  beforeEach(() => {
    watcher = makeAgoricChainStorageWatcher(
      fakeRpcAddr,
      fakeChainId,
      undefined,
      {
        fromCapData: unmarshal,
        // @ts-expect-error mock doesnt require capdata type
        toCapData: marshal,
        unserialize: unmarshal,
        // @ts-expect-error mock doesnt require capdata type
        serialize: marshal,
      },
    );
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('can handle multiple paths at once', async () => {
    const expected1 = 'test result';
    const expected2 = ['child1', 'child2'];
    const path = 'vitest.fakePath';

    fetch.mockResolvedValue(
      createFetchResponse([
        { value: expected1, kind: AgoricChainStoragePathKind.Data, id: 0 },
        { value: expected2, kind: AgoricChainStoragePathKind.Children, id: 1 },
      ]),
    );

    const value1 = new Promise(res => {
      watcher.watchLatest<string>(
        [AgoricChainStoragePathKind.Data, path],
        value => res(value),
      );
    });
    vi.advanceTimersByTime(15);
    const value2 = new Promise(res => {
      watcher.watchLatest<string[]>(
        [AgoricChainStoragePathKind.Children, path],
        value => res(value),
      );
    });
    vi.advanceTimersByTime(5);

    expect(await value1).toEqual(expected1);
    expect(await value2).toEqual(expected2);
    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith(fakeRpcAddr, {
      method: 'POST',
      body: JSON.stringify([
        {
          jsonrpc: '2.0',
          id: 0,
          method: 'abci_query',
          params: { path: `/custom/vstorage/data/${path}` },
        },
        {
          jsonrpc: '2.0',
          id: 1,
          method: 'abci_query',
          params: { path: `/custom/vstorage/children/${path}` },
        },
      ]),
    });
  });

  it('can handle unserialized values', async () => {
    const expected = 'abc123';
    const path = 'vitest.unserializedValue';

    fetch.mockResolvedValue(
      createUnserializedFetchResponse([
        { value: expected, kind: AgoricChainStoragePathKind.Data, id: 0 },
      ]),
    );

    const value = new Promise(res => {
      watcher.watchLatest<string>(
        [AgoricChainStoragePathKind.Data, path],
        val => res(val),
      );
    });
    vi.advanceTimersToNextTimer();

    expect(await value).toEqual(expected);
  });

  it('can do single queries', async () => {
    const expected = 126560000000;
    const path = 'vitest.unserializedValue';

    fetch.mockResolvedValue(
      createUnserializedFetchResponse([
        { value: expected, kind: AgoricChainStoragePathKind.Data, id: 0 },
      ]),
    );

    const value = watcher.queryOnce<string>([
      AgoricChainStoragePathKind.Data,
      path,
    ]);

    vi.advanceTimersToNextTimer();
    expect(await value).toEqual(expected);
    expect(fetch).toHaveBeenCalledOnce();

    vi.advanceTimersToNextTimer();
    expect(fetch).toHaveBeenCalledOnce();
  });

  it('notifies for changed data values', async () => {
    const expected1 = 'test result';
    const path = 'vitest.fakePath';

    fetch.mockResolvedValue(
      createFetchResponse([
        {
          id: 0,
          value: expected1,
          kind: AgoricChainStoragePathKind.Data,
          blockHeight: 123,
        },
      ]),
    );

    const values = [future(), future()];
    watcher.watchLatest<string>(
      [AgoricChainStoragePathKind.Data, path],
      value => {
        if (values[0].isComplete()) {
          values[1].resolve(value);
        } else {
          values[0].resolve(value);
        }
      },
    );
    vi.advanceTimersToNextTimer();
    expect(await values[0].value).toEqual(expected1);
    expect(fetch).toHaveBeenCalledOnce();

    const expected2 = `${expected1}foo`;
    fetch.mockResolvedValue(
      createFetchResponse([
        {
          id: 0,
          value: expected2,
          kind: AgoricChainStoragePathKind.Data,
          blockHeight: 456,
        },
      ]),
    );

    vi.advanceTimersToNextTimer();
    expect(await values[1].value).toEqual(expected2);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('notifies for changed children values', async () => {
    const expected1 = ['child1', 'child2'];
    const path = 'vitest.fakePath';

    fetch.mockResolvedValue(
      createFetchResponse([
        {
          id: 0,
          value: expected1,
          kind: AgoricChainStoragePathKind.Children,
        },
      ]),
    );

    const values = [future<string[]>(), future<string[]>()];
    watcher.watchLatest<string[]>(
      [AgoricChainStoragePathKind.Children, path],
      value => {
        if (values[0].isComplete()) {
          values[1].resolve(value);
        } else {
          values[0].resolve(value);
        }
      },
    );
    vi.advanceTimersToNextTimer();
    expect(await values[0].value).toEqual(expected1);
    expect(fetch).toHaveBeenCalledOnce();

    const expected2 = [...expected1, 'child3'];
    fetch.mockResolvedValue(
      createFetchResponse([
        {
          id: 0,
          value: expected2,
          kind: AgoricChainStoragePathKind.Children,
        },
      ]),
    );

    vi.advanceTimersToNextTimer();
    expect(await values[1].value).toEqual(expected2);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('handles errors', async () => {
    const expectedLog = 'test error log';
    const expectedCodespace = 'sdk';
    const expectedCode = 6;
    const path = 'vitest.fakePath';

    fetch.mockResolvedValue(
      createFetchResponse([
        {
          id: 0,
          value: null,
          kind: AgoricChainStoragePathKind.Children,
          code: expectedCode,
          log: expectedLog,
          codespace: 'sdk',
        },
      ]),
    );

    const result = future<{ log: string; codespace?: string; code?: number }>();
    watcher.watchLatest<string>(
      [AgoricChainStoragePathKind.Children, path],
      _value => {
        /* noop */
      },
      (log: string, code?: number, codespace?: string) =>
        result.resolve({ log, code, codespace }),
    );
    vi.advanceTimersToNextTimer();
    const { log, code, codespace } = await result.value;
    expect(log).toEqual(expectedLog);
    expect(code).toEqual(expectedCode);
    expect(codespace).toEqual(expectedCodespace);
  });

  it('can unsubscribe from paths', async () => {
    const expected1 = ['child1', 'child2'];
    const path = 'vitest.fakePath';

    fetch.mockResolvedValue(
      createFetchResponse([
        {
          id: 0,
          value: expected1,
          kind: AgoricChainStoragePathKind.Children,
        },
      ]),
    );

    const values = [future<string[]>(), future<string[]>()];
    const unsub = watcher.watchLatest<string[]>(
      [AgoricChainStoragePathKind.Children, path],
      value => {
        if (values[0].isComplete()) {
          values[1].resolve(value);
        } else {
          values[0].resolve(value);
        }
      },
    );
    vi.advanceTimersToNextTimer();
    expect(await values[0].value).toEqual(expected1);
    expect(fetch).toHaveBeenCalledOnce();

    unsub();

    vi.advanceTimersToNextTimer();
    expect(fetch).toHaveBeenCalledOnce();
  });
});

const createFetchResponse = (
  values: {
    id: number;
    value: unknown;
    kind?: AgoricChainStoragePathKind;
    blockHeight?: number;
    code?: number;
    log?: string;
    codespace?: string;
  }[],
) => ({
  json: () =>
    new Promise(res =>
      res(
        values.map(
          ({ kind, value, blockHeight, code = 0, log, id, codespace }) => {
            const data =
              kind === AgoricChainStoragePathKind.Children
                ? { children: value }
                : {
                    value: JSON.stringify({
                      values: [JSON.stringify(marshal(value))],
                      blockHeight: String(blockHeight ?? 0),
                    }),
                  };

            return {
              id,
              result: {
                response: {
                  value: window.btoa(JSON.stringify(data)),
                  code,
                  log,
                  codespace,
                },
              },
            };
          },
        ),
      ),
    ),
});

const createUnserializedFetchResponse = (
  values: {
    kind?: AgoricChainStoragePathKind;
    value: unknown;
    blockHeight?: number;
    code?: number;
    log?: string;
    id: number;
  }[],
) => ({
  json: () =>
    new Promise(res =>
      res(
        values.map(({ value, code = 0, log, id }) => {
          const data = {
            value,
          };

          return {
            id,
            result: {
              response: {
                value: window.btoa(JSON.stringify(data)),
                code,
                log,
              },
            },
          };
        }),
      ),
    ),
});

const future = <T>() => {
  let resolve: (value: T) => void;
  let isComplete = false;
  const value = new Promise<T>(res => {
    resolve = (v: T) => {
      isComplete = true;
      res(v);
    };
  });

  // @ts-expect-error defined in promise constructor
  return { resolve, value, isComplete: () => isComplete };
};
