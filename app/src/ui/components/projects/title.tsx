import React from "react";
import { ProjectDto } from "@framework/types";
import { Title as PageTitle } from "../layout/title";

interface Props {
  project: ProjectDto;
}

export const Title: React.SFC<Props> = ({project}) => (
  <PageTitle caption={`${project.projectNumber || ""} : ${project.title || ""}`} />
);
