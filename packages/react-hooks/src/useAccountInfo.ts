// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveAccountFlags, DeriveAccountInfo, DeriveAccountRegistration } from '@polkadot/api-derive/types';
import { keyring } from '@polkadot/ui-keyring';
import type { KeyringJson$Meta } from '@polkadot/ui-keyring/types';
import { useEffect, useState } from 'react';
import { useAccounts } from './useAccounts';
import { useAddresses } from './useAddresses';
import { useApi } from './useApi';
import { useCall } from './useCall';

export interface AddressFlags extends DeriveAccountFlags {
  isDevelopment: boolean;
  isExternal: boolean;
  isFavorite: boolean;
  isHardware: boolean;
  isInContacts: boolean;
  isInjected: boolean;
  isMultisig: boolean;
  isProxied: boolean;
  isOwned: boolean;
}

export interface AddressIdentity extends DeriveAccountRegistration {
  isGood: boolean;
  isBad: boolean;
  isKnownGood: boolean;
  isReasonable: boolean;
  isErroneous: boolean;
  isLowQuality: boolean;
  isExistent: boolean;
  waitCount: number;
}

export interface UseAccountInfo {
  accountIndex?: string;
  flags: AddressFlags;
  name: string;
  setName: React.Dispatch<string>;
  tags: string[];
  genesisHash: string | null;
  identity?: AddressIdentity;
  meta?: KeyringJson$Meta;
  isNull: boolean;
}

const IS_NONE = {
  isCouncil: false,
  isDevelopment: false,
  isExternal: false,
  isFavorite: false,
  isHardware: false,
  isInContacts: false,
  isInjected: false,
  isMultisig: false,
  isOwned: false,
  isProxied: false,
  isSociety: false,
  isSudo: false,
  isTechCommittee: false
};

export function useAccountInfo(value: string | null, isContract = false): UseAccountInfo {
  const { api } = useApi();
  const { isAccount } = useAccounts();
  const { isAddress } = useAddresses();
  const accountInfo = useCall<DeriveAccountInfo>(api.derive.accounts.info as any, [value]);
  const accountFlags = useCall<DeriveAccountFlags>(api.derive.accounts.flags as any, [value]);
  const [accountIndex, setAccountIndex] = useState<string | undefined>(undefined);
  const [tags, setSortedTags] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [genesisHash, setGenesisHash] = useState<string | null>(null);
  const [identity, setIdentity] = useState<AddressIdentity | undefined>();
  const [flags, setFlags] = useState<AddressFlags>(IS_NONE);
  const [meta, setMeta] = useState<KeyringJson$Meta | undefined>();

  useEffect((): void => {
    accountFlags &&
      setFlags((flags) => ({
        ...flags,
        ...accountFlags
      }));
  }, [accountFlags]);

  useEffect((): void => {
    const { accountIndex, identity, nickname } = accountInfo || {};
    const newIndex = accountIndex?.toString();

    setAccountIndex((oldIndex) => (oldIndex !== newIndex ? newIndex : oldIndex));

    let name;

    if (api.query.identity && !!api.query.identity.identityOf) {
      if (identity?.display) {
        name = identity.display;
      }
    } else if (nickname) {
      name = nickname;
    }

    setName(name || '');

    if (identity) {
      const judgements = identity.judgements.filter(([, judgement]) => !judgement.isFeePaid);
      const isKnownGood = judgements.some(([, judgement]) => judgement.isKnownGood);
      const isReasonable = judgements.some(([, judgement]) => judgement.isReasonable);
      const isErroneous = judgements.some(([, judgement]) => judgement.isErroneous);
      const isLowQuality = judgements.some(([, judgement]) => judgement.isLowQuality);

      setIdentity({
        ...identity,
        isBad: isErroneous || isLowQuality,
        isErroneous,
        isExistent: !!identity.display,
        isGood: isKnownGood || isReasonable,
        isKnownGood,
        isLowQuality,
        isReasonable,
        judgements,
        waitCount: identity.judgements.length - judgements.length
      });
    } else {
      setIdentity(undefined);
    }
  }, [accountInfo, api]);

  useEffect((): void => {
    if (value) {
      try {
        const accountOrAddress = keyring.getAccount(value) || keyring.getAddress(value);
        const isOwned = isAccount(value);
        const isInContacts = isAddress(value);

        setGenesisHash(accountOrAddress?.meta.genesisHash || null);
        setFlags(
          (flags): AddressFlags => ({
            ...flags,
            isDevelopment: accountOrAddress?.meta.isTesting || false,
            isExternal: !!accountOrAddress?.meta.isExternal || false,
            isHardware: !!accountOrAddress?.meta.isHardware || false,
            isInContacts,
            isInjected: !!accountOrAddress?.meta.isInjected || false,
            isMultisig: !!accountOrAddress?.meta.isMultisig || false,
            isOwned,
            isProxied: !!accountOrAddress?.meta.isProxied || false
          })
        );
        setMeta(accountOrAddress?.meta);
        setName(accountOrAddress?.meta.name || '');
        setSortedTags(accountOrAddress?.meta.tags ? (accountOrAddress.meta.tags as string[]).sort() : []);
      } catch (error) {
        // ignore
      }
    }
  }, [identity, isAccount, isAddress, value]);

  return {
    accountIndex,
    flags,
    genesisHash,
    identity,
    isNull: !value,
    meta,
    name,
    setName,
    tags
  };
}
