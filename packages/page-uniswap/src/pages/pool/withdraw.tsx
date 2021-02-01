import { useContractQuery, useContractTx } from '@patract/react-hooks';
import {
  Box,
  Button,
  Center,
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
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text
} from '@patract/ui-components';
import { formatAmount, parseAmount } from '@patract/utils';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useExchange } from '../../hooks/useExchangeFactory';

const defaultValues = {
  withdraw_token: 1
};

const Withdraw = ({
  isOpen,
  onClose,
  onSubmit,
  item,
  lpBalance
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  item: any;
  lpBalance: any;
}) => {
  const [value, setValue] = useState('');
  const [estimated, setEstimated] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<any>(false);

  const { contract } = useExchange(item.exchange);
  const { read } = useContractQuery({ contract, method: 'estimatedRemoveLiquidity' });
  const { excute } = useContractTx({ title: 'Withdraw', contract, method: 'removeLiquidity' });

  const balance = useMemo(() => {
    return lpBalance ? formatAmount(lpBalance, 18) : 0;
  }, [lpBalance]);

  const percentage = useMemo(() => {
    return balance ? Math.ceil((Number(value) * 100) / Number(balance)) : 0;
  }, [value, balance]);

  const onSliderChange = useCallback(
    (value: number) => {
      setValue(((Number(value as any) * (balance as any)) / 100).toString());
    },
    [value, balance]
  );

  useEffect(() => {
    if (isOpen) {
      console.log(value);
      read(parseAmount(isNaN(value as any) ? '0' : String(Number(value).toFixed(18)), 18)).then((result: any) => {
        result &&
          setEstimated([formatAmount(result[0], item.from_decimals), formatAmount(result[1], item.to_decimals)]);
      });
    }
  }, [read, isOpen, value, item.from_decimals, item.to_decimals]);

  const close = () => {
    setValue('');
    onClose();
  };

  const submit = () => {
    const lpvalue = parseAmount(value || '0', 18);

    setIsLoading(true);
    excute([lpvalue])
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
        <ModalHeader>Withdraw Liquidity</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl sx={{ mb: '24px' }}>
            <FormLabel textStyle='form-label'>
              <span>Withdraw LP Token</span>
              <span>Balance: {balance}</span>
            </FormLabel>
            <InputNumber
              value={value}
              onChange={setValue}
              max={balance}
              sx={{
                w: 'calc(100% - 160px)',
                h: '44px',
                fontSize: 'lg',
                borderRadius: '4px 0 0 4px',
                borderRight: '0',
                verticalAlign: 'top',
                _focus: { boxShadow: 'none' }
              }}
            />
            <Box
              width='160px'
              border='1px solid'
              borderColor='gray.200'
              sx={{
                display: 'inline-block',
                verticalAlign: 'top',
                border: '1px solid',
                borderRadius: '0 4px 4px 0',
                borderLeft: '0'
              }}
            >
              <Center>
                <Box
                  sx={{
                    verticalAlign: 'top',
                    background: '#E1E9FF',
                    borderRadius: '4px',
                    minWidth: '144px',
                    padding: '3px 13px',
                    textAlign: 'center',
                    left: '42px',
                    my: '5px'
                  }}
                >
                  <Text sx={{ display: 'inline-block', fontSize: 'lg', lineHeight: '24px', mr: '3px' }}>LP</Text>
                  <Text sx={{ display: 'inline-block', fontSize: 'xs', lineHeight: '24px', color: 'brand.grey' }}>
                    ({item.from_name}-{item.to_name})
                  </Text>
                </Box>
              </Center>
            </Box>
            <Slider value={percentage} sx={{ mt: '2.5' }} onChange={onSliderChange} focusThumbOnChange={false}>
              <SliderTrack>
                <SliderFilledTrack bg='#25A17C' />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel textStyle='form-label'>
              <span>You will receive (estimated)</span>
            </FormLabel>
            <InputGroup>
              <InputNumber value={estimated?.[0] || '0'} isDisabled={true} />
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
                        minWidth: '74px',
                        padding: '5px 0',
                        textAlign: 'center',
                        left: '42px'
                      }}
                    >
                      {item.from_name}
                    </Text>
                    <Box mr='1' mt='1'>
                      <IdentityIcon value={item.from} />
                    </Box>
                  </Flex>
                }
              />
            </InputGroup>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel textStyle='form-label'>
              <span>You will receive (estimated)</span>
            </FormLabel>
            <InputGroup>
              <InputNumber value={estimated?.[1] || '0'} isDisabled={true} />
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
                        minWidth: '74px',
                        padding: '5px 0',
                        textAlign: 'center',
                        left: '42px'
                      }}
                    >
                      {item.to_name}
                    </Text>
                    <Box mr='1' mt='1'>
                      <IdentityIcon value={item.to} />
                    </Box>
                  </Flex>
                }
              />
            </InputGroup>
          </FormControl>
        </ModalBody>

        <ModalFooter py={8}>
          <Stack direction='row' spacing={4} justifyContent='flex-end'>
            <Button isLoading={isLoading} isDisabled={!value} colorScheme='blue' onClick={submit}>
              Submit
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Withdraw;
