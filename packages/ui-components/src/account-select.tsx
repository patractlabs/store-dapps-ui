import { TriangleDownIcon } from '@chakra-ui/icons';
import { Box, Flex, Popover, PopoverContent, PopoverTrigger, Text, useDisclosure } from '@chakra-ui/react';
import { useAccount } from '@patract/react-hooks';
import { truncated } from '@patract/utils';
import type { KeyringPair } from '@polkadot/keyring/types';
import React, { useEffect } from 'react';

export const AccountSelect: React.FC = () => {
  const { accountList, currentAccount, setCurrentAccount } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSelect = (account: KeyringPair) => {
    onClose();
    setCurrentAccount(account.address);
  };

  useEffect(() => {
    setCurrentAccount(currentAccount);
  }, [currentAccount]);

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
            px: '16px'
          }}
        >
          <Text
            sx={{
              display: 'inline-block',
              verticalAlign: 'top',
              fontSize: '16x',
              lineHeight: '25px',
              minWidth: '74px',
              padding: '5px 0',
              left: '42px'
            }}
          >
            {truncated(currentAccount)}
          </Text>
          <TriangleDownIcon sx={{ w: '10px', h: '10px', color: '#0058FA', ml: '8px' }} />
        </Flex>
      </PopoverTrigger>
      <PopoverContent sx={{ w: '250px', left: '56px', top: '-6px', zIndex: 'dropdown' }}>
        <ul>
          {accountList?.map((account) => (
            <Box
              as='li'
              key={account.address}
              sx={{ listStyle: 'none', p: '3px 10px', cursor: 'pointer', _hover: { bgColor: '#E4EDFF' } }}
              onClick={onSelect.bind(null, account)}
            >
              <Text
                sx={{
                  display: 'inline-block',
                  color: 'brand.primary',
                  fontSize: '14px'
                }}
              >
                {truncated(account.address)}
              </Text>
            </Box>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};
