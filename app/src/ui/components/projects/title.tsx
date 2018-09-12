import React from "react";
import * as Dtos from "../../models";
import * as ACC from "../";

interface Props {
    project: Dtos.ProjectDto;
    pageTitle: string;
}

export const Title : React.SFC<Props> = ({pageTitle, project}) => {
    return <ACC.Title title={pageTitle} caption={`${project.projectNumber || ""} : ${project.title || ""}`} />;
}