import React from "react";
import { SimpleString } from "../components/renderers";

export const renderersGuide: IGuide = {
    name: "Renderers",
    options: [
        {
            name: "SimpleString",
            comments: "Renders a simple string with includes gov.uk style",
            example: "<SimpleString>You need to review your forecasts before you can submit your claim.</SimpleString>",
            render: () => <SimpleString>You need to review your forecasts before you can submit your claim.</SimpleString>
        }
    ]
};
