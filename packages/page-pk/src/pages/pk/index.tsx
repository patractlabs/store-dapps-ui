import React from 'react';
import { Flex, Button } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import Layout from '../../components/layout';

const PK: React.FC = () => {
  const onCreateGame = () => {}; 
  return <Layout>
      <Flex flexDirection='row-reverse'>
        <Button
          sx={{
            textAlign: 'right',
            fontSize: '14px',
            fontWeight: '500',
            lineHeight: '20px',
            color: 'brand.primary',
            mb: '14px'
          }}
          onClick={onCreateGame}
        >
          <AddIcon sx={{ mr: '10px' }} />
          Create a Pair
        </Button>
      </Flex>
  </Layout>
};

export default PK;