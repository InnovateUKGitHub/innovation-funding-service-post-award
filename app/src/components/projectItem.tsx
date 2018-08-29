import React from "react";
import { ProjectDto } from "../models";
import { routeConfig } from "../routing";
import { Link } from "./links";
import { FullDate } from "./renderers";
import { ListItem } from "./layout";

interface Props {
  project: ProjectDto;
  frequency: number;
  periodText: string;
  warning: boolean;
}

export const OpenProjectItem: React.SFC<Props & OpenProps> = (props) => (
  <ListItem>
    <ProjectDescription {...props} />
    <OpenClaimPeriod {...props} />
  </ListItem>
);

export const AwaitingProjectItem: React.SFC<Props & NextProps> = (props) => (
  <ListItem>
    <ProjectDescription {...props} />
    <NextClaimPeriod {...props} />
  </ListItem>
);

export const ProjectDescription: React.SFC<Props> = (props) => (
  <div className="govuk-grid-column-two-thirds">
    <h2 className="govuk-heading-s govuk-!-margin-bottom-2">
      <Link route={routeConfig.projectDetails} routeParams={{ id: props.project.id }}>
        {props.project.projectNumber}: {props.project.title}
      </Link>
    </h2>
    <p className="govuk-body govuk-!-margin-bottom-2">{props.periodText} {props.project.period} of {props.frequency}</p>
    <p className="govuk-body govuk-!-margin-bottom-2">
      { props.warning ? "You need to submit your Q2 claim" : "Your Q1 claim is submitted" }
    </p>
  </div>
);

interface OpenProps {
  daysRemaining: number;
  endDate: Date;
}
export const OpenClaimPeriod: React.SFC<OpenProps> = (props) => (
  <div className="govuk-grid-column-one-third">
    <h3 className="govuk-heading-s">{props.daysRemaining}</h3>
    <p className="govuk-body govuk-!-margin-bottom-1">Days left of claim period</p>
    <p className="govuk-body govuk-!-margin-bottom-1">deadline <FullDate value={props.endDate} /></p>
  </div>
);

interface NextProps {
  periodStart: Date;
  periodEnd: Date;
}
export const NextClaimPeriod: React.SFC<NextProps> = (props) => (
  <div className="govuk-grid-column-one-third">
    <h3 className="gouk-heading-s">Next claim period</h3>
    <p className="govuk-body govuk-!-margin-bottom-1">Begins <FullDate value={props.periodStart} /></p>
    <p className="govuk-body govuk-!-margin-bottom-1">Ends <FullDate value={props.periodEnd} /></p>
  </div>
);
