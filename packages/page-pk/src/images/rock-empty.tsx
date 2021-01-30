import React from 'react';
import { Image, ImageProps } from '@chakra-ui/react';
import RockEmpty from './svgs/rock-empty.svg';

export const RockEmptyImage = (props: ImageProps) => (
  <Image src={RockEmpty} aria-hidden={true} draggable={false} alt='' {...props} />
);
