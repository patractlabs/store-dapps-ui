import { ApiPromise } from '@polkadot/api/promise';
import type { SubmittableExtrinsicFunction } from '@polkadot/api/promise/types';
import type { InjectedExtension } from '@polkadot/extension-inject/types';

export interface ApiState {
  apiDefaultTx: SubmittableExtrinsicFunction;
  apiDefaultTxSudo: SubmittableExtrinsicFunction;
  hasInjectedAccounts: boolean;
  isApiReady: boolean;
  isDevelopment: boolean;
  systemChain: string;
  systemName: string;
  systemVersion: string;
  tokenDecimals: number;
}

export interface ApiProps extends ApiState {
  api: ApiPromise;
  apiError: string | null;
  extensions?: InjectedExtension[];
  isApiConnected: boolean;
  isApiInitialized: boolean;
  isWaitingInjected: boolean;
}
