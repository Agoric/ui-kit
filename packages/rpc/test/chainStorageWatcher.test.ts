/* eslint-disable no-use-before-define */
/* eslint-disable import/extensions */
import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest';
import { makeAgoricChainStorageWatcher } from '../src/chainStorageWatcher';
import { AgoricChainStoragePathKind } from '../src/types';

const fetch = vi.fn();
global.fetch = fetch;
global.harden = val => val;

const fakeApiAddr = 'https://fake.api';
const fakeChainId = 'agoric-unit-test-1';
const marshal = (val: unknown) => val;
const unmarshal = (val: unknown) => val;

let watcher: ReturnType<typeof makeAgoricChainStorageWatcher>;

vi.mock('../src/marshal', () => ({ makeMarshal: () => {} }));

describe('makeAgoricChainStorageWatcher', () => {
  beforeEach(() => {
    watcher = makeAgoricChainStorageWatcher(
      fakeApiAddr,
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
    const path = 'test.fakePath';
    const requestUrl1 = `${fakeApiAddr}/agoric/vstorage/data/${path}`;
    const requestUrl2 = `${fakeApiAddr}/agoric/vstorage/children/${path}`;

    fetch.mockImplementation(requestUrl => {
      if (requestUrl === requestUrl1) {
        return createFetchResponse(AgoricChainStoragePathKind.Data, expected1);
      }
      return createFetchResponse(
        AgoricChainStoragePathKind.Children,
        expected2,
      );
    });

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

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith(requestUrl1);
    expect(fetch).toHaveBeenCalledWith(requestUrl2);
  });

  it('can do single queries', async () => {
    const expected = 126560000000;
    const path = 'test.fakePath';

    fetch.mockImplementation(_ => {
      return createFetchResponse(
        AgoricChainStoragePathKind.Data,
        JSON.stringify(expected),
        undefined,
        false,
      );
    });

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
    const path = 'test.fakePath';

    fetch.mockImplementation(_ => {
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
    expect(fetch).toHaveBeenCalledOnce();

    const expected2 = `${expected1}foo`;
    fetch.mockImplementation(_ => {
      return createFetchResponse(
        AgoricChainStoragePathKind.Data,
        expected2,
        456,
      );
    });

    vi.advanceTimersToNextTimer();
    expect(await values[1].value).toEqual(expected2);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('notifies for changed children values', async () => {
    const expected1 = ['child1', 'child2'];
    const path = 'test.fakePath';

    fetch.mockImplementation(_ => {
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
    expect(fetch).toHaveBeenCalledOnce();

    const expected2 = [...expected1, 'child3'];
    fetch.mockImplementation(_ => {
      return createFetchResponse(
        AgoricChainStoragePathKind.Children,
        expected2,
      );
    });

    vi.advanceTimersToNextTimer();
    expect(await values[1].value).toEqual(expected2);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('can unsubscribe from paths', async () => {
    const expected1 = ['child1', 'child2'];
    const path = 'test.fakePath';

    fetch.mockImplementation(_ => {
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
    expect(fetch).toHaveBeenCalledOnce();

    unsub();

    vi.advanceTimersToNextTimer();
    expect(fetch).toHaveBeenCalledOnce();
  });
});

const createFetchResponse = (
  kind: AgoricChainStoragePathKind,
  value: unknown,
  blockHeight?: number,
  json = true,
) => ({
  json: () =>
    new Promise(res =>
      res(
        kind === AgoricChainStoragePathKind.Children
          ? { children: value }
          : {
              value: JSON.stringify({
                values: json ? [JSON.stringify(marshal(value))] : undefined,
                value: !json ? value : undefined,
                blockHeight: String(blockHeight ?? 0),
              }),
            },
      ),
    ),
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
