import { Container, BoxProps } from '@chakra-ui/react';
import React from 'react';

export type PageMainProps = React.HTMLAttributes<HTMLDivElement> & BoxProps;

export const PageMain: React.FC<PageMainProps> = React.memo(({ children, ...rest }) => {
  return (
    <Container maxW='max' p={4} {...rest}>
      {children}
    </Container>
  );
});
