import React from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';

const paletteColors = [
  { hex: 'FF003A', code: 1 },
  { hex: 'FF0000', code: 2 },
  { hex: 'FF2200', code: 3 },
  { hex: 'FF7700', code: 4 },
  { hex: 'F7F400', code: 5 },
  { hex: 'ABFB00', code: 6 },
  { hex: '44FC00', code: 7 },
  { hex: '00FD00', code: 8 },
  { hex: '00E500', code: 9 },
  { hex: '00E819', code: 10 },
  { hex: '00E587', code: 11 },
  { hex: '00E4CD', code: 12 },
  { hex: '00DBFF', code: 13 },
  { hex: '00ADFF', code: 14 },
  { hex: '0084FB', code: 15 },
  { hex: '004DFB', code: 16 },
  { hex: '0003FF', code: 17 },
  { hex: '4D00F5', code: 18 },
  { hex: '9300EB', code: 19 },
  { hex: 'CD00E8', code: 20 },
  { hex: 'FF00EE', code: 21 },
  { hex: 'FF00C3', code: 22 },
  { hex: 'FFFFFF', code: 23 },
  { hex: 'DCDCDC', code: 24 },
  { hex: '646362', code: 25 },
  { hex: '000000', code: 26 }
];

const Palette: React.FC = () => {
  return (
    <Box sx={{ w: '122px', bgColor: '#FFFFFF', p: '23px 0', h: '100%' }}>
      <Heading as='h3' sx={{ fontSize: '16px', lineHeight: '22px', textAlign: 'center', mb: '16px' }}>
        Color Palette
      </Heading>
      <Flex as='ul' sx={{ flexWrap: 'wrap', p: '0 16px' }}>
        {paletteColors.map(({ hex, code }) => (
          <Box
            key={hex}
            as='li'
            sx={{
              listStyle: 'none',
              w: '40px',
              h: '40px',
              borderRadius: '50%',
              bgColor: `#${hex}`,
              mb: '10px',
              border: hex === 'FFFFFF' ? '1px solid #ABB4D0' : 'none',
              _odd: { mr: '10px' }
            }}
          ></Box>
        ))}
      </Flex>
    </Box>
  );
};

export default Palette;
