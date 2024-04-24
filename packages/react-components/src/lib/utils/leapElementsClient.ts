import type { WalletClient } from '@leapwallet/elements';
import { useWalletClient } from '@cosmos-kit/react';
import { useMemo } from 'react';

export const useElementsWalletClient = (): WalletClient => {
  const { client } = useWalletClient();

  // @ts-expect-error Mismatch between `Long` type in `signDoc`
  const walletClient: WalletClient = useMemo(() => {
    return {
      enable: (chainIds: string | string[]) => {
        return client!.enable!(chainIds);
      },
      getAccount: async (chainId: string) => {
        await client!.enable!(chainId);
        const result = await client!.getAccount!(chainId);
        return {
          bech32Address: result.address,
          pubKey: result.pubkey,
          isNanoLedger: !!result.isNanoLedger,
        };
      },
      getSigner: async (chainId: string) => {
        const signer = client!.getOfflineSignerDirect!(chainId);
        const aminoSigner = client!.getOfflineSignerAmino!(chainId);

        return {
          signDirect: async (address, signDoc) => {
            // @ts-expect-error Mismatch between `Long` type in `signDoc`
            const result = await signer.signDirect(address, signDoc);
            return {
              signature: new Uint8Array(
                Buffer.from(result.signature.signature, 'base64'),
              ),
              signed: result.signed,
            };
          },
          signAmino: async (address, signDoc) => {
            const result = await aminoSigner.signAmino(address, signDoc);
            return {
              signature: new Uint8Array(
                Buffer.from(result.signature.signature, 'base64'),
              ),
              signed: result.signed,
            };
          },
        };
      },
    };
  }, [client]);

  return walletClient;
};
