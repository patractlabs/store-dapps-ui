import React from 'react';
import { Box, Flex, Table, Text, Thead, Th, Tr } from '@patract/ui-components';
import Pagination from '@material-ui/lab/Pagination';

export interface Col {
  name: string;
}

export interface TableProps {
  cols: Col[];
  height?: string;
  title: string;

  onChange?: (page: number) => void;
}

export const T: React.FC<TableProps> = ({ cols, height = '600px', title, onChange }) => {
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
    <Box height={height} mt='10' px='10px' py='8px' rounded='lg' shadow='sm' bg='white'>
      <Text p={8} fontSize='16px' fontWeight='bold'>
        {title}
      </Text>
      <Table>
        <Thead>
          <Tr>
            {cols.map((col, idx) => (
              <Th key={title + idx}>{col.name}</Th>
            ))}
          </Tr>
        </Thead>
      </Table>
      <Flex mt='4' justifyContent='flex-end' position='relative' bottom='2'>
        <Pagination count={9} page={page} onChange={c} shape='rounded' />
      </Flex>
    </Box>
  );
};

export default T;
