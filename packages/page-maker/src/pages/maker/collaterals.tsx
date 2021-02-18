import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useContractQuery, useContractTx } from '@patract/react-hooks';
import { Address } from '@patract/ui-components';
import React, { FC, ReactElement } from 'react';
import { useMakerContract } from '../../hooks/use-maker-contract';

export const Collaterals: FC<{
  list: any[],
}> = ({ list }): ReactElement => {
  const { contract } = useMakerContract();
  const { excute } = useContractTx({ title: 'Pixel', contract, method: 'update' });
  const { read } = useContractQuery({ contract, method: '' });

  return <Box>
    <p>My Collaterals</p>
    <Table variant='simple' size='md'>
        <Thead>
          <Tr>
            <Th>Account</Th>
            <Th>Creation Date</Th>
            <Th>DOT Collateral</Th>
            <Th>DAI Issuance</Th>
            <Th>Current Collateral Ratio</Th>
            <Th>Operation</Th>
          </Tr>
        </Thead>
        <Tbody>
          {list?.map((item) => (
            <Tr key={item.id}>
              <Td>
                <Address value={item.address} type="contract" />
              </Td>
              <Td>
                <Address value={item.signer} />
              </Td>
              <Td>{item.tokenName}</Td>
              <Td>{item.tokenSymbol}</Td>
              <Td>{item.tokenDecimals}</Td>
              <Td>{item.totalSupply}</Td>
              <Td>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
  </Box>
};