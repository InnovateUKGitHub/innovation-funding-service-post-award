import React from "react";
import { ProjectDto } from "../models";
import { routeConfig } from "../routing";
import { ClaimFrequency } from "../server/features/projects";
import { Link } from "./links";
import { FullDate } from "./renderers";
import { ListItem } from "./layout";

interface Props {
  project: ProjectDto;
}

export const ProjectItem: React.SFC<Props> = (props) => {
  const project    = props.project;
  const quarterly  = project.claimFrequency === ClaimFrequency.Quarterly;
  const periodText = quarterly ? "Quarter" : "Period";
  const frequency  = quarterly ? 4 : 12;
  const today      = new Date();
  // needs last claim date to work out latest period for claim deadline
  const end        = new Date(project.startDate);
  const endMonth   = project.period * (quarterly ? 4 : 1);
  end.setMonth(end.getMonth() + endMonth);
  end.setDate(0);
  // 30 days in ms 60 * 60 * 24 * 30 * 1000 = 2592000000
  const timeRemaining = end.getTime() - today.getTime();
  const daysRemaining = Math.floor(timeRemaining / (60 * 60 * 24 * 1000));
  const claimWarning  = daysRemaining <= 30;

  return (
    <ListItem>
      <div className="govuk-grid-column-two-thirds">
        <h2 className="govuk-heading-s govuk-!-margin-bottom-2">
          <Link route={routeConfig.projectDetails} routeParams={{ id: project.id }}>{project.projectNumber}: {project.title}</Link>
        </h2>
        <p className="govuk-body govuk-!-margin-bottom-2">{periodText} {project.period} of {frequency}</p>
        <p className="govuk-body govuk-!-margin-bottom-2">
          { claimWarning ? "You need to submit your Q2 claim" : "Your Q1 claim is submitted" }
        </p>
      </div>

      {!claimWarning ? null : (
        <div className="govuk-grid-column-one-third">
          <h3 className="govuk-heading-s">{daysRemaining}</h3>
          <p className="govuk-body govuk-!-margin-bottom-1">Days left of claim period</p>
          <p className="govuk-body govuk-!-margin-bottom-1">deadline <FullDate value={end} /></p>
        </div>
      )}
    </ListItem>
  );
};
