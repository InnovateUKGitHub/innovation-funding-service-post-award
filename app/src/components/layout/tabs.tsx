import React from "react";

interface TabProps {
    tabList: string[];
    selected?: string;
}

export const Tabs: React.SFC<TabProps> = (props: TabProps) => {
    const renderTab = (tab: string, url: string, index:number) => {
        return (
            <li className="govuk-tabs__list-item" key={`tab-${index}`} role="presentation">
                <a href={url} className="govuk-tabs__tab" aria-selected={tab === props.selected}>{tab}</a>
            </li>
        );
    };

    return (
        <div className={`govuk-tabs govuk-!-margin-bottom-9`} >
            <ul className="govuk-tabs__list">
                {props.tabList.map((x,i) => renderTab(x, `#`, i))}
            </ul>
        </div>
    );
};
