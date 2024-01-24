/* eslint-disable no-use-before-define */
/* eslint-disable import/extensions */
import { makeClientMarshaller } from './marshal.js';
import { AgoricChainStoragePathKind } from './types.js';
import { vstorageQuery, pathToKey } from './vstorageQuery.js';
import type { UpdateHandler } from './types.js';

type Subscriber<T> = {
  onUpdate: UpdateHandler<T>;
  onError?: (log: string) => void;
};

const defaults = {
  newPathQueryDelayMs: 20,
  refreshLowerBoundMs: 4000,
  refreshUpperBoundMs: 8000,
};

const randomRefreshPeriod = (
  refreshLowerBoundMs: number,
  refreshUpperBoundMs: number,
) =>
  Math.round(Math.random() * (refreshUpperBoundMs - refreshLowerBoundMs)) +
  refreshLowerBoundMs;

const makePathSubscriber = <T>(
  onUpdate: UpdateHandler<T>,
  onError?: (log: string) => void,
) => ({
  onUpdate,
  onError,
});

export type ChainStorageWatcher = ReturnType<
  typeof makeAgoricChainStorageWatcher
>;

/**
 This is used to avoid notifying subscribers for already-seen
 values. For `data` queries, it is the stringified blockheight of where the
 value appeared. For `children` queries, it is the stringified array of
 children.
 */
type LatestValueIdentifier = string;

/**
 * Periodically queries the most recent data from chain storage.
 * @param apiAddr API server URL
 * @param chainId the chain id to use
 * @param onError
 * @param marshaller CapData marshal to use
 * @param refreshLowerBoundMs
 * @param refreshUpperBoundMs
 * @returns
 */
export const makeAgoricChainStorageWatcher = (
  apiAddr: string,
  chainId: string,
  onError?: (e: Error) => void,
  marshaller = makeClientMarshaller(),
  refreshLowerBoundMs = defaults.refreshLowerBoundMs,
  refreshUpperBoundMs = defaults.refreshUpperBoundMs,
) => {
  /**
   * Map from vstorage paths to `[identifier, value]` pairs containing their
   * most recent response values and their {@link LatestValueIdentifier}.
   */
  const latestValueCache = new Map<
    string,
    [identifier: LatestValueIdentifier, value: unknown]
  >();

  const watchedPathsToSubscribers = new Map<string, Set<Subscriber<unknown>>>();
  const watchedPathsToRefreshTimeouts = new Map<
    string,
    ReturnType<typeof setTimeout>
  >();

  const refreshDataForPath = async (
    path: [AgoricChainStoragePathKind, string],
  ) => {
    const queueNextRefresh = () => {
      globalThis.clearTimeout(watchedPathsToRefreshTimeouts.get(pathKey));
      const timeout = globalThis.setTimeout(
        () => refreshDataForPath(path),
        randomRefreshPeriod(refreshLowerBoundMs, refreshUpperBoundMs),
      );
      watchedPathsToRefreshTimeouts.set(pathKey, timeout);
    };

    const pathKey = pathToKey(path);
    let response;
    try {
      response = await vstorageQuery(apiAddr, marshaller.fromCapData, path);
    } catch (e: unknown) {
      console.error(`Error querying vstorage for path ${path}:`, e);
      if (onError && e instanceof Error) {
        onError(e);
      }
      // Try again later until client tells us to stop.
      queueNextRefresh();
      return;
    }

    const { value, blockHeight } = response;
    const [latestValueIdentifier, latestValue] =
      latestValueCache.get(pathKey) || [];

    if (
      latestValue &&
      (blockHeight === latestValueIdentifier ||
        // Blockheight is undefined so fallback to using the stringified value
        // as the identifier, as is the case for `children` queries.
        (blockHeight === undefined &&
          (value === latestValue || JSON.stringify(value) === latestValue)))
    ) {
      // The value isn't new, don't emit.
      queueNextRefresh();
      return;
    }

    latestValueCache.set(pathKey, [
      // Fallback to using stringified value as identifier if no blockHeight,
      // as is the case for `children` queries.
      blockHeight ?? JSON.stringify(value),
      value,
    ]);

    const subscribersForPath = watchedPathsToSubscribers.get(pathKey);
    subscribersForPath?.forEach(s => {
      s.onUpdate(harden(value));
    });
    queueNextRefresh();
  };

  const stopWatching = (pathKey: string, subscriber: Subscriber<unknown>) => {
    const subscribersForPath = watchedPathsToSubscribers.get(pathKey);
    if (!subscribersForPath?.size) {
      throw new Error(
        `already stopped watching path ${pathKey}, nothing to do`,
      );
    }

    if (subscribersForPath.size === 1) {
      watchedPathsToSubscribers.delete(pathKey);
      latestValueCache.delete(pathKey);
      globalThis.clearTimeout(watchedPathsToRefreshTimeouts.get(pathKey));
      watchedPathsToRefreshTimeouts.delete(pathKey);
    } else {
      subscribersForPath.delete(subscriber);
    }
  };

  const watchLatest = <T>(
    path: [AgoricChainStoragePathKind, string],
    onUpdate: (latestValue: T) => void,
  ) => {
    const pathKey = pathToKey(path);
    const subscriber = makePathSubscriber(onUpdate);

    const latestValue = latestValueCache.get(pathKey);
    if (latestValue) {
      subscriber.onUpdate(harden(latestValue[1]) as T);
    }

    const samePathSubscribers = watchedPathsToSubscribers.get(pathKey);
    if (samePathSubscribers !== undefined) {
      samePathSubscribers.add(subscriber as Subscriber<unknown>);
    } else {
      watchedPathsToSubscribers.set(
        pathKey,
        new Set([subscriber as Subscriber<unknown>]),
      );
      refreshDataForPath(path);
    }

    return () => stopWatching(pathKey, subscriber as Subscriber<unknown>);
  };

  const queryOnce = async <T>(path: [AgoricChainStoragePathKind, string]) => {
    const { value } = await vstorageQuery<T>(
      apiAddr,
      marshaller.fromCapData,
      path,
    );
    return value;
  };

  // Assumes argument is an unserialized presence.
  const presenceToSlot = (o: unknown) => marshaller.toCapData(o).slots[0];

  const queryBoardAux = <T>(boardObjects: unknown[]) => {
    const boardIds = boardObjects.map(presenceToSlot);
    return boardIds.map(id =>
      queryOnce<T>([
        AgoricChainStoragePathKind.Data,
        `published.boardAux.${id}`,
      ]),
    );
  };

  return {
    watchLatest,
    chainId,
    apiAddr,
    marshaller,
    queryOnce,
    queryBoardAux,
  };
};
