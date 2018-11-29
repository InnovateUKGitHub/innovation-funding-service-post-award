import * as React from "react";

interface Props {
  title: string;
  children: JSX.Element;
}

interface State {
  accordionOpen: boolean;
}

export class AccordionItem extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      accordionOpen: true // on server needs to be open
    };
  }


  componentDidMount(){
    console.log("componentDidMount");
    this.setState({accordionOpen: false}); // once mounted on client can be initally shut
  }

  render() {
    const styles = {
      buttonStyle: {
        background: "none",
        border: "none"
      }
    };

    return (
      <div className="acc-accordion__section">
        <div className="acc-accordion__section-header" onClick={() => this.setState({accordionOpen: !this.state.accordionOpen})}>
          <button style={styles.buttonStyle} className="govuk-heading-m govuk-!-margin-bottom-3 govuk-!-margin-top-3">{this.props.title}</button>
          <img className="govuk-!-padding-right-2" src={this.state.accordionOpen ? "/assets/images/icon-minus.png" : "/assets/images/icon-plus.png"}/>
        </div>
        {this.state.accordionOpen && <div className="acc-accordion__section-panel">
          {this.props.children}
        </div>}
      </div>
    );
  }
}
