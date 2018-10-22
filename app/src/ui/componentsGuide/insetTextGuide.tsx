import React from "react";
import { InsetText } from "../components/layout";

export const insetText: IGuide = {
    name: "InsetText",
    options: [
        {
            name: "Simple",
            comments: "Renders an inset text",
            example: "<InsetText text=\"Your file has been uploaded.\"/>",
            render: () => <InsetText text="Your file has been uploaded." />
        }
    ]
};
