import React, { useCallback, useState } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button
} from '@patract/ui-components';
import { useModal } from '@patract/react-hooks';

export const DeleteButton: React.FC<any> = ({ onSubmit, item }) => {
  const { isOpen, onOpen, onClose } = useModal();
  const cancelRef = React.useRef<any>();
  const [isLoading, setIsLoading] = useState(false);

  const submit = useCallback(() => {
    setIsLoading(true);
    onSubmit([item.id])
      .then(() => {
        onClose();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [onSubmit, onClose, item.id]);

  return (
    <>
      <Button colorScheme='red' variant='link' _focus={{ boxShadow: 'none' }} onClick={onOpen}>
        Delete
      </Button>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Game
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button isLoading={isLoading} colorScheme='red' onClick={submit} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
