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
import { EMPTY, formatAmount, parseAmount } from '@patract/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { useApprove } from '../../hooks/useApprove';
import { useErc20Balance } from '../../hooks/useErc20Balance';
import { useExchange } from '../../hooks/useExchangeFactory';
import { useToken } from '../../hooks/useTokenFactory';

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
  const [lpValue, setLpValue] = useState<string>('');
  const isDot = useMemo(() => {
    return item.to === EMPTY || item.from === EMPTY;
  }, [item.to, item.from]);
  const { currentAccount } = useAccount();
  const { contract: exContract } = useExchange(item.exchange, isDot);
  const { contract: fromContract } = useToken(item.from);
  const { contract: toContract } = useToken(item.to);
  const [isLoading, setIsLoading] = useState(false);

  const readFrom = useErc20Balance(fromContract);
  const readTo = useErc20Balance(toContract);

  const { read: readEstimatedAddLiquidity } = useContractQuery({
    contract: exContract,
    method: 'estimatedAddLiquidity'
  });

  const { read: readEstimatedToToken } = useContractQuery({
    contract: exContract,
    method: 'estimatedToToken'
  });

  const { excute } = useContractTx({
    title: 'Add Liquidity',
    contract: exContract,
    method: 'addLiquidity'
  });
  const approveFrom = useApprove(fromContract);
  const approveTo = useApprove(toContract);

  const isFirst = useMemo(() => {
    const totalFrom = Number(item.from_token_pool);
    const totalTo = Number(item.to_token_pool);
    if (!totalFrom && !totalTo) {
      return true;
    } else {
      return false;
    }
  }, [item.from_token_pool, item.to_token_pool]);

  useEffect(() => {
    if (!isFirst && isOpen && fromValue) {
      readEstimatedToToken(parseAmount(fromValue, item.from_decimals))
        .then((result) => {
          if (!isNaN(result as any)) {
            setToValue(formatAmount(result as any, item.to_decimals));
          } else {
            setToValue('');
          }
        })
        .catch(() => {
          setToValue('');
        });
    }
  }, [fromValue, isOpen, isFirst, item.to_decimals]);

  const [fromPrice, toPrice] = useMemo(() => {
    const totalFrom = Number(fromValue) + Number(formatAmount(item.from_token_pool, item.from_decimals));
    const totalTo = Number(toValue) + Number(formatAmount(item.to_token_pool, item.to_decimals));

    if (!totalFrom || !totalTo) {
      return [0, 0];
    } else {
      return [totalTo / totalFrom, totalFrom / totalTo];
    }
  }, [fromValue, toValue, item.from_token_pool, item.to_token_pool, item.to_decimals, item.from_decimals]);

  useEffect(() => {
    if (isOpen && readFrom) {
      readFrom(currentAccount)
        .then((result) => {
          result && setFromBalance(result);
        })
        .catch(() => {
          setFromBalance('');
        });
    }
  }, [isOpen, readFrom, currentAccount, item.from_decimals]);

  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen, fromValue, toValue, readEstimatedAddLiquidity, item.from_decimals, item.to_decimals]);

  useEffect(() => {
    if (isOpen && readTo) {
      readTo(currentAccount)
        .then((result) => {
          result && setToBalance(result);
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
    const to = parseAmount(toValue || '0', item.to_decimals);

    setIsLoading(true);
    approveFrom(item.exchange)
      .then(() => {
        return approveTo(item.exchange);
      })
      .then(() => {
        return isDot ? excute([from], to) : excute([from, to]);
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
                      <IdentityIcon value={item.from} theme='polkadot' />
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
              <InputNumber maxDecimals={item.to_decimals} isDisabled={!isFirst} value={toValue} onChange={setToValue} />
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
                      <IdentityIcon value={item.to} theme='polkadot' />
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
                <span>
                  Balance:{' '}
                  {lpBalance && <Fixed value={lpBalance} round={8} decimals={item.from_decimals} postfix='LPT' />}
                </span>
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
                    <Fixed value={lpValue} decimals={item.from_decimals} round={8} postfix='LPT' />
                  </Center>
                  <Center>
                    <Text sx={{ color: 'brand.grey', fontSize: 'xs' }}>You will receive</Text>
                  </Center>
                </Box>
                <Box>
                  <Center sx={{ fontSize: 'sm', fontWeight: 'medium' }}>
                    <Fixed value={item.lp_token_supply} decimals={item.from_decimals} postfix='LPT' />
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
