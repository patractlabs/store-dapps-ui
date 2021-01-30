import React from 'react';
import { Image, ImageProps } from '@chakra-ui/react';
import PaperEmpty from './svgs/paper-empty.svg';

export const PaperEmptyImage = (props: ImageProps) => (
  <Image src={PaperEmpty} aria-hidden={true} draggable={false} alt='' {...props} />
);
