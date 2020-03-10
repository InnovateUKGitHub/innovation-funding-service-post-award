import React from "react";
import { SvgCrown } from "@ui/components/svg/crownSvg";
import { GOVUK_COLOUR_WHITE } from "@ui/styles/colours";
import { ModalConsumer, ModalRegister } from "@ui/redux";

interface Props {
  id: string;
}

interface InnerProps {
  id: string;
  modalRegister: ModalRegister;
}
export const Modal: React.FunctionComponent<Props> = ({ id, children }) => (
  <ModalConsumer>{ modalRegister => <Component id={id} modalRegister={modalRegister}>{children}</Component> }</ModalConsumer>
);

class Component extends React.Component<InnerProps> {

  constructor(props: InnerProps) {
    super(props);
    this.props.modalRegister.registerModal({id: this.props.id, children: this.props.children});
  }

  componentWillUnmount(): void {
    this.props.modalRegister.removeModal(this.props.id);
  }

  componentDidMount(): void {
    this.props.modalRegister.registerModal({id: this.props.id, children: this.props.children});
  }

  render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return null;
  }
}
/*
* This should ba placed on the page at the top level and controlled by the modal register, *not* to be placed wherever a modal is needed.
* Currently used in the app component so should not be placed anywhere else. For adding modals to the page, use the "Modal" component.
* It's been left as an exported module so it can be demoed in the component guide
* */
export class PrivateModal extends React.Component<{id: string}> {
  render() {
    return (
      <div id={this.props.id} className={"govuk-modal-dialogue"} data-module="govuk-modal-dialogue">
        <div className="govuk-modal-dialogue__wrapper">
          <dialog id="timeout" className="govuk-modal-dialogue__box" aria-labelledby="timeout-title" aria-describedby="timeout-description" aria-modal="true" role="alertdialog" tabIndex={0}>
            <div className="govuk-modal-dialogue__header">
              <SvgCrown colour={GOVUK_COLOUR_WHITE}/>
              {/*tslint:disable-next-line: react-a11y-anchors*/}
              <a href="#" role="button" className="govuk-button govuk-modal-dialogue__close" data-module="govuk-button" aria-label="Close modal dialogue">×</a>
            </div>
            <div className="govuk-modal-dialogue__content">
              {this.props.children}
            </div>
          </dialog>
        </div>
        <div className="govuk-modal-dialogue__backdrop"/>
      </div>
    );
  }
}
