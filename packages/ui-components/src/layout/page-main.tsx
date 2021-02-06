import React from 'react';
import { Container, BoxProps } from '@chakra-ui/react';
import { ApiReady } from '../api-ready'

export type PageMainProps = React.HTMLAttributes<HTMLDivElement> & BoxProps;

export const PageMain: React.FC<PageMainProps> = React.memo(({ children, ...rest }) => {
  return (
    <Container maxW='max' h='full' py={4} flexGrow={1} {...rest} px="96px">
      <ApiReady>{children}</ApiReady>
    </Container>
  );
});
