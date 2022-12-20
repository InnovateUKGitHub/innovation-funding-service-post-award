import type { AllRoles } from "@gql/hooks/useProjectRolesQuery";
import { Content, H4, Link, ListItem, Renderers } from "@ui/components";
import { SimpleString } from "@ui/components/renderers";
import { useContent } from "@ui/hooks";
import { ProjectOverviewRoute } from "../overview.page";
import { ProjectSetupRoute } from "../setup";
import { IDashboardProjectData, IPartner, IProject } from "./Dashboard.interface";
import { useProjectActions } from "./dashboard.logic";

const getProjectNotes = ({
  project,
  partner,
  projectSection,
}: {
  project: IProject;
  partner?: IPartner;
  projectSection: ReturnType<typeof getProjectSection>;
}) => {
  const isNotAvailable = !["open", "awaiting"].includes(projectSection);
  const isPartnerWithdrawn = ["Involuntary Withdrawal", "Voluntary Withdrawal", "Migrated - Withdrawn"].includes(
    partner?.accParticipantStatusCustom ?? "",
  );

  const messages: JSX.Element[] = [];

  // The lead partner will never have status === withdrawn,
  // so it doesn't matter that "withdrawn" is not getting appended to leadPartnerName
  // Caveat: they will be withdrawn for a few minutes while another lead partner is set, but we're not worrying about this
  messages.push(<>{project.accLeadParticipantNameCustom}</>);

  // Note: If project is not available then just bail early!
  if (isNotAvailable) return messages;

  if (projectSection === "upcoming") {
    const upcomingMessage = (
      <Renderers.ShortDateRange start={project.accStartDateCustom} end={project.accEndDateCustom} />
    );
    messages.push(upcomingMessage);
  }

  // TODO: Ensure Salesforce dates are not nillable.
  if (new Date(project.accEndDateCustom!) < new Date() || isPartnerWithdrawn) {
    messages.push(<Content value={x => x.projectMessages.projectEndedMessage} />);
  } else {
    const projectDate = (
      <Renderers.ShortDateRange
        start={project.accCurrentPeriodStartDateCustom}
        end={project.accCurrentPeriodEndDateCustom}
      />
    );

    messages.push(
      <>
        Period {project.accCurrentPeriodNumberCustom} of {project.accNumberofPeriodsCustom} ({projectDate})
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
  partner?: IPartner;
  projectSection: ReturnType<typeof getProjectSection>;
}) => {
  const titleContent = `${project.accProjectNumberCustom}: ${project.accProjectTitleCustom}`;

  if (projectSection === "upcoming") return <>{titleContent}</>;

  const projectNotSetup = partner && projectSection === "pending";

  const route = projectNotSetup
    ? ProjectSetupRoute.getLink({ projectId: project.id, partnerId: partner.id })
    : ProjectOverviewRoute.getLink({ projectId: project.id });

  return <Link route={route}>{titleContent}</Link>;
};

const getPartnerOnProject = ({ project, roles }: { project: IProject; roles: AllRoles }) => {
  const projectRole = roles[project.id];

  if (projectRole) {
    const { projectRoles, partnerRoles } = projectRole;
    const isPm = projectRoles.isPm ?? false;

    if (project.accProjectParticipantsProjectReference) {
      // Do two loops of the Project Participants, first by finding the lead partner,
      // then through other partners.
      //
      // For the Salesforce System User, this means that the project partner is the
      // lead partner.
      for (const partner of project.accProjectParticipantsProjectReference) {
        // Find the lead partner...
        if (partner?.accAccountIdCustom?.id === project.accLeadParticipantIdCustom) {
          // If the user is a PM, the project partner is the lead partner.
          if (isPm) return partner;

          // If the user is an FC of the lead partner, the project partner is the lead partner.
          const partnerRole = partnerRoles[partner.accAccountIdCustom.id];
          if (partnerRole?.isFc) return partner;
        }
      }

      // If the user is an FC of a non-lead partner, the project partner is that partner.
      for (const partner of project.accProjectParticipantsProjectReference) {
        if (partner) {
          const partnerRole = partnerRoles[partner.accAccountIdCustom.id];
          if (partnerRole?.isFc) return partner;
        }
      }
    }
  }

  return undefined;
};

const getProjectSection = ({ project, partner, roles }: { project: IProject; partner?: IPartner; roles: AllRoles }) => {
  if (
    partner?.accParticipantStatusCustom === "Pending" &&
    roles[project.id]?.partnerRoles[partner.accAccountIdCustom.id]?.isFc
  ) {
    return "pending";
  }

  const isMo = roles[project.id]?.projectRoles.isMo ?? false;
  const isFc = roles[project.id]?.projectRoles.isFc ?? false;
  const isPm = roles[project.id]?.projectRoles.isPm ?? false;

  switch (project.accProjectStatusCustom) {
    case "Live":
    case "Final Claim":
    case "On Hold":
      if (project.accCurrentPeriodNumberCustom === 0) {
        return "upcoming";
      }

      if (isPm || isMo) {
        return project.accNumberOfOpenClaimsCustom! > 0 ? "open" : "awaiting";
      }

      if (isFc && partner) {
        const hasNoClaimsDue = partner.accTrackingClaimsCustom === "No Claims Due";
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
  roles,
  displaySections = [],
}: {
  projectData: IDashboardProjectData;
  roles: AllRoles;
  displaySections: ReturnType<typeof getProjectSection>[];
}) => {
  const { project, partner, projectSection } = projectData;
  const projectNotes = getProjectNotes({ project, partner, projectSection });
  const projectActions = useProjectActions({ project, partner, roles, projectSection });

  if (!displaySections.includes(projectSection)) return null;

  return (
    <ListItem actionRequired={projectActions.length > 0} qa={`project-${project.accProjectNumberCustom}`}>
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
  roles,
  displaySection,
  isFiltering,
}: {
  projectsData: IDashboardProjectData[];
  roles: AllRoles;
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
        <DashboardProject key={i} projectData={item} displaySections={displaySections} roles={roles} />
      ))}
    </>
  );
};

export { DashboardProject, DashboardProjectList, getPartnerOnProject, getProjectSection };
export type { IDashboardProjectData };
