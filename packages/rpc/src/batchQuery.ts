/* eslint-disable import/extensions */
import type { FromCapData } from '@endo/marshal';
import { AgoricChainStoragePathKind } from './types';

export const pathToKey = (path: [AgoricChainStoragePathKind, string]) =>
  path.join('.');

export const keyToPath = (key: string) => {
  const parts = key.split('.');
  return [parts[0], parts.slice(1).join('.')] as [
    AgoricChainStoragePathKind,
    string,
  ];
};

export const batchVstorageQuery = (
  node: string,
  unmarshal: FromCapData<string>,
  paths: [AgoricChainStoragePathKind, string][],
) => {
  const options = {
    method: 'POST',
    body: JSON.stringify(
      paths.map((path, index) => ({
        jsonrpc: '2.0',
        id: index,
        method: 'abci_query',
        params: { path: `/custom/vstorage/${path[0]}/${path[1]}` },
      })),
    ),
  };

  return fetch(node, options)
    .then(res => res.json())
    .then(res =>
      Object.fromEntries(
        (Array.isArray(res) ? res : [res]).map(entry => {
          const { id: index } = entry;
          if (entry.result.response.code) {
            return [
              pathToKey(paths[index]),
              { error: entry.result.response.log },
            ];
          }

          if (!entry.result.response.value) {
            return [
              pathToKey(paths[index]),
              {
                error: `Cannot parse value of response for path [${
                  paths[index]
                }]: ${JSON.stringify(entry)}`,
              },
            ];
          }

          const data = JSON.parse(window.atob(entry.result.response.value));

          if (paths[index][0] === AgoricChainStoragePathKind.Children) {
            return [
              pathToKey(paths[index]),
              { value: data.children, blockHeight: undefined },
            ];
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const parseIfJSON = (d: any) => {
            try {
              return JSON.parse(d);
            } catch {
              return d;
            }
          };
          const value = parseIfJSON(data.value);

          const latestValue = Object.hasOwn(value, 'values')
            ? parseIfJSON(value.values[value.values.length - 1])
            : value;

          const unserialized = Object.hasOwn(latestValue, 'slots')
            ? unmarshal(latestValue)
            : latestValue;

          return [
            pathToKey(paths[index]),
            {
              blockHeight: value.blockHeight,
              value: unserialized,
            },
          ];
        }),
      ),
    );
};
