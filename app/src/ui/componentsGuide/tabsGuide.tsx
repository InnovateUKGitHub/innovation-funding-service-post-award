import React from "react";
import { Tabs } from "../components/layout";

const tabs = [
    {text: "Claims", url: "#"},
    {text: "Forecasts", url: "#", selected:true},
    {text: "Project Details", url: "#"},
    {text: "PCR", url: "#"},
];

export const tabsGuide: IGuide = {
    name: "Tabs",
    options: [
        {
            name: "Simple",
            comments: "Renders Tabs as page navigation can either do route or url navigation. This is discouraged by gov design guidelines but requried for initial wireframes",
            example: `<Tabs tabList={${JSON.stringify(tabs)}}/>`,
            render: () => <Tabs tabList={tabs}/>
        }
    ]
};
