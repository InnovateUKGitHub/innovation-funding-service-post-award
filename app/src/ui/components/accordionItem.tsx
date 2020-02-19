import * as React from "react";
import cn from "classnames";
import { AccordionContext } from "./accordion";
import { Content } from "@ui/components/content";
import { ContentSelector } from "@content/content";

interface Props {
  title?: React.ReactNode;
  titleContent?: ContentSelector;
  qa?: string;
}

interface State {
  accordionOpen: boolean;
  focused: boolean;
}

export class AccordionItem extends React.Component<Props, State> {

  static contextType = AccordionContext;
  context!: React.ContextType<typeof AccordionContext>;

  constructor(props: Props) {
    super(props);
    this.state = {
      accordionOpen: true, // on server needs to be open
      focused: false
    };
  }

  componentDidMount() {
    this.context.subscribe();
    this.setState({ accordionOpen: false }); // once mounted on client can be initally shut
  }

  onClick() {
    const newAccordionState = !this.state.accordionOpen;
    this.context.toggle(newAccordionState);
    this.setState({ accordionOpen: newAccordionState });
  }

  onBlur() {
    this.setState({ focused: false });
  }

  onFocus() {
    this.setState({ focused: true });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.context.allOpen && !prevState.accordionOpen) {
      this.setState({
        accordionOpen: true
      });
    }
    if (this.context.allClosed && prevState.accordionOpen) {
      this.setState({
        accordionOpen: false
      });
    }
  }

  renderTitle() {
    const title = this.props.titleContent ? <Content value={this.props.titleContent}/> : this.props.title;
    if (!title) return null;
    if (!this.context.jsEnabled) {
      return <span className="govuk-accordion__section-button">{title}</span>;
    }
    return (
      <React.Fragment>
        <button data-module="govuk-button" type="button" className="govuk-accordion__section-button" aria-expanded={this.state.accordionOpen} data-qa={`${this.props.qa}-button`}>{title}</button>
        <span className="govuk-accordion__icon" aria-hidden={!this.state.accordionOpen}/>
      </React.Fragment>
    );
  }

  render() {
    const topLevelClasses = cn({
      "govuk-accordion__section": true,
      "govuk-accordion__section--expanded": this.state.accordionOpen
    });
    const headerClasses = cn({
      "govuk-accordion__section-header": true,
      "govuk-accordion__section-header--focused": this.state.focused
    });
    return (
      <div className={topLevelClasses} data-qa={this.props.qa}>
        <div role="button" aria-pressed={this.state.accordionOpen} onBlur={() => this.onBlur()} onFocus={() => this.onFocus()} onClick={() => this.onClick()} className={headerClasses} >
          <p className="govuk-accordion__section-heading">
            {this.renderTitle()}
          </p>
        </div>
        <div className="acc-accordion__section-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}
