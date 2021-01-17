import React from 'react';
import { Input } from '@chakra-ui/react';
import { Controller, FieldError } from 'react-hook-form';

export type InputTextControllerProps = Omit<
  React.ComponentProps<typeof Controller> & React.ComponentProps<typeof Input>,
  'render'
> & {
  error?: FieldError;
  errorColor?: string;
};

export const InputTextController: React.FC<InputTextControllerProps> = (props) => {
  const {
    errorColor = 'red.500',
    error,
    name,
    render,
    as,
    defaultValue,
    control,
    rules,
    onFocus,
    ...inputProps
  } = props;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      onFocus={onFocus}
      render={({ ref, ...field }) => (
        <Input color={inputProps.color || (error ? errorColor : undefined)} ref={ref} {...field} {...inputProps} />
      )}
    />
  );
};
