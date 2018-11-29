import * as React from "react";

interface Props {
  title: string;
  content: JSX.Element;
}

interface State {
  accordionOpen: boolean;
}

export class Accordion extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      accordionOpen: false
    };
  }

  render() {
    const styles = {
      buttonStyle: {
        background: "none",
        border: "none"
      }
    };

    return (
      <div className="govuk-accordion__section">
        <div className="govuk-accordion__section-header" onClick={() => this.setState({accordionOpen: !this.state.accordionOpen})}>
          <button style={styles.buttonStyle} className="govuk-heading-m govuk-!-margin-bottom-3 govuk-!-margin-top-3">{this.props.title}</button>
          <img className="govuk-!-padding-right-2" src={this.state.accordionOpen ? "/assets/images/icon-minus.png" : "/assets/images/icon-plus.png"}/>
        </div>
        {this.state.accordionOpen && <div className="govuk-accordion__section-panel">
          {this.props.content}
        </div>}
      </div>
    );
  }
}
