import React from "react";
import { IRoutes } from "@ui/routing";
import { ProjectData } from "./Dashboard.interface";
import { useContent } from "@ui/hooks";
import { DashboardProject } from "./DashboardProject";
import { SimpleString } from "@ui/components/renderers";

interface ProjectListProps {
  errorType?: "live" | "upcoming" | "archived";
  searchEnabled: boolean;
  routes: IRoutes;
  projects: ProjectData[];
}

export function DashboardProjectList({ searchEnabled, routes, projects, errorType }: ProjectListProps) {
  const { content, getContentFromResult } = useContent();

  if (!!projects.length) {
    return (
      <>
        {projects.map(item => (
          <DashboardProject key={item.project.id} {...item} section={item.projectSection} routes={routes} />
        ))}
      </>
    );
  }

  // Note: The content solution lookup requires a parent property otherwise we will get a lookup error
  if (errorType) {
    const messageByType = content.projectsDashboard[errorType];
    const noProjectMessage = searchEnabled ? messageByType.noMatchingProjects : messageByType.noProjects;

    return <SimpleString>{getContentFromResult(noProjectMessage)}</SimpleString>;
  }

  return null;
}
