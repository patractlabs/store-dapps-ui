import Pagination from '@material-ui/lab/Pagination';
import { useAccount, useModal } from '@patract/react-hooks';
import { Box, Center, CircularProgress, Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from '@patract/ui-components';
import { truncated } from '@patract/utils';
import React, { useMemo, useState } from 'react';
import Erc20fixed from './contracts/erc20fixed.json';
import Erc20mintable from './contracts/erc20mintable.json';
import { useAssetList, useQueryContracts } from './hooks';
import { IssueAssetButton } from './issue-asset-button';

export const AssetList: React.FC<{ isAll: boolean }> = ({ isAll }) => {
  const { currentAccount } = useAccount();
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);

  const { data } = useQueryContracts(isAll, currentAccount, Erc20fixed.source.hash, Erc20mintable.source.hash, offset);

  const page = useMemo(() => {
    return Math.floor(offset / 5) + 1;
  }, [offset]);

  const handlePage = (_: any, page: number) => {
    console.log(page);
    setOffset((page - 1) * 5);
  };

  const contractList = useMemo(() => {
    if (!data) return;
    setCount(Math.floor(data.Events_aggregate.aggregate.count / 5) + 1);
    return data.Events.map((event: any) => {
      return {
        id: event.id,
        signer: event.args[0],
        address: event.args[1],
        codeHash: event.extrinsic.args.code_hash
      };
    });
  }, [data]);

  const { data: list, loading, forceUpdate } = useAssetList(contractList);

  return (
    <Box mt={4} padding={3} background='white' borderRadius='12px' border='1px solid' borderColor='gray.100'>
      <Table variant='simple' size='md'>
        <Thead>
          <Tr>
            <Th>Contract Address</Th>
            <Th>Owner Address</Th>
            <Th>Name</Th>
            <Th>Symbol</Th>
            <Th>Decimals</Th>
            <Th>Max Supply</Th>
            {isAll ? null : <Th></Th>}
          </Tr>
        </Thead>
        <Tbody>
          {list?.map((item) => (
            <Tr key={item.id}>
              <Td>{truncated(item.address)}</Td>
              <Td>{truncated(item.signer)}</Td>
              <Td>{item.tokenName}</Td>
              <Td>{item.tokenSymbol}</Td>
              <Td>{item.tokenDecimals}</Td>
              <Td>{item.totalSupply}</Td>
              {isAll ? null : (
                <Td>
                  {item.codeHash === Erc20mintable.source.hash ? (
                    <IssueAssetButton contractAddress={item.address} updateView={forceUpdate} />
                  ) : null}
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
      {(!list || list.length === 0) && (
        <Center p={16}>{loading ? <CircularProgress isIndeterminate color='blue.300' /> : <Text>No Data</Text>}</Center>
      )}
      {list && list.length !== 0 && (
        <Flex mt='4' justifyContent='flex-end'>
          <Pagination count={count} page={page} onChange={handlePage} shape='rounded' />
        </Flex>
      )}
    </Box>
  );
};
