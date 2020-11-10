import React from "react";
import { Email } from "../components/renderers";
import { IGuide } from "@framework/types";

export const emailGuide: IGuide = {
    name: "Email",
    options: [
        {
            name: "Simple",
            comments: "Renders an email link",
            example: "<Email value=\"test@test.com\"/>",
            render: () => <Email value="test@test.com" />
        }
    ]
};
