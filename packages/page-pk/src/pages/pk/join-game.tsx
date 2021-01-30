import React from 'react';
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
  Tag
} from '@chakra-ui/react';
import { FaRegHandRock, FaRegHandPaper, FaRegHandPeace } from 'react-icons/fa';

const JoinGame = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent sx={{ w: '700px', maxW: 'auto' }}>
        <ModalHeader
          sx={{
            color: '#0058FA',
            fontSize: 'md',
            fontWeight: 'medium',
            lineHeight: 'base',
            py: '3',
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
          <HStack spacing={4}>
            <Box
              sx={{
                borderRadius: '3px',
                bgColor: '#FFFFFF',
                w: '100px',
                h: '100px',
                py: '10px',
                cursor: 'pointer'
              }}
            >
              <Center flexDirection='column'>
                <Icon
                  as={FaRegHandRock}
                  sx={{ w: '55px', h: '55px', transform: 'rotate(90deg)', color: 'orange.800' }}
                />
                <Text sx={{ mt: '4px' }}>Rock</Text>
              </Center>
            </Box>
            <Box
              sx={{
                borderRadius: '3px',
                bgColor: '#FFFFFF',
                w: '100px',
                h: '100px',
                py: '10px',
                cursor: 'pointer',
                border: '1px solid #0058FA'
              }}
            >
              <Center flexDirection='column'>
                <Icon
                  as={FaRegHandPaper}
                  sx={{ w: '55px', h: '55px', transform: 'rotate(90deg)', color: 'orange.800' }}
                />
                <Text sx={{ mt: '4px' }}>Paper</Text>
              </Center>
            </Box>
            <Box
              sx={{ borderRadius: '3px', bgColor: '#FFFFFF', w: '100px', h: '100px', py: '10px', cursor: 'pointer' }}
            >
              <Center flexDirection='column'>
                <Icon
                  as={FaRegHandPeace}
                  sx={{ w: '55px', h: '55px', transform: 'rotate(90deg)', color: 'orange.800' }}
                />
                <Text sx={{ mt: '4px' }}>Scissors</Text>
              </Center>
            </Box>
          </HStack>

          <Text sx={{ color: 'gray.400', fontSize: 'xs' }}>Balance: 10</Text>
          <InputGroup size='sm' sx={{ bgColor: 'white', mt: '4px' }}>
            <Input sx={{ fontSize: 'lg', h: '40px', borderRight: '0', w: '350px' }} />
            <InputRightAddon children={<Tag colorScheme='blue'>DOT</Tag>} sx={{ h: '40px', bg: 'transparent' }} />
          </InputGroup>

          <Text
            sx={{
              border: '1px solid',
              borderColor: 'red.400',
              color: 'orange.400',
              bgColor: 'red.50',
              borderRadius: '4px',
              p: '5px 15px',
              fontSize: 'sm',
              mt: '8px'
            }}
          >
            <p>
              1. The creator need to reveal the salt in 1 day, otherwise you can get
            </p>
            <p>
              2. If the creator reveal and you win, you will get 190% back with 90% as profit.
            </p>
            <p>3. If the creator reveal and you lose, you will get 0% back with -100% as lost.</p>
            <p>4. If the creator reveal and you are even, you will get 100% back.</p>
          </Text>
        </ModalBody>
        <ModalFooter sx={{ justifyContent: 'center' }}>
          <Button onClick={onClose} colorScheme='primary'>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JoinGame;
