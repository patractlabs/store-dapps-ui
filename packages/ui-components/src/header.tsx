import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import React from 'react';

export type HeaderProps = {
  title: React.ReactNode;
};

export const Header: React.FC<HeaderProps> = React.memo(({ title }) => {
  return (
    <header>
      <Container maxW='max' p={0}>
        <Flex alignItems='center'>
          <Heading
            as='h1'
            fontSize='2xl'
            fontWeight='medium'
            p={4}
            _after={{
              content: '""',
              height: 12
            }}
          >
            {title}
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
          <nav />
        </Flex>
      </Container>
    </header>
  );
});
