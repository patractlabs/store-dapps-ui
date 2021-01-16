import React from 'react';
import { Box, Container } from '@chakra-ui/react';

const Layout: React.FC = ({ children }) => (
  <main>
    <Box sx={{ bgColor: '#F1F3F6', w: '100%', h: '100vh', py: '58px' }}>
      <Container maxW='1104px' sx={{ p: 0 }}>
        {children}
      </Container>
    </Box>
  </main>
);

export default Layout;
