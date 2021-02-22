import React from 'react';
import { Box, Flex, Table, Tbody, Td, Text, Thead, Th, Tr } from '@patract/ui-components';
import Pagination from '@material-ui/lab/Pagination';
import { useApi } from '@patract/react-hooks';

import { Circle, Hash } from './component';

import { TableProps, TrProps } from './types';

/**
 * Custom Table
 *
 * + Pagination
 */
export const T: React.FC<TableProps> = ({ head, body, title, onChange, width, pagin = true }) => {
  const [page, setPage] = React.useState(1);
  const api = useApi();
  const decimal = React.useMemo(() => api.api.registry.chainDecimals, []);

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
          {body.map((b, i) => (
            <Trr row={b} key={i} decimal={decimal} />
          ))}
        </Tbody>
      </Table>
      {pagin && (
        <Flex mt='4' justifyContent='flex-end' position='relative' bottom='2'>
          <Pagination count={9} page={page} onChange={c} shape='rounded' />
        </Flex>
      )}
    </Box>
  );
};

/* Well, I've forgotten why I named this component `Tr` */
export const Trr: React.FC<{ row: TrProps; decimal: number }> = ({ row, decimal }) => {
  return (
    <Tr>
      <Td>{row.epoch_id}</Td>
      {row.random && (
        <Td>
          <Hash hash={row.random} />
        </Td>
      )}
      {row.ident && <Td>{row.ident}</Td>}
      <Td display='flex' flexDirection='row'>
        {row.my_num && row.my_num.length > 0 ? (
          row.my_num.map((v, i) => (
            <Box key={String(i)}>
              <Circle v={v} />
            </Box>
          ))
        ) : (
          <Box>Waiting</Box>
        )}
      </Td>
      {row.tickets && <Td>{row.tickets}</Td>}
      {row.reward !== undefined && <Trend v={row.reward} />}
      {row.buyer && <Td>{row.buyer}</Td>}
      {row.pool_in !== undefined && <Trend v={row.pool_in / Math.pow(10, decimal)} />}
      {row.pool_out !== undefined && <Trend v={row.pool_out / Math.pow(10, decimal)} />}
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
