import React from 'react';
import { Link as ReachLink } from 'react-router-dom';
import { Box, Container, Flex, Heading, Link } from '@chakra-ui/react';

const NavLink = ({ url, text }: { url: string; text: string }) => (
  <Link
    as={ReachLink}
    to={url}
    sx={{
      position: 'relative',
      fontSize: '16px',
      fontWeight: '400',
      color: '#0058FA',
      lineHeight: '51px',
      px: '25px',
      mr: '70px'
    }}
    _after={{
      position: 'absolute',
      content: '""',
      height: '4px',
      borderRadius: '2px',
      w: '100%',
      bgColor: '#0058FA',
      bottom: 0,
      left: 0
    }}
  >
    {text}
  </Link>
);

const Header = () => {
  return (
    <header>
      <nav>
        <Box h='51px' w='100%'>
          <Container maxW='1440px' p={0}>
            <Flex sx={{ alignItems: 'center' }}>
              <Heading
                as='h1'
                sx={{
                  fontSize: '24px',
                  fontWeight: 500,
                  lineHeight: '51px',
                  fontFamily: 'PingFangSC-Medium, PingFang SC'
                }}
              >
                Patra Swap
              </Heading>
              <Box sx={{ h: '27px', w: '1px', bgColor: '#E6E6E6', ml: '38px', mr: '78px' }} />
              <NavLink url='/swap' text='Swap' />
              <NavLink url='/pool' text='Pool' />
            </Flex>
          </Container>
        </Box>
      </nav>
    </header>
  );
};

export default Header;
