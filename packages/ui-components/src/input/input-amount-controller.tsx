import { InputGroup, InputRightElement } from '@chakra-ui/react';
import React from 'react';
import { InputNumberController } from './input-number-controller';

type InputAmountControllerProps = React.ComponentProps<typeof InputNumberController>;

export const InputAmountController: React.FC<InputAmountControllerProps> = (props) => {
  const { name, render, as, defaultValue, control, rules, onFocus, pattern, ...rest } = props;

  return (
    <InputGroup {...rest}>
      <InputNumberController
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        onFocus={onFocus}
        pattern='^[0-9]*[.,]?[0-9]{0,10}$'
        {...rest}
      />
      <InputRightElement children='DOT' />
    </InputGroup>
  );
};
