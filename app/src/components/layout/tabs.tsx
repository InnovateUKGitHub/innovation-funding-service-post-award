import React from "react";

interface TabProps {
    tabList: string[];
    selected?: string;
    className?: string;
}

export const Tabs: React.SFC<TabProps> = (props: TabProps) => {
    const renderTab = (tab: string) => {
        return (
            <li className="govuk-tabs__list-item">
                <a href="" className="govuk-tabs__tab" aria-selected={tab === props.selected}>{tab}</a>
            </li>
        );
    };

    return (
        <div className={`govuk-tabs ${props.className}`} data-module="tabs" >
            <ul className="govuk-tabs__list">
                {props.tabList.map(renderTab)}
            </ul>
        </div>
    );
};
