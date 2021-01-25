import type { KeyringPair } from '@polkadot/keyring/types';

export type AccountProps = {
  accountList?: KeyringPair[];
  currentAccount: string;
  setCurrentAccount: (account: string) => void;
  updateAccounts: () => void;
};
