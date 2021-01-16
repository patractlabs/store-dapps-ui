import { Input } from '@chakra-ui/react';
import React from 'react';
import { Controller } from 'react-hook-form';

type InputNumberControllerProps = Omit<
  React.ComponentProps<typeof Controller> & React.ComponentProps<typeof Input>,
  'render'
>;

export const InputNumberController: React.FC<InputNumberControllerProps> = (props) => {
  const { name, render, as, defaultValue, control, rules, onFocus, ...rest } = props;
  const inputProps = {
    pattern: '^[0-9]*[.,]?[0-9]*$',
    inputMode: 'decimal' as 'decimal',
    ...rest
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      onFocus={onFocus}
      render={({ onChange, ref, ...field }) => (
        <Input
          onChange={(e) => {
            if (e.target.value === '' || new RegExp(inputProps.pattern).test(e.target.value)) {
              onChange(e);
            }
          }}
          ref={ref}
          {...field}
          {...inputProps}
        />
      )}
    />
  );
};
