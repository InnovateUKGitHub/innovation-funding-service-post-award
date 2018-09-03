import React from "react";
import { FullDate, FullDateTime, FullDateTimeWithSeconds, ShortDate, ShortDateTime } from "../components/renderers/date";

export const datesGuide: IGuide = {
    name: "Dates",
    options: [
        {
            name: "Full date",
            comments: `Renders a full date`,
            example: `<FullDate value={new Date()} />`,
            render: () => <FullDate value={new Date()} />,
        },
        {
            name: "Full date time",
            comments: `Renders a full date and time`,
            example: `<FullDateTime value={new Date()} />`,
            render: () => <FullDateTime value={new Date()} />,
        },
        {
            name: "Full date time with seconds",
            comments: `Renders a full date and time including seconds`,
            example: `<FullDateTimeWithSeconds value={new Date()} />`,
            render: () => <FullDateTimeWithSeconds value={new Date()} />,
        },
        {
            name: "Short date",
            comments: `Renders a short date`,
            example: `<ShortDate value={new Date()} />`,
            render: () => <ShortDate value={new Date()} />,
        },
        {
            name: "Short date time",
            comments: `Renders a short date and time`,
            example: `<ShortDateTime value={new Date()} />`,
            render: () => <ShortDateTime value={new Date()} />,
        },
    ]
};
