import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';

export const Countdown = ({ value }: { value: number }) => {
  const timeLeft = useCountdown(value);

  return <div>{new Date(timeLeft * 1000).toISOString().substr(11, 8)}</div>;
};