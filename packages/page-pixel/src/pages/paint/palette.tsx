import { Box, Flex, Heading } from '@patract/ui-components';
import React, { useEffect } from 'react';

type PaletteProps = {
  color: number;
  onColorChange: (color: number) => void;
};

export const paletteColors = [
  'transparent',
  '#FF003A',
  '#FF0000',
  '#FF2200',
  '#FF7700',
  '#F7F400',
  '#ABFB00',
  '#44FC00',
  '#00FD00',
  '#00E500',
  '#00E819',
  '#00E587',
  '#00E4CD',
  '#00DBFF',
  '#00ADFF',
  '#0084FB',
  '#004DFB',
  '#0003FF',
  '#4D00F5',
  '#9300EB',
  '#CD00E8',
  '#FF00EE',
  '#FF00C3',
  '#FFFFFF',
  '#DCDCDC',
  '#646362',
  '#000000'
];

const Palette: React.FC<PaletteProps> = ({ color, onColorChange }) => {
  return (
    <Box sx={{ w: '122px', p: '23px 0', h: '100%', bgColor: '#FFFFFF' }}>
      <Heading as='h3' sx={{ fontSize: '16px', lineHeight: '22px', textAlign: 'center', mb: '16px' }}>
        Color Palette
      </Heading>
      <Flex as='ul' sx={{ flexWrap: 'wrap', p: '0 16px', bgColor: '#FFFFFF' }}>
        {paletteColors.slice(1).map((hex, index) => (
          <Box
            key={hex}
            as='li'
            onClick={onColorChange.bind(null, index + 1)}
            sx={{
              listStyle: 'none',
              w: '40px',
              h: '40px',
              borderRadius: '50%',
              bgColor: hex,
              mb: '10px',
              border: color === index + 1 ? '2px solid #000000' : hex === '#FFFFFF' ? '1px solid #ABB4D0' : 'none',
              boxShadow: color === index + 1 ? 'rgb(66 153 225 / 60%) 0px 0px 0px 3px' : 'none',
              _odd: { mr: '10px' }
            }}
          ></Box>
        ))}
      </Flex>
    </Box>
  );
};

export default Palette;
