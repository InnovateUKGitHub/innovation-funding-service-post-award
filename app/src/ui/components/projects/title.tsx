import React from "react";
import { ProjectDto } from "../../../types";
import { Title as PageTitle } from "../layout/title";

interface Props {
  project: ProjectDto;
  pageTitle: string;
}

export const Title: React.SFC<Props> = ({pageTitle, project}) => (
  <PageTitle title={pageTitle} caption={`${project.projectNumber || ""} : ${project.title || ""}`} />
);
