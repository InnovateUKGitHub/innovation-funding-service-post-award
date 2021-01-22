import { InsetText } from "../components/layout/insetText";
import { IGuide } from "@framework/types";

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
