import { AddIcon } from '@chakra-ui/icons';
import { useContractQuery, useContractTx, useToast } from '@patract/react-hooks';
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
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
import React, { useCallback, useEffect, useState } from 'react';
import { FaCopy, FaEquals, FaRandom } from 'react-icons/fa';
import { useBalance } from '../../hooks/useBalance';
import { usePkContract } from '../../hooks/usePkContract';
import {
  PaperEmptyImage,
  PaperImage,
  RockEmptyImage,
  RockImage,
  ScissorsEmptyImage,
  ScissorsImage
} from '../../images/';
import { GameChoice } from './index';

function makeSalt(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

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
      <Image sx={{ w: '55px', h: '55px' }} />
      <Text sx={{ mt: '4px', color: isSelected ? 'brand.primary' : 'currentColor' }}>{choice}</Text>
    </Center>
  </Box>
);

const CreateGame = ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: () => void }) => {
  const [selectedChoice, setSelectedChoice] = useState<GameChoice>('Rock');
  const [salt, setSalt] = useState('');
  const [hash, setHash] = useState('');
  const { contract } = usePkContract();
  const balance = useBalance();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<any>(false);

  const { read: readHash } = useContractQuery({ contract, method: 'saltHash' });
  const { excute } = useContractTx({ title: 'Create Game', contract, method: 'create' });
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps, value } = useNumberInput({
    step: 1,
    defaultValue: 1,
    min: 1,
    max: Number(balance),
    precision: 1
  });

  useEffect(() => {
    if (!isOpen) return;
    if (!salt) {
      setHash('');
    } else {
      readHash(salt, selectedChoice)
        .then((hash: any) => {
          setHash(hash);
        })
        .catch(() => {
          setHash('');
        });
    }
  }, [isOpen, readHash, salt, selectedChoice]);

  useEffect(() => {
    if (!isOpen) return;
    setSalt(makeSalt(24));
  }, [isOpen]);

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  const copySalt = useCallback(() => {
    if (salt.trim()) {
      navigator.clipboard.writeText(salt).then(function () {
        toast({
          status: 'success',
          title: 'Copied',
          description: ''
        });
      });
    }
  }, [salt, toast]);

  const generateSalt = () => {
    setSalt(makeSalt(24));
  };

  const close = useCallback(() => {
    setHash('');
    setSalt('');
    onClose();
  }, [onClose]);

  const submit = useCallback(() => {
    setIsLoading(true);
    excute([hash], parseAmount(value.toString(), 10))
      .then(() => {
        close();
        onSubmit();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [hash, close, onSubmit, excute, value]);

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <ModalOverlay />
      <ModalContent maxW='2xl' border='1px' borderColor='gray.200' borderRadius='20px'>
        <ModalHeader>Create Game</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box sx={{ bgColor: '#FFFFFF', py: '7px', borderRadius: '8px 8px 0 0', w: '100%' }}>
            <Center>Hash</Center>
          </Box>
          <Box sx={{ w: '100%', p: '10px 64px 16px', bgColor: '#E7EAF0' }} justifyContent='center' alignItems='center'>
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
            <Center>
              <AddIcon sx={{ color: 'gray.400', pt: '7px', pb: '2px', w: '22px', h: '22px' }} />
            </Center>
            <Text sx={{ color: 'gray.400', fontSize: '12px' }}>
              Please randomly generate a{' '}
              <Box as='span' color='orange.500'>
                SALT
              </Box>{' '}
              and keep it secret
            </Text>
            <InputGroup>
              <Input
                background='white'
                value={salt}
                onChange={(event) => {
                  setSalt(event.target.value);
                }}
              />
              <InputRightElement
                width={16}
                justifyContent='space-between'
                children={
                  <Flex justifyContent='space-between' width='full'>
                    <Icon
                      as={FaCopy}
                      mr={2}
                      onClick={copySalt}
                      sx={{ color: 'blue.500', cursor: 'pointer', h: '20px', w: '20px' }}
                    />
                    <Icon
                      mr={2}
                      as={FaRandom}
                      onClick={generateSalt}
                      sx={{ color: 'blue.500', cursor: 'pointer', h: '20px', w: '20px' }}
                    />
                  </Flex>
                }
                sx={{ h: '40px' }}
              />
            </InputGroup>
            <Text
              sx={{
                border: '1px solid',
                borderColor: 'red.400',
                color: 'orange.400',
                bgColor: 'red.50',
                borderRadius: '4px',
                p: '5px 15px',
                fontSize: 'xs',
                textAlign: 'center',
                mt: '2'
              }}
            >
              This will generate a random number as salt to encrypt your on-chain choice. The joiner won't see your
              choice before you reveal this salt.
            </Text>
          </Box>
          <Box
            sx={{
              bgColor: '#FFFFFF',
              p: '14px 12px',
              mb: '2.5',
              borderRadius: '0 0 8px 8px',
              w: '100%',
              color: 'green.500',
              fontSize: 'xs',
              lineHeight: '17px'
            }}
          >
            <Center>
              <Icon as={FaEquals} sx={{ color: 'gray.300', w: '17px', h: '17px', mr: '5px' }} />
              <Text
                sx={{
                  display: 'inline-block'
                }}
              >
                {hash}
              </Text>
            </Center>
          </Box>

          <Flex justify='space-between' flexDirection='row'>
            <Text sx={{ color: 'gray.400', fontSize: 'xs' }}>{parseFloat(balance).toFixed()} JPT</Text>
            <Text sx={{ color: 'gray.400', fontSize: 'xs' }}>Balance</Text>
          </Flex>
          <HStack alignItems='center'>
            <InputGroup>
              <Input {...input} background='white' />
              <InputRightElement
                width={16}
                children={<Tag colorScheme='blue'>JPT</Tag>}
                sx={{ h: '40px', bg: 'transparent' }}
              />
            </InputGroup>
            <Button
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
            </Button>
            <Button
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
            </Button>
          </HStack>
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
            <p>
              1. We will save this salt in this web page automatically and locally, but you can also copy it and keep it
              secretly.
            </p>
            <p>
              2. If someone join your game, you need to reveal the salt in 1 day, otherwise you will get 0% back with
              -100% lost no matter if you win or lose.
            </p>
            <p>3. If you reveal and win, you will get 200% back with +100% as profit.</p>
            <p>4. If you reveal and lose, you will get 10% back with -90% as lost.</p>
            <p>5. If you reveal and even, you will get 100% back.</p>
          </Box>
        </ModalBody>
        <ModalFooter py={8}>
          <Stack direction='row' spacing={4} justifyContent='flex-end'>
            <Button isDisabled={!salt || !hash || !value} isLoading={isLoading} colorScheme='blue' onClick={submit}>
              Submit
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateGame;
