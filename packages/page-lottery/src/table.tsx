import React from 'react';
import { Box, Table, Text, Thead, Th, Tr } from '@patract/ui-components';

export interface Col {
  name: string;
}

export interface TableProps {
  cols: Col[];
  height?: string;
  title: string;
}

export const T: React.FC<TableProps> = ({ cols, height = '600px', title }) => {
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
    </Box>
  );
};

export default T;
