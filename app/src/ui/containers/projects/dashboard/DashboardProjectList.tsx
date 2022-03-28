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

export function DashboardProjectList({ isFiltering, routes, projects, errorType }: ProjectListProps) {
  const { content, getContentFromResult } = useContent();

  if (!projects.length) {
    const messageByType = content.projectsDashboard[errorType];
    const noProjectMessage = isFiltering ? messageByType.noMatchingProjects : messageByType.noProjects;

    return <SimpleString>{getContentFromResult(noProjectMessage)}</SimpleString>;
  }

  return (
    <>
      {projects.map(item => (
        <DashboardProject key={item.project.id} {...item} section={item.curatedSection} routes={routes} />
      ))}
    </>
  );
}
