import React from "react";
import cn from "classnames";
import { Link } from "../links";
import { ILinkInfo } from "@framework/types/ILinkInfo";

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
            return (
                <div className={`govuk-tabs govuk-!-margin-bottom-9`} data-qa={qa}>
                    <ul className="govuk-tabs__list" role="tablist">
                        {tabList.map((item, index) => this.renderItem(item, index))}
                    </ul>
                </div>
            );
        }
        return null;
    }

    private renderItem(item: TabItem, index: number) {
        const tab = this.renderTab(item);
        if (!tab) return null;
        return (
            <li role="tab" aria-selected={item.selected} className="govuk-tabs__list-item" key={`tab-${index}`} data-qa={item.qa}>
                {tab}
            </li>
        );
    }

    private renderTab(item: TabItem) {
        const classes = cn({
          "govuk-tabs__tab": true,
          "govuk-tabs__tab--selected": item.selected
        });

        if (item.route) {
            return <Link className={classes} route={item.route}>{item.text}</Link>;
        }

        if (item.url) {
            return <a href={item.url} className={classes}>{item.text}</a>;
        }

        return <span className={classes}>item.text</span>;
    }
}
