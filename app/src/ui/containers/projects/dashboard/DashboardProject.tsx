import { memo } from "react";

import { getAuthRoles, PartnerClaimStatus, ProjectStatus } from "@framework/types";
import * as ACC from "@ui/components";
import { useContent } from "@ui/hooks";

import { DashboardProjectProps, ProjectProps } from "./Dashboard.interface";

const getProjectNotes = ({ section, project, partner }: ProjectProps): JSX.Element[] => {
  const isNotAvailable = !["open", "awaiting"].includes(section);
  const isPartnerWithdrawn = !!partner?.isWithdrawn;

  const messages: JSX.Element[] = [];

  // The lead partner will never have status === withdrawn,
  // so it doesn't matter that "withdrawn" is not getting appended to leadPartnerName
  // Caveat: they will be withdrawn for a few minutes while another lead partner is set, but we're not worrying about this
  messages.push(<>{project.leadPartnerName}</>);

  if (section === "upcoming") {
    const upcomingMessage = <ACC.Renderers.ShortDateRange start={project.startDate} end={project.endDate} />;

    messages.push(upcomingMessage);
  }

  // Note: If project is not available then just bail early!
  if (isNotAvailable) return messages;

  if (project.isPastEndDate || isPartnerWithdrawn) {
    messages.push(<ACC.Content value={x => x.projectMessages.projectEndedMessage} />);
  } else {
    const projectDate = <ACC.Renderers.ShortDateRange start={project.periodStartDate} end={project.periodEndDate} />;

    messages.push(
      <>
        Period {project.periodId} of {project.numberOfPeriods} ({projectDate})
      </>,
    );
  }

  return messages;
};

const useProjectActions = ({ section, project, partner }: ProjectProps): string[] => {
  const { getContent } = useContent();
  const { isMo, isFc, isPm } = getAuthRoles(project.roles);

  const messages: string[] = [];

  if (section === "pending") {
    messages.push(getContent(x => x.projectMessages.pendingProject));
  }

  if (section === "archived") {
    messages.push(project.statusName);
  }

  if (["open", "awaiting"].includes(section)) {
    const isProjectOnHold = project.status === ProjectStatus.OnHold;
    const hasQueriedPcrs = project.pcrsQueried > 0;

    if (isProjectOnHold) {
      messages.push(getContent(x => x.projectMessages.projectOnHold));
    }

    if (isFc && partner) {
      if (partner.newForecastNeeded) {
        messages.push(getContent(x => x.projectMessages.checkForecast));
      }

      switch (partner.claimStatus) {
        case PartnerClaimStatus.ClaimDue:
          messages.push(getContent(x => x.projectMessages.claimToSubmitMessage));
          break;
        case PartnerClaimStatus.ClaimsOverdue:
          messages.push(getContent(x => x.projectMessages.claimOverdueMessage));
          break;
        case PartnerClaimStatus.ClaimQueried:
          messages.push(getContent(x => x.projectMessages.claimQueriedMessage));
          break;
        case PartnerClaimStatus.IARRequired:
          messages.push(getContent(x => x.projectMessages.claimRequestMissingDocument));
          break;
      }
    }

    if (isMo) {
      if (project.claimsToReview) {
        messages.push(getContent(x => x.projectMessages.claimsToReviewMessage({ count: project.claimsToReview })));
      }
      if (project.claimsOverdue) {
        const content = getContent(x => x.projectMessages.claimOverdueMessage);
        if (!messages.includes(content)) messages.push(content);
      }
      if (project.pcrsToReview) {
        messages.push(getContent(x => x.projectMessages.pcrsToReview({ count: project.pcrsToReview })));
      }
    }

    if (isPm && hasQueriedPcrs) {
      messages.push(getContent(x => x.projectMessages.pcrQueried));
    }
  }

  return messages;
};

const doesNotRequireAction = ({ section }: ProjectProps) => section === "archived" || section === "upcoming";

const generateTitle = ({ project, partner, section, routes }: DashboardProjectProps): string | JSX.Element => {
  const titleContent = `${project.projectNumber}: ${project.title}`;

  if (section === "upcoming") return titleContent;

  const projectNotSetup = partner && section === "pending";

  const route = projectNotSetup
    ? routes.projectSetup.getLink({ projectId: project.id, partnerId: partner!.id }) // TODO: Remove non-null after TSC 4.4
    : routes.projectOverview.getLink({ projectId: project.id });

  return <ACC.Link route={route}>{titleContent}</ACC.Link>;
};

function DashboardProject(props: DashboardProjectProps) {
  const titleValue = generateTitle(props);

  const projectActions = useProjectActions(props);
  const projectNotes = getProjectNotes(props);

  const displayAction = projectActions.length > 0 && !doesNotRequireAction(props);
  return (
    <ACC.ListItem key={props.project.id} actionRequired={displayAction} qa={`project-${props.project.projectNumber}`}>
      <div className="govuk-grid-column-two-thirds" style={{ display: "inline-flex", alignItems: "center" }}>
        <div>
          <ACC.H4 as="h3" className="govuk-!-margin-bottom-2">
            {titleValue}
          </ACC.H4>

          {projectNotes.map((note, i) => (
            <div key={i} className="govuk-body-s govuk-!-margin-bottom-0">
              {note}
            </div>
          ))}
        </div>
      </div>

      <div className="govuk-grid-column-one-third govuk-grid-column--right-align govuk-!-margin-top-2">
        {projectActions.map((content, i) => (
          <div key={`rightMessage${i}`} className="govuk-body-s govuk-!-margin-bottom-1 govuk-!-font-weight-bold">
            {content}
          </div>
        ))}
      </div>
    </ACC.ListItem>
  );
}

export const MemoizedDashboardProject = memo(DashboardProject);
