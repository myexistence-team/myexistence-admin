import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader
} from "@coreui/react";
import { confirmAlert } from "react-confirm-alert";

/**
 *
 * @param {Object} props
 * @param {string} props.message - Message for the confirmation
 * @param {string} props.title - Title of confirmation
 * @param {string} props.buttonColor
 * @param {string} props.buttonVariant
 * @param {string} props.cancelButtonLabel
 * @param {string} props.cancelButtonColor
 * @param {string} props.cancelButtonVariant
 * @param {string} props.confirmButtonLabel
 * @param {string} props.confirmButtonColor
 * @param {string} props.confirmButtonVariant
 * @param {Function} props.onClose
 * @param {Function} props.onConfirm
 *
 * @returns
 */
export default function meConfirm(props) {
  return confirmAlert({
    customUI: confirmProps => {
      return (
        <CModal onClose={confirmProps.onClose} show={true} centered>
          {props.title && (
            <CModalHeader>
              <h3>{props.title}</h3>
            </CModalHeader>
          )}
          <CModalBody>
            {typeof props.message === "function"
              ? props.message()
              : props.message || "Apakah Anda yakin?"}
          </CModalBody>
          <CModalFooter>
            <CButton
              color={props.cancelButtonColor || props.buttonColor || "primary"}
              variant={
                props.cancelButtonVariant || props.buttonVariant || "outline"
              }
              onClick={
                props.onCancel
                  ? () => {
                      confirmProps.onClose();
                      props.onCancel();
                    }
                  : confirmProps.onClose
              }
            >
              {props.cancelButtonLabel || "Batal"}
            </CButton>
            <CButton
              color={props.confirmButtonColor || props.buttonColor || "primary"}
              variant={props.confirmButtonVariant || props.buttonVariant}
              onClick={
                props.onConfirm
                  ? () => {
                      confirmProps.onClose();
                      props.onConfirm();
                    }
                  : confirmProps.onClose
              }
            >
              {props.confirmButtonLabel || "Ya"}
            </CButton>
          </CModalFooter>
        </CModal>
      );
    }
  });
}
