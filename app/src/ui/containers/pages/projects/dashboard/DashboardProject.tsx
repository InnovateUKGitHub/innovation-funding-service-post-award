import { PartnerClaimStatus } from "@framework/constants/partner";
import { ProjectStatus } from "@framework/constants/project";
import { getAuthRoles } from "@framework/types/authorisation";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { ListItem } from "@ui/components/atomicDesign/atoms/ListItem/listItem";
import { Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { ShortDateRange } from "@ui/components/atomicDesign/atoms/Date";
import { H4 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { useContent } from "@ui/hooks/content.hook";
import { memo } from "react";
import { DashboardProjectProps, ProjectProps } from "./Dashboard.interface";
import { getAssociateStartDateMissing, getShouldShowAssociateStartDateWarning } from "./dashboard.logic";
import { ILinkInfo } from "@framework/types/ILinkInfo";

const useProjectNotes = ({ section, project, partner }: ProjectProps): JSX.Element[] => {
  const { getContent } = useContent();

  const isNotAvailable = !["open", "awaiting"].includes(section);
  const isPartnerWithdrawn = !!partner?.isWithdrawn;

  const messages: JSX.Element[] = [];

  // The lead partner will never have status === withdrawn,
  // so it doesn't matter that "withdrawn" is not getting appended to leadPartnerName
  // Caveat: they will be withdrawn for a few minutes while another lead partner is set, but we're not worrying about this
  messages.push(<>{project.leadPartnerName}</>);

  if (section === "upcoming") {
    const upcomingMessage = <ShortDateRange start={project.startDate} end={project.endDate} />;

    messages.push(upcomingMessage);
  }

  // Note: If project is not available then just bail early!
  if (isNotAvailable) return messages;

  if (project.isPastEndDate || isPartnerWithdrawn) {
    messages.push(<Content value={x => x.projectMessages.projectEndedMessage} />);
  } else {
    messages.push(
      <>
        {getContent(x =>
          x.projectMessages.shortCurrentPeriodRangeInfo({
            currentPeriod: project.periodId,
            numberOfPeriods: project.numberOfPeriods,
          }),
        )}
        {" ("}
        <ShortDateRange start={project.periodStartDate} end={project.periodEndDate} />
        {")"}
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

    if (getShouldShowAssociateStartDateWarning(project)) {
      if (getAssociateStartDateMissing(project)) {
        messages.push(getContent(x => x.projectMessages.startDateRequired));
      } else {
        messages.push(getContent(x => x.projectMessages.canEditStartDate));
      }
    }
  }

  return messages;
};

const doesNotRequireAction = ({ section }: ProjectProps) => section === "archived" || section === "upcoming";

const generateTitle = ({ project, partner, section, routes }: DashboardProjectProps): string | JSX.Element => {
  const titleContent = `${project.projectNumber}: ${project.title}`;

  if (section === "upcoming") return titleContent;

  const projectNotSetup = partner && section === "pending";

  let route: ILinkInfo;

  if (getShouldShowAssociateStartDateWarning(project)) {
    route = routes.contactSetupAssociate.getLink({ projectId: project.id });
  } else if (projectNotSetup) {
    route = routes.projectSetup.getLink({ projectId: project.id, partnerId: partner.id });
  } else {
    route = routes.projectOverview.getLink({ projectId: project.id });
  }

  return <Link route={route}>{titleContent}</Link>;
};

const DashboardProject = (props: DashboardProjectProps) => {
  const titleValue = generateTitle(props);

  const projectActions = useProjectActions(props);
  const projectNotes = useProjectNotes(props);

  const displayAction = projectActions.length > 0 && !doesNotRequireAction(props);
  return (
    <ListItem key={props.project.id} actionRequired={displayAction} qa={`project-${props.project.projectNumber}`}>
      <div className="govuk-grid-column-two-thirds" style={{ display: "inline-flex", alignItems: "center" }}>
        <div>
          <H4 as="h3" className="govuk-!-margin-bottom-2">
            {titleValue}
          </H4>

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
    </ListItem>
  );
};

export const MemoizedDashboardProject = memo(DashboardProject);
