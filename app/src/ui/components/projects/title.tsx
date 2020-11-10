import React from "react";
import { ProjectDto } from "@framework/types";
import { PageTitle } from "../layout/pageTitle";

export type TitleProps = Pick<ProjectDto, "projectNumber" | "title">;

export function Title({ projectNumber, title }: TitleProps) {
  const captionValue = `${projectNumber} : ${title}`;

  return <PageTitle caption={captionValue} />;
}
