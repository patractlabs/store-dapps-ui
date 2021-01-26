import { Container, BoxProps } from '@chakra-ui/react';
import React from 'react';

export type PageMainProps = React.HTMLAttributes<HTMLDivElement> & BoxProps;

export const PageMain: React.FC<PageMainProps> = React.memo(({ children, ...rest }) => {
  return (
    <Container maxW='max' h='full' p={4} flexGrow={1} {...rest}>
      {children}
    </Container>
  );
});
