import { TriangleDownIcon } from '@chakra-ui/icons';
import { useModal } from '@patract/react-hooks';
import {
  Box,
  Center,
  Flex,
  IdentityIcon,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text
} from '@patract/ui-components';
import { EMPTY, truncated } from '@patract/utils';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTokens } from '../hooks/useTokens';

export type MenuOption = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
};

export type InputAddressSelectProps = {
  value: string;
  options: any;
  hasDefault?: boolean;
  onChangeValue: (value: string) => void;
  onChangeOption: (value: any) => void;
} & Omit<React.ComponentProps<typeof Controller>, 'render'>;

const InputAddressSelect: React.FC<InputAddressSelectProps> = ({
  hasDefault,
  value,
  options,
  onChangeOption,
  onChangeValue
}) => {
  const { isOpen, onOpen, onClose } = useModal();
  const [inputValue, setInputValue] = useState('');

  const onPopoverClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setInputValue('');
    }, 500);
  }, [onClose, setInputValue]);

  const onSelect = useCallback(
    (option) => {
      onClose();
      onChangeOption(option);
    },
    [onClose, onChangeOption]
  );

  const option = useMemo(() => {
    if (!value && hasDefault) {
      return (options || []).find((d: any) => d.contract === EMPTY);
    }
    return (options || []).find((d: any) => d.contract === value);
  }, [options, value, hasDefault]);

  return (
    <Box>
      <Input
        onChange={(event) => {
          if (hasDefault && event.target.value === EMPTY) {
            onChangeValue('');
          }
          onChangeValue(event.target.value);
        }}
        value={value}
        sx={{
          w: 'calc(100% - 160px)',
          h: '44px',
          borderRadius: '4px 0 0 4px',
          borderRight: '0',
          _focus: { boxShadow: 'none' }
        }}
      />
      <Popover isOpen={isOpen} onOpen={onOpen} onClose={onPopoverClose}>
        <PopoverTrigger>
          <Box
            border='1px solid'
            borderColor='gray.200'
            width='160px'
            sx={{
              height: '44px',
              display: 'inline-block',
              verticalAlign: 'top',
              borderRadius: '0 4px 4px 0',
              borderLeft: '0',
              cursor: 'pointer',
              bgColor: '#FFFFFF'
            }}
          >
            <Flex height='full' alignItems='center' justifyContent='space-between'>
              <Flex alignItems='center'>
                <Box mr='1' mt='1'>
                  <IdentityIcon value={option?.contract} theme='polkadot' />
                </Box>
                {option?.token_symbol ? (
                  <Text
                    sx={{
                      display: 'inline-block',
                      verticalAlign: 'top',
                      fontSize: 'lg',
                      lineHeight: 'short',
                      background: '#E1E9FF',
                      borderRadius: '4px',
                      minWidth: '96px',
                      padding: '5px 0',
                      textAlign: 'center',
                      left: '42px',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      maxWidth: '96px',
                      paddingLeft: '2px'
                    }}
                  >
                    {option?.token_symbol}
                  </Text>
                ) : null}
              </Flex>
              <TriangleDownIcon sx={{ verticalAlign: 'top', w: '10px', h: '10px', color: '#0058FA', mr: '12px' }} />
            </Flex>
          </Box>
        </PopoverTrigger>

        <PopoverContent
          sx={{
            width: '622px',
            maxHeight: '440px',
            overflowY: 'auto',
            left: '-381px',
            right: 0,
            top: '-6px',
            zIndex: 'dropdown'
          }}
        >
          <Box>
            {options?.length ? (
              options.map((option: any) => (
                <Box key={option.contract} cursor='pointer' onClick={onSelect.bind(null, option)}>
                  <Flex
                    py={2}
                    px={4}
                    alignItems='center'
                    justifyContent='space-between'
                    _hover={{ bgColor: 'gray.100' }}
                  >
                    <Flex>
                      <IdentityIcon value={option.contract} theme='polkadot' />
                      <Text ml={2} fontSize='sm'>
                        {option.token_name}
                      </Text>
                      <Text fontSize='sm' color='gray.500'>
                        ({option.token_symbol})
                      </Text>
                    </Flex>
                    <Text ml={4} color='gray.500'>
                      {option.contract === EMPTY ? 'DOT' : truncated(option.contract || '')}
                    </Text>
                  </Flex>
                </Box>
              ))
            ) : (
              <Center m={4}>
                <Text fontSize='md'>No results found in active lists.</Text>
              </Center>
            )}
          </Box>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default InputAddressSelect;
