import { SimpleString } from "@ui/components/renderers/simpleString";
import { useContent } from "@ui/hooks/content.hook";
import { CuratedSection } from "./Dashboard.interface";

interface DashboardProjectCountProps {
  curatedTotals: CuratedSection<number>;
  totalProjectCount: number;
}

export const DashboardProjectCount = ({ curatedTotals, totalProjectCount }: DashboardProjectCountProps) => {
  const { getContent } = useContent();
  const { open: openTotal, upcoming: upcomingTotal, archived: archivedTotal, pending: pendingTotal } = curatedTotals;

  if (!totalProjectCount) return null;

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

  const prefixMessage = getContent(x => x.pages.projectsDashboard.projectPrefixCount({ count: totalProjectCount }));
  const listOfProjects = `(${results.join(", ")})`;

  return (
    <SimpleString qa="project-count">
      {prefixMessage} {listOfProjects}
    </SimpleString>
  );
};
