import { Dialog } from "evergreen-ui";
import React, { createContext, useContext } from "react";

const ModalContext = createContext({
  title: "haha",
  message: "hihi",
  open: false,
  onConfirm: () => {},
  onCancel: () => {}
});
const { Provider } = ModalContext;

export function ModalProvider(props) {
  const modalContext = useContext(ModalContext);

  modalContext.trigger = ({ title, message, onConfirm, onCancel }) => {
    modalContext.open = true;
    modalContext.title = title;
    modalContext.message = message;
    modalContext.onConfirm = onConfirm;
    modalContext.onCancel = onCancel;
  };

  function handleConfirm() {
    modalContext.onConfirm();
    modalContext.open = false;
  }

  function handleOnCancel() {
    modalContext.onCancel();
    modalContext.open = false;
  }

  return (
    <Provider value={modalContext}>
      <Dialog
        isShown={modalContext.open}
        title={modalContext.title}
        onConfirm={handleConfirm}
        onCancel={handleOnCancel}
      >
        {modalContext.message}
      </Dialog>
      {props.children}
    </Provider>
  );
}

export function useModal() {
  const modalContext = useContext(ModalContext);

  return { trigger: modalContext.trigger };
}
