import React from "react";
import { SimpleString } from "@ui/components/renderers";

import { CuratedSection } from "./Dashboard.interface";
import { useContent } from "@ui/hooks";

interface DashboardProjectCountProps {
  curatedTotals: CuratedSection<number>;
  totalProjectCount: number;
}

export function DashboardProjectCount({ curatedTotals, totalProjectCount }: DashboardProjectCountProps) {
  const { getContent } = useContent();
  const { open: openTotal, upcoming: upcomingTotal, archived: archivedTotal, pending: pendingTotal } = curatedTotals;

  if (!totalProjectCount) return null;

  const results: string[] = [];

  if (!!pendingTotal) results.push(getContent(x => x.projectsDashboard.pendingMessage(pendingTotal)));
  if (!!openTotal) results.push(getContent(x => x.projectsDashboard.liveMessage(openTotal)));
  if (!!upcomingTotal) results.push(getContent(x => x.projectsDashboard.upcomingMessage(upcomingTotal)));
  if (!!archivedTotal) results.push(getContent(x => x.projectsDashboard.archivedMessage(archivedTotal)));

  const prefixMessage = getContent(x => x.projectsDashboard.projectCountPrefixMessage(totalProjectCount));
  const listOfProjects = `(${results.join(", ")})`;

  return (
    <SimpleString qa="project-count">
      {prefixMessage} {listOfProjects}
    </SimpleString>
  );
}
