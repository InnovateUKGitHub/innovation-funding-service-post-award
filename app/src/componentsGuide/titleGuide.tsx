import React from "react";
import { Title } from "../components/layout";

export const titleGuide: IGuide = {
    name: "Title",
    options: [
        {
            name: "Simple",
            comments: "Renders a Title and a caption if present",
            example: "<Title caption=\"Finance Contact\" title=\"Accounts\"/>",
            render: () => <Title caption="Finance Contact" title="Accounts"/>
        }
    ]
};
