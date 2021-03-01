import React, { useCallback } from 'react';
import { Box, Button, CloseIcon, Flex, Spacer } from '@patract/ui-components';

import { Circle, NumberInput } from './component';
import { useProvider } from './provider';
import { useLottery } from './hooks';
import { parseAmount } from '@patract/utils';
import { useContractTx } from '@patract/react-hooks';

export const TicketBoard: React.FC<{}> = () => {
  const context = useProvider();
  const [epoch, setEpoch] = React.useState(context.epochId);
  const [ticket, setTicket] = React.useState(1);

  // define
  const [chosen, setChosen] = React.useState<number[]>([-1, -1, -1]);

  // tx
  const contract = useLottery().contract;
  const { excute } = useContractTx({ title: 'Buy Tickets', contract, method: 'buyTickets' });

  React.useEffect(() => {
    setEpoch(context.epochId);
  }, [context.epochId]);

  // set state
  const _onClick = React.useCallback(
    (v: number) => {
      const index = chosen.findIndex(_v => _v === -1);
      if (index > -1) {
        const newChosen = [...chosen];
        newChosen[index] = v;
        setChosen(newChosen);
      } 
    },
    [chosen],
  );

  const cancel = useCallback((index: number) => {
    const newChosen = [...chosen];
    newChosen[index] = -1;
    setChosen(newChosen);
  }, [chosen]);

  const _buyTickets = () => {
    excute([Number(epoch), chosen, ticket], parseAmount(ticket.toString(), 10));
  };

  return (
    <Flex
      width='100%'
      flexDirection='column'
      bg='#F9F9FBFF'
      p='5'
      rounded='md'
      border='1px solid rgba(171, 180, 208, 0.35)'
    >
      <Box>
        <span>Select Numbers:</span>
      </Box>
      <Flex py="1em" flexDir='row' justifyContent='space-around'>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) =>
          Circle({
            v: n,
            style: 0,
            r: '42px',
            fontSize: '1.1rem',
            lineHeight: '2.4rem',
            key: String(n),
            onClick: () => _onClick(n)
          })
        )}
      </Flex>
      <Box
        bg='#fff'
        rounded='4px'
        shadow='0px 0px 6px 0px rgba(171, 180, 208, 0.31)'
        p='1.5rem'
        mb="1em"
      >
        <TicketInput chosen={chosen} ticket={ticket} setTicket={setTicket} onCancel={cancel}/>
      </Box>
      <Flex justifyContent='space-between'>
        <Flex alignItems='center'>
          <Box mr='1rem'>Epoch ID: </Box>
          <NumberInput disabled={context.epochId} value={epoch} set={setEpoch} />
        </Flex>
        <Flex alignItems='flex-end'>
          <Button bg='rgba(0, 88, 250, 1)' color='#fff' width='5rem' onClick={_buyTickets} disabled={chosen.length !== 3}>
            Buy
          </Button>
          <Box ml='1rem' color='rgba(37, 161, 124, 1)' fontSize='12px'>
            Total: {ticket} DOT
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

const TicketInput: React.FC<{
  chosen: number[];
  ticket: number;
  setTicket: (v: number) => void;
  onCancel: (index: number) => void;
}> = ({
  chosen,
  ticket,
  setTicket,
  onCancel,
}) => {
  return (
    <Flex
      justifyContent='center'
      alignItems='center'
    >
      <Flex flexDir='row' justifyContent='space-around'>
        {Circle({
          v: chosen[0],
          style: chosen[0] === -1 ? 1 : 0,
          r: '52px',
          fontSize: '1.5rem',
          lineHeight: '3rem',
          mr: '20px',
          key: '0',
          onClick: () => { onCancel(0) },
        })}
        {Circle({
          v: chosen[1],
          style: chosen[1] === -1 ? 1 : 0,
          r: '52px',
          fontSize: '1.5rem',
          lineHeight: '3rem',
          mr: '20px',
          key: '1',
          onClick: () => { onCancel(1) },
        })}
        {Circle({
          v: chosen[2],
          style: chosen[2] === -1 ? 1 : 0,
          r: '52px',
          fontSize: '1.5rem',
          lineHeight: '3rem',
          mr: '0px',
          key: '2',
          onClick: () => { onCancel(2) },
        })}
      </Flex>
      <Spacer />
      <CloseIcon />
      <Spacer />
      <NumberInput value={ticket} set={setTicket} />
    </Flex>
  );
};
