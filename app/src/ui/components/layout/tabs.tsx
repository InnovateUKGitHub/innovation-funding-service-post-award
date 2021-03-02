import React from "react";
import cn from "classnames";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { UL } from "@ui/components";
import { Link } from "../links";

export interface TabItem {
  text: string;
  route?: ILinkInfo;
  url?: string;
  selected?: boolean;
  qa?: string;
}

export interface TabProps {
  tabList: TabItem[];
  qa?: string;
}

export class Tabs extends React.PureComponent<TabProps, {}> {
  render() {
    const { tabList, qa } = this.props;

    if (tabList !== null && tabList.length) {
      const tabs = tabList.map((item, index) => this.createTab(item, index));
      return (
        <div className="govuk-tabs" data-qa={qa}>
          <UL className="govuk-tabs__list" role="tablist">
            {tabs}
          </UL>
        </div>
      );
    }
    return null;
  }

  private createTab(item: TabItem, index: number) {
    const tab = this.createTabContents(item);
    if (!tab) return null;

    const classes = cn("govuk-tabs__list-item", {
      "govuk-tabs__list-item--selected": item.selected,
    });

    return (
      <li role="tab" aria-selected={item.selected} className={classes} key={`tab-${index}`} data-qa={item.qa}>
        {tab}
      </li>
    );
  }

  private createTabContents(item: TabItem) {
    const classes = cn("govuk-tabs__tab");

    if (item.route) {
      return (
        <Link className={classes} route={item.route}>
          {item.text}
        </Link>
      );
    }

    if (item.url) {
      return (
        <a href={item.url} className={classes}>
          {item.text}
        </a>
      );
    }

    return <span className={classes}>item.text</span>;
  }
}
