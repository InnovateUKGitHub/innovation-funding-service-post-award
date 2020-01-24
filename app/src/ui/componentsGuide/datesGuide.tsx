import React from "react";
import {
    CondensedDateRange, DayAndLongMonth, Duration,
    FullDate, FullDateTime, LongDateRange,
    LongYear, Months, ShortDate, ShortDateRange,
    ShortDateRangeFromDuration, ShortDateTime, ShortMonth
} from "../components/renderers/date";

const startDate = new Date("2018/01/01");
const endDate = new Date("2019/12/31");

export const datesGuide: IGuide = {
    name: "Dates",
    options: [
        {
            name: "Condensed date range",
            comments: "Renders date range with short month and year",
            example: `<CondensedDateRange start={startDate} end={endDate}/>`,
            render: () => <CondensedDateRange start={startDate} end={endDate}/>
        },
        {
            name: "Long date range",
            comments: "Renders date range with full month, date and year",
            example: `<LongDateRange start={startDate} end={endDate}/>`,
            render: () => <LongDateRange start={startDate} end={endDate}/>
        },
        {
            name: "Short date range",
            comments: "Renders date range with short month, date and year",
            example: `<ShortDateRange start={startDate} end={endDate}/>`,
            render: () => <ShortDateRange start={startDate} end={endDate}/>
        },
        {
            name: "Short month",
            comments: "Renders string of short month",
            example: `<ShortMonth value={startDate}/>`,
            render: () => <ShortMonth value={startDate}/>
        },
        {
            name: "Day and long month",
            comments: "Renders date and full month",
            example: `<DayAndLongMonth value={startDate}/>`,
            render: () => <DayAndLongMonth value={startDate}/>
        },
        {
            name: "Long year",
            comments: "Renders full year",
            example: `<LongYear value={startDate}/>`,
            render: () => <LongYear value={startDate}/>
        },
        {
            name: "Full date",
            comments: `Renders a full date`,
            example: `<FullDate value={new Date()} /><FullDate value={new Date()} />`,
            render: () => <FullDate value={new Date()} />
        },
        {
            name: "Full date time",
            comments: `Renders a full date and time`,
            example: `<FullDateTime value={new Date()} /><FullDateTime value={new Date()} />`,
            render: () => <FullDateTime value={new Date()} />
        },
        {
            name: "Short date",
            comments: `Renders a short date`,
            example: `<ShortDate value={new Date()} /><ShortDate value={new Date()} />`,
            render: () => <ShortDate value={new Date()} />
        },
        {
            name: "Short date time",
            comments: `Renders a short date and time`,
            example: `<ShortDateTime value={new Date()} /><ShortDateTime value={new Date()} />`,
            render: () => <ShortDateTime value={new Date()} />
        },
        {
            name: "Duration",
            comments: "Renders duration between two dates in months",
            example: `<Duration startDate={startDate} endDate={endDate}/>`,
            render: () => <Duration startDate={startDate} endDate={endDate}/>
        },
        {
            name: "Months",
            comments: "Single month",
            example: `<Months months={1}/>`,
            render: () => <Months months={1}/>
        },
        {
            name: "Months",
            comments: "Multiple months",
            example: `<Months months={11}/>`,
            render: () => <Months months={11}/>
        },
        {
            name: "Short date range from duration",
            comments: "Renders date range from given start date and duration",
            example: `<ShortDateRangeFromDuration startDate={startDate} months={3}/>`,
            render: () => <ShortDateRangeFromDuration startDate={startDate} months={3}/>
        }
    ]
};
