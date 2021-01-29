import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, ButtonProps, Flex, Table, Tbody, Td, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import Add from './add';
import CreatePair from './create-pair';
import Withdraw from './withdraw';

const TdLink = ({ sx, ...rest }: ButtonProps) => <Button size='sm' mr='4' {...rest} />;

export const PoolList = () => {
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isWithdrawOpen, onOpen: onWithdrawOpen, onClose: onWithdrawClose } = useDisclosure();
  const { isOpen: isCreatePairOpen, onOpen: onCreatePairOpen, onClose: onCreatePairClose } = useDisclosure();

  return (
    <Box>
      <Flex flexDirection='row-reverse' mb={4}>
        <Button leftIcon={<AddIcon mb={1} />} onClick={onCreatePairOpen}>
          Create Asset
        </Button>
      </Flex>
      <Box mt={4} padding={3} background='white' borderRadius='12px' border='1px solid' borderColor='gray.100'>
        <Table variant='simple' size='small'>
          <Thead>
            <Tr>
              <Th>Pair</Th>
              <Th>From Token Address</Th>
              <Th>To Token Address</Th>
              <Th>From Token Pool</Th>
              <Th>To Token Pool</Th>
              <Th>LP Token Supply</Th>
              <Th>Your LP Tokens</Th>
              <Th>Operation</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>name from/name to</Td>
              <Td>GAneP4k…fJEfs</Td>
              <Td>E5PpL…j3grz</Td>
              <Td>10000 USDT</Td>
              <Td>1000 pDOT</Td>
              <Td>70000000</Td>
              <Td>20000000</Td>
              <Td>
                <TdLink sx={{ color: '#285AF8' }} onClick={onAddOpen}>
                  Add
                </TdLink>
                <TdLink sx={{ color: '#25A17C' }} onClick={onWithdrawOpen}>
                  Withdraw
                </TdLink>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
      <Add isOpen={isAddOpen} onClose={onAddClose} />
      <Withdraw isOpen={isWithdrawOpen} onClose={onWithdrawClose} />
      <CreatePair isOpen={isCreatePairOpen} onClose={onCreatePairClose} />
    </Box>
  );
};
