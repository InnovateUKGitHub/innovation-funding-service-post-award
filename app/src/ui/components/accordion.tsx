import * as React from "react";

export const AccordionContext = React.createContext({
  allOpen: false,
  allClosed: true,
  jsEnabled: false,
  toggle: (open: boolean) => {
    return;
  },
  subscribe: () => {
    return;
  }
});

export class Accordion extends React.Component<{qa?: string}, { jsEnabled: boolean, openCount: number, subscribedCount: number }> {

  constructor(props: {}) {
    super(props);
    this.state = {
      jsEnabled: false,
      openCount: 0,
      subscribedCount: 0
    };
  }

  componentDidMount() {
    this.setState({ jsEnabled: true });
  }

  subscribe() {
    this.setState(state => ({ subscribedCount: state.subscribedCount + 1 }));
  }

  toggle(open: boolean) {
    this.setState(state => ({ openCount: open ? state.openCount + 1 : state.openCount - 1 }));
  }

  openAll() {
    this.setState(state => ({ openCount: state.subscribedCount }));
  }

  closeAll() {
    this.setState({ openCount: 0 });
  }

  renderAccordionControls(allOpen: boolean) {
    if (!this.state.jsEnabled) return null;
    return (
      <div className="govuk-accordion__controls" data-qa="accordion-open-close-all-button">
        <button data-module="govuk-button" onClick={() => allOpen ? this.closeAll() : this.openAll()} type="button" className="govuk-accordion__open-all" aria-expanded={allOpen}>
          {allOpen ? "Close all" : "Open all"}
          <span className="govuk-visually-hidden"> sections</span>
        </button>
      </div>
    );
  }

  render() {
    const allOpen = this.state.subscribedCount === this.state.openCount;
    const allClosed = this.state.openCount === 0;

    const context = {
      allOpen,
      allClosed,
      jsEnabled: this.state.jsEnabled,
      toggle: (open: boolean) => this.toggle(open),
      subscribe: () => this.subscribe()
    };
    const qa = this.props.qa? this.props.qa + "-accordion-container" : "accordion-container";
    return (
      <div className="govuk-accordion" data-qa={qa}>
        {this.renderAccordionControls(allOpen)}
        <AccordionContext.Provider value={context}>
          {this.props.children}
        </AccordionContext.Provider>
      </div>
    );
  }
}
