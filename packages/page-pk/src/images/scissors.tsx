import React from 'react';
import { Image, ImageProps } from '@chakra-ui/react';
import Scissors from './svgs/scissors.svg';

export const ScissorsImage = (props: ImageProps) => (
  <Image src={Scissors} aria-hidden={true} draggable={false} alt='' {...props} />
);
