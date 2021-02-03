import { useContractTx } from '@patract/react-hooks';
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tag,
  Text,
  useNumberInput
} from '@patract/ui-components';
import { parseAmount } from '@patract/utils';
import React, { useCallback, useState } from 'react';
import { useBalance } from '../../hooks/useBalance';
import { usePkContract } from '../../hooks/usePkContract';
import {
  PaperEmptyImage,
  PaperImage,
  RockEmptyImage,
  RockImage,
  ScissorsEmptyImage,
  ScissorsImage
} from '../../images';
import { GameChoice } from './index';

type ChoiceCardProps = {
  Image: typeof Image;
  choice: GameChoice;
  onSelect: (choice: GameChoice) => void;
  isSelected: boolean;
};

const ChoiceCard: React.FC<ChoiceCardProps> = ({ Image, choice, onSelect, isSelected }) => (
  <Box
    onClick={onSelect.bind(null, choice)}
    sx={{
      borderRadius: '3px',
      bgColor: '#FFFFFF',
      w: '100px',
      h: '100px',
      py: '10px',
      cursor: 'pointer',
      border: '1px solid',
      borderColor: isSelected ? 'brand.primary' : 'transparent'
    }}
  >
    <Center flexDirection='column'>
      <Image sx={{ w: '55px', h: '55px', transform: 'scaleX(-1)' }} />
      <Text sx={{ mt: '4px', color: isSelected ? 'brand.primary' : 'currentColor' }}>{choice}</Text>
    </Center>
  </Box>
);

export const JoinGame = ({
  isOpen,
  onClose,
  onSubmit,
  item
}: {
  isOpen: boolean;
  item: any;
  onClose: () => void;
  onSubmit: () => void;
}) => {
  const [selectedChoice, setSelectedChoice] = useState<GameChoice>('Rock');
  const { contract } = usePkContract();
  const balance = useBalance();
  const [isLoading, setIsLoading] = useState<any>(false);

  const { excute } = useContractTx({ title: 'Join Game', contract, method: 'join' });
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps, value } = useNumberInput({
    step: 1,
    defaultValue: 1,
    min: 1,
    max: Number(balance),
    precision: 1
  });

  // const inc = getIncrementButtonProps();
  // const dec = getDecrementButtonProps();
  const input = getInputProps();

  const close = useCallback(() => {
    onClose();
  }, [onClose]);

  const submit = useCallback(() => {
    setIsLoading(true);
    excute([item.id, selectedChoice], parseAmount(value.toString(), 10))
      .then(() => {
        close();
        onSubmit();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [item, close, onSubmit, excute, selectedChoice, value]);

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <ModalOverlay />
      <ModalContent maxW='2xl' border='1px' borderColor='gray.200' borderRadius='20px'>
        <ModalHeader>Join Game</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box sx={{ w: '100%', p: '10px 64px 16px' }} justifyContent='center' alignItems='center'>
            <HStack spacing={4} justifyContent='center'>
              <ChoiceCard
                Image={selectedChoice === 'Rock' ? RockImage : RockEmptyImage}
                choice='Rock'
                onSelect={setSelectedChoice}
                isSelected={selectedChoice === 'Rock'}
              />
              <ChoiceCard
                Image={selectedChoice === 'Paper' ? PaperImage : PaperEmptyImage}
                choice='Paper'
                onSelect={setSelectedChoice}
                isSelected={selectedChoice === 'Paper'}
              />
              <ChoiceCard
                Image={selectedChoice === 'Scissors' ? ScissorsImage : ScissorsEmptyImage}
                choice='Scissors'
                onSelect={setSelectedChoice}
                isSelected={selectedChoice === 'Scissors'}
              />
            </HStack>
          </Box>
          <Flex justify='space-between'>
            <HStack alignItems='center' sx={{ width: '77%' }}>
              <InputGroup>
                <Input {...input} background='white' isDisabled/>
                <InputRightElement
                  width={16}
                  children={<Tag colorScheme='blue'>JPT</Tag>}
                  sx={{ h: '40px', bg: 'transparent' }}
                />
              </InputGroup>
              {/* <Button
                {...inc}
                sx={{
                  h: '40px',
                  border: '0',
                  bgColor: 'white',
                  color: 'blue.500',
                  boxShadow: '0px 1px 5px 0px rgba(171, 180, 208, 0.5)'
                }}
              >
                +
              </Button> */}
              {/* <Button
                {...dec}
                sx={{
                  h: '40px',
                  border: '0',
                  bgColor: 'white',
                  color: 'blue.500',
                  boxShadow: '0px 1px 5px 0px rgba(171, 180, 208, 0.5)'
                }}
              >
                -
              </Button> */}
            </HStack>
            <Text sx={{ color: 'gray.400', fontSize: 'xs', width: '23%', lineHeight: '40px', textAlign: 'right' }}>Balance: {parseInt(balance)} JPT</Text>
          </Flex>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'red.400',
              color: 'orange.400',
              bgColor: 'red.50',
              borderRadius: '4px',
              p: '5px 15px',
              fontSize: 'sm',
              mt: '2'
            }}
          >
            <p>1. The creator need to reveal the salt in 1 day, otherwise you can get</p>
            <p>2. If the creator reveal and you win, you will get 190% back with 90% as profit.</p>
            <p>3. If the creator reveal and you lose, you will get 0% back with -100% as lost.</p>
            <p>4. If the creator reveal and you are even, you will get 100% back.</p>
          </Box>
        </ModalBody>
        <ModalFooter py={8}>
          <Stack direction='row' spacing={4} justifyContent='flex-end'>
            <Button isDisabled={!value} isLoading={isLoading} colorScheme='blue' onClick={submit}>
              Submit
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
