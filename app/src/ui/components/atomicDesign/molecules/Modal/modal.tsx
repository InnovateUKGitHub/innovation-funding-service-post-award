// TODO: This should be a button since we supply no href
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

import { SvgCrown } from "@ui/components/atomicDesign/atoms/svg/CrownSvg/crownSvg";
import { govukColourWhite } from "@ui/styles/colours";
import { ModalRegister, ModalConsumer } from "@ui/redux/modalProvider";

interface Props {
  id: string;
  children: React.ReactNode | null | undefined;
}

interface InnerProps {
  id: string;
  modalRegister: ModalRegister;
  children: React.ReactNode;
}
export const Modal: React.FunctionComponent<Props> = ({ id, children }) => (
  <ModalConsumer>
    {modalRegister => (
      <Component id={id} modalRegister={modalRegister}>
        {children}
      </Component>
    )}
  </ModalConsumer>
);

class Component extends React.Component<InnerProps> {
  constructor(props: InnerProps) {
    super(props);
    this.props.modalRegister.registerModal({ id: this.props.id, children: this.props.children });
  }

  componentWillUnmount(): void {
    this.props.modalRegister.removeModal(this.props.id);
  }

  componentDidMount(): void {
    this.props.modalRegister.registerModal({ id: this.props.id, children: this.props.children });
  }

  render(): React.ReactNode {
    return null;
  }
}
/*
 * This should ba placed on the page at the top level and controlled by the modal register, *not* to be placed wherever a modal is needed.
 * Currently used in the app component so should not be placed anywhere else. For adding modals to the page, use the "Modal" component.
 * It's been left as an exported module so it can be demoed in the component guide
 * */
export class PrivateModal extends React.Component<{ id: string; children: React.ReactNode }> {
  render() {
    return (
      <div id={this.props.id} className={"govuk-modal-dialogue"} data-module="govuk-modal-dialogue">
        <div className="govuk-modal-dialogue__wrapper">
          <dialog
            id="timeout"
            className="govuk-modal-dialogue__box"
            aria-labelledby="timeout-title"
            aria-describedby="timeout-description"
            aria-modal="true"
            role="alertdialog"
          >
            <div className="govuk-modal-dialogue__header">
              <SvgCrown colour={govukColourWhite} />
              <a
                href="#"
                role="button"
                className="govuk-button govuk-modal-dialogue__close"
                data-module="govuk-button"
                aria-label="Close modal dialogue"
              >
                ×
              </a>
            </div>
            <div className="govuk-modal-dialogue__content">{this.props.children}</div>
          </dialog>
        </div>
        <div className="govuk-modal-dialogue__backdrop" />
      </div>
    );
  }
}
