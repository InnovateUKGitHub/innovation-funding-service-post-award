import React from "react";

interface InfoProps {
  summary: React.ReactNode;
  qa?: string;
}

export class Info extends React.PureComponent<InfoProps, {}> {

  private elem: HTMLElement|null = null;

  componentDidMount() {
    const govFrontend = window && (window as any).GOVUKFrontend;
    if(this.elem && govFrontend) {
      new govFrontend.Details(this.elem).init();
    }
  }

  render() {
    return (
      <details data-module="govuk-details" className="govuk-details" ref={(e) => this.elem = e} data-qa={this.props.qa}>
        <summary className="govuk-details__summary">
          <span className="govuk-details__summary-text">{this.props.summary}</span>
        </summary>
        <div className="govuk-details__text">{this.props.children}</div>
      </details>
    );
  }
}
