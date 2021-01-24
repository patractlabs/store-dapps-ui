import { useToast as useChakraToast, AlertStatus, UseToastOptions } from '@chakra-ui/react';

export const useToast = (options?: UseToastOptions) => {
  return useChakraToast({
    position: 'top-right',
    isClosable: true,
    description: 'Unknown',
    ...options
  });
};
