import { useAccount, useContractQuery, useContractTx } from '@patract/react-hooks';
import {
  Box,
  Button,
  Center,
  Fixed,
  Flex,
  FormControl,
  FormLabel,
  IdentityIcon,
  InputGroup,
  InputNumber,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text
} from '@patract/ui-components';
import { parseAmount } from '@patract/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { useExchange } from '../../hooks/useExchangeFactory';
import { useLPtokenContract } from '../../hooks/useLPtokenContract';
import { useErc20Balance } from '../../hooks/useErc20Balance';
import { useToken } from '../../hooks/useTokenFactory';
import { useApprove } from '../../hooks/useApprove';

const Add = ({
  isOpen,
  onClose,
  item,
  onSubmit,
  lpBalance
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  item: any;
  lpBalance: any;
}) => {
  const [fromValue, setFromValue] = useState<string>('');
  const [fromBalance, setFromBalance] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');
  const [toBalance, setToBalance] = useState<string>('');
  const [lpTotal, setLpTotal] = useState<string>('');
  const [lpValue, setLpValue] = useState<string>('');

  const { currentAccount } = useAccount();
  const { contract: exContract } = useExchange(item.exchange);
  const { contract: fromContract } = useToken(item.from);
  const { contract: toContract } = useToken(item.to);
  const { contract: lpContract } = useLPtokenContract();
  const [isLoading, setIsLoading] = useState(false);

  const readFrom = useErc20Balance(fromContract);
  const readTo = useErc20Balance(toContract);


  const { read: readTotalSupply } = useContractQuery({ contract: lpContract, method: 'totalSupply' });
  const { read: readEstimatedAddLiquidity } = useContractQuery({
    contract: exContract,
    method: 'estimatedAddLiquidity'
  });
  const { excute } = useContractTx({
    title: 'Add Liquidity',
    contract: exContract,
    method: 'addLiquidity'
  });
  const approveFrom = useApprove(fromContract);
  const approveTo = useApprove(toContract);

  const poolPrice = useMemo(() => {
    const totalFrom = Number(item.from_token_pool);
    const totalTo = Number(item.to_token_pool);
    if (!totalFrom || !totalTo) {
      return 0;
    } else {
      return (totalTo / totalFrom) * 10 ** (item.from_decimals - item.to_decimals);
    }
  }, [item.from_token_pool, item.to_token_pool, item.from_decimals, item.to_decimals]);

  useEffect(() => {
    if (poolPrice) {
      if (Number(fromValue)) {
        const value = poolPrice * Number(fromValue);
        if (value > 10 ** 19) {
          setToValue('');
        } else {
          setToValue(value.toFixed(Math.min(item.to_decimals || 0, 8)));
        }
      } else {
        setToValue('');
      }
    }
  }, [fromValue, poolPrice, item.to_decimals]);

  const [fromPrice, toPrice] = useMemo(() => {
    const totalFrom = Number(fromValue) + Number(item.from_token_pool);
    const totalTo = Number(toValue) + Number(item.to_token_pool);

    if (!totalFrom || !totalTo) {
      return [0, 0];
    } else {
      return [
        (totalTo / totalFrom) * 10 ** (item.from_decimals - item.to_decimals),
        (totalFrom / totalTo) * 10 ** (item.to_decimals - item.from_decimals)
      ];
    }
  }, [fromValue, toValue, item.from_token_pool, item.to_token_pool, item.to_decimals, item.from_decimals]);

  useEffect(() => {
    if (isOpen && readFrom) {
      readFrom(currentAccount)
        .then((result) => {
          result && setFromBalance(result as any);
        })
        .catch(() => {
          setFromBalance('');
        });
    }
  }, [isOpen, readFrom, currentAccount, item.from_decimals]);

  useEffect(() => {
    if (isOpen && readTotalSupply) {
      readTotalSupply()
        .then((result) => {
          result && setLpTotal(result as any);
        })
        .catch(() => {
          setLpTotal('');
        });
    }
  }, [isOpen, readTotalSupply]);

  useEffect(() => {
    if (isOpen && readTotalSupply) {
      readEstimatedAddLiquidity(
        parseAmount(fromValue || '0', item.from_decimals),
        parseAmount(toValue || '0', item.to_decimals)
      )
        .then((result) => {
          setLpValue((result as any) || '0');
        })
        .catch((error) => {
          console.error(error);
          setLpValue('');
        });
    }
  }, [isOpen, fromValue, toValue, readEstimatedAddLiquidity, item.from_decimals, item.to_decimals, readTotalSupply]);

  useEffect(() => {
    if (isOpen && readTo) {
      readTo(currentAccount)
        .then((result) => {
          result && setToBalance(result as any);
        })
        .catch(() => {
          setToBalance('');
        });
    }
  }, [isOpen, readTo, currentAccount, item.to_decimals]);

  const close = () => {
    setFromValue('');
    setToValue('');
    onClose();
  };

  const submit = () => {
    const from = parseAmount(fromValue || '0', item.from_decimals);


    setIsLoading(true);
    approveFrom(item.exchange)
      .then(() => {
        return approveTo(item.exchange);
      })
      .then(() => {
        return excute([from]);
      })
      .then(() => {
        onSubmit();
        close();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <ModalOverlay />
      <ModalContent maxW='2xl' border='1px' borderColor='gray.200' borderRadius='20px'>
        <ModalHeader>Add Liquidity</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel textStyle='form-label'>
              <span>From</span>

              <span>
                Balance: <Fixed value={fromBalance} decimals={item.from_decimals} />{' '}
              </span>
            </FormLabel>
            <InputGroup>
              <InputNumber maxDecimals={item.from_decimals} value={fromValue} onChange={setFromValue} />
              <InputRightElement
                width={40}
                children={
                  <Flex width='full' alignItems='center' mr={2} flexDirection='row-reverse'>
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
                      {item.from_symbol}
                    </Text>
                    <Box mr='1' mt='1'>
                      <IdentityIcon value={item.from} theme='robohash' />
                    </Box>
                  </Flex>
                }
              />
            </InputGroup>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel textStyle='form-label'>
              <span>To</span>

              <span>
                Balance: <Fixed value={toBalance} decimals={item.to_decimals} />
              </span>
            </FormLabel>
            <InputGroup>
              <InputNumber
                maxDecimals={item.to_decimals}
                isDisabled={!!poolPrice}
                value={toValue}
                onChange={setToValue}
              />
              <InputRightElement
                width={40}
                children={
                  <Flex width='full' alignItems='center' mr={2} flexDirection='row-reverse'>
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
                      {item.to_symbol}
                    </Text>
                    <Box mr='1' mt='1'>
                      <IdentityIcon value={item.to} theme='robohash' />
                    </Box>
                  </Flex>
                }
              />
            </InputGroup>
          </FormControl>
          <Flex>
            <FormControl mr={8}>
              <FormLabel textStyle='form-label'>Price and pool share</FormLabel>
              <Flex
                sx={{
                  borderRadius: '4px',
                  border: '1px solid #ABB4D0',
                  p: 4,
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Center sx={{ fontSize: 'sm', fontWeight: 'medium' }}>
                    <Fixed value={fromPrice} round={8} withDecimals />
                  </Center>
                  <Center sx={{ color: 'brand.grey', fontSize: 'xs' }}>
                    {item.to_symbol} per {item.from_symbol}
                  </Center>
                </Box>
                <Box>
                  <Center sx={{ fontSize: 'sm', fontWeight: 'medium' }}>
                    <Fixed value={toPrice} round={8} withDecimals />
                  </Center>
                  <Center sx={{ color: 'brand.grey', fontSize: 'xs' }}>
                    {item.from_symbol} per {item.to_symbol}
                  </Center>
                </Box>
              </Flex>
            </FormControl>
            <FormControl>
              <FormLabel textStyle='form-label'>
                <span>LP Tokens</span>
                <span>Balance: {lpBalance && <Fixed value={lpBalance} round={8} decimals={18} postfix='LPT' />}</span>
              </FormLabel>
              <Flex
                sx={{
                  borderRadius: '4px',
                  border: '1px solid #ABB4D0',
                  p: 4,
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Center sx={{ fontSize: 'sm', fontWeight: 'medium' }}>
                    <Fixed value={lpValue} decimals={18} round={8} postfix='LPT' />
                  </Center>
                  <Center>
                    <Text sx={{ color: 'brand.grey', fontSize: 'xs' }}>You will receive</Text>
                  </Center>
                </Box>
                <Box>
                  <Center sx={{ fontSize: 'sm', fontWeight: 'medium' }}>
                    <Fixed value={item.lp_token_supply} decimals={18} postfix='LPT' />
                  </Center>
                  <Center>
                    <Text sx={{ color: 'brand.grey', fontSize: 'xs' }}>Total supply</Text>
                  </Center>
                </Box>
              </Flex>
            </FormControl>
          </Flex>
        </ModalBody>

        <ModalFooter py={8}>
          <Stack direction='row' spacing={4} justifyContent='flex-end'>
            <Button isDisabled={!toValue || !fromValue} isLoading={isLoading} colorScheme='blue' onClick={submit}>
              Submit
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Add;
