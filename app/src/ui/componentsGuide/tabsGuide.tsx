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
            comments: "Renders Tabs",
            example: `<Tabs tabList={${JSON.stringify(tabs)}}/>`,
            render: () => <Tabs tabList={tabs}/>
        }
    ]
};
