import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { theme } from './theme';

export type UIProviderProps = React.ComponentProps<typeof ChakraProvider>;

export const UIProvider: React.FC<UIProviderProps> = ({ resetCSS, ...rest }) => {
  return <ChakraProvider {...rest} theme={theme} resetCSS={resetCSS || false} />;
};
