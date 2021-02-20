//! Data Provider
import React from 'react';
import { BiggestWinner, EpochHistory, MyLottery, EpochInfo } from './types';
import { useLottery } from './hooks';
import { useApi, useAccount, useContractQuery } from '@patract/react-hooks';
import { TIMEOUT } from 'dns';

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
    return <div>init api...</div>;
  }
};

const BASE_EPOCH = 300;

export const ProviderInner: React.FC<{}> = ({ children }) => {
  // hooks
  const [epochId, setEpochId] = React.useState(0);
  const [rewardPool, setRewardPool] = React.useState(0);
  const [openIn, setOpenIn] = React.useState(0);
  const [myLotteries, setMyLotteries] = React.useState<MyLottery[]>([]);
  const [biggestWinners, setBiggestWinners] = React.useState<BiggestWinner[]>([]);
  const [epochHistories, setEpochHistories] = React.useState<EpochHistory[]>([]);
  const [timer, setTimer] = React.useState(setInterval(() => {}, 1000));

  const api = useApi();
  const account = useAccount();
  const contract = useLottery();
  const latestEpoch = useContractQuery({ contract: contract.contract, method: 'latestEpoch' });
  const lotteries = useContractQuery({ contract: contract.contract, method: 'lotteriesOf' });
  const epochHistory = useContractQuery({ contract: contract.contract, method: 'epochHistory' });
  const biggestWinenr = useContractQuery({ contract: contract.contract, method: 'biggestWinner' });

  // Subscribe storage
  React.useEffect(() => {
    api.api.query.contracts.contractInfoOf('5DYvhVPkjTJdbQNz66kza3e2Cn7XvxBpR4F1s1si9Vd96wFh', async () => {
      const epoch: any = await latestEpoch.read();
      const currentSlot: any = await api.api.query.babe.currentSlot();
      const curLotteries: any = await lotteries.read(account.currentAccount);

      // Get historires
      const histories: EpochHistory[] = [];
      new Array(epoch.epoch_id - BASE_EPOCH).fill(BASE_EPOCH).forEach(async (v, i) => {
        const r = await epochHistory.read(v + i);
        r && histories.push(r as any);
      });

      // Get My Lotteries
      const winners: BiggestWinner[] = [];
      histories.forEach(async (h) => {
        winners.push((await biggestWinenr.read(h.epoch_id)) as any);
      });

      setEpochId(Number(epoch?.epoch_id));
      setOpenIn(Number(epoch?.start_slot - currentSlot.toNumber()) * 6);
      setRewardPool(Number(epoch?.reward_pool));
      setEpochHistories(histories);
      setBiggestWinners(winners);

      curLotteries && setMyLotteries(curLotteries);
    });
  }, []);

  React.useEffect(() => {
    clearInterval(timer);
    setTimer(
      setInterval(() => {
        console.log('123');
        if (openIn > 0) {
          setOpenIn(openIn - 1);
        }
      }, 1000)
    );
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
