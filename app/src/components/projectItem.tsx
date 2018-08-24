import React from "react";
import { ProjectDto } from "../models";
import { Link } from "./links";
import { routeConfig } from "../routing";

interface Props {
  project: ProjectDto;
}

export const ProjectItem: React.SFC<Props> = (props) => (
  <div className="govuk-grid-row">
    <div className="govuk-grid-column-two-thirds">
      <h2 className="govuk-heading-s">
        <Link route={routeConfig.projectDetails}>{props.project.id}: {props.project.title}</Link>
      </h2>
      <p className="govuk-body">Period n of m</p>
      <p className="govuk-body">You need to submit your Q2 claim</p>
    </div>

    <div className="govuk-grid-column-one-third">
      <h3 className="govuk-heading-s">30</h3>
      <p className="govuk-body">This is a paragraph inside a one-third wide column</p>
    </div>
  </div>
);
