import AccountSigner from '@patract/react-components/signer/signers/account-signer';
import { web3FromSource } from '@polkadot/extension-dapp';
import type { Registry } from '@polkadot/types/types';
import { keyring } from '@polkadot/ui-keyring';

export const getSigner = async (registry: Registry, address: string) => {
  const pair = keyring.getPair(address);

  const {
    meta: { isInjected, source }
  } = pair;

  if (isInjected) {
    const injected = await web3FromSource(source as string);

    if (!injected) throw new Error(`Unable to find a signer for ${address}`);

    return injected.signer;
  }

  return new AccountSigner(registry, pair);
};
