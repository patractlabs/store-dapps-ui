import React from 'react';
import { Input } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

export type InputTextControllerProps = Omit<
  React.ComponentProps<typeof Controller> & React.ComponentProps<typeof Input>,
  'render'
>;

export const InputTextController: React.FC<InputTextControllerProps> = (props) => {
  const { name, render, as, defaultValue, control, rules, onFocus, ...inputProps } = props;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      onFocus={onFocus}
      render={({ ref, ...field }) => <Input ref={ref} {...field} {...inputProps} />}
    />
  );
};
