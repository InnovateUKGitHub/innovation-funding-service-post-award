import { toDefinedArray } from "@shared/toArray";
import { Content, H4, Link, ListItem, Renderers } from "@ui/components";
import { SimpleString } from "@ui/components/renderers";
import { useContent } from "@ui/hooks";
import { ProjectOverviewRoute } from "../projectOverview/projectOverview.page";
import { ProjectSetupRoute } from "../setup";
import { IDashboardProjectData, IPartner, IProject } from "./Dashboard.interface";
import { useProjectActions } from "./dashboard.logic";

const getProjectNotes = ({
  project,
  partner,
  projectSection,
}: {
  project: IProject;
  partner?: IPartner | null;
  projectSection: ReturnType<typeof getProjectSection>;
}) => {
  const isNotAvailable = !["open", "awaiting"].includes(projectSection);
  const isPartnerWithdrawn = ["Involuntary Withdrawal", "Voluntary Withdrawal", "Migrated - Withdrawn"].includes(
    partner?.Acc_ParticipantStatus__c?.value ?? "",
  );

  const messages: JSX.Element[] = [];

  // The lead partner will never have status === withdrawn,
  // so it doesn't matter that "withdrawn" is not getting appended to leadPartnerName
  // Caveat: they will be withdrawn for a few minutes while another lead partner is set, but we're not worrying about this
  messages.push(<>{project.Acc_LeadParticipantName__c?.value}</>);

  if (projectSection === "upcoming") {
    const upcomingMessage = (
      <Renderers.ShortDateRange start={project.Acc_StartDate__c?.value} end={project.Acc_EndDate__c?.value} />
    );
    messages.push(upcomingMessage);
  }

  // Note: If project is not available then just bail early!
  if (isNotAvailable) return messages;

  // TODO: Ensure Salesforce dates are not nillable.
  if ((project.Acc_EndDate__c?.value && new Date(project.Acc_EndDate__c?.value) < new Date())|| isPartnerWithdrawn) {
    messages.push(<Content value={x => x.projectMessages.projectEndedMessage} />);
  } else {
    const projectDate = (
      <Renderers.ShortDateRange
        start={project.Acc_CurrentPeriodStartDate__c?.value}
        end={project.Acc_CurrentPeriodEndDate__c?.value}
      />
    );

    messages.push(
      <>
        Period {project.Acc_CurrentPeriodNumber__c?.value} of {project.Acc_NumberofPeriods__c?.value} ({projectDate})
      </>,
    );
  }

  return messages;
};

const DashboardProjectTitle = ({
  project,
  partner,
  projectSection,
}: {
  project: IProject;
  partner?: IPartner | null;
  projectSection: ReturnType<typeof getProjectSection>;
}) => {
  const titleContent = `${project.Acc_ProjectNumber__c?.value}: ${project.Acc_ProjectTitle__c?.value}`;

  if (projectSection === "upcoming") return <>{titleContent}</>;

  const projectNotSetup = partner && projectSection === "pending";

  const route = projectNotSetup
    ? ProjectSetupRoute.getLink({ projectId: project.Id, partnerId: partner.Id })
    : ProjectOverviewRoute.getLink({ projectId: project.Id });

  return <Link route={route}>{titleContent}</Link>;
};

const getPartnerOnProject = ({ project }: { project: IProject }) => {
  const { isPm, isSalesforceSystemUser, partnerRoles } = project.roles;

  if (project.Acc_ProjectParticipantsProject__r?.edges) {
    // Do two loops of the Project Participants, first by finding the lead partner,
    // then through other partners.
    //
    // For the Salesforce System User, this means that the project partner is the
    // lead partner.
    for (const { node: partner } of toDefinedArray(project.Acc_ProjectParticipantsProject__r.edges)) {
      // Find the lead partner...
      if (partner?.Acc_AccountId__r?.Id === project.Acc_LeadParticipantID__c?.value) {
        // If the user is a PM, the project partner is the lead partner.
        if (isPm || isSalesforceSystemUser) return partner;

        // If the user is an FC of the lead partner, the project partner is the lead partner.
        const partnerRole = partnerRoles.find(x => x.partnerId === partner?.Acc_AccountId__r?.Id);
        if (partnerRole?.isFc) return partner;
        break;
      }
    }

    // If the user is an FC of a non-lead partner, the project partner is that partner.
    for (const { node: partner } of toDefinedArray(project.Acc_ProjectParticipantsProject__r.edges)) {
      if (partner) {
        const partnerRole = partnerRoles.find(x => x.partnerId === partner?.Acc_AccountId__r?.Id);
        if (partnerRole?.isFc) return partner;
      }
    }
  }

  return undefined;
};

const getProjectSection = ({ project, partner }: { project: IProject; partner?: IPartner | null }) => {
  if (
    partner?.Acc_ParticipantStatus__c?.value === "Pending" &&
    project.roles.partnerRoles.find(x => x.partnerId === partner.Acc_AccountId__r?.Id)?.isFc
  ) {
    return "pending";
  }

  const { isMo, isFc, isPm } = project.roles;

  switch (project.Acc_ProjectStatus__c?.value) {
    case "Live":
    case "Final Claim":
    case "On Hold":
      if (project.Acc_CurrentPeriodNumber__c?.value === 0) {
        return "upcoming";
      }

      if (isPm || isMo) {
        return project.Acc_NumberOfOpenClaims__c!.value! > 0 ? "open" : "awaiting";
      }

      if (isFc && partner) {
        const hasNoClaimsDue = partner.Acc_TrackingClaims__c?.value === "No Claims Due";
        return hasNoClaimsDue ? "awaiting" : "open";
      }

      return "upcoming";

    case "Closed":
    case "Terminated":
      return "archived";

    default:
      return "upcoming";
  }
};

const DashboardProject = ({
  projectData,
  displaySections = [],
}: {
  projectData: IDashboardProjectData;
  displaySections: ReturnType<typeof getProjectSection>[];
}) => {
  const { project, partner, projectSection } = projectData;
  const projectNotes = getProjectNotes({ project, partner, projectSection });
  const projectActions = useProjectActions({ project, partner, projectSection });

  if (!displaySections.includes(projectSection)) return null;

  return (
    <ListItem actionRequired={projectActions.length > 0} qa={`project-${project.Acc_ProjectNumber__c?.value}`}>
      <div className="govuk-grid-column-two-thirds" style={{ display: "inline-flex", alignItems: "center" }}>
        <div>
          <H4 as="h3" className="govuk-!-margin-bottom-2">
            <DashboardProjectTitle project={project} partner={partner} projectSection={projectSection} />
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

const DashboardProjectList = ({
  projectsData,
  displaySection,
  isFiltering,
}: {
  projectsData: IDashboardProjectData[];
  displaySection: "live" | "upcoming" | "archived";
  isFiltering: boolean;
}) => {
  const { getContent } = useContent();
  let noCompetitionsMessage: string;
  let displaySections: ReturnType<typeof getProjectSection>[];

  switch (displaySection) {
    case "live":
      noCompetitionsMessage = getContent(x =>
        isFiltering ? x.pages.projectsDashboard.noLiveMatchingMessage : x.pages.projectsDashboard.noLiveProjectsMessage,
      );
      displaySections = ["open", "pending", "awaiting"];
      break;
    case "upcoming":
      noCompetitionsMessage = getContent(x =>
        isFiltering
          ? x.pages.projectsDashboard.noUpcomingMatchingMessage
          : x.pages.projectsDashboard.noUpcomingProjectsMessage,
      );
      displaySections = ["upcoming"];
      break;
    case "archived":
      noCompetitionsMessage = getContent(x =>
        isFiltering
          ? x.pages.projectsDashboard.noArchivedMatchingMessage
          : x.pages.projectsDashboard.noArchivedProjectsMessage,
      );
      displaySections = ["archived"];
      break;
  }

  if (!projectsData.length) {
    return <SimpleString>{noCompetitionsMessage}</SimpleString>;
  }

  return (
    <>
      {projectsData.map((item, i) => (
        <DashboardProject key={i} projectData={item} displaySections={displaySections} />
      ))}
    </>
  );
};

export { DashboardProject, DashboardProjectList, getPartnerOnProject, getProjectSection };
export type { IDashboardProjectData };
