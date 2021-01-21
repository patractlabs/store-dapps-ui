import React from 'react';
import { Box, Container, Flex, Heading } from '@chakra-ui/react';

const Header = () => {
  return (
    <header>
      <nav>
        <Box h='51px' w='100%'>
          <Container maxW='1440px' p={0}>
            <Flex sx={{ alignItems: 'center' }}>a
              <Heading
                as='h1'
                sx={{
                  fontSize: '24px',
                  fontWeight: 500,
                  lineHeight: '51px',
                  fontFamily: 'PingFangSC-Medium, PingFang SC'
                }}
              >
                Patra PK
              </Heading>
              <Box sx={{ h: '27px', w: '1px', bgColor: '#E6E6E6', ml: '38px', mr: '78px' }} />
            </Flex>
          </Container>
        </Box>
      </nav>
    </header>
  );
};

export default Header;
