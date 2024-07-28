import { useDispatch, useSelector } from 'react-redux';

import { useStringGetter } from '@/hooks';

import { ButtonAction, ButtonSize } from '@/constants/buttons';
import { DialogTypes } from '@/constants/dialogs';
import { STRING_KEYS } from '@/constants/localization';

import { Button } from '@/components/Button';

import { openDialog } from '@/state/dialogs';
import { getOnboardingState } from '@/state/accountSelectors';
import { OnboardingState } from '@/constants/account';

type StyleProps = {
  size?: ButtonSize;
};

export const OnboardingTriggerButton = ({ size = ButtonSize.Small }: StyleProps) => {
  const stringGetter = useStringGetter();
  const dispatch = useDispatch();

  const onboardingState = useSelector(getOnboardingState);

  return (
    <Button
      action={ButtonAction.Primary}
      size={size}
      onClick={() => dispatch(openDialog({ type: DialogTypes.Onboarding }))}
    >
      {
        {
          [OnboardingState.Disconnected]: 'Connect Wallet',
          [OnboardingState.WalletConnected]: 'Reconnect Wallet'
        }[onboardingState as string]
      }
    </Button>
  );
};
