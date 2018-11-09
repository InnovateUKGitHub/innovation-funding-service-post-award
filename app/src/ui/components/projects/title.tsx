import React from "react";
import * as ACC from "../";
import { ProjectDto } from "../../../types";

interface Props {
    project: ProjectDto;
    pageTitle: string;
}

export const Title: React.SFC<Props> = ({pageTitle, project}) => {
    return <ACC.Title title={pageTitle} caption={`${project.projectNumber || ""} : ${project.title || ""}`} />;
};
