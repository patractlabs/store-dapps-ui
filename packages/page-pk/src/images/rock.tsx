import React from 'react';
import { Image, ImageProps } from '@chakra-ui/react';
import Rock from './svgs/rock.svg';

export const RockImage = (props: ImageProps) => (
  <Image src={Rock} aria-hidden={true} draggable={false} alt='' {...props} />
);
