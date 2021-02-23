import { Flex, PageHeader, PageLayout, PageMain, Spacer } from '@patract/ui-components';
import React from 'react';

import { Tip } from './component';
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
  const winnerMap = React.useMemo(() => {
    const map: Record<string, number[]> = {};

    context.epochHistories.filter((e) => e).forEach((w) => (map[String(w.epoch_id)] = (w as any).my_num));
    return map;
  }, [context.epochHistories]);

  return (
    <PageLayout>
      <PageHeader title='Patra Lottery' />
      <PageMain my='30' minWidth='1360px' width='1360px'>
        <Tip />
        <Foo />
        <Flex>
          <T
            title='My Lotteries'
            head={['Epoch ID', 'Randoam Number', 'My Number', 'Tickets', 'Reward(DOT)']}
            body={my}
            width='570px'
            current_epoch={context.epochId}
            winnerMap={winnerMap}
          />
          <Spacer />
          <T
            title='Biggest Winners'
            head={['Epoch ID', 'Buyer Account', 'Number', 'Tickets', 'Reward(DOT)']}
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
            winnerMap={winnerMap}
          />
        </Flex>
        <T
          height='1104px'
          title='Epoch Histories'
          head={['Epoch ID', 'BABE Random Number', 'Lottery', 'Buyer', 'Pool In(DOT)', 'Pool Out(DOT)']}
          body={his}
          current_epoch={context.epochId}
          winnerMap={winnerMap}
        />
      </PageMain>
    </PageLayout>
  );
};

export default App;
