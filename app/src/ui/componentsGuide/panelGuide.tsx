import React from "react";
import { Panel } from "../components";

export const panelGuide: IGuide = {
    name: "Panel",
    options: [
        {
            name: "Simple",
            comments: "Renders a section and children",
            example: "<Panel title=\"Project claims history\" />",
            render: () => <Panel title="Project claims history"><div>I'm a child</div></Panel>
        }
    ]
};
