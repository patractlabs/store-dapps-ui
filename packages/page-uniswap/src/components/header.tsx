import React from 'react';
import { Link as ReachLink, useLocation } from 'react-router-dom';
import { Link, Flex } from '@chakra-ui/react';
import { PageHeader } from '@patract/ui-components';

const NavLink = ({ url, text, isActive }: { url: string; text: string; isActive: boolean }) => (
  <Link
    as={ReachLink}
    to={url}
    sx={{
      position: 'relative',
      fontSize: '16px',
      fontWeight: '400',
      color: '#0058FA',
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
            height: '4px',
            borderRadius: '2px',
            w: '100%',
            bgColor: '#0058FA',
            bottom: 0,
            left: 0
          }
        : {}
    }
  >
    {text}
  </Link>
);

const Header = () => {
  const { pathname } = useLocation();

  return (
    <PageHeader
      title='Patra Swap'
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
