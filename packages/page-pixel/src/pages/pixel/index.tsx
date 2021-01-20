import React from 'react';
import { Box, Center, Text } from '@chakra-ui/react';
import Layout from '../../components/layout';
import ToolBar from './tool-bar';
import Palette from './palette';
import Canvas from './canvas';

const Pixel: React.FC = () => {
  return <Layout>
      <Box sx={{ position: 'absolute', mt: '42px' }}>
          <Text sx={{ color: 'brand.grey' }}>1 Pixel = 1 DOT</Text>
          <Text sx={{ color: 'brand.primary' }}>Pool ：567 DOT</Text>
      </Box>
      <Center sx={{ display:'inline-flex', w: '100%', m: '42px 0 34px' }}><ToolBar /></Center>
      <Canvas />
      <Box as="aside" aria-label='palette' sx={{ position: 'absolute', h: '100%', right: '0', top: '0' }}>
        <Palette />    
      </Box>
  </Layout>
};

export default Pixel;
