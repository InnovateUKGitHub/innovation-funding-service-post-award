import classNames from "classnames";
import * as Selectors from "../../redux/selectors";
import React from "react";
import * as ACC from "../../components";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import { ContainerBaseWithState, ContainerProps, ReduxContainer } from "../containerBase";
import { PartnerClaimStatus, PartnerDto, ProjectDto, ProjectRole, ProjectStatus } from "@framework/types";
import { DateTime } from "luxon";
import * as colour from "../../styles/colours";
import { HomeRoute } from "../home";
import { AllClaimsDashboardRoute, ClaimsDashboardRoute } from "../claims";
import { StatisticsBox } from "../../components";

interface Data {
  projects: Pending<ProjectDto[]>;
  partners: Pending<PartnerDto[]>;
  features: IFeatureFlags;
}

interface Callbacks {
}

interface Props {
}

interface State {
  showRequestsToReview: boolean;
  showClaimsToReview: boolean;
  showClaimsWithParticipant: boolean;
}

interface ProjectData  {
  project: ProjectDto;
  partner: PartnerDto | null;
  projectSection: Section;
}

interface CombinedData {
  projects: ProjectDto[];
  partners: PartnerDto[];
}

type Section = "archived" | "open" | "awaiting" | "upcoming";
type Icon = "warning" | "edit" | "none";

class ProjectDashboardComponent extends ContainerBaseWithState<Props, Data, Callbacks, State> {

  constructor(props: ContainerProps<Props, Data, Callbacks>) {
    super(props);
    this.state = {
      showRequestsToReview: false,
      showClaimsToReview: false,
      showClaimsWithParticipant: false,
    };
  }

  render() {
    const combined = Pending.combine({
      projects: this.props.projects,
      partners: this.props.partners,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContent(x)} />;
  }

  private renderContent({projects, partners}: CombinedData ) {
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={HomeRoute.getLink({})}>Back to dashboard</ACC.BackLink>}
        pageTitle={<ACC.Title />}
      >
        {this.renderContents(projects, partners)}
      </ACC.Page>
    );
  }

  private renderContents(projects: ProjectDto[], partners: PartnerDto[]) {
    const combinedData = projects.map(project => {
      const partner = partners.find(y => (y.projectId === project.id) && !!(y.roles & ProjectRole.FinancialContact)) || null;
      const projectSection = this.getProjectSection(project, partner);
      return {
        project,
        partner,
        projectSection
      };
    });

    return (
      <React.Fragment>
        {this.renderStatisticsSection(combinedData)}
        {this.renderProjectList(combinedData, "Projects with open claims", "open-claims", "section-open", "open", "You currently do not have any projects with open claims.")}
        {this.renderProjectList(combinedData, "Projects awaiting the next claim period", "next-claims", "section-closed", "awaiting", "You currently do not have any projects outside of the claims period.")}
        {combinedData.filter(x => x.projectSection === "upcoming").length ? this.renderProjectList(combinedData, "Upcoming projects", "upcoming-claims", "section-upcoming", "upcoming", "") : null}
        {combinedData.filter(x => x.projectSection === "archived").length ? this.renderProjectList(combinedData, "Archived projects", "archived-claims", "section-archived", "archived", ""): null}
      </React.Fragment>
    );
  }

  private renderStatisticsSection(combinedData: ProjectData[]) {
    const projectsAsMO = combinedData.filter(x => x.project.roles & ProjectRole.MonitoringOfficer);
    const requestsToReview = 0;
    const claimsToReview = projectsAsMO.reduce((accumulator, currentValue) => accumulator + currentValue.project.claimsToReview, 0);
    const pendingClaims = projectsAsMO.reduce((accumulator, currentValue) => accumulator + currentValue.project.claimsWithParticipant, 0);

    const isMO = !!projectsAsMO.length;

    if(!isMO) {
      return null;
    }

    return (
      <ACC.Section qa="requiring-action-section" title="Overview">
        {/* tslint:disable-next-line */}
        <div className="govuk-grid-column-full govuk-statistics-section">
          {this.renderStatisticsBox(requestsToReview, "Project change requests to review.", () => this.setState({showRequestsToReview: !this.state.showRequestsToReview}), this.state.showRequestsToReview, "pcr")}
          {this.renderStatisticsBox(claimsToReview, "Partner claims to review.", () => this.setState({ showClaimsToReview: !this.state.showClaimsToReview }), this.state.showClaimsToReview, "review")}
          {this.renderStatisticsBox(pendingClaims, "Partner claims pending.", () => this.setState({showClaimsWithParticipant: !this.state.showClaimsWithParticipant}), this.state.showClaimsWithParticipant, "queried")}
        </div>
      </ACC.Section>
    );
  }

  private renderStatisticsBox(numberOfClaims: number, label: string, filterFunction: () => void, buttonIsPressed: boolean, qa?: string) {
    if (this.props.features.projectFiltering && numberOfClaims > 0) {
      return (
        <button className={classNames("govuk-statistics-section__details", "govuk-statistics-section__details--button", {"govuk-statistics-section__details--button--unselected": !buttonIsPressed})} aria-pressed={buttonIsPressed} onClick={filterFunction}>
          <StatisticsBox number={numberOfClaims} label={label} qa={qa}/>
        </button>
      );
    }

    return(
      <div className="govuk-statistics-section__details">
        <StatisticsBox number={numberOfClaims} label={label} qa={qa}/>
      </div>
    );
  }

  private renderProjectList(data: ProjectData[], title: string, qa: string, key: string, section: Section, noProjectsMessage: string) {
    const statusFiltered = data.filter(x => x.projectSection === section);
    const stateFiltered = statusFiltered
      .filter(x => !this.state.showClaimsToReview || x.project.claimsToReview > 0)
      .filter(x => !this.state.showClaimsWithParticipant || x.project.claimsWithParticipant > 0);
    return (
      <ACC.ListSection title={title} qa={qa} key={key}>
        {stateFiltered.map((x, i) => this.renderProject(x.project, x.partner, section, i))}
        {this.renderNoPojectsMessage(stateFiltered, noProjectsMessage, statusFiltered)}
      </ACC.ListSection>
    );
  }

  private renderNoPojectsMessage = (combinedFiltersData: ProjectData[], noProjectsMessage: string, statusFiltered: ProjectData[]) => {
    if (!!combinedFiltersData.length) return null;
    if (statusFiltered.length !== 0 && (this.state.showClaimsWithParticipant || this.state.showClaimsToReview )) {
      return <ACC.ListItem><div className="govuk-body govuk-!-margin-0">{this.renderFilterNoProjectMessage()}</div></ACC.ListItem>;
    }
    return <ACC.ListItem><p className="govuk-body govuk-!-margin-0">{noProjectsMessage}</p></ACC.ListItem>;
  }

  private renderFilterNoProjectMessage = () => {
    return (
      <ul className="govuk-list">
        <li>0 Project change requests to review.</li>
        <li>0 Partner claims to review.</li>
        <li>0 Partner claims pending.</li>
      </ul>);
  }

  private getProjectSection(project: ProjectDto, partner: PartnerDto | null): Section {
    switch (project.status) {
      case ProjectStatus.Live:
      case ProjectStatus.FinalClaim:
      case ProjectStatus.OnHold:
        if (project.periodId === 0) {
          return "upcoming";
        }
        if (project.roles & (ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer)) {
          return project.numberOfOpenClaims > 0 ? "open" : "awaiting";
        }
        if (project.roles & (ProjectRole.FinancialContact) && partner) {
          return partner.status === PartnerClaimStatus.NoClaimsDue ? "awaiting" : "open";
        }
        return "upcoming";
      case ProjectStatus.Closed:
      case ProjectStatus.Terminated:
        return "archived";
      default:
        return "upcoming";
    }
  }

  private getIconStatus(project: ProjectDto, partner: PartnerDto | null): Icon {
    // if fc return warning if overdue or iar required
    if (partner && ((partner.claimsOverdue! > 0) || partner.status === PartnerClaimStatus.IARRequired)) {
      return "warning";
    }

    // mo or pm return warning if any claims overdue
    if ((project.roles & (ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager)) && project.claimsOverdue > 0) {
      return "warning";
    }

    // if fc return edit if claim is not submitted
    if (partner && (partner.status !== PartnerClaimStatus.ClaimSubmitted && partner.status !== PartnerClaimStatus.NoClaimsDue)) {
      return "edit";
    }

    // if mo return edit if claims to review
    if ((project.roles & ProjectRole.MonitoringOfficer) && project.claimsToReview > 0) {
      return "edit";
    }

    return "none";
  }

  // tslint:disable-next-line:cognitive-complexity
  private getMessages(project: ProjectDto, partner: PartnerDto | null, section: Section): React.ReactNode[] {
    const messages: React.ReactNode[] = [];

    const isMo = !!(project.roles & ProjectRole.MonitoringOfficer);
    const isPM = !!(project.roles & ProjectRole.ProjectManager);

    if (section === "open" || section === "awaiting") {
      messages.push(`Period ${project.periodId} of ${project.totalPeriods}`);
    }

    if (section === "archived" || section === "upcoming") {
      messages.push(<ACC.Renderers.LongDateRange start={project.startDate} end={project.endDate} />);
    }

    if (section === "open") {
      if (isMo) {
        messages.push(`Claims you need to review: ${project.claimsToReview}`);
      }

      switch (partner && partner.status) {
        case PartnerClaimStatus.ClaimDue:
        case PartnerClaimStatus.ClaimsOverdue:
          messages.push(`You need to submit your claim.`);
          break;
        case PartnerClaimStatus.ClaimSubmitted:
          messages.push(`You have submitted your claim.`);
          break;
        case PartnerClaimStatus.ClaimQueried:
          messages.push(`Your claim has been queried. Please respond.`);
          break;
        case PartnerClaimStatus.IARRequired:
          messages.push(`You need to submit your IAR.`);
          break;
      }

      if (isMo || isPM) {
        messages.push(`Unsubmitted or queried claims: ${project.claimsWithParticipant}`);
      }
    }

    if (section === "archived") {
      if (project.status === ProjectStatus.Terminated) {
        messages.push("Terminated.");
      }
    }

    return messages;
  }

  private getIsOverdue(project: ProjectDto, partner: PartnerDto | null): boolean {
    if ((project.roles & (ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager)) && project.claimsOverdue > 0) {
      return true;
    }

    if (partner && partner.claimsOverdue! > 0) {
      return true;
    }

    return false;
  }

  private renderBadge(project: ProjectDto, partner: PartnerDto | null, section: Section) {
    const isOverdue = section === "open" ? this.getIsOverdue(project, partner) : false;

    if (project.status === ProjectStatus.OnHold) {
      return (<div className="govuk-body" style={{ color: colour.GOVUK_TEXT_COLOUR, fontWeight: "bold" }}>On hold</div>);
    }
    else if (isOverdue) {
      return (<div className="govuk-body" style={{ color: colour.GOVUK_ERROR_COLOUR, fontWeight: "bold" }}>Claim overdue</div>);
    }
    else if (section === "open") {
      return <ACC.Claims.ClaimWindow periodEnd={DateTime.fromJSDate(project.claimWindowStart!).setZone("Europe/London").minus({ days: 1 }).toJSDate()} />;
    }
    else if (section === "awaiting") {
      return <ACC.Claims.ClaimWindow periodEnd={project.periodEndDate!} />;
    }

    return null;
  }

  private renderProjectTitle(project: ProjectDto, partner: PartnerDto | null, links: boolean) {
    const text = `${project.projectNumber}: ${project.title}`;

    if (!links) {
      return <p className="govuk-heading-s govuk-!-margin-bottom-2">{text}</p>;
    }

    if (project.roles === ProjectRole.FinancialContact && partner) {
      return <ACC.Link route={ClaimsDashboardRoute.getLink({ projectId: project.id, partnerId: partner.id })}>{text}</ACC.Link>;
    }

    return <ACC.Link route={AllClaimsDashboardRoute.getLink({ projectId: project.id })}>{text}</ACC.Link>;
  }

  private renderProject(project: ProjectDto, partner: PartnerDto | null, section: Section, index: number) {
    const iconStatus = section === "open" ? this.getIconStatus(project, partner) : "none";
    const messages: React.ReactNode[] = this.getMessages(project, partner, section);

    return (
      <ACC.ListItem icon={iconStatus} key={`project_${index}`} qa={`project-${project.projectNumber}`}>
        <div className="govuk-grid-column-two-thirds" style={{ display: "inline-flex", alignItems: "center" }}>
          <div className={iconStatus !== "none" ? "govuk-!-margin-left-8" : ""}>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-2">
              {this.renderProjectTitle(project, partner, section !== "upcoming")}
            </h3>
            {messages.map((content, i) => <p key={`message${i}`} className="govuk-body govuk-!-margin-bottom-0">{content}</p>)}
          </div>
        </div>
        <div className="govuk-grid-column-one-third govuk-!-margin-top-2" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          {this.renderBadge(project, partner, section)}
        </div>
      </ACC.ListItem>
    );
  }
}

const definition = ReduxContainer.for<Props, Data, Callbacks>(ProjectDashboardComponent);

export const ProjectDashboard = definition.connect({
  withData: (state, props) => ({
    projects: Selectors.getProjects().getPending(state),
    partners: Selectors.getAllPartners().getPending(state),
    features: state.config.features
  }),
  withCallbacks: () => ({})
});

export const ProjectDashboardRoute = definition.route({
  routeName: "projectDashboard",
  routePath: "/projects/dashboard",
  getParams: (route) => ({}),
  getLoadDataActions: (params) => [
    Actions.loadProjects(),
    Actions.loadPartners()
  ],
  getTitle: () => ({
    htmlTitle: "Projects",
    displayTitle: "Projects"
  }),
  container: ProjectDashboard
});
