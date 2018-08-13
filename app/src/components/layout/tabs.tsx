import React from "react";

interface TabProps {
    tabList: string[];
}

export const Tabs: React.SFC<TabProps> = (props: TabProps) => {
    const renderTab = (tab: string) => {
        return (
            <li className="govuk-tabs__list-item">
                <a href="#" className="govuk-tabs__tab" aria-selected={tab === "Project details"}>{tab}</a>
            </li>
        );
    };

    return (
        <ul className="govuk-tabs__list">
            {props.tabList.map(renderTab)}
        </ul>
    );
}
