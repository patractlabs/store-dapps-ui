import { Container } from '@chakra-ui/react';
import React from 'react';

export type PageLayoutProps = {};

export const PageLayout: React.FC<PageLayoutProps> = React.memo(({ children }) => {
  return (
    <Container maxW='full' minH='100vh' background='#F1F3F6' p={0} display='flex' flexDirection='column'>
      {children}
    </Container>
  );
});
