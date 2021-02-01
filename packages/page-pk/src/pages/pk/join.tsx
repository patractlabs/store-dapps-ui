import { useModal } from '@patract/react-hooks';
import { Button } from '@patract/ui-components';
import React from 'react';
import { JoinGame } from './join-game';

export const JoinButton: React.FC<any> = ({ onSubmit, item }) => {
  const { isOpen, onOpen, onClose } = useModal();

  return (
    <>
      <Button colorScheme='blue' variant='link' _focus={{ boxShadow: 'none' }} onClick={onOpen}>
        Join
      </Button>
      <JoinGame item={item} isOpen={isOpen} onClose={onClose} onSubmit={onSubmit} />
    </>
  );
};
