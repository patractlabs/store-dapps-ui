import { Input } from '@chakra-ui/react';
import React from 'react';

type InputNumberProps = Omit<React.ComponentProps<typeof Input>, 'render'> & {
  onChange?: (value: string) => void;
};

export const InputNumber: React.FC<InputNumberProps> = (props) => {
  const { onChange, ...rest } = props;
  const inputProps = {
    pattern: '^[0-9]*[.,]?[0-9]*$',
    inputMode: 'decimal' as 'decimal',
    ...rest
  };

  const pattern = new RegExp(inputProps.pattern);

  return (
    <Input
      onChange={(e) => {
        if (e.target.value === '' || pattern.test(e.target.value)) {
          onChange && onChange(e.target.value);
        }
      }}
      {...inputProps}
    />
  );
};
