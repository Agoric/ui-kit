/* eslint-disable import/extensions */
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import axiosRetry from 'axios-retry';
import type { FromCapData } from '@endo/marshal';
import { AgoricChainStoragePathKind } from './types.js';

export const pathToKey = (path: [AgoricChainStoragePathKind, string]) =>
  path.join('.');

export const keyToPath = (key: string) => {
  const parts = key.split('.');
  return [parts[0], parts.slice(1).join('.')] as [
    AgoricChainStoragePathKind,
    string,
  ];
};

const parseIfJSON = (d: string | unknown) => {
  if (typeof d !== 'string') return d;
  try {
    return JSON.parse(d);
  } catch {
    return d;
  }
};

// Exported for testing.
export const axiosClient = axios.create();

axiosRetry(axiosClient, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
});

export const vstorageQuery = async <T>(
  node: string,
  unmarshal: FromCapData<string>,
  [pathKind, path]: [AgoricChainStoragePathKind, string],
): Promise<{ blockHeight?: string; value: T }> => {
  const url = new URL(`${node}/agoric/vstorage/${pathKind}/${path}`).href;
  const request = axiosClient.get(url);

  return request.then(({ data: res }) => {
    if (pathKind === AgoricChainStoragePathKind.Children) {
      return { value: res.children, blockHeight: undefined };
    }

    if (!res.value) {
      return {
        value: res.value,
      };
    }

    const data = parseIfJSON(res.value);

    const latestValue =
      typeof data.values === 'undefined'
        ? parseIfJSON(data.value)
        : parseIfJSON(data.values[data.values.length - 1]);

    const unserialized =
      typeof latestValue.slots === 'undefined'
        ? latestValue
        : unmarshal(latestValue);

    return {
      blockHeight: data.blockHeight,
      value: unserialized,
    };
  });
};
