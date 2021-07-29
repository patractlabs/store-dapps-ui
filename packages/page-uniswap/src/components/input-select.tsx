import { TriangleDownIcon } from '@chakra-ui/icons';
import { useAccount, useApi, useModal } from '@patract/react-hooks';
import {
  Box,
  Center,
  Divider,
  Fixed,
  Flex,
  FormLabel,
  Heading,
  IdentityIcon,
  Input,
  InputNumber,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text
} from '@patract/ui-components';
import { EMPTY, FixedNumber, toFixed, truncated } from '@patract/utils';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { queryBalance } from '../hooks/useErc20Balance';
import { useTokenFactory } from '../hooks/useTokenFactory';
import { useTokens } from '../hooks/useTokens';

export type MenuOption = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
};

export type InputSelectProps = {
  label: string;
  value: string;
  option: any;
  withBalance?: boolean;
  signal?: number;
  defaultOptionIndex: any;
  onChangeValue: (value: string) => void;
  onChangeOption: (value: any) => void;
} & Omit<React.ComponentProps<typeof Controller>, 'render'>;

const InputSelect: React.FC<InputSelectProps> = ({
  value,
  option,
  label,
  onChangeOption,
  onChangeValue,
  defaultOptionIndex,
  withBalance,
  signal = 0
}) => {
  const { isOpen, onOpen, onClose } = useModal();
  const { api } = useApi();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<any>(null);
  const { data, queryUnknownToken } = useTokens();
  const { currentAccount } = useAccount();
  const [balance, setBalance] = useState<null | FixedNumber>(null);
  const createToken = useTokenFactory();

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

  useEffect(() => {
    if (option || !data) return;
    onChangeOption(data[defaultOptionIndex]);
  }, [option, data, onChangeOption, defaultOptionIndex]);

  useEffect(() => {
    if (!inputValue) {
      setOptions(data);
    } else {
      const options = data.filter(({ name, symbol, address }: any) => {
        const lowerInput = inputValue.toLowerCase();
        return (
          name.toLocaleLowerCase().includes(lowerInput) ||
          symbol.toLocaleLowerCase().includes(lowerInput) ||
          address.toLocaleLowerCase().includes(lowerInput)
        );
      });
      setOptions(options);
    }
  }, [data, inputValue]);

  useEffect(() => {
    if (option?.address && withBalance) {
      const { contract } = createToken(option.address);
      queryBalance(api, currentAccount, contract, currentAccount)
        .then((b) => {
          if (!b || b === '0') {
            setBalance(null);
          } else {
            setBalance(toFixed(b as string, option.decimals));
          }
        })
        .catch((error) => {
          console.log(error);
          setBalance(null);
        });
    } else {
      setBalance(null);
    }
  }, [api, currentAccount, signal, option, withBalance, createToken]);

  return (
    <React.Fragment>
      <FormLabel textStyle='form-label'>
        <span>{label}</span>
        {withBalance ? (
          balance ? (
            <span>
              Balance:
              <Fixed value={balance} postfix={option?.symbol} />
            </span>
          ) : (
            <span>Balance: 0</span>
          )
        ) : null}
      </FormLabel>
      <InputNumber
        onChange={onChangeValue}
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
            <Center height='full'>
              <Flex alignItems='center'>
                <Box mr='1' mt='1'>
                  <IdentityIcon value={option?.address} theme='polkadot' />
                </Box>
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
                    left: '42px'
                  }}
                >
                  {option?.symbol}
                </Text>
              </Flex>
              <TriangleDownIcon sx={{ verticalAlign: 'top', w: '10px', h: '10px', color: '#0058FA', ml: '8px' }} />
            </Center>
          </Box>
        </PopoverTrigger>

        <PopoverContent sx={{ w: '464px', left: '-226px', top: '-6px', zIndex: 'dropdown' }}>
          <Box sx={{ p: '16px 18px' }}>
            <Heading as='h4' sx={{ fontSize: 'md', fontWeight: 'medium', lineHeight: 'short', mb: '2' }}>
              Select a token
            </Heading>
            <Input
              placeholder='Search address name or symbol'
              onChange={(event) => setInputValue(event.target.value)}
              value={inputValue}
            />
          </Box>
          <Divider />
          <Box>
            {options?.length ? (
              options.map((option: any) => (
                <Box key={option.address} cursor='pointer' onClick={onSelect.bind(null, option)}>
                  <Flex
                    py={2}
                    px={4}
                    alignItems='center'
                    justifyContent='space-between'
                    _hover={{ bgColor: 'gray.100' }}
                  >
                    <Flex>
                      <IdentityIcon value={option.address} theme='polkadot' />
                      <Box mx={2} width='32'>
                        <Text fontSize='sm'>{option.symbol}</Text>
                        <Text fontSize='xs' color='gray.500'>
                          {option.name}
                        </Text>
                      </Box>
                    </Flex>
                    <Text ml={4} color='gray.500'>
                      {option.address === EMPTY ? 'DOT' : truncated(option.address)}
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
    </React.Fragment>
  );
};

export default InputSelect;
