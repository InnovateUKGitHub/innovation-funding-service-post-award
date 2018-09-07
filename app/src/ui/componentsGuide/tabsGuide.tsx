import React from "react";
import { Tabs } from "../components/layout";

export const tabsGuide: IGuide = {
    name: "Tabs",
    options: [
        {
            name: "Simple",
            comments: "Renders Tabs",
            example: "<Tabs tabList={[\"Claims\", \"Forecasts\", \"Project Details\", \"PCR\"]} selected={\"Claims\"}/>",
            render: () => <Tabs tabList={["Claims", "Forecasts", "Project Details", "PCR"]} selected={"Claims"}/>
        }
    ]
};
