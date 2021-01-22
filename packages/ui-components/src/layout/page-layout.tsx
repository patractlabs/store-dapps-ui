import { Container } from '@chakra-ui/react';
import React from 'react';

export type PageLayoutProps = {};

export const PageLayout: React.FC<PageLayoutProps> = React.memo(({ children }) => {
  return (
    <Container maxW='full' height='full' background='#f8f9fa' p={0} display='flex' flexDirection='column'>
      {children}
    </Container>
  );
});
