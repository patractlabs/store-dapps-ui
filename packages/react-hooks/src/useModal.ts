import { useDisclosure, UseDisclosureProps } from '@chakra-ui/react';

export const useModal = (props?: UseDisclosureProps) => {
  return useDisclosure(props);
};
