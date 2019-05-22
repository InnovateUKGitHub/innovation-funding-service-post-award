import classNames from "classnames";
import * as Selectors from "../../redux/selectors";
import React from "react";
import * as ACC from "../../components";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { PartnerClaimStatus, PartnerDto, ProjectDto, ProjectRole, ProjectStatus } from "@framework/types";
import { DateTime } from "luxon";
import * as colour from "../../styles/colours";
import { HomeRoute } from "../home";
import { AllClaimsDashboardRoute, ClaimsDashboardRoute } from "../claims";
import { StatisticsBox } from "../../components";

interface Data {
  data: Pending<{
    projects: ProjectDto[];
    partners: PartnerDto[];
  }>;
}

interface Callbacks {
}

interface Props {
}

type Section = "archived" | "open" | "awaiting" | "upcoming";
type Icon = "warning" | "edit" | "none";

class ProjectDashboardComponent extends ContainerBase<Props, Data, Callbacks> {

  render() {
    return <ACC.PageLoader pending={this.props.data} render={x => this.renderContent(x.projects, x.partners)} />;
  }

  private renderContent(projects: ProjectDto[], partners: PartnerDto[]) {
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
      const status = this.getProjectStatus(project, partner);
      return {
        project,
        partner,
        status
      };
    });

    const open = combinedData.filter(x => x.status === "open");
    const awaiting = combinedData.filter(x => x.status === "awaiting");
    const archived = combinedData.filter(x => x.status === "archived");
    const upcoming = combinedData.filter(x => x.status === "upcoming");

    return (
      <React.Fragment>
        {this.renderStatisticsSection(combinedData)}
        {this.renderProjectList(open, "Open claims", "open-claims", "section-open", "open", "You currently do not have any projects with open claims.")}
        {this.renderProjectList(awaiting, "Awaiting the next claim period", "next-claims", "section-closed", "awaiting", "You currently do not have any projects outside of the claims period.")}
        {upcoming.length ? this.renderProjectList(upcoming, "Upcoming projects", "upcoming-claims", "section-upcoming", "upcoming", "") : null}
        {this.renderProjectList(archived, "Archive", "archived-claims", "section-archived", "archived", "You currently do not have any archived projects.")}
      </React.Fragment>
    );
  }

  private renderStatisticsSection(combinedData: { project: ProjectDto; partner: PartnerDto | null; status: Section }[]) {
    const projectsAsMO = combinedData.filter(x => x.project.roles & ProjectRole.MonitoringOfficer);
    const claimsToReview = projectsAsMO.reduce((accumulator, currentValue) => accumulator + currentValue.project.claimsToReview, 0);
    const pendingClaims = projectsAsMO.reduce((accumulator, currentValue) => accumulator + currentValue.project.claimsWithParticipant, 0);

    const isMO = !!projectsAsMO.length;

    if(!isMO) {
      return null;
    }

    return (
      <ACC.Section qa="requiring-action-section">
        {this.renderStatisticsBox(0, "change request you need to review", "pcr")}
        {this.renderStatisticsBox(claimsToReview, "claims you need to review", "review")}
        {this.renderStatisticsBox(pendingClaims, "unsubmitted or queried claims", "queried")}
      </ACC.Section>
    );
  }

  private renderStatisticsBox(numberOfClaims: number, claimAction: string, qa?: string) {
    return(
      <div className={classNames("govuk-grid-column-one-third", "govuk-!-padding-left-0")} >
        <StatisticsBox numberOfClaims={numberOfClaims} claimAction={claimAction} qa={qa}/>
      </div>
    );
  }

  private renderProjectList(data: {project: ProjectDto, partner: PartnerDto | null, status: Section}[], title: string, qa: string, key: string, section: Section, noProjectsMessage: string) {
    return (
      <ACC.ListSection title={title} qa={qa} key={key}>
        {data.map((x, i) => this.renderProject(x.project, x.partner, section, i))}
        {!data.length ? <ACC.ListItem><p className="govuk-body govuk-!-margin-0">{noProjectsMessage}</p></ACC.ListItem> : null}
      </ACC.ListSection>
    );
  }

  private getProjectStatus(project: ProjectDto, partner: PartnerDto | null): Section {
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
    data: Pending.combine({
      projects: Selectors.getProjects().getPending(state),
      partners: Selectors.getAllPartners().getPending(state),
    }),
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
