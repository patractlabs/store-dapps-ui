import React, { useEffect } from 'react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Center,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  Spinner,
  useDisclosure
} from '@chakra-ui/react';
import { useAccount, useApi } from '@patract/react-hooks';
import { truncated } from '@patract/utils';
import type { KeyringPair } from '@polkadot/keyring/types';
import { IdentityIcon } from '@patract/ui-components';

export const AccountSelect: React.FC = () => {
  const { isApiReady } = useApi();
  const { accountList, currentAccount, setCurrentAccount } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSelect = (account: KeyringPair) => {
    onClose();
    setCurrentAccount(account.address);
    localStorage.setItem('current-account', account.address);
  };

  useEffect(() => {
    const storedAccount = localStorage.getItem('current-account');
    if (storedAccount && accountList?.some(account => account.address === storedAccount)) {
      setCurrentAccount(storedAccount);
    } else if (accountList && accountList.length > 0){
      setCurrentAccount(accountList[0].address);
    }
  }, [accountList]);

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <Flex
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '250px',
            h: '40px',
            border: '1px solid',
            borderRadius: '4px',
            borderColor: 'gray.300',
            cursor: 'pointer',
            bgColor: '#FFFFFF',
            px: '8px',
            _hover: {
              borderColor: 'gray.400'
            },
            _focus: {
              borderColor: 'gray.400'
            }
          }}
        >
          {!isApiReady ? (
            <Flex sx={{ flex: '1', flexDirection: 'row-reverse' }}>
              <Spinner size='sm' color='blue.500' />
            </Flex>
          ) : (
            <>
              <Flex
                sx={{
                  flexGrow: '1',
                  verticalAlign: 'top',
                  fontSize: '14px',
                  lineHeight: '25px',
                  minWidth: '74px',
                  padding: '5px 0',
                  left: '42px'
                }}
              >
                <IdentityIcon value={currentAccount} />
                <Text sx={{ flexGrow: '1', ml: '8px' }}>{currentAccount.slice(0, 6)}</Text>
                <Text sx={{ color: 'gray.400' }}>{truncated(currentAccount)}</Text>
              </Flex>
              <TriangleDownIcon sx={{ w: '10px', h: '10px', color: '#0058FA', ml: '8px' }} />
            </>
          )}
        </Flex>
      </PopoverTrigger>
      {isApiReady && (
        <PopoverContent sx={{ w: '250px', left: '36px', top: '-6px', zIndex: 'dropdown' }}>
          <ul>
            {accountList?.map((account) => (
              <Box
                as='li'
                key={account.address}
                sx={{ listStyle: 'none', p: '5px 10px', cursor: 'pointer', _hover: { bgColor: 'gray.100' } }}
                onClick={onSelect.bind(null, account)}
              >
                <Flex sx={{ fontSize: '14px' }}>
                  <IdentityIcon value={account.address} />
                  <Text sx={{ flexGrow: '1', ml: '8px' }}>{account.address.slice(0, 6)}</Text>
                  <Text sx={{ color: 'gray.400' }}>{truncated(account.address)}</Text>
                </Flex>
              </Box>
            ))}
          </ul>
        </PopoverContent>
      )}
    </Popover>
  );
};
