import React from 'react';
import { Box, Flex, Table, Tbody, Td, Text, Thead, Th, Tr, Button } from '@patract/ui-components';
import Pagination from '@material-ui/lab/Pagination';
import { useContractTx } from '@patract/react-hooks';

import { Circle, Hash } from './component';
import { useLottery } from './hooks';
import { TableProps, TrProps } from './types';

/**
 * Custom Table
 *
 * + Pagination
 */
export const T: React.FC<TableProps> = ({
  head,
  body,
  title,
  onChange,
  width,
  pagin = true,
  limit = 5,
  current_epoch,
  winnerMap
}) => {
  const [page, setPage] = React.useState(1);
  const rows = body.sort((a, b) => b.epoch_id - a.epoch_id);

  // On Changing Page
  const c = React.useCallback(
    (_: any, page: number) => {
      setPage(page);
      onChange && onChange(page);
    },
    [onChange, setPage]
  );

  return (
    <Box mt='10' px='10px' py='8px' rounded='lg' shadow='sm' bg='white' width={width ? width : ''}>
      <Text p={8} fontSize='16px' fontWeight='bold'>
        {title}
      </Text>
      <Table>
        <Thead>
          <Tr>
            {head.map((head, idx) => (
              <Th key={title + 'head' + idx}>{head}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rows.slice((page - 1) * limit, page * limit).map((b, i) => (
            <Trr
              row={b}
              key={i}
              decimal={10}
              currentEpoch={current_epoch}
              renderHash={title !== 'Biggest Winners'}
              winner={winnerMap[b.epoch_id]}
            />
          ))}
        </Tbody>
      </Table>
      {pagin && (
        <Flex mt='4' justifyContent='flex-end' position='relative' bottom='2'>
          <Pagination
            count={body.length % limit === 0 ? body.length / limit : Math.floor(body.length / limit) + 1}
            page={page}
            onChange={c}
            shape='rounded'
          />
        </Flex>
      )}
    </Box>
  );
};

/* Well, I've forgotten why I named this component `Tr` */
export const Trr: React.FC<{
  row: TrProps;
  decimal: number;
  currentEpoch: number;
  renderHash?: boolean;
  winner: number[];
}> = ({ row, decimal, currentEpoch, winner, renderHash = true }) => {
  const contract = useLottery().contract;
  const { excute } = useContractTx({ title: 'Draw Lottery', contract, method: 'drawLottery' });

  const _draw = React.useCallback(
    (epoch: number) => {
      excute([epoch]);
    },
    [excute]
  );

  return (
    <Tr>
      <Td>{row.epoch_id}</Td>
      {row.random && (
        <Td>
          <Hash
            hash={row.random}
            num={winner ? winner.filter((v) => row.my_num.includes(v)) : []}
            render={renderHash}
          />
        </Td>
      )}
      {row.ident && <Td>{row.ident}</Td>}
      <Td display='flex' flexDirection='row'>
        {winner && row.my_num && row.my_num.length === 3 ? (
          <Box display='inherit'>
            <Circle v={row.my_num[0]} style={winner.includes(row.my_num[0]) ? 0 : 1} forceDisabled />
            <Circle v={row.my_num[1]} style={winner.includes(row.my_num[1]) ? 0 : 1} forceDisabled />
            <Circle v={row.my_num[2]} style={winner.includes(row.my_num[2]) ? 0 : 1} forceDisabled />
          </Box>
        ) : (
          <Box>
            {(winner === undefined || winner === []) && row.epoch_id < currentEpoch && row.buyer ? (
              <Button bg='rgba(0, 88, 250, 1)' color='#fff' onClick={() => _draw(row.epoch_id)}>
                Draw
              </Button>
            ) : (
              'Waiting...'
            )}
          </Box>
        )}
      </Td>
      {row.tickets && <Td>{row.tickets}</Td>}
      {row.reward !== undefined && <Trend v={row.reward / Math.pow(10, decimal)} />}
      {row.buyer && <Td>{row.buyer}</Td>}
      {row.pool_in !== undefined && <Trend v={row.pool_in / Math.pow(10, decimal)} />}
      {row.pool_out !== undefined && <Trend v={-row.pool_out / Math.pow(10, decimal)} />}
    </Tr>
  );
};

/* font color of reward */
const Trend: React.FC<{ v: number }> = ({ v }) => {
  if (v === 0) {
    return (
      <Td>
        <Box color='#999999F'>~</Box>
      </Td>
    );
  } else if (v > 0) {
    return (
      <Td>
        <Box color='#25A17CFF'>{'+' + Number(v)}</Box>
      </Td>
    );
  } else {
    return (
      <Td>
        <Box color='#E02020FF'>{'-' + -Number(v)}</Box>
      </Td>
    );
  }
};

export default T;
