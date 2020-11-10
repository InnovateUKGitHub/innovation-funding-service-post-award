import React from "react";
import { SectionPanel } from "../components";
import { IGuide } from "@framework/types";

export const sectionPanelGuide: IGuide = {
    name: "Section Panel",
    options: [
        {
            name: "Simple",
            comments: "Used inside a section to wrap content in a border.",
            example: "<SectionPanel title=\"Project claims history\" />",
            render: () => <SectionPanel title="Project claims history"><div>I'm a child</div></SectionPanel>
        }
    ]
};
