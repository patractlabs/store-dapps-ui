import React from 'react';
import { Image, ImageProps } from '@chakra-ui/react';
import ScissorsEmpty from './svgs/scissors-empty.svg';

export const ScissorsEmptyImage = (props: ImageProps) => (
  <Image src={ScissorsEmpty} aria-hidden={true} draggable={false} alt='' {...props} />
);
