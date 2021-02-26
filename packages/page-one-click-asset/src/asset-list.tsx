import Pagination from '@material-ui/lab/Pagination';
import { useAccount } from '@patract/react-hooks';
import {
  Address,
  Box,
  Center,
  CircularProgress,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Fixed
} from '@patract/ui-components';
import React, { useMemo, useState } from 'react';
import Erc20fixed from '@patract/utils/contracts/erc20_fixed.json';
import Erc20mintable from '@patract/utils/contracts/erc20_issue.json';
import { useAssetList, useQueryContracts } from './hooks';
import { IssueAssetButton } from './issue-asset-button';

export const AssetList: React.FC<{ isPublic: boolean }> = ({ isPublic }) => {
  const { currentAccount } = useAccount();
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);

  const { data } = useQueryContracts(
    isPublic,
    currentAccount,
    Erc20fixed.source.hash,
    Erc20mintable.source.hash,
    offset
  );

  const page = useMemo(() => {
    return Math.floor(offset / 5) + 1;
  }, [offset]);

  const handlePage = (_: any, page: number) => {
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
            <Th>Type</Th>
            {isPublic ? null : <Th></Th>}
          </Tr>
        </Thead>
        <Tbody>
          {list?.map((item) => (
            <Tr key={item.id}>
              <Td>
                <Address value={item.address} type='contract' />
              </Td>
              <Td>
                <Address value={item.signer} />
              </Td>
              <Td>{item.tokenName}</Td>
              <Td>{item.tokenSymbol}</Td>
              <Td>{item.tokenDecimals}</Td>
              <Td>
                {item.tokenDecimals ? <Fixed value={item.totalSupply} decimals={Number(item.tokenDecimals)} /> : null}
              </Td>
              <Td>
                {item.codeHash === Erc20mintable.source.hash
                  ? 'Mintable'
                  : item.codeHash === Erc20fixed.source.hash
                  ? 'Fixed Supply'
                  : null}
              </Td>

              {isPublic ? null : (
                <Td>
                  {item.codeHash === Erc20mintable.source.hash ? (
                    <IssueAssetButton tokenDecimals={Number(item.tokenDecimals)} contractAddress={item.address} updateView={forceUpdate} />
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
      {((list && list.length !== 0) || page !== 1) && (
        <Flex mt='4' justifyContent='flex-end'>
          <Pagination count={count} page={page} onChange={handlePage} shape='rounded' />
        </Flex>
      )}
    </Box>
  );
};
