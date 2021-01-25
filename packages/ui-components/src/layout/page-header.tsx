import { Box, Container, AccountSelect, Flex, Heading } from '@patract/ui-components';
import React from 'react';

export type PageHeaderProps = {
  title: React.ReactNode;
};

export const PageHeader: React.FC<PageHeaderProps> = React.memo(({ title }) => {
  return (
    <Box maxW='full' as='header' p={0} background='white'>
      <Container display='flex' maxW='max' alignItems='center'>
        <Heading as='h1' fontSize='2xl' fontWeight='medium' py={4}>
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
        <Box as='nav' flex='1'></Box>

        <Box>
          <AccountSelect />
        </Box>
      </Container>
    </Box>
  );
});
