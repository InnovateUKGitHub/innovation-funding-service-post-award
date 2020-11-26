import React from "react";
import {
  getAuthRoles,
  ILinkInfo,
  PartnerClaimStatus,
  PartnerDto,
  ProjectDto,
  ProjectRole,
  ProjectStatus,
} from "@framework/types";
import { DashboardProjectProps, ProjectProps } from "./Dashboard.interface";

import * as ACC from "../../../components";

// tslint:disable-next-line: cognitive-complexity
export function DashboardProject({ routes, ...props }: DashboardProjectProps) {
  const isActionRequired = ({ section, project, partner }: ProjectProps): boolean => {
    if (section === "archived" || section === "upcoming") {
      return false;
    }

    // If the project is pending and requires setup
    if (section === "pending") {
      return true;
    }

    // if fc return warning if overdue or iar required
    if (partner && (partner.claimsOverdue! > 0 || partner.claimStatus === PartnerClaimStatus.IARRequired)) {
      return true;
    }

    // mo or pm return warning if any claims overdue
    if (project.roles & (ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager) && project.claimsOverdue > 0) {
      return true;
    }

    // if fc return edit if claim is not submitted
    if (
      partner &&
      partner.claimStatus !== PartnerClaimStatus.ClaimSubmitted &&
      partner.claimStatus !== PartnerClaimStatus.NoClaimsDue
    ) {
      return true;
    }

    // if mo return edit if claims to review
    if (project.roles & ProjectRole.MonitoringOfficer && project.claimsToReview > 0) {
      return true;
    }

    return false;
  };

  const getRightHandMessages = ({ section, project, partner }: ProjectProps): JSX.Element[] => {
    const { isMo, isFc, isPm } = getAuthRoles(project.roles);

    const messages: JSX.Element[] = [];

    if (section === "pending") {
      messages.push(<ACC.Content value={x => x.projectsDashboard.messages.pendingProject} />);
    }

    if (section === "archived") messages.push(<>{project.statusName}</>);

    if (["open", "awaiting"].indexOf(section) !== -1) {
      if (project.status === ProjectStatus.OnHold) {
        messages.push(<ACC.Content value={x => x.projectsDashboard.messages.projectOnHold} />);
      }

      if (isFc && partner) {
        messages.push(...getRightHandMessagesForFC(partner));
      }

      if (isMo) {
        messages.push(<ACC.Content value={x => x.projectsDashboard.messages.claimsToReview(project.claimsToReview)} />);

        messages.push(<ACC.Content value={x => x.projectsDashboard.messages.pcrsToReview(project.pcrsToReview)} />);
      }

      if (isPm && project.pcrsQueried > 0) {
        messages.push(<ACC.Content value={x => x.projectsDashboard.messages.pcrQueried} />);
      }
    }

    return messages;
  };

  const getLeftHandMessages = ({ section, project, partner }: ProjectProps): JSX.Element[] => {
    const {
      leadPartnerName,
      startDate,
      endDate,
      periodId,
      numberOfPeriods,
      periodStartDate,
      periodEndDate,
      isPastEndDate,
    } = project;
    const messages: JSX.Element[] = [];

    // The lead partner will never have status === withdrawn,
    // so it doesn't matter that "withdrawn" is not getting appended to leadPartnerName
    // Caveat: they will be withdrawn for a few minutes while another lead partner is set, but we're not worrying about this
    messages.push(<>{leadPartnerName}</>);

    if (section === "upcoming") {
      messages.push(<ACC.Renderers.ShortDateRange start={startDate} end={endDate} />);
    }

    if (section === "open" || section === "awaiting") {
      const hasProjectEnded: boolean = !!(isPastEndDate || (partner && partner.isWithdrawn));

      const projectDate = <ACC.Renderers.ShortDateRange start={periodStartDate} end={periodEndDate} />;
      const openMessage = (
        <>
          Period {periodId} of {numberOfPeriods} ({projectDate})
        </>
      );

      const endedMessage = <ACC.Content value={x => x.projectsDashboard.messages.projectEnded} />;

      messages.push(hasProjectEnded ? endedMessage : openMessage);
    }

    return messages;
  };

  const getRightHandMessagesForFC = ({ newForecastNeeded, claimStatus }: PartnerDto) => {
    const messages: JSX.Element[] = [];

    if (newForecastNeeded) {
      messages.push(<ACC.Content value={x => x.projectsDashboard.messages.checkForecast} />);
    }

    switch (claimStatus) {
      case PartnerClaimStatus.ClaimDue:
        messages.push(<ACC.Content value={x => x.projectsDashboard.messages.claimToSubmit} />);
        break;
      case PartnerClaimStatus.ClaimQueried:
        messages.push(<ACC.Content value={x => x.projectsDashboard.messages.claimQueried} />);
        break;
      case PartnerClaimStatus.IARRequired:
        messages.push(<ACC.Content value={x => x.projectsDashboard.messages.claimRequiresIAR} />);
        break;
    }
    return messages;
  };

  const generateTitle = ({ project, partner, section }: DashboardProjectProps): string | JSX.Element => {
    const titleContent = `${project.projectNumber}: ${project.title}`;

    const displayLink = section !== "upcoming";
    const pendingSetup = section === "pending";

    return displayLink ? (
      <ACC.Link route={getTitleLink(pendingSetup, project, partner)}>{titleContent}</ACC.Link>
    ) : (
      titleContent
    );
  };

  const getTitleLink = (requireSetup: boolean, project: ProjectDto, partner?: PartnerDto): ILinkInfo => {
    return requireSetup && partner
      ? routes.projectSetup.getLink({ projectId: project.id, partnerId: partner.id })
      : routes.projectOverview.getLink({ projectId: project.id });
  };

  const actionRequired = isActionRequired(props);
  const rightHandMessages = getRightHandMessages(props);
  const leftHandMessages = getLeftHandMessages(props);

  const titleValue = generateTitle({ ...props, routes });

  return (
    <ACC.ListItem key={props.project.id} actionRequired={actionRequired} qa={`project-${props.project.projectNumber}`}>
      <div className="govuk-grid-column-two-thirds" style={{ display: "inline-flex", alignItems: "center" }}>
        <div>
          <h3 className="govuk-heading-s govuk-!-margin-bottom-2">
            {typeof titleValue === "string" ? (
              <p className="govuk-heading-s govuk-!-margin-bottom-2">{titleValue}</p>
            ) : (
              titleValue
            )}
          </h3>

          {leftHandMessages.map((content, i) => (
            <div key={`leftMessage${i}`} className="govuk-body-s govuk-!-margin-bottom-0">
              {content}
            </div>
          ))}
        </div>
      </div>

      <div className="govuk-grid-column-one-third govuk-grid-column--right-align govuk-!-margin-top-2">
        {rightHandMessages.map((content, i) => (
          <div key={`rightMessage${i}`} className="govuk-body-s govuk-!-margin-bottom-0 govuk-!-font-weight-bold">
            {content}
          </div>
        ))}
      </div>
    </ACC.ListItem>
  );
}
