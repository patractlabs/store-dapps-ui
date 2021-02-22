import React from 'react';
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
  const [chosen, setChosen] = React.useState<number[]>([]);
  const [disabled, setDisabled] = React.useState(false);

  // tx
  const contract = useLottery().contract;
  const { excute } = useContractTx({ title: 'Buy Tickets', contract, method: 'buyTickets' });

  React.useEffect(() => {
    setEpoch(context.epochId);
  }, [context.epochId]);

  // set state
  const _onClick = React.useCallback(
    (v: number) => {
      let dim = chosen;
      if (chosen.includes(v)) {
        dim = chosen.filter((n) => n !== v);
      } else {
        dim.push(v);
      }

      setChosen([...dim]);
    },
    [chosen]
  );

  // trigger
  React.useEffect(() => {
    if (chosen.length < 3) {
      setDisabled(false);
    } else if (chosen.length > 2) {
      setDisabled(true);
    }
  }, [chosen, setChosen]);

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
      <Flex flexDir='row' justifyContent='space-around'>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) =>
          Circle({
            v: n,
            style: 0,
            r: '42px',
            fontSize: '1.1rem',
            lineHeight: '2.4rem',
            key: String(n),
            disabled,
            onClick: () => _onClick(n)
          })
        )}
      </Flex>
      <Spacer />
      <Flex alignItems='center'>
        <Box mr='1rem'>Epoch ID: </Box>
        <NumberInput disabled={context.epochId} value={epoch} set={setEpoch} />
      </Flex>
      <Spacer />
      <TicketInput chosen={chosen} ticket={ticket} setTicket={setTicket} />
      <Spacer />
      <Flex alignItems='flex-end'>
        <Button bg='rgba(0, 88, 250, 1)' color='#fff' width='5rem' onClick={_buyTickets}>
          Buy
        </Button>
        <Box ml='1rem' color='rgba(37, 161, 124, 1)' fontSize='12px'>
          Total: {ticket} DOT
        </Box>
      </Flex>
    </Flex>
  );
};

const TicketInput: React.FC<{ chosen: number[]; ticket: number; setTicket: (v: number) => void }> = ({
  chosen,
  ticket,
  setTicket
}) => {
  const [visible, setVisible] = React.useState([-1, -1, -1]);

  // Ugly fix
  React.useEffect(() => {
    if (chosen.length === 3) {
      setVisible([chosen[0], chosen[1], chosen[2]]);
    } else if (chosen.length === 2) {
      setVisible([chosen[0], chosen[1], -1]);
    } else if (chosen.length === 1) {
      setVisible([chosen[0], -1, -1]);
    } else {
      setVisible([-1, -1, -1]);
    }
  }, [chosen]);

  return (
    <Flex
      bg='#fff'
      rounded='4px'
      shadow='0px 0px 6px 0px rgba(171, 180, 208, 0.31)'
      height='90px'
      justifyContent='center'
      alignItems='center'
      p='1rem'
    >
      <Flex flexDir='row' justifyContent='space-around'>
        {/* Ugly workaround */}
        {Circle({
          v: visible[0],
          style: 0,
          r: '52px',
          fontSize: '1.5rem',
          lineHeight: '3rem',
          mr: '20px',
          key: '0'
        })}
        {Circle({
          v: visible[1],
          style: 0,
          r: '52px',
          fontSize: '1.5rem',
          lineHeight: '3rem',
          mr: '20px',
          key: '1'
        })}
        {Circle({
          v: visible[2],
          style: 0,
          r: '52px',
          fontSize: '1.5rem',
          lineHeight: '3rem',
          mr: '0px',
          key: '2'
        })}
      </Flex>
      <Spacer />
      <CloseIcon />
      <Spacer />
      <NumberInput value={ticket} set={setTicket} />
    </Flex>
  );
};
