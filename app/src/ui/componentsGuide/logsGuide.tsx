import React from "react";
import { LogItem, Logs } from "@ui/components/logs";
import { DateTime } from "luxon";

const data: LogItem[] = [
  { newStatus: "Approved", createdDate: DateTime.local().minus({ days: 1 }).toJSDate(), createdBy: "example@test.com", comments: "" },
  { newStatus: "Queried", createdDate: DateTime.local().minus({ days: 2, hours: 1, minutes: 55 }).toJSDate(), createdBy: "another@test.com", comments: "The comments are optional" },
  { newStatus: "Submitted", createdDate: DateTime.local().minus({ days: 3, hours: -1, minutes: 12 }).toJSDate(), createdBy: "geoff.jefty.geoff@test.com", comments: "" },
  { newStatus: "Draft", createdDate: DateTime.local().minus({ days: 4, hours: -1, minutes: -18 }).toJSDate(), createdBy: "mr.me@test.com", comments: "The comments are optional\n\nAnd and can be mutiline" },
];

export const logsGuide: IGuide = {
  name: "Logs",
  options: [
    {
      name: "Simple",
      comments: "Renders a table of logs and status changes with optional comments",
      example: `
        const logs : {
          newStatus: string,
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
