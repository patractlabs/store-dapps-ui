import React from 'react';
import { Box, CloseIcon, Flex, Table, Tbody, Td, Text, Thead, Th, Tr, Button } from '@patract/ui-components';
import Pagination from '@material-ui/lab/Pagination';
import { useContractTx } from '@patract/react-hooks';

import { Circle, Hash } from './component';
import { useLottery } from './hooks';
import { TableProps, TrProps } from './types';
import { useProvider } from './provider';

import Nyan from '../public/nyan.gif';

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
  const rows =
    title === 'Biggest Winners'
      ? body.sort((a, b) => {
          if (a !== undefined && b !== undefined) {
            return (b as any).reward - (a as any).reward;
          } else {
            return 0;
          }
        })
      : body.sort((a, b) => b.epoch_id - a.epoch_id);

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
          {rows.length === 0 ? (
            <Tr>
              <Td>
                <img src={Nyan} alt='loading' />
              </Td>
            </Tr>
          ) : (
            rows
              .slice((page - 1) * limit, page * limit)
              .map((b, i) => (
                <Trr
                  title={title}
                  row={b}
                  key={i}
                  decimal={10}
                  currentEpoch={current_epoch}
                  renderHash={title !== 'Biggest Winners'}
                  winner={winnerMap[b.epoch_id]}
                />
              ))
          )}
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
  title: string;
  row: TrProps;
  decimal: number;
  currentEpoch: number;
  renderHash?: boolean;
  winner: number[];
}> = ({ row, decimal, currentEpoch, winner, renderHash = true, title }) => {
  const contract = useLottery().contract;
  const { excute } = useContractTx({ title: 'Draw Lottery', contract, method: 'drawLottery' });
  const context = useProvider();

  const _draw = React.useCallback(
    (epoch: number) => {
      excute([epoch]).then(() => {
        context.setTrigger(!context.trigger);
      });
    },
    [excute, context]
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
            limit={title === 'Biggest Winners' ? 14 : title === 'Epoch Histories' ? 66 : 12}
          />
        </Td>
      )}
      {row.ident && <Td>{row.ident}</Td>}
      <Td display='flex' flexDirection='row'>
        {(title === 'Biggest Winners' ? winner : true) && row.my_num && row.my_num.length === 3 ? (
          <Flex direction='row' alignItems='center' justifyContent='center' pt='0.3rem' pb='0.3rem'>
            <Circle
              active={false}
              v={row.my_num[0]}
              style={title === 'Epoch Histories' ? 0 : winner && row.my_num[0] === winner[0] ? 0 : 1}
            />
            <Circle
              active={false}
              v={row.my_num[1]}
              style={title === 'Epoch Histories' ? 0 : winner && row.my_num[1] === winner[1] ? 0 : 1}
            />
            <Circle
              active={false}
              v={row.my_num[2]}
              style={title === 'Epoch Histories' ? 0 : winner && row.my_num[2] === winner[2] ? 0 : 1}
            />
            {row.tickets && (
              <Flex direction='row' alignItems='center' justifyContent='center' lineHeight='2rem'>
                <CloseIcon ml='0.5rem' mr='0.5rem' width='0.5rem' />
                {`${row.tickets}`}
              </Flex>
            )}
          </Flex>
        ) : (
          <Box>
            {row.random === '0x0000000000000000000000000000000000000000000000000000000000000000' &&
            row.epoch_id < currentEpoch &&
            row.buyers ? (
              <Button bg='rgba(0, 88, 250, 1)' color='#fff' onClick={() => _draw(row.epoch_id)}>
                Draw
              </Button>
            ) : (
              'Waiting...'
            )}
          </Box>
        )}
      </Td>
      {row.reward !== undefined && (
        <Trend
          v={
            title === 'Biggest Winners'
              ? Math.floor(row.reward / Math.pow(10, decimal))
              : row.reward / Math.pow(10, decimal)
          }
        />
      )}
      {row.buyers && (
        <Td>
          <Box>{row.buyers.length}</Box>
        </Td>
      )}
      {row.pool_in !== undefined && <Trend v={row.pool_in / Math.pow(10, decimal)} />}
      {row.pool_out !== undefined &&
        (row.pool_out === 0 ? (
          <Td>
            <Button bg='rgba(0, 88, 250, 1)' color='#fff' onClick={() => _draw(row.epoch_id)} size='xs'>
              Draw
            </Button>
          </Td>
        ) : (
          <Trend v={-row.pool_out / Math.pow(10, decimal)} />
        ))}
    </Tr>
  );
};

/* font color of reward */
const Trend: React.FC<{ v: number }> = ({ v }) => {
  return (
    <Td>
      <Flex>
        {v === 0 ? (
          <Box color='#999999F'>-</Box>
        ) : v > 0 ? (
          <Box color='#25A17CFF'>{'+' + Number(v)}</Box>
        ) : (
          <Box color='#E02020FF'>{'-' + -Number(v)}</Box>
        )}
        {v !== 0 && (
          <Flex fontSize='0.5rem' pl='0.2rem' alignItems='flex-end' lineHeight='1rem' color='999'>
            DOT
          </Flex>
        )}
      </Flex>
    </Td>
  );
};

export default T;
