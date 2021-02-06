import React from 'react';
import { Link } from '@chakra-ui/react';
import { Link as ReachLink } from 'react-router-dom';
import { Box, Container, AccountSelect, Heading } from '@patract/ui-components';

export type PageHeaderProps = {
  title: React.ReactNode;
  navLinks?: React.ReactNode;
};

export const PageHeader: React.FC<PageHeaderProps> = React.memo(({ title, navLinks }) => {
  return (
    <Box maxW='full' as='header' p={0} background='white'>
      <Container display='flex' maxW='max' alignItems='center' px="72px">
        <Heading as='h1' fontSize='2xl' fontWeight='medium' py={4}>
          <Link as={ReachLink} to='/' sx={{ _hover: { textDecoration: 'none', color: 'gray.800' }}}>
            {title}
          </Link>
        </Heading>
        <Box
          as='div'
          sx={{
            borderRight: 'solid 1px',
            borderColor: 'gray.300',
            marginLeft: 4,
            height: 5
          }}
        ></Box>
        <Box as='nav' flex='1' ml='57px'>
          {navLinks}
        </Box>
        <Box>
          <AccountSelect />
        </Box>
      </Container>
    </Box>
  );
});
