import React from "react";
import { SvgCrown } from "@ui/components/svg/crownSvg";
import { GOVUK_COLOUR_WHITE } from "@ui/styles/colours";

interface Props {
  id: string;
}

export class Modal extends React.Component<Props> {

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
