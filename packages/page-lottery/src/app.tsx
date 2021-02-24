import { Flex, PageHeader, PageLayout, PageMain, Spacer } from '@patract/ui-components';
import React from 'react';

import { T } from './table';
import { Foo } from './foo';
import { useProvider } from './provider';
import { BiggestWinner } from './types';

export const App = () => {
  const context = useProvider();

  const my = React.useMemo(() => (context.myLotteries ? (context.myLotteries as any) : []), [context.myLotteries]);
  const his = React.useMemo(() => (context.epochHistories ? (context.epochHistories as any) : []), [
    context.epochHistories
  ]);
  const win = React.useMemo(() => (context.biggestWinners ? (context.biggestWinners as any) : []), [
    context.biggestWinners
  ]);

  return (
    <PageLayout>
      <PageHeader title='PatraLottery' />
      <PageMain my='30' minWidth='1360px' width='1360px'>
        <Foo />
        <Flex>
          <T
            title='My Lotteries'
            head={['Epoch', 'Random', 'My Number', 'Tickets', 'Reward']}
            body={my}
            width='570px'
            current_epoch={context.epochId}
            winnerMap={context.winnerMap}
          />
          <Spacer />
          <T
            title='Biggest Winners'
            head={['Epoch', 'Buyer', 'Number', 'Tickets', 'Reward']}
            body={win
              .filter((w: any) => w.reward !== 0)
              .slice(0, 5)
              .map((w: BiggestWinner) => {
                return {
                  epoch_id: w.epoch_id,
                  random: w.winner,
                  my_num: w.win_num,
                  tickets: w.tickets,
                  reward: w.reward
                };
              })}
            width='570px'
            limit={5}
            pagin={false}
            current_epoch={context.epochId}
            winnerMap={context.winnerMap}
          />
        </Flex>
        <T
          height='1104px'
          title='Epoch Histories'
          head={['Epoch', 'BABE Random Number', 'Lottery', 'Buyers', 'Pool In', 'Pool Out']}
          body={his.map((h: any) => {
            h.my_num = h.win_num;
            return h;
          })}
          current_epoch={context.epochId}
          winnerMap={context.winnerMap}
        />
      </PageMain>
    </PageLayout>
  );
};

export default App;
