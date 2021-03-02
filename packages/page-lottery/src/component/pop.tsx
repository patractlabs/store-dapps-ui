import React from 'react';
import {
  Box,
  Popover,
  PopoverTrigger,
  Flex,
  QuestionIcon,
  PopoverContent,
  PopoverBody,
  PopoverArrow
} from '@patract/ui-components';

export const Pop: React.FC<{}> = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <Flex width='5rem' mt='5' color='rgba(37, 161, 124, 1)' justifyContent='flex-start' alignItems='center'>
          <QuestionIcon w={5} h={5} /> <Box ml='0.2rem'>Rules</Box>
        </Flex>
      </PopoverTrigger>
      <PopoverContent color='rgba(250, 100, 0, 1)' fontSize='13px' borderColor='rgba(250, 28, 0, 1)'>
        <PopoverArrow />
        <PopoverBody>
          <Box mb='0.5rem'>1. Wrong with 3 numbers: lose all of your deposit.</Box>
          <Box mb='0.5rem'>2. Right with 1 number : get 2x of your deposit back.</Box>
          <Box mb='0.5rem'>3. Right with 2 numbers : get 10x of your deposit back.</Box>
          <Box mb='0.5rem'>4. Right with 3 numbers : split all the Reward Pool with other same level winners.</Box>
          <Box mb='0.5rem'>5. If the Reward Pool is empty, then all the left winers will get 0 back.</Box>
          <Box>6. After an epoch is ended, everyone can close this season and get 0.1 DOT back as reward.</Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
