import { useState } from 'react';

import { ButtonAction, ButtonState } from '@/constants/buttons';
import { STRING_KEYS } from '@/constants/localization';
import { useNow, useStringGetter } from '@/hooks';

import { Button, type ButtonStateConfig, type ButtonProps } from '@/components/Button';

type ElementProps = {
  timeoutInSeconds: number;
} & ButtonProps;

export type TimeoutButtonProps = ElementProps;

export const TimeoutButton = ({
  children,
  timeoutInSeconds,
  ...otherProps
}: TimeoutButtonProps) => {
  const [timeoutDeadline] = useState(Date.now() + timeoutInSeconds * 1000);
  const now = useNow();
  const stringGetter = useStringGetter();

  const secondsLeft = Math.max(0, (timeoutDeadline - now) / 1000);

  const getWaitSecondsMessage = (secondsLeft: number) => {
    const seconds = Math.ceil(secondsLeft);
    return seconds === 1
      ? `Wait for ${seconds} second`
      : `Wait for ${seconds} seconds`;
  };
  const waitSecondsMessage = secondsLeft ? getWaitSecondsMessage(secondsLeft) : children;

  return (
    <Button
      {...otherProps}
      action={ButtonAction.Primary}
      state={{
        isDisabled:
          secondsLeft > 0 ||
          otherProps?.state === ButtonState.Disabled ||
          (otherProps?.state as ButtonStateConfig)?.isDisabled,
      }}
    >
      {waitSecondsMessage}
    </Button>
  );
};
