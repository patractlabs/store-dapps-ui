import React from 'react';
import { Link as ReachLink, useLocation } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import { PageHeader } from '@patract/ui-components';

const NavLink = ({ url, text, isActive }: { url: string; text: string; isActive: boolean }) => (
  <Box
    as={ReachLink}
    to={url}
    sx={{
      position: 'relative',
      fontSize: 'md',
      fontWeight: '400',
      lineHeight: '60px',
      px: '25px',
      mr: '70px',
      _hover: {
        textDecoration: 'none'
      }
    }}
    _after={
      isActive
        ? {
            position: 'absolute',
            content: '""',
            height: '2px',
            borderRadius: '2px',
            w: '100%',
            bgColor: 'rgb(43, 108, 176)',
            bottom: 0,
            left: 0
          }
        : {}
    }
  >
    {text}
  </Box>
);

const Header = () => {
  const { pathname } = useLocation();

  return (
    <PageHeader
      title='PatraSwap'
      navLinks={
        <Flex>
          <NavLink url='/swap' text='Swap' isActive={pathname === '/swap'} />
          <NavLink url='/pool' text='Pool' isActive={pathname === '/pool'} />
        </Flex>
      }
    />
  );
};

export default Header;
