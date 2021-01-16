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
  Th as ChakraTh,
  Td as ChakraTd,
  useDisclosure,
  TableColumnHeaderProps,
  TableCellProps,
  ButtonProps
} from '@chakra-ui/react';
import Add from './add';
import Withdraw from './withdraw';

const Th = ({ sx, ...rest }: TableColumnHeaderProps) => (
  <ChakraTh
    sx={{
      textTransform: 'none',
      fontSize: '12px',
      fontWeight: '400',
      px: '8px',
      ...sx
    }}
    {...rest}
  />
);
const Td = ({ sx, ...rest }: TableCellProps) => (
  <ChakraTd sx={{ px: '8px', ...sx }} {...rest} />
);
const TdLink = ({ sx, ...rest }: ButtonProps) => (
  <Button variant='link' sx={{ fontSize: '12px', fontWeight: '400', ...sx }} {...rest} />
);

const Pool = () => {
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isWithdrawOpen, onOpen: onWithdrawOpen, onClose: onWithdrawClose } = useDisclosure();

  return (
    <Layout>
      <Box
        sx={{
          border: '1px solid #E0E0E0',
          borderRadius: '2px',
          bgColor: '#FFFFFF',
          px: '24px',
          pb: '44px',
        }}
      >
        <Heading as='h3' sx={{ fontSize: '16px', lineHeight: '20px', fontWeight: 400, py: '16px', px: '14px' }}>
          List
        </Heading>
        <Table sx={{ color: '#666666', fontSize: '12px' }}>
          <Thead sx={{ bgColor: '#F4F4F4' }}>
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
      <Add isOpen={true} onClose={onAddClose} />
      <Withdraw isOpen={isWithdrawOpen} onClose={onWithdrawClose} />
    </Layout>
  );
};

export default Pool;
