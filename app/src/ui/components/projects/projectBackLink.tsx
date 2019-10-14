import React from "react";
import { BackLink } from "../links";
import { ProjectDto } from "@framework/dtos";
import { IRoutes } from "@ui/routing";

interface Props {
  project: ProjectDto;
  routes: IRoutes;
}

export const ProjectBackLink = (props: Props) => (
  <BackLink route={props.routes.projectOverview.getLink({ projectId: props.project.id })}>Back to project</BackLink>
);
