import styled, { AnyStyledComponent } from "styled-components";

import { PreventCloseDialogProps } from "@/constants/dialogs";
import { STRING_KEYS } from "@/constants/localization";
import { useStringGetter } from "@/hooks";
import { layoutMixins } from "@/styles/layoutMixins";

import { Dialog } from "@/components/Dialog";
import { Icon, IconName } from "@/components/Icon";

export const WalletRestrictedDialog = ({
  preventClose,
  setIsOpen,
}: PreventCloseDialogProps) => {
  const stringGetter = useStringGetter();

  return (
    <Dialog
      isOpen
      preventClose={preventClose}
      setIsOpen={setIsOpen}
      title="Wallet Restricted"
      slotIcon={<Styled.Icon iconName={IconName.Warning} />}
    >
      <Styled.Content>
        Because you appear to be a resident of, or using this user interface from, a jurisdiction that violates our terms of use, or have engaged in activity that violates our terms of use, you have been blocked and this transaction cannot be completed.
      </Styled.Content>
    </Dialog>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Icon = styled(Icon)`
  color: var(--color-warning);
`;

Styled.Content = styled.div`
  ${layoutMixins.column}
  gap: 1rem;
`;
