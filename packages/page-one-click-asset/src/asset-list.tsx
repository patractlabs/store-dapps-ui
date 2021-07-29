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
import { useAssetList, useQueryContracts } from './hooks';
import { IssueAssetButton } from './issue-asset-button';
import { abis } from '@patract/utils';

export const AssetList: React.FC<{ isPublic: boolean }> = ({ isPublic }) => {
  const { currentAccount } = useAccount();
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);

  const { data } = useQueryContracts(
    isPublic,
    currentAccount,
    abis.Erc20fixed.source.hash,
    abis.Erc20issue.source.hash,
    offset
  );

  const page = useMemo(() => {
    return Math.floor(offset / 5);
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
    <Box background='white' border='1px solid' borderColor='gray.100' borderRadius='12px' mt={4} padding={3}>
      <Table size='md' variant='simple'>
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
                <Address type='contract' value={item.address} />
              </Td>
              <Td>
                <Address value={item.signer} />
              </Td>
              <Td>{item.tokenName}</Td>
              <Td>{item.tokenSymbol}</Td>
              <Td>{item.tokenDecimals}</Td>
              <Td>
                {item.tokenDecimals ? <Fixed decimals={Number(item.tokenDecimals)} value={item.totalSupply} /> : null}
              </Td>
              <Td>
                {item.codeHash === abis.Erc20issue.source.hash
                  ? 'Mintable'
                  : item.codeHash === abis.Erc20fixed.source.hash
                  ? 'Fixed Supply'
                  : null}
              </Td>

              {isPublic ? null : (
                <Td>
                  {item.codeHash === abis.Erc20issue.source.hash ? (
                    <IssueAssetButton
                      contractAddress={item.address}
                      tokenDecimals={Number(item.tokenDecimals)}
                      updateView={forceUpdate}
                    />
                  ) : null}
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
      {(!list || list.length === 0) && (
        <Center p={16}>{loading ? <CircularProgress color='blue.300' isIndeterminate /> : <Text>No Data</Text>}</Center>
      )}
      {((list && list.length !== 0) || page !== 1) && (
        <Flex justifyContent='flex-end' mt='4'>
          <Pagination count={count} onChange={handlePage} page={page} shape='rounded' />
        </Flex>
      )}
    </Box>
  );
};
