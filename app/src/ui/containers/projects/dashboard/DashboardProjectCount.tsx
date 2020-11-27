import React from "react";
import { SimpleString } from "@ui/components/renderers";

import { CuratedSection } from "./Dashboard.interface";

interface DashboardProjectCountProps {
  curatedTotals: CuratedSection<number>;
  totalProjectCount: number;
}

export function DashboardProjectCount({ curatedTotals, totalProjectCount }: DashboardProjectCountProps) {
  const { open: openTotal, upcoming: upcomingTotal, archived: archivedTotal, pending: pendingTotal } = curatedTotals;

  if (!totalProjectCount) return null;

  const results: string[] = [];

  if (!!pendingTotal) results.push(`${pendingTotal} in project setup`);
  if (!!openTotal) results.push(`${openTotal} live`);
  if (!!upcomingTotal) results.push(`${upcomingTotal} upcoming`);
  if (!!archivedTotal) results.push(`${archivedTotal} archived`);

  const prefixMessage = `${totalProjectCount} ${totalProjectCount > 1 ? "projects" : "project"}`;
  const listOfProjects = `(${results.join(", ")})`;

  return (
    <SimpleString qa="project-count">
      {prefixMessage} {listOfProjects}
    </SimpleString>
  );
}
