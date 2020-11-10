import React from "react";
import cn from "classnames";
import { Messages } from "../renderers/messages";

export interface HashTabItem {
  text: string;
  hash: string;
  content: React.ReactNode;
  qa?: string;
}

interface TabProps {
  tabList: HashTabItem[];
  qa?: string;
  messages?: string[];
}

interface State {
  hash: string;
}

export class HashTabs extends React.PureComponent<TabProps, State> {

  constructor(props: TabProps) {
    super(props);
    this.state = {
      hash: "#",
    };
  }

  private elem: HTMLElement|null = null;

  componentDidMount() {
    this.setHash();
    window.addEventListener("hashchange", this.setHash, false);
    const govFrontend = window && (window as any).GOVUKFrontend;
    if(this.elem && govFrontend) {
      // call gov design js to init behaviour
      new govFrontend.Tabs(this.elem).init();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.setHash, false);
  }

  setHash = () => {
    this.setState({hash: window.location.hash});
  }

  render() {
    const { tabList, qa } = this.props;
    if (tabList === null || !tabList.length) return null;

    const selected = this.findSelectedItem();
    return (
      <div className="govuk-tabs" data-module="govuk-tabs" ref={(e) => this.elem = e}>
        <h2 className="govuk-tabs__title">
          Contents
        </h2>
        <ul className="govuk-tabs__list" data-qa={qa} role="tablist">
          {tabList.map((item) => this.renderTabItem(item, selected.hash === item.hash))}
        </ul>
        {tabList.map((item) => this.renderTabContents(item, selected.hash === item.hash))}
      </div>
    );
  }

  private renderTabItem(item: HashTabItem, selected: boolean) {
    const tab = this.renderTab(item, selected);
    if (!tab) return null;

    const classes = cn(
      "govuk-tabs__list-item",
      {
        "govuk-tabs__list-item--selected": selected
      }
    );

    return (
      <li key={`tab-${item.text}`} role="presentation" data-qa={item.qa} className={classes}>
        {tab}
      </li>
    );
  }

  private renderTab(item: HashTabItem, selected: boolean) {
    const classes = cn("govuk-tabs__tab");
    return <a href={`#${item.hash}`} className={classes} aria-selected={selected} role="tab">{item.text}</a>;
  }

  private renderTabContents(item: HashTabItem, selected: boolean) {
    const classes = cn("govuk-tabs__panel", {"govuk-tabs__panel--hidden": !selected});
    return (
      <section key={item.hash} id={item.hash} className={classes}>
        {this.props.messages && <Messages messages={this.props.messages}/>}
        {item.content}
      </section>
    );
  }

  private findSelectedItem() {
    // Find tab with hash matching window hash
    const selectedItem = this.props.tabList.find(item => `#${item.hash}` === this.state.hash);
    if (selectedItem) return selectedItem;

    // Otherwise return first tab
    return this.props.tabList[0];
  }
}
