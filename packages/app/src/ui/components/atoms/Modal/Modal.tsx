import { ReactNode } from "react";
import ReactModal from "react-modal";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  children: ReactNode;
}

const Modal = ({ isOpen, setIsOpen, children }: ModalProps) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      appElement={
        typeof globalThis.document !== "undefined"
          ? (globalThis.document.getElementById("root") as HTMLDivElement)
          : undefined
      }
      parentSelector={() => document.getElementById("modal") as HTMLDivElement}
      shouldCloseOnOverlayClick={false}
      className="ifspa-govuk-modal-content"
      portalClassName="ifspa-govuk-modal-container"
      overlayClassName="ifspa-govuk-modal-overlay"
      bodyOpenClassName="ifspa-govuk-modal-open"
    >
      {children}
    </ReactModal>
  );
};

export { Modal };
