import React from "react";
import { Link } from "../links";
import { ILinkInfo } from "../../../types/ILinkInfo";

export interface TabItem {
    text: string;
    route?: ILinkInfo;
    url?: string;
    selected?: boolean;
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
                    <ul className="govuk-tabs__list">
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
            <li className="govuk-tabs__list-item" key={`tab-${index}`} role="presentation">
                {tab}
            </li>
        );
    }

    private renderTab(item: TabItem) {
        if (item.route) {
            return <Link className="govuk-tabs__tab" route={item.route} selected={item.selected}>{item.text}</Link>;
        }

        if (item.url) {
            return <a href={item.url} className="govuk-tabs__tab" aria-selected={item.selected}>{item.text}</a>;
        }

        return <span className="govuk-tabs__tab">item.text</span>;
    }
}
