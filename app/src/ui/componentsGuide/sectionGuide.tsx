import React from "react";
import { Section } from "../components/layout";

export const sectionGuide: IGuide = {
    name: "Section",
    options: [
        {
            name: "Simple",
            comments: "Renders a section and children",
            example: "<Section title=\"Project members\" />",
            render: () => <Section title="Project members"><div>I'm a child</div></Section>
        }
    ]
};
