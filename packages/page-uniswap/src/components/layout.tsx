import React from 'react';
import { Box, Container } from '@chakra-ui/react';

const Layout: React.FC = ({ children }) => (
  <Box as='main' sx={{ bgColor: '#F1F3F6', w: '100%', minH: 'calc(100vh - 51px)', pt: '58px' }}>
    <Container maxW='1104px' sx={{ p: 0 }}>
      {children}
    </Container>
  </Box>
);

export default Layout;
