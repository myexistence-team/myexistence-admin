import { Dialog } from "evergreen-ui";
import React, { useState } from "react";

export default function useDialog(
  { title, content, onConfirm, shouldCloseOnOverlayClick, width },
  customize = false,
  options = {
    intent: "success",
    hasFooter: false,
    hasHeader: true
  }
) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const dialog = customize ? (
    <Dialog
      isShown={isOpen}
      width={width}
      title={title}
      intent={options.intent}
      hasHeader={options.hasHeader}
      onCloseComplete={close}
      hasFooter={false}
      shouldCloseOnOverlayClick={
        shouldCloseOnOverlayClick === undefined || shouldCloseOnOverlayClick
      }
    >
      {content}
    </Dialog>
  ) : (
    <Dialog
      isShown={isOpen}
      title={title}
      intent="success"
      onConfirm={onConfirm}
      onCloseComplete={close}
      confirmLabel="OK"
      cancelLabel="Batal"
    >
      {content}
    </Dialog>
  );

  return { open, close, dialog };
}
