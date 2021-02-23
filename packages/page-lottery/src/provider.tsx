//! Data Provider
import React from 'react';
import { BiggestWinner, EpochHistory, MyLottery } from './types';
import { useLottery } from './hooks';
import { useApi, useAccount, useContractQuery } from '@patract/react-hooks';
import { Box } from '@patract/ui-components';

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
  const latestEpoch = useContractQuery({ contract: contract.contract, method: 'latestEpoch' });
  const lotteries = useContractQuery({ contract: contract.contract, method: 'lotteriesOf' });
  const epochHistory = useContractQuery({ contract: contract.contract, method: 'epochHistory' });
  const biggestWinenr = useContractQuery({ contract: contract.contract, method: 'biggestWinner' });

  // Subscribe storage
  React.useEffect(() => {
    api.api.query.contracts.contractInfoOf('5FWmurGYTNyqVMKnY9stU9TWt1C3L8yquk3iCzhbwa5xeY5b', async () => {
      const epoch: any = await latestEpoch.read();
      const currentSlot: any = await api.api.query.babe.currentSlot();
      const curLotteries: any = await lotteries.read(currentAccount);

      // Get historires
      const histories: EpochHistory[] = [];
      const dimHis = new Array(epoch.epoch_id - BASE_EPOCH).fill(BASE_EPOCH);
      for (const v in dimHis) {
        const r = await epochHistory.read(Number(BASE_EPOCH) + Number(v));
        if (r && !histories.includes(r as any)) {
          histories.push(r as any);
        }
      }

      console.log(histories);

      // Get My Lotteries
      const winners: BiggestWinner[] = [];
      for (const w in histories) {
        const r = await biggestWinenr.read(histories[w].epoch_id);
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
