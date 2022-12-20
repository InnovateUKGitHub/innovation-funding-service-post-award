import { useContent } from "@ui/hooks";
import { SimpleString } from "@ui/components/renderers";
import { CuratedSection } from "./Dashboard.interface";

interface DashboardProjectCountProps {
  curatedTotals: CuratedSection<number>;
}

export function DashboardProjectCount({ curatedTotals }: DashboardProjectCountProps) {
  const { getContent } = useContent();
  const { open: openTotal, upcoming: upcomingTotal, archived: archivedTotal, pending: pendingTotal } = curatedTotals;

  const results: string[] = [];

  if (!!pendingTotal) {
    results.push(getContent(x => x.pages.projectsDashboard.countMessages.pendingMessage({ count: pendingTotal })));
  }
  if (!!openTotal) {
    results.push(getContent(x => x.pages.projectsDashboard.countMessages.liveMessage({ count: openTotal })));
  }
  if (!!upcomingTotal) {
    results.push(getContent(x => x.pages.projectsDashboard.countMessages.upcomingMessage({ count: upcomingTotal })));
  }
  if (!!archivedTotal) {
    results.push(getContent(x => x.pages.projectsDashboard.countMessages.archivedMessage({ count: archivedTotal })));
  }

  // If there are no totals at all, return null.
  if (results.length === 0) {
    return null;
  }

  const prefixMessage = getContent(x =>
    x.pages.projectsDashboard.projectPrefixCount({ count: pendingTotal + openTotal + upcomingTotal + archivedTotal }),
  );
  const listOfProjects = `(${results.join(", ")})`;

  return (
    <SimpleString qa="project-count">
      {prefixMessage} {listOfProjects}
    </SimpleString>
  );
}
