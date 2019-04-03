import * as Selectors from "../../redux/selectors";
import React from "react";
import * as ACC from "../../components";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { PartnerClaimStatus, PartnerDto, ProjectDto, ProjectRole, ProjectStatus } from "../../../types";
import { DateTime } from "luxon";
import * as colour from "../../styles/colours";
import { HomeRoute } from "../home";
import { AllClaimsDashboardRoute, ClaimsDashboardRoute } from "../claims";

interface Data {
  data: Pending<{
    projects: ProjectDto[];
    partners: PartnerDto[];
  }>;
}

interface Callbacks {
}

interface Props {
  showHidden?: boolean;
}

type Section = "archived" | "open" | "awaiting" | "upcoming";
type Icon = "warning" | "edit" | "none";

class ProjectDashboardComponent extends ContainerBase<Props, Data, Callbacks> {

  render() {
    return <ACC.PageLoader pending={this.props.data} render={x => this.renderContent(x.projects, x.partners)} />;
  }

  private renderContent(projects: ProjectDto[], partners: PartnerDto[]) {
    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={HomeRoute.getLink({})}>Back to dashboard</ACC.BackLink>
        </ACC.Section>
        <ACC.Title title="Projects" />
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
        <ACC.ListSection title="Open claims" qa="open-claims" key={`section-open`}>
          {open.map((x, i) => this.renderProject(x.project, x.partner, "open", i))}
          {!open.length ? <ACC.ListItem><p className="govuk-body govuk-!-margin-0">You currently do not have any projects with open claims.</p></ACC.ListItem> : null}
        </ACC.ListSection>
        <ACC.ListSection title="Awaiting the next claim period" qa="next-claims" key={`section-closed`}>
          {awaiting.map((x, i) => this.renderProject(x.project, x.partner, "awaiting", i))}
          {!awaiting.length ? <ACC.ListItem><p className="govuk-body govuk-!-margin-0">You currently do not have any projects outside of the claims period.</p></ACC.ListItem> : null}
        </ACC.ListSection>
        <ACC.ListSection title="Archive" qa="archived-claims" key={`section-archived`}>
          {archived.map((x, i) => this.renderProject(x.project, x.partner, "archived", i))}
          {!archived.length ? <ACC.ListItem><p className="govuk-body govuk-!-margin-0">You currently do not have any archived projects.</p></ACC.ListItem> : null}
        </ACC.ListSection>
        {
          this.props.showHidden === true && upcoming.length ?
            <ACC.ListSection title="Hidden" qa="hidden-claims" key={`section-hidden`}>
              {upcoming.map((x, i) => this.renderProject(x.project, x.partner, "archived", i))}
            </ACC.ListSection>
            : null
        }
      </React.Fragment>
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

  private getMessages(project: ProjectDto, partner: PartnerDto | null, section: Section): React.ReactNode[] {
    const messages: React.ReactNode[] = [];

    const isMo = !!(project.roles & ProjectRole.MonitoringOfficer);
    const isPM = !!(project.roles & ProjectRole.ProjectManager);

    if (section === "open" || section === "awaiting") {
      messages.push(`Period ${project.periodId} of ${project.totalPeriods}`);
    }

    if (section === "archived") {
      messages.push(<ACC.Renderers.LongDateRange start={project.startDate} end={project.endDate} />);
    }

    if (section === "open") {
      if (isMo) {
        messages.push(`Claims you need to review: ${project.claimsToReview}`);
      }

      if (isMo || isPM) {
        messages.push(`Unsubmitted or queried claims: ${project.claimsWithParticipant}`);
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

    if (isOverdue) {
      return (<div className="govuk-body" style={{ color: colour.GOVUK_ERROR_COLOUR, fontWeight: "bold" }}>Claim overdue</div>);
    }
    else if (section === "open") {
      return <ACC.Claims.ClaimWindow periodEnd={DateTime.fromJSDate(project.claimWindowStart!).minus({ days: 1 }).toJSDate()} />;
    }
    else if (section === "awaiting") {
      return <ACC.Claims.ClaimWindow periodEnd={project.periodEndDate!} />;
    }

    return null;
  }

  private renderLink(project: ProjectDto, partner: PartnerDto | null) {
    const text = `${project.projectNumber}: ${project.title}`;
    if (project.roles === ProjectRole.FinancialContact && partner) {
      return <ACC.Link route={ClaimsDashboardRoute.getLink({ projectId: project.id, partnerId: partner.id })}>{text}</ACC.Link>;
    }
    return <ACC.Link route={AllClaimsDashboardRoute.getLink({ projectId: project.id })}>{text}</ACC.Link>;
  }

  private renderProject(project: ProjectDto, partner: PartnerDto | null, section: Section, index: number) {
    const iconStatus = section === "open" ? this.getIconStatus(project, partner) : "none";
    const messages: React.ReactNode[] = this.getMessages(project, partner, section);

    const itemStyle: React.CSSProperties = {

    };

    if (iconStatus !== "none") {
      itemStyle.marginLeft = "30px";
    }

    const iconStyle: React.CSSProperties = {
      marginLeft: "-10px"
    };

    return (
      <ACC.ListItem icon={iconStatus} key={`project_${index}`} qa={`project-${project.projectNumber}`}>
        <div className="govuk-grid-column-two-thirds" style={{ display: "inline-flex", alignItems: "center" }}>
          {iconStatus === "warning" ? <div style={iconStyle}><img src="/assets/images/icon-alert.png" /></div> : null}
          {iconStatus === "edit" ? <div style={iconStyle}><img src="/assets/images/icon-edit.png" /></div> : null}
          <div style={itemStyle}>
            <h2 className="govuk-heading-s govuk-!-margin-bottom-2">
              {this.renderLink(project, partner)}
            </h2>
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
  getParams: (route) => ({
    useSalesforceStatus: route.params.useSalesforceStatus === "true",
    showHidden: route.params.showHidden === "true"
  }),
  getLoadDataActions: (params) => [
    Actions.loadProjects(),
    Actions.loadPartners()
  ],
  container: ProjectDashboard
});
