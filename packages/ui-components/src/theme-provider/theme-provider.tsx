import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { theme } from './theme';

export type ThemeProviderProps = React.ComponentProps<typeof ChakraProvider>;

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ resetCSS, ...rest }) => {
  return <ChakraProvider {...rest} theme={theme} resetCSS={resetCSS || false} />;
};
