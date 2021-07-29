// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ProviderInterface } from '@polkadot/rpc-provider/types';
import { deriveMapCache, setDeriveCache } from '@polkadot/api-derive/util';
import { ApiPromise } from '@polkadot/api/promise';
import { web3Accounts, web3Enable, web3ListRpcProviders, web3UseRpcProvider } from '@polkadot/extension-dapp';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import { WsProvider } from '@polkadot/rpc-provider';
import type { ChainProperties, ChainType } from '@polkadot/types/interfaces';
import { keyring } from '@polkadot/ui-keyring';
import type { KeyringStore } from '@polkadot/ui-keyring/types';
import { formatBalance, isTestChain } from '@polkadot/util';
import { defaults as addressDefaults } from '@polkadot/util-crypto/address/defaults';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { StatusContext } from '../status/status-context';
import ApiContext from './api-context';
import { ApiSigner } from '../signer/signers/api-signer';
import { registry } from './type-registry';
import type { ApiProps, ApiState } from './types';
import BN from 'bn.js';

export const DEFAULT_AUX = ['Aux1', 'Aux2', 'Aux3', 'Aux4', 'Aux5', 'Aux6', 'Aux7', 'Aux8', 'Aux9'];

interface Props {
  children: React.ReactNode;
  url?: string;
  store?: KeyringStore;
}

interface InjectedAccountExt {
  address: string;
  meta: {
    name: string;
    source: string;
    whenCreated: number;
  };
}

interface ChainData {
  injectedAccounts: InjectedAccountExt[];
  properties: ChainProperties;
  systemChain: string;
  systemChainType: ChainType;
  systemName: string;
  systemVersion: string;
}

export const DEFAULT_DECIMALS = registry.createType('u32', 15);
export const DEFAULT_SS58 = registry.createType('u32', addressDefaults.prefix);

let api: ApiPromise;

export { api };

function isKeyringLoaded() {
  try {
    return !!keyring.keyring;
  } catch {
    return false;
  }
}

// FIXME This is not good, may be to upgrade store sdk to fix this
async function waitWeb3Inject(ms = 5000): Promise<void> {
  const delay = () => new Promise((resolve) => setTimeout(resolve, 100));

  return new Promise((resolve) => {
    window.onload = async () => {
      const start = Date.now();

      while (true) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (Object.keys(((window as unknown) as any).injectedWeb3).length !== 0) {
          break;
        } else {
          if (Date.now() - ms > start) {
            break;
          }
        }
        await delay();
      }
      resolve();
    };
  });
}

async function getInjectedAccounts(injectedPromise: Promise<InjectedExtension[]>): Promise<InjectedAccountExt[]> {
  try {
    await injectedPromise;

    const accounts = await web3Accounts();

    return accounts.map(
      ({ address, meta }, whenCreated): InjectedAccountExt => ({
        address,
        meta: {
          ...meta,
          name: `${meta.name || 'unknown'} (${meta.source === 'polkadot-js' ? 'extension' : meta.source})`,
          whenCreated
        }
      })
    );
  } catch (error) {
    console.error('web3Enable', error);

    return [];
  }
}

async function retrieve(api: ApiPromise, injectedPromise: Promise<InjectedExtension[]>): Promise<ChainData> {
  const [
    chainProperties,
    systemChain,
    systemChainType,
    systemName,
    systemVersion,
    injectedAccounts
  ] = await Promise.all([
    api.rpc.system.properties(),
    api.rpc.system.chain(),
    api.rpc.system.chainType ? api.rpc.system.chainType() : Promise.resolve(registry.createType('ChainType', 'Live')),
    api.rpc.system.name(),
    api.rpc.system.version(),
    getInjectedAccounts(injectedPromise)
  ]);

  // HACK Horrible hack to try and give some window to the DOT denomination
  const ss58Format = api.consts.system?.ss58Prefix || chainProperties.ss58Format;
  const properties = registry.createType('ChainProperties', {
    ss58Format,
    tokenDecimals: chainProperties.tokenDecimals,
    tokenSymbol: chainProperties.tokenSymbol
  });

  return {
    injectedAccounts,
    properties,
    systemChain: (systemChain || '<unknown>').toString(),
    systemChainType,
    systemName: systemName.toString(),
    systemVersion: systemVersion.toString()
  };
}

async function loadOnReady(
  api: ApiPromise,
  injectedPromise: Promise<InjectedExtension[]>,
  store: KeyringStore | undefined
): Promise<ApiState> {
  const { injectedAccounts, properties, systemChain, systemChainType, systemName, systemVersion } = await retrieve(
    api,
    injectedPromise
  );
  const ss58Format = properties.ss58Format.unwrapOr(DEFAULT_SS58).toNumber();
  const tokenSymbol = properties.tokenSymbol.unwrapOr([formatBalance.getDefaults().unit, ...DEFAULT_AUX]);
  const tokenDecimals = (properties.tokenDecimals.unwrapOr([DEFAULT_DECIMALS]) as BN[]).map((b) => b.toNumber())[0];
  const isDevelopment = systemChainType.isDevelopment || systemChainType.isLocal || isTestChain(systemChain);

  // explicitly override the ss58Format as specified
  registry.setChainProperties(registry.createType('ChainProperties', { ss58Format, tokenDecimals, tokenSymbol }));

  // FIXME This should be removed (however we have some hanging bits, e.g. vanity)
  keyring.setSS58Format(ss58Format);

  // first setup the UI helpers
  formatBalance.setDefaults({
    decimals: tokenDecimals,
    unit: tokenSymbol[0].toString()
  });

  // finally load the keyring
  isKeyringLoaded() ||
    keyring.loadAll(
      {
        genesisHash: api.genesisHash,
        isDevelopment,
        ss58Format,
        store,
        type: 'sr25519'
      },
      injectedAccounts
    );

  const defaultSection = Object.keys(api.tx)[0];
  const defaultMethod = Object.keys(api.tx[defaultSection])[0];
  const apiDefaultTx = api.tx[defaultSection][defaultMethod];
  const apiDefaultTxSudo = (api.tx.system && api.tx.system.setCode) || apiDefaultTx;

  setDeriveCache(api.genesisHash.toHex(), deriveMapCache);

  return {
    apiDefaultTx,
    apiDefaultTxSudo,
    hasInjectedAccounts: injectedAccounts.length !== 0,
    isApiReady: true,
    isDevelopment,
    systemChain,
    systemName,
    systemVersion,
    tokenDecimals
  };
}

export const Api = React.memo(function Api({ children, store, url }: Props): React.ReactElement<Props> | null {
  const { queuePayload, queueSetTxStatus } = useContext(StatusContext);
  const [state, setState] = useState<ApiState>(({
    hasInjectedAccounts: false,
    isApiReady: false
  } as unknown) as ApiState);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const [apiError, setApiError] = useState<null | string>(null);
  const [extensions, setExtensions] = useState<InjectedExtension[] | undefined>();

  const value = useMemo<ApiProps>(
    () => ({ ...state, api, apiError, extensions, isApiConnected, isApiInitialized, isWaitingInjected: !extensions }),
    [apiError, extensions, isApiConnected, isApiInitialized, state]
  );

  // initial initialization
  useEffect((): void => {
    waitWeb3Inject()
      .then(() => {
        return web3Enable('polkadot-js/apps');
      })
      .then(async (injected) => {
        const injectedPromise = Promise.resolve(injected);

        let provider: ProviderInterface;

        if (injected.length > 0) {
          const providers = await web3ListRpcProviders(injected[0].name);

          if (providers && Object.keys(providers).length > 0) {
            provider = (await web3UseRpcProvider(injected[0].name, Object.keys(providers)[0])).provider;
          } else {
            provider = new WsProvider(url);
          }
        } else {
          provider = new WsProvider(url);
        }

        const signer = new ApiSigner(registry, queuePayload, queueSetTxStatus);

        api = new ApiPromise({
          provider,
          registry,
          signer,
          types: {
            LookupSource: 'MultiAddress',
            Address: 'MultiAddress',
            AccountInfo: 'AccountInfoWithTripleRefCount',
            AliveContractInfo: {
              trieId: 'TrieId',
              storageSize: 'u32',
              pairCount: 'u32',
              codeHash: 'CodeHash',
              rentAllowance: 'Balance',
              rentPayed: 'Balance',
              deductBlock: 'BlockNumber',
              lastWrite: 'Option<BlockNumber>',
              _reserved: 'Option<Null>'
            },
            FullIdentification: 'AccountId',
            AuthorityState: {
              _enum: ['Working', 'Waiting']
            },
            EraIndex: 'u32',
            ActiveEraInfo: {
              index: 'EraIndex',
              start: 'Option<u64>'
            },
            UnappliedSlash: {
              validator: 'AccountId',
              reporters: 'Vec<AccountId>'
            }
          }
        });

        api.on('connected', () => setIsApiConnected(true));
        api.on('disconnected', () => setIsApiConnected(false));
        api.on('error', (error: Error) => setApiError(error.message));
        api.on('ready', (): void => {
          injectedPromise.then(setExtensions).catch(console.error);

          loadOnReady(api, injectedPromise, store)
            .then(setState)
            .catch((error): void => {
              console.error(error);

              setApiError((error as Error).message);
            });
        });

        setIsApiInitialized(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!value.isApiInitialized) {
    return null;
  }

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
});
