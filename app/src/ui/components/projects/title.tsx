import React from "react";
import { ProjectDto } from "@framework/types";
import { PageTitle } from "../layout/pageTitle";

interface Props {
  project: ProjectDto;
}

export const Title: React.SFC<Props> = ({project}) => (
  <PageTitle caption={`${project.projectNumber || ""} : ${project.title || ""}`} />
);
