import React from "react";
import cn from "classnames";

export interface HashTabItem {
  text: string;
  hash: string;
  content: React.ReactNode;
  default?: boolean;
  qa?: string;
}

interface TabProps {
  tabList: HashTabItem[];
  qa?: string;
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

  componentDidMount() {
    this.setHash();
    window.addEventListener("hashchange", this.setHash, false);
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
      <div className={`govuk-tabs govuk-!-margin-bottom-9`} data-qa={qa}>
        <ul className="govuk-tabs__list" role="tablist">
          {tabList.map((item, index) => this.renderItem(item, selected.hash === item.hash, index))}
        </ul>
      </div>
    );
  }

  private renderItem(item: HashTabItem, selected: boolean, index: number) {
    const tab = this.renderTab(item, selected);
    if (!tab) return null;
    return (
      <li role="tab" aria-selected={selected} className="govuk-tabs__list-item" key={`tab-${index}`} data-qa={item.qa}>
        {tab}
      </li>
    );
  }

  private renderTab(item: HashTabItem, selected: boolean) {
    const classes = cn({
      "govuk-tabs__tab": true,
      "govuk-tabs__tab--selected": selected
    });
    return <a href={`#${item.hash}`} className={classes}>{item.text}</a>;
  }

  private findSelectedItem() {
    // Find tab with hash matching window hash
    const selectedItem = this.props.tabList.find(item => `#${item.hash}` === this.state.hash);
    if (selectedItem) return selectedItem;

    // Otherwise find default tab
    const defaultItem = this.props.tabList.find(x => !!x.default);
    if (defaultItem) return defaultItem;

    // Otherwise return first tab
    return this.props.tabList[0];
  }
}
