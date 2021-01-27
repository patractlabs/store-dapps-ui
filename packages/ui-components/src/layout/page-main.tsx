import React from 'react';
import { Container, BoxProps } from '@chakra-ui/react';
import { ApiReady } from '../api-ready'

export type PageMainProps = React.HTMLAttributes<HTMLDivElement> & BoxProps;

export const PageMain: React.FC<PageMainProps> = React.memo(({ children, ...rest }) => {
  return (
    <Container maxW='max' h='full' p={4} flexGrow={1} {...rest}>
      <ApiReady>{children}</ApiReady>
    </Container>
  );
});
