import React from 'react';
import Layout from '../../components/layout';
import {
  Box,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  ButtonProps,
  Flex
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import Add from './add';
import Withdraw from './withdraw';
import CreatePair from './create-pair';

const TdLink = ({ sx, ...rest }: ButtonProps) => (
  <Button variant='link' sx={{ fontSize: '12px', fontWeight: '400', ...sx }} {...rest} />
);

const Pool = () => {
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isWithdrawOpen, onOpen: onWithdrawOpen, onClose: onWithdrawClose } = useDisclosure();
  const { isOpen: isCreatePairOpen, onOpen: onCreatePairOpen, onClose: onCreatePairClose } = useDisclosure();

  return (
    <Layout>
      <Flex flexDirection='row-reverse'>
        <Button
          sx={{
            textAlign: 'right',
            fontSize: '14px',
            fontWeight: '500',
            lineHeight: '20px',
            color: 'brand.primary',
            mb: '14px'
          }}
          onClick={onCreatePairOpen}
        >
          <AddIcon sx={{ mr: '10px' }} />
          Create a Pair
        </Button>
      </Flex>
      <Box
        sx={{
          border: '1px solid #E0E0E0',
          borderRadius: '2px',
          bgColor: '#FFFFFF',
          px: '24px',
          pb: '44px'
        }}
      >
        <Heading as='h3' sx={{ fontSize: '16px', lineHeight: '20px', fontWeight: 400, py: '16px', px: '14px' }}>
          List
        </Heading>
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
                  withDraw
                </TdLink>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
      <Add isOpen={isAddOpen} onClose={onAddClose} />
      <Withdraw isOpen={true} onClose={onWithdrawClose} />
      <CreatePair isOpen={isCreatePairOpen} onClose={onCreatePairClose} />
    </Layout>
  );
};

export default Pool;
