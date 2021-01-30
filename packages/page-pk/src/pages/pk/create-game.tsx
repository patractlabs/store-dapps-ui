import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Center,
  Icon,
  HStack,
  Text,
  InputGroup,
  Input,
  InputRightAddon,
  useNumberInput,
  Tag,
  Image,
  Alert,
  AlertIcon,
  AlertDialog,
  AlertDialogContent
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { FaEquals, FaCopy, FaRandom } from 'react-icons/fa';
import { GameChoice } from './index';
import debounce from 'lodash.debounce';
import {
  PaperImage,
  PaperEmptyImage,
  ScissorsImage,
  ScissorsEmptyImage,
  RockImage,
  RockEmptyImage
} from '../../images/';

function makeSalt(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const generateHash = (salt: string, choice: Exclude<GameChoice, null | undefined>) => {
  return `0xd5d2e35f458a48fe51fa7ae442527601d7f34d028${salt}${choice}`;
};

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

const CreateGame = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [selectedChoice, setSelectedChoice] = useState<GameChoice>('Rock');
  const [salt, setSalt] = useState(makeSalt(12));
  const [hash, setHash] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
    step: 1,
    defaultValue: 1,
    min: 1,
    max: 10,
    precision: 0
  });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  const updateHash = useCallback(
    debounce(({ value = salt, choice = selectedChoice }) => {
      if (value.trim() && choice) {
        setHash(generateHash(value.trim(), choice));
      }
    }, 1500),
    [salt, selectedChoice]
  );

  const copySalt = () => {
    if (salt.trim()) {
      navigator.clipboard.writeText(salt).then(function () {
        setIsAlertOpen(true);
        setTimeout(() => {
          setIsAlertOpen(false);
        }, 1500);
      });
    }
  };

  const generateSalt = () => {
    const newSalt = makeSalt(12);
    setSalt(newSalt);
    updateHash({ value: newSalt });
  };

  useEffect(() => {
    updateHash({});
  }, [updateHash, selectedChoice]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent sx={{ w: '700px', maxW: 'auto' }}>
          <ModalHeader
            sx={{
              color: '#0058FA',
              fontSize: 'md',
              fontWeight: '500',
              lineHeight: '24px',
              py: '13px',
              boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Center>Create Game</Center>
          </ModalHeader>
          <ModalCloseButton sx={{ color: '#999999' }} />
          <ModalBody sx={{ p: '16px 128px', bgColor: '#F8F8F8' }}>
            <Box sx={{ bgColor: '#FFFFFF', py: '7px', borderRadius: '8px 8px 0 0', w: '100%' }}>
              <Center>Hash</Center>
            </Box>
            <Box sx={{ w: '100%', p: '10px 64px 16px', bgColor: '#E7EAF0' }}>
              <HStack spacing={4}>
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
                Please randomly generate a SALT and keep it secret
              </Text>
              <InputGroup size='sm' sx={{ bgColor: 'white', mt: '4px' }}>
                <Input
                  value={salt}
                  onChange={(event) => {
                    setSalt(event.target.value);
                    updateHash({ value: event.target.value });
                  }}
                  sx={{ h: '40px' }}
                />
                <InputRightAddon
                  children={
                    <Icon
                      as={FaCopy}
                      onClick={copySalt}
                      sx={{ color: 'blue.500', cursor: 'pointer', h: '20px', w: '20px' }}
                    />
                  }
                  sx={{ h: '40px' }}
                />
                <InputRightAddon
                  children={
                    <Icon
                      as={FaRandom}
                      onClick={generateSalt}
                      sx={{ color: 'blue.500', cursor: 'pointer', h: '20px', w: '20px' }}
                    />
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
                    display: 'inline-block',
                    maxW: '420px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {hash}
                </Text>
              </Center>
            </Box>

            <Text sx={{ color: 'gray.400', fontSize: 'xs' }}>Balance: 10</Text>
            <HStack maxW='320px' alignItems='center'>
              <InputGroup size='sm' sx={{ bgColor: 'white', w: '347px' }}>
                <Input {...input} sx={{ fontSize: 'lg', h: '40px', borderRight: '0',  w: '277px' }} />
                <InputRightAddon children={<Tag colorScheme='blue'>DOT</Tag>} sx={{ h: '40px', bg: 'transparent' }} />
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
            <Text
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
                1. We will save this salt in this web page automatically and locally, but you can also copy it and keep
                it secretly.
              </p>
              <p>
                2. If someone join your game, you need to reveal the salt in 1 day, otherwise you will get 0% back with
                -100% lost no matter if you win or lose.
              </p>
              <p>3. If you reveal and win, you will get 200% back with +100% as profit.</p>
              <p>4. If you reveal and lose, you will get 10% back with -90% as lost.</p>
              <p>5. If you reveal and even, you will get 100% back.</p>
            </Text>
          </ModalBody>
          <ModalFooter sx={{ justifyContent: 'center' }}>
            <Button onClick={onClose} colorScheme='primary'>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog isOpen={isOpen && isAlertOpen} leastDestructiveRef={undefined} onClose={onClose}>
        <AlertDialogContent>
          <Alert status='success'>
            <AlertIcon />
            The salt is copied.
          </Alert>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CreateGame;
