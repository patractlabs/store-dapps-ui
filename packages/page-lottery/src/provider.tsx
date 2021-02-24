//! Data Provider
import React from 'react';
import { BiggestWinner, EpochHistory, MyLottery } from './types';
import { useLottery } from './hooks';
import { useApi, useAccount } from '@patract/react-hooks';
import { Box } from '@patract/ui-components';
import { PatraLottery } from '@patract/utils';

import Nyan from '../public/nyan.gif';

export interface Value {
  epochId: number;
  rewardPool: number;
  myLotteries: MyLottery[];
  biggestWinners: BiggestWinner[];
  epochHistories: EpochHistory[];
  openIn: number;
}

const context = React.createContext<Value>({} as Value);

export const Provider: React.FC<{}> = ({ children }) => {
  const api = useApi();
  if (api.isApiReady) {
    return <ProviderInner>{children}</ProviderInner>;
  } else {
    return (
      <Box position='absolute' left='42%' top='42%'>
        <img src={Nyan} alt='loading' />
      </Box>
    );
  }
};

const BASE_EPOCH = 0;

export const ProviderInner: React.FC<{}> = ({ children }) => {
  // hooks
  const [epochId, setEpochId] = React.useState(0);
  const [rewardPool, setRewardPool] = React.useState(0);
  const [openIn, setOpenIn] = React.useState(0);
  const [myLotteries, setMyLotteries] = React.useState<MyLottery[]>([]);
  const [biggestWinners, setBiggestWinners] = React.useState<BiggestWinner[]>([]);
  const [epochHistories, setEpochHistories] = React.useState<EpochHistory[]>([]);
  const [timer, setTimer] = React.useState(setInterval(() => {}, 1000));
  const [trigger, setTrigger] = React.useState(false);

  const api = useApi();
  const { currentAccount } = useAccount();
  const contract = useLottery();

  // Subscribe storage
  React.useEffect(() => {
    api.api.query.contracts.contractInfoOf(PatraLottery, async () => {
      const epoch: any = (await contract.contract.query['latestEpoch'](currentAccount, {})).output?.toJSON();
      const currentSlot: any = await api.api.query.babe.currentSlot();
      const curLotteries: any = (
        await contract.contract.query['lotteriesOf'](currentAccount, {}, currentAccount)
      ).output?.toJSON();

      // Get historires
      const histories: EpochHistory[] = [];
      const dimHis = new Array(epoch.epoch_id - BASE_EPOCH).fill(BASE_EPOCH);
      for (const v in dimHis) {
        const r = (
          await contract.contract.query['epochHistory'](currentAccount, {}, Number(BASE_EPOCH) + Number(v))
        ).output?.toJSON();
        if (r && !histories.includes(r as any)) {
          histories.push(r as any);
        }
      }

      // Get My Lotteries
      const winners: BiggestWinner[] = [];
      for (const w in histories) {
        const r = (
          await contract.contract.query['biggestWinner'](currentAccount, {}, histories[w].epoch_id)
        ).output?.toJSON();
        if (r) {
          winners.push({ ...(r as any), epoch_id: histories[w].epoch_id });
        }
      }

      setEpochId(Number(epoch?.epoch_id));
      setOpenIn(Number(epoch?.start_slot - currentSlot.toNumber()) * 6);
      setRewardPool(Number(epoch?.reward_pool));
      setBiggestWinners(winners);
      setEpochHistories(histories);

      curLotteries && setMyLotteries(curLotteries);
    });
    // eslint-disable-next-line
  }, [trigger, currentAccount]);

  React.useEffect(() => {
    clearInterval(timer);
    setTimer(
      setInterval(() => {
        if (openIn > 0) {
          setOpenIn(openIn - 1);
        } else {
          setTrigger(!trigger);
        }
      }, 1000)
    );
    // eslint-disable-next-line
  }, [openIn]);

  // return states
  return (
    <context.Provider
      value={{
        epochId,
        rewardPool,
        myLotteries,
        biggestWinners,
        epochHistories,
        openIn
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useProvider = (): Value => {
  const ctx = React.useContext(context);

  if (context === undefined) {
    throw new Error('useDock must provide by DockProvider');
  }

  return ctx;
};
