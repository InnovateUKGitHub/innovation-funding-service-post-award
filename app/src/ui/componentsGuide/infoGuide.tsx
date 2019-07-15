import React from "react";
import { Info } from "@ui/components";

export const info: IGuide = {
    name: "Info",
    options: [
        {
            name: "Simple",
            comments: "Help with nationality",
            example: "<Info summary=\"Help with nationality.\" text=\"We need to know your nationality so we can work out which elections...\"/>",
            render: () => <Info summary="Help with nationality" text="We need to know your nationality so we can work out which elections you’re entitled to vote in. If you cannot provide your nationality, you’ll have to send copies of identity documents through the post." />
        }
    ]
};
