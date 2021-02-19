import React from 'react';
import { Box, Flex, Table, Tbody, Td, Text, Thead, Th, Tr } from '@patract/ui-components';
import Pagination from '@material-ui/lab/Pagination';

import { TableProps, TrProps } from './types';

export const T: React.FC<TableProps> = ({ head, body, title, onChange }) => {
  const [page, setPage] = React.useState(1);

  // On Changing Page
  const c = React.useCallback(
    (_: any, page: number) => {
      setPage(page);
      onChange && onChange(page);
    },
    [onChange, setPage]
  );

  return (
    <Box mt='10' px='10px' py='8px' rounded='lg' shadow='sm' bg='white'>
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
        <Tbody>{body.map((b) => Trr(b))}</Tbody>
      </Table>
      <Flex mt='4' justifyContent='flex-end' position='relative' bottom='2'>
        <Pagination count={9} page={page} onChange={c} shape='rounded' />
      </Flex>
    </Box>
  );
};

export const Trr: React.FC<TrProps> = ({
  epoch,
  random,
  lottery,
  ident,
  reward,
  tickets,
  buyer,
  poolIn,
  poolOut,
  operation
}) => {
  return (
    <Tr key=''>
      <Td>{epoch}</Td>
      {random && <Td>{random}</Td>}
      {ident && <Td>{ident}</Td>}
      <Td>{lottery.join(',')}</Td>
      {tickets && <Td>{tickets}</Td>}
      {reward && Trend({ v: reward })}
      {buyer && <Td>{buyer}</Td>}
      {poolIn && Trend({ v: poolIn })}
      {poolOut && Trend({ v: poolOut })}
      {operation && <Td>{operation}</Td>}
    </Tr>
  );
};

const Trend: React.FC<{ v: number }> = ({ v }) => {
  if (v === 0) {
    return (
      <Td>
        <Box color='#999999F'>'-'</Box>
      </Td>
    );
  } else if (v > 0) {
    return (
      <Td>
        <Box color='#25A17CFF'>{'+' + v}</Box>
      </Td>
    );
  } else {
    return (
      <Td>
        <Box color='#E02020FF'>{'-' + -v}</Box>
      </Td>
    );
  }
};

export default T;
