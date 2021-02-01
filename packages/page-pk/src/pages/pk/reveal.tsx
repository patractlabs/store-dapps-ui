import { useContractTx, useModal } from '@patract/react-hooks';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  HStack,
  Image,
  Input,
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
import React, { useCallback, useState } from 'react';
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

export const RevealButton: React.FC<any> = ({ onSubmit, item }) => {
  const { isOpen, onOpen, onClose } = useModal();

  return (
    <>
      <Button colorScheme='green' variant='link' _focus={{ boxShadow: 'none' }} onClick={onOpen}>
        Reveal
      </Button>
      <RevealGame item={item} isOpen={isOpen} onClose={onClose} onSubmit={onSubmit} />
    </>
  );
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

export const RevealGame = ({
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
  const [isLoading, setIsLoading] = useState<any>(false);
  const [salt, setSalt] = useState('');

  const { excute } = useContractTx({ title: 'Reveal Game', contract, method: 'reveal' });

  const close = useCallback(() => {
    onClose();
  }, []);

  const submit = useCallback(() => {
    setIsLoading(true);
    excute([item.id, salt, selectedChoice])
      .then(() => {
        close();
        onSubmit();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [item, salt, selectedChoice]);

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <ModalOverlay />
      <ModalContent maxW='2xl' border='1px' borderColor='gray.200' borderRadius='20px'>
        <ModalHeader>Reveal Game</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormLabel>Your choice</FormLabel>
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
          <FormControl as='fieldset'>
            <FormLabel>Salt</FormLabel>
            <Input value={salt} onChange={(event) => setSalt(event.target.value)}></Input>
          </FormControl>
        </ModalBody>
        <ModalFooter py={8}>
          <Stack direction='row' spacing={4} justifyContent='flex-end'>
            <Button isDisabled={!salt} isLoading={isLoading} colorScheme='blue' onClick={submit}>
              Submit
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
