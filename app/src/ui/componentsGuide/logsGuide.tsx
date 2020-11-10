import React from "react";
import { LogItem, Logs } from "@ui/components/logs";
import { DateTime } from "luxon";
import { IGuide } from "@framework/types";

const data: LogItem[] = [
  { newStatusLabel: "Approved", createdDate: DateTime.local().minus({ days: 1 }).toJSDate(), comments: "", createdBy: "Shane" },
  { newStatusLabel: "Queried", createdDate: DateTime.local().minus({ days: 2, hours: 1, minutes: 55 }).toJSDate(), comments: "The comments are optional", createdBy: "Markus" },
  { newStatusLabel: "Submitted", createdDate: DateTime.local().minus({ days: 3, hours: -1, minutes: 12 }).toJSDate(), comments: "", createdBy: "Kian" },
  { newStatusLabel: "Draft", createdDate: DateTime.local().minus({ days: 4, hours: -1, minutes: -18 }).toJSDate(), comments: "The comments are optional\n\nAnd and can be mutiline", createdBy: "Nicky" },
];

export const logsGuide: IGuide = {
  name: "Logs",
  options: [
    {
      name: "Simple",
      comments: "Renders a table of logs and status changes with optional comments",
      example: `
        const logs : {
          newStatusLabel: string,
          createdDate: Date,
          createdBy: string
          comments: string|null|undefined
        }[] = [];

      <Logs data={logs}/>
              `,
      render: () => <Logs qa="logs_guide" data={data} />
    }
  ]
};
