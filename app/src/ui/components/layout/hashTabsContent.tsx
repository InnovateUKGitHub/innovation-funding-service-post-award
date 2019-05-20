import React from "react";
import { HashTabItem, Section } from "@ui/components";

interface TabProps {
  tabList: HashTabItem[];
  qa?: string;
}

interface State {
  hash: string;
  jsEnabled: boolean;
}

export class HashTabsContent extends React.PureComponent<TabProps, State> {

  constructor(props: TabProps) {
    super(props);
    this.state = {
      hash: "#",
      jsEnabled: false
    };
  }

  componentDidMount() {
    this.setState({jsEnabled: true});
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
    const { tabList } = this.props;
    if (tabList === null || !tabList.length) return null;
    const selected = this.findSelectedItem();
    return this.state.jsEnabled ? this.renderSection(selected) : tabList.map(x => this.renderSection(x));
  }

  private renderSection(item: HashTabItem) {
    return (
      <Section key={item.hash} id={item.hash} title={item.text}>
        {item.content}
      </Section>
    );
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
