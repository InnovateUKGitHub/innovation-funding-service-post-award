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
  </div>
);

interface OpenProps {
  daysRemaining: number;
  endDate: Date;
}
export const OpenClaimPeriod: React.SFC<OpenProps> = (props) => (
  <div className="govuk-grid-column-one-third govuk-!-margin-top-2" style={{ textAlign: "center" }}>
    <h3 className="govuk-heading-m govuk-!-margin-bottom-2">{props.daysRemaining}</h3>
    <p className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16">Days left of claim period</p>
    <p className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16">deadline <FullDate value={props.endDate} /></p>
  </div>
);

interface NextProps {
  periodStart: Date;
  periodEnd: Date;
}
export const NextClaimPeriod: React.SFC<NextProps> = (props) => (
  <div className="govuk-grid-column-one-third govuk-!-margin-top-2">
    <h3 className="govuk-heading-s govuk-!-margin-bottom-2">Next claim period</h3>
    <p className="govuk-body govuk-!-margin-bottom-1"><strong>Begins</strong> <FullDate value={props.periodStart} /></p>
    <p className="govuk-body govuk-!-margin-bottom-1"><strong>Ends</strong> <FullDate value={props.periodEnd} /></p>
  </div>
);
