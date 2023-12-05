/* eslint-disable no-use-before-define */
/* eslint-disable import/extensions */
import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { makeAgoricChainStorageWatcher } from '../src/chainStorageWatcher';
import { axiosClient } from '../src/vstorageQuery';
import { AgoricChainStoragePathKind } from '../src/types';

global.harden = val => val;

const fakeApiAddr = 'https://fake.api';
const fakeChainId = 'agoric-unit-test-1';
const marshal = (val: unknown) => val;
const unmarshal = (val: unknown) => val;

let watcher: ReturnType<typeof makeAgoricChainStorageWatcher>;
let mockAxios: MockAdapter;
let onError: ReturnType<typeof vi.fn>;

vi.mock('../src/marshal', () => ({ makeMarshal: () => {} }));

describe('makeAgoricChainStorageWatcher', () => {
  beforeEach(() => {
    onError = vi.fn();
    mockAxios = new MockAdapter(axiosClient);
    watcher = makeAgoricChainStorageWatcher(fakeApiAddr, fakeChainId, onError, {
      fromCapData: unmarshal,
      // @ts-expect-error mock doesnt require capdata type
      toCapData: marshal,
      unserialize: unmarshal,
      // @ts-expect-error mock doesnt require capdata type
      serialize: marshal,
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('can handle multiple paths at once', async () => {
    const expected1 = 'test result';
    const expected2 = ['child1', 'child2'];
    const path = 'test.fakePath';
    const requestUrl1 = `${fakeApiAddr}/agoric/vstorage/data/${path}`;
    const requestUrl2 = `${fakeApiAddr}/agoric/vstorage/children/${path}`;

    mockAxios
      .onGet(requestUrl1)
      .replyOnce(() =>
        createFetchResponse(AgoricChainStoragePathKind.Data, expected1),
      );
    mockAxios
      .onGet(requestUrl2)
      .replyOnce(() =>
        createFetchResponse(AgoricChainStoragePathKind.Children, expected2),
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
    expect(mockAxios.history.get.length).toBe(2);
  });

  it('can do single queries', async () => {
    const expected = 126560000000;
    const path = 'test.fakePath';

    mockAxios
      .onGet()
      .replyOnce(() =>
        createFetchResponse(
          AgoricChainStoragePathKind.Data,
          JSON.stringify(expected),
          undefined,
          false,
        ),
      );

    const value = watcher.queryOnce([AgoricChainStoragePathKind.Data, path]);

    vi.advanceTimersToNextTimer();
    expect(await value).toEqual(expected);
    expect(mockAxios.history.get.length).toBe(1);

    vi.advanceTimersToNextTimer();
    expect(mockAxios.history.get.length).toBe(1);
  });

  it('notifies for changed data values', async () => {
    const expected1 = 'test result';
    const path = 'test.fakePath';

    mockAxios.onGet().replyOnce(_ => {
      return createFetchResponse(
        AgoricChainStoragePathKind.Data,
        expected1,
        123,
      );
    });

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
    expect(mockAxios.history.get.length).toBe(1);

    const expected2 = `${expected1}foo`;
    mockAxios.onGet().replyOnce(_ => {
      return createFetchResponse(
        AgoricChainStoragePathKind.Data,
        expected2,
        456,
      );
    });

    vi.advanceTimersToNextTimer();
    expect(await values[1].value).toEqual(expected2);
    expect(mockAxios.history.get.length).toBe(2);
  });

  it('notifies for changed children values', async () => {
    const expected1 = ['child1', 'child2'];
    const path = 'test.fakePath';

    mockAxios.onGet().replyOnce(() => {
      return createFetchResponse(
        AgoricChainStoragePathKind.Children,
        expected1,
      );
    });

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
    expect(mockAxios.history.get.length).toBe(1);

    const expected2 = [...expected1, 'child3'];
    mockAxios.onGet().replyOnce(() => {
      return createFetchResponse(
        AgoricChainStoragePathKind.Children,
        expected2,
      );
    });

    vi.advanceTimersToNextTimer();
    expect(await values[1].value).toEqual(expected2);
    expect(mockAxios.history.get.length).toBe(2);
  });

  it('can unsubscribe from paths', async () => {
    const expected1 = ['child1', 'child2'];
    const path = 'test.fakePath';

    mockAxios.onGet().replyOnce(_ => {
      return createFetchResponse(
        AgoricChainStoragePathKind.Children,
        expected1,
      );
    });

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
    expect(mockAxios.history.get.length).toBe(1);

    unsub();

    vi.advanceTimersToNextTimer();
    expect(mockAxios.history.get.length).toBe(1);
  });

  it('queryOnce retries up to two times on server errors', async () => {
    const expected = 126560000000;
    const path = 'test.fakePath';

    const failedResponse = createFetchResponse(
      AgoricChainStoragePathKind.Data,
      '{}',
      undefined,
      false,
      500,
    );
    mockAxios
      .onGet()
      .replyOnce(() => failedResponse)
      .onGet()
      .replyOnce(() => failedResponse)
      .onGet()
      .replyOnce(() =>
        createFetchResponse(
          AgoricChainStoragePathKind.Data,
          JSON.stringify(expected),
          undefined,
          false,
          200,
        ),
      );

    const value = watcher.queryOnce([AgoricChainStoragePathKind.Data, path]);

    vi.advanceTimersByTimeAsync(1000);
    expect(await value).toEqual(expected);
    expect(mockAxios.history.get.length).toBe(3);
  });

  it('queryOnce throws on three consecutive server errors', async () => {
    const expected = 126560000000;
    const path = 'test.fakePath';

    const failedResponse = createFetchResponse(
      AgoricChainStoragePathKind.Data,
      '{}',
      undefined,
      false,
      500,
    );
    mockAxios
      .onGet()
      .replyOnce(() => failedResponse)
      .onGet()
      .replyOnce(() => failedResponse)
      .onGet()
      .replyOnce(() => failedResponse);

    const value = watcher.queryOnce([AgoricChainStoragePathKind.Data, path]);
    vi.advanceTimersByTimeAsync(1000);

    await expect(async () => value).rejects.toThrow(
      'Request failed with status code 500',
    );
    expect(mockAxios.history.get.length).toBe(3);
  });

  it('watchLatest retries up to two times on server errors', async () => {
    const expected1 = 'test result';
    const path = 'test.fakePath';

    const failedResponse = createFetchResponse(
      AgoricChainStoragePathKind.Data,
      '{}',
      undefined,
      true,
      500,
    );
    mockAxios
      .onGet()
      .replyOnce(() => failedResponse)
      .onGet()
      .replyOnce(() => failedResponse)
      .onGet()
      .replyOnce(() =>
        createFetchResponse(AgoricChainStoragePathKind.Data, expected1),
      );

    const result = new Promise(res => {
      watcher.watchLatest<string>(
        [AgoricChainStoragePathKind.Data, path],
        value => res(value),
      );
    });
    vi.advanceTimersByTimeAsync(1000);
    expect(await result).toEqual(expected1);
    expect(mockAxios.history.get.length).toBe(3);
  });

  it('watchLatest calls onError after three consecutive server errors', async () => {
    const expected1 = 'test result';
    const path = 'test.fakePath';

    const failedResponse = createFetchResponse(
      AgoricChainStoragePathKind.Data,
      '{}',
      undefined,
      true,
      500,
    );
    mockAxios
      .onGet()
      .replyOnce(() => failedResponse)
      .onGet()
      .replyOnce(() => failedResponse)
      .onGet()
      .replyOnce(() => failedResponse);

    const result = new Promise((res, rej) => {
      watcher.watchLatest<string>(
        [AgoricChainStoragePathKind.Data, path],
        value => res(value),
      );
      setTimeout(() => rej(new Error('timeout')), 1000);
    });
    vi.advanceTimersByTimeAsync(1000);

    await expect(async () => result).rejects.toThrow('timeout');
    expect(onError).toHaveBeenCalledWith(
      new Error('Request failed with status code 500'),
    );
    expect(mockAxios.history.get.length).toBe(3);
  });
});

const createFetchResponse = (
  kind: AgoricChainStoragePathKind,
  value: unknown,
  blockHeight?: number,
  json = true,
  code = 200,
) =>
  new Promise<unknown[]>(res => {
    res([
      code,
      kind === AgoricChainStoragePathKind.Children
        ? { children: value }
        : {
            value: {
              values: json ? [JSON.stringify(marshal(value))] : undefined,
              value: !json ? value : undefined,
              blockHeight: String(blockHeight ?? 0),
            },
          },
    ]);
  });

const future = <T>() => {
  let resolve: (value: T) => void;
  let isComplete = false;
  const value = new Promise(res => {
    resolve = (v: T) => {
      isComplete = true;
      res(v);
    };
  });

  // @ts-expect-error defined in promise constructor
  return { resolve, value, isComplete: () => isComplete };
};
