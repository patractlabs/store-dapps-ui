import { useContractQuery, contractQuery, useAccount } from '@patract/react-hooks';
import { formatAmount, parseAmount } from '@patract/utils';
import {
  Box,
  Button,
  Center,
  Spinner,
  Flex,
  FormControl,
  Icon,
  PageLayout,
  PageMain,
  Text
} from '@patract/ui-components';
import React, { useEffect, useMemo, useState } from 'react';
import { FiRepeat } from 'react-icons/fi';
import Header from '../../components/header';
import InputSelect from '../../components/input-select';
import { useFactoryContract } from '../../hooks/useFactoryContract';
import { useExchangeFactory } from '../../hooks/useExchangeFactory';

export const Swap = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [inputOption, setInputOption] = useState<any>(null);
  const [outputValue, setOutputValue] = useState<string>('');
  const [outputOption, setOutputOption] = useState<any>(null);
  const [exchangeContract, setExchangeContract] = useState<any>(null);
  const [exchangeContractLoading, setExchangeContractLoading] = useState(false);
  const [estimatedInput, setEstimatedInput] = useState<string | null>(null);
  const [estimatedOutput, setEstimatedOutput] = useState<string | null>(null);
  const [isSwapPrice, setIsSwapPrice] = useState(false);

  const createExchange = useExchangeFactory();
  const { currentAccount } = useAccount();
  const { contract } = useFactoryContract();

  const { read: readExchangeAddress } = useContractQuery({ contract, method: 'factory,getExchange' });

  const swapPrice = useMemo(() => {
    if (!isSwapPrice) {
      if (inputValue && estimatedOutput && Number(inputValue as any) !== 0) {
        //@ts-ignore
        return (estimatedOutput / inputValue).toFixed(10);
      } else if (outputValue && estimatedInput && Number(estimatedInput as any) !== 0) {
        //@ts-ignore
        return (outputValue / estimatedInput).toFixed(10);
      } else {
        return null;
      }
    } else {
      if (inputValue && estimatedOutput && Number(estimatedOutput as any) !== 0) {
        //@ts-ignore
        return (inputValue / estimatedOutput).toFixed(10);
      } else if (outputValue && estimatedInput && Number(outputValue as any) !== 0) {
        //@ts-ignore
        return (estimatedInput / outputValue).toFixed(10);
      } else {
        return null;
      }
    }
  }, [isSwapPrice, inputValue, estimatedOutput, outputValue, estimatedInput]);

  const swapInputOuteput = () => {
    if (estimatedInput === null) {
      setInputOption(outputOption);
      setOutputOption(inputOption);
      setOutputValue(inputValue);
      setInputValue('');
      setEstimatedInput('');
      setEstimatedOutput(null);
    } else if (estimatedOutput === null) {
      setInputOption(outputOption);
      setOutputOption(inputOption);
      setInputValue(outputValue);
      setOutputValue('');
      setEstimatedInput(null);
      setEstimatedOutput('');
    }
  };

  useEffect(() => {
    if (exchangeContract) {
      if (estimatedInput === null && estimatedOutput === '' && inputValue) {
        if (exchangeContract.from === inputOption.address) {
          contractQuery(
            currentAccount,
            exchangeContract.contract.contract,
            'getFromSwapToInputPrice',
            parseAmount(inputValue, inputOption.decimals)
          ).then((result: any) => {
            result && setEstimatedOutput(formatAmount(result, outputOption.decimals));
          });
        } else {
          contractQuery(
            currentAccount,
            exchangeContract.contract.contract,
            'getToSwapFromInputPrice',
            parseAmount(inputValue, inputOption.decimals)
          ).then((result: any) => {
            result && setEstimatedOutput(formatAmount(result, outputOption.decimals));
          });
        }
      } else if (estimatedOutput === null && estimatedInput === '' && outputValue) {
        if (exchangeContract.from === inputOption.address) {
          contractQuery(
            currentAccount,
            exchangeContract.contract.contract,
            'getFromSwapToOutputPrice',
            parseAmount(outputValue, outputOption.decimals)
          ).then((result: any) => {
            result && setEstimatedInput(formatAmount(result, inputOption.decimals));
          });
        } else {
          contractQuery(
            currentAccount,
            exchangeContract.contract.contract,
            'getToSwapFromOutputPrice',
            parseAmount(outputValue, outputOption.decimals)
          ).then((result: any) => {
            result && setEstimatedInput(formatAmount(result, inputOption.decimals));
          });
        }
      }
    }
  }, [exchangeContract, currentAccount, inputValue, outputValue]);

  const submit = () => {};

  useEffect(() => {
    if (inputOption && outputOption) {
      setExchangeContractLoading(true);
      readExchangeAddress(inputOption.address, outputOption.address)
        .then((result) => {
          if (result) {
            return setExchangeContract({
              from: inputOption.address,
              to: outputOption.address,
              contract: createExchange(result)
            });
          } else {
            return readExchangeAddress(outputOption.address, inputOption.address).then((result) => {
              if (result) {
                setExchangeContract({
                  from: outputOption.address,
                  to: inputOption.address,
                  contract: createExchange(result)
                });
              } else {
                setExchangeContract(null);
              }
            });
          }
        })
        .catch((error) => {
          console.error(error);
          setExchangeContract(null);
        })
        .finally(() => {
          setExchangeContractLoading(false);
        });
    }
  }, [readExchangeAddress, inputOption, outputOption]);

  useEffect(() => {}, []);

  return (
    <Box>
      <Center mt='10'>
        <Box
          maxW='2xl'
          width='2xl'
          background='white'
          border='1px solid'
          borderColor='gray.200'
          borderRadius='20px'
          p={[10, 20]}
        >
          <FormControl sx={{ mb: '24px' }}>
            <InputSelect
              defaultOptionIndex={1}
              value={estimatedInput === null ? inputValue : estimatedInput}
              option={inputOption}
              onChangeOption={setInputOption}
              onChangeValue={(value) => {
                setInputValue(value);
                setOutputValue('');
                if (value) {
                  setEstimatedInput(null);
                  setEstimatedOutput('');
                } else {
                  setEstimatedInput(null);
                  setEstimatedOutput(null);
                }
              }}
              label={`To${estimatedInput === null ? '' : ' (estimated)'}`}
            />
          </FormControl>
          <Icon
            as={FiRepeat}
            onClick={swapInputOuteput}
            sx={{
              position: 'absolute',
              display: 'inline-block',
              padding: '4px',
              w: 7,
              h: 7,
              color: 'blue.500',
              transform: 'rotate(90deg)',
              borderRadius: '2px',
              mt: '-10px',
              cursor: 'pointer',
              zIndex: 'docked',
              mx: 'auto',
              left: 0,
              right: 0
            }}
          />
          <FormControl sx={{ mb: '16px' }}>
            <InputSelect
              defaultOptionIndex={0}
              value={estimatedOutput === null ? outputValue : estimatedOutput}
              option={outputOption}
              onChangeOption={setOutputOption}
              onChangeValue={(value) => {
                setInputValue('');
                setOutputValue(value);
                if (value) {
                  setEstimatedInput('');
                  setEstimatedOutput(null);
                } else {
                  setEstimatedInput(null);
                  setEstimatedOutput(null);
                }
              }}
              label={`From${estimatedOutput === null ? '' : ' (estimated)'}`}
            />
          </FormControl>
          <Box
            sx={{
              border: '1px solid #ABB4D0',
              borderRadius: '4px',
              p: '10px 18px',
              mb: '24px'
            }}
          >
            {exchangeContractLoading ? (
              <Spinner size='sm' color='blue.500' />
            ) : !exchangeContract ? (
              <Text color='red.500'>Invalid trading pairs</Text>
            ) : (
              <Flex sx={{ justifyContent: 'space-between' }}>
                <Text sx={{ color: '#999999', display: 'inline-block' }}>Price</Text>
                <Center>
                  {swapPrice ? (
                    !isSwapPrice ? (
                      <Text sx={{ display: 'inline-block' }}>
                        {swapPrice} {outputOption.symbol} per {inputOption.symbol}
                      </Text>
                    ) : (
                      <Text sx={{ display: 'inline-block' }}>
                        {swapPrice} {inputOption.symbol} per {outputOption.symbol}
                      </Text>
                    )
                  ) : null}

                  <Icon
                    as={FiRepeat}
                    w={5}
                    h={5}
                    sx={{ ml: '15px', color: 'brand.primary', cursor: 'pointer' }}
                    onClick={() => setIsSwapPrice(!isSwapPrice)}
                  />
                </Center>
              </Flex>
            )}
          </Box>
          <FormControl>
            <Button width='full' size='lg' colorScheme='blue' onClick={submit}>
              Swap
            </Button>
          </FormControl>
        </Box>
      </Center>
    </Box>
  );
};
