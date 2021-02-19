import React from 'react';
import { Box } from '@patract/ui-components';

const circleStyle = (style: number) => {
  switch (style) {
    case 1:
      return {
        bg: 'linear-gradient(180deg, #F3F6F9 0%, #E4E8F5 100%)',
        border: 'solid #ABB4D0;',
        font: '#ABB4D0'
      };
    case 2:
      return {
        bg: 'linear-gradient(180deg, #F3F6F9 0%, #E4E8F5 100%)',
        border: 'solid #0058FA',
        font: '#0058FA'
      };
    default:
      return { bg: 'linear-gradient(180deg, #FFDA00 0%, #FF5C00 100%)', border: '', font: '' };
  }
};

export const Circle: React.FC<{
  v: number;
  style?: number;
  r?: string;
  lineHeight?: string;
  fontSize?: string;
  key?: string;
  mr?: string;
}> = ({ v, style = 0, r = '25px', lineHeight = '1.5rem', fontSize = '', key = '', mr = '3px' }) => {
  const pallet = circleStyle(style);

  return (
    <Box
      fontSize={fontSize}
      mr={mr}
      height={r}
      width={r}
      rounded='2em'
      lineHeight={lineHeight}
      textAlign='center'
      bg={pallet.bg}
      color={pallet.font}
      border={pallet.border}
      borderWidth='1px'
      boxShadow={style === 0 ? '0px 1px 3px 0px rgba(171, 180, 208, 0.5);' : ''}
      key={key}
    >
      {v}
    </Box>
  );
};
