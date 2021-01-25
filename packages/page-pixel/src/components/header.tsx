import React from 'react';
import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import { AccountSelect } from '@patract/ui-components';

const Header = () => {
  return (
    <header>
      <nav>
        <Box h='51px' w='100%'>
          <Container maxW='1440px' p={0}>
            <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Flex sx={{ alignItems: 'center' }}>
                <Heading
                  as='h1'
                  sx={{
                    fontSize: '24px',
                    fontWeight: 500
                  }}
                >
                  Patra Pixle
                </Heading>
                <Box sx={{ h: '27px', w: '1px', bgColor: '#E6E6E6', ml: '38px', mr: '78px' }} />
              </Flex>
              <AccountSelect />
            </Flex>
          </Container>
        </Box>
      </nav>
    </header>
  );
};

export default Header;
