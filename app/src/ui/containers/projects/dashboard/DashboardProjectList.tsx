import { IRoutes } from "@ui/routing";
import { ProjectData } from "./Dashboard.interface";
import { useContent } from "@ui/hooks";
import { MemoizedDashboardProject as DashboardProject } from "./DashboardProject";
import { SimpleString } from "@ui/components/renderers";

interface ProjectListProps {
  errorType: "live" | "upcoming" | "archived";
  isFiltering: boolean;
  routes: IRoutes;
  projects: ProjectData[];
}

export const DashboardProjectList = ({ isFiltering, routes, projects, errorType }: ProjectListProps) => {
  const { getContent } = useContent();

  if (!projects.length) {
    let content: string;

    switch (errorType) {
      case "live":
        content = getContent(x =>
          isFiltering
            ? x.pages.projectsDashboard.noLiveMatchingMessage
            : x.pages.projectsDashboard.noLiveProjectsMessage,
        );
        break;
      case "upcoming":
        content = getContent(x =>
          isFiltering
            ? x.pages.projectsDashboard.noUpcomingMatchingMessage
            : x.pages.projectsDashboard.noUpcomingProjectsMessage,
        );
        break;
      case "archived":
        content = getContent(x =>
          isFiltering
            ? x.pages.projectsDashboard.noArchivedMatchingMessage
            : x.pages.projectsDashboard.noArchivedProjectsMessage,
        );
        break;
    }

    return <SimpleString>{content}</SimpleString>;
  }

  return (
    <>
      {projects.map(item => (
        <DashboardProject key={item.project.id} {...item} section={item.curatedSection} routes={routes} />
      ))}
    </>
  );
};
