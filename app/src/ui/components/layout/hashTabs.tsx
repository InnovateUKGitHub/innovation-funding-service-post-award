import React from "react";
import cn from "classnames";
import { UL } from "@ui/components/layout/list";
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

  private elem: HTMLElement | null = null;

  componentDidMount() {
    this.setHash();
    window.addEventListener("hashchange", this.setHash, false);
    const govFrontend = window && (window as any).GOVUKFrontend;
    if (this.elem && govFrontend) {
      // call gov design js to init behaviour
      new govFrontend.Tabs(this.elem).init();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.setHash, false);
  }

  setHash = () => {
    this.setState({ hash: window.location.hash });
  };

  render() {
    const { tabList, qa } = this.props;

    if (tabList !== null && tabList.length) {
      const selected = this.findSelectedItem();
      const tabs = tabList.map(item => this.createTab(item, selected.hash === item.hash));
      return (
        <div className="govuk-tabs" data-module="govuk-tabs" ref={e => (this.elem = e)}>
          <h2 className="govuk-tabs__title">Contents</h2>
          <UL className="govuk-tabs__list" qa={qa} role="tablist">
            {tabs}
          </UL>
          {tabList.map(item => this.renderTabContents(item, selected.hash === item.hash))}
        </div>
      );
    }
    return null;
  }

  private createTab(item: HashTabItem, selected: boolean) {
    const tab = (
      <a href={`#${item.hash}`} className={cn("govuk-tabs__tab")} aria-selected={selected} role="tab">
        {item.text}
      </a>
    );
    if (!tab) return null;

    const classes = cn("govuk-tabs__list-item", {
      "govuk-tabs__list-item--selected": selected,
    });

    return (
      <li key={`tab-${item.text}`} role="presentation" data-qa={item.qa} className={classes}>
        {tab}
      </li>
    );
  }

  private renderTabContents(item: HashTabItem, selected: boolean) {
    const classes = cn("govuk-tabs__panel", { "govuk-tabs__panel--hidden": !selected });
    return (
      <section key={item.hash} id={item.hash} className={classes}>
        {this.props.messages && <Messages messages={this.props.messages} />}
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
