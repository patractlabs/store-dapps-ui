import type { ApiPromise } from '@polkadot/api';
import { BN_ONE, extractTime } from '@polkadot/util';
import type { Time } from '@polkadot/util/types';
import BN from 'bn.js';
import { useMemo } from 'react';
import { useApi } from './useApi';

type Result = [number, Time];

const DEFAULT_TIME = new BN(6000);

export const useBlockTime = (blocks = BN_ONE, apiOverride?: ApiPromise): Result => {
  const { api } = useApi();

  return useMemo((): Result => {
    const a = apiOverride || api;
    const blockTime =
      a.consts.babe?.expectedBlockTime ||
      a.consts.difficulty?.targetBlockTime ||
      a.consts.timestamp?.minimumPeriod.muln(2) ||
      DEFAULT_TIME;
    const time = extractTime(blockTime.mul(blocks).toNumber());
    const { days, hours, minutes, seconds } = time;

    return [blockTime.toNumber(), time];
  }, [api, apiOverride, blocks]);
};
