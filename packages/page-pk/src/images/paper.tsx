import React from 'react';
import { Image, ImageProps } from '@chakra-ui/react';
import Paper from './svgs/paper.svg';

export const PaperImage = (props: ImageProps) => (
  <Image src={Paper} aria-hidden={true} draggable={false} alt='' {...props} />
);
