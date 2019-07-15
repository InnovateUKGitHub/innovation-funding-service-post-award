import React from "react";
import { BackLink } from "../links";

import { ProjectOverviewRoute } from "@ui/containers/projects/overview";
import { ProjectDto } from "@framework/dtos";

export const ProjectBackLink = (props: {project: ProjectDto}) => <BackLink route={ProjectOverviewRoute.getLink({ projectId: props.project.id})}>Back to project</BackLink>;
