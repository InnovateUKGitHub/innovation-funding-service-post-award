import React from "react";
import * as ACC from "../../components";
import {
  PartnerClaimStatus,
  PartnerDto,
  ProjectDto,
  ProjectRole,
  ProjectStatus
} from "@framework/types";
import { StoresConsumer } from "@ui/redux";
import { Pending } from "@shared/pending";
import { BaseProps, ContainerBaseWithState, ContainerProps, defineRoute } from "../containerBase";
import { Content } from "@content/content";
import { ContentResult } from "@content/contentBase";

interface Params {
  search?: string | null;
}

interface Data {
  totalNumberOfProjects: Pending<number>;
  projects: Pending<ProjectDto[]>;
  partners: Pending<PartnerDto[]>;
}

interface Callbacks {
  onSearch: (search: string | null | undefined) => void;
}

interface ProjectData {
  project: ProjectDto;
  partner: PartnerDto | null;
  projectSection: Section;
}

type Section = "archived" | "open" | "awaiting" | "upcoming";

class ProjectDashboardComponent extends ContainerBaseWithState<Params, Data, Callbacks, {}> {

  constructor(props: ContainerProps<Params, Data, Callbacks>) {
    super(props);
    this.state = {
      showRequestsToReview: false,
      showClaimsToReview: false,
      showClaimsWithParticipant: false,
      projectSearchString: ""
    };
  }

  render() {
    const combined = Pending.combine({
      totalNumberOfProjects: this.props.totalNumberOfProjects,
      projects: this.props.projects,
      partners: this.props.partners
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.totalNumberOfProjects, x.projects, x.partners)} />;
  }

  private renderContents(totalNumberOfProjects: number, projects: ProjectDto[], partners: PartnerDto[]) {
    return (
      <ACC.Page
        backLink={this.getBackLink()}
        pageTitle={<ACC.PageTitle />}
      >
        {totalNumberOfProjects >= this.props.config.features.numberOfProjectsToSearch && this.renderSearch()}
        {this.renderProjectLists(projects, partners)}
      </ACC.Page>
    );
  }

  private getBackLink() {
    const config = this.props.config;
    if (config.ssoEnabled) {
      return <a className="govuk-back-link" href={`${config.ifsRoot}/dashboard-selection`}>Back to dashboard</a>;
    }
    return <ACC.BackLink route={this.props.routes.home.getLink({})}>Back to home page</ACC.BackLink>;
  }

  private renderProjectCount(live: ProjectData[], upcoming: ProjectData[], archived: ProjectData[]) {
    const count = live.length + upcoming.length + archived.length;
    if (!count) return null;

    const results = [];
    if (live.length) results.push(`${live.length} live`);
    if (upcoming.length) results.push(`${upcoming.length} upcoming`);
    if (archived.length) results.push(`${archived.length} archived`);
    return <ACC.Renderers.SimpleString qa={"project-count"}>{`${count} project${count > 1 ? "s" : ""} (${results.join(", ")})`}</ACC.Renderers.SimpleString>;
  }

  private renderProjectLists(projects: ProjectDto[], partners: PartnerDto[]) {
    const combinedData = projects
      .map(project => {
        const partner = (project.roles & ProjectRole.ProjectManager)
          ? partners.find(y => y.projectId === project.id && y.isLead)!
          : partners.find(y => (y.projectId === project.id) && !!(y.roles & ProjectRole.FinancialContact)) || null;

        const projectSection = this.getProjectSection(project, partner);
        return {
          project,
          partner,
          projectSection
        };
      });

    const openProjects = combinedData.filter(x => x.projectSection === "open" || x.projectSection === "awaiting");
    const upcomingProjects = combinedData.filter(x => x.projectSection === "upcoming");
    const archivedProjects = combinedData.filter(x => x.projectSection === "archived");

    return (
      <React.Fragment>
        {this.renderProjectCount(openProjects, upcomingProjects, archivedProjects)}
        <ACC.Section qa="open-projects" key="section-open">
          {this.renderProjectList(openProjects, x => x.projectsDashboard.live)}
        </ACC.Section>
        <ACC.Accordion>
          <ACC.AccordionItem title="Upcoming" qa="upcoming-projects">
            {this.renderProjectList(upcomingProjects, x => x.projectsDashboard.upcoming)}
          </ACC.AccordionItem>
          <ACC.AccordionItem title="Archived" qa="archived-projects">
            {this.renderProjectList(archivedProjects, x => x.projectsDashboard.archived)}
          </ACC.AccordionItem>
        </ACC.Accordion>
      </React.Fragment>
    );
  }

  private renderProjectList(projects: ProjectData[], messages: (x: Content) => { noProjects: () => ContentResult, noMatchingProjects: () => ContentResult }) {

    if (!projects.length && this.props.search) {
      return <ACC.Renderers.SimpleString><ACC.Content value={x => messages(x).noMatchingProjects()} /></ACC.Renderers.SimpleString>;
    }

    if (!projects.length) {
      return <ACC.Renderers.SimpleString><ACC.Content value={x => messages(x).noProjects()} /></ACC.Renderers.SimpleString>;
    }

    return (
      projects.map((x, i) => this.renderProject(x.project, x.partner, x.projectSection, i))
    );
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
          return partner.claimStatus === PartnerClaimStatus.NoClaimsDue ? "awaiting" : "open";
        }
        return "upcoming";
      case ProjectStatus.Closed:
      case ProjectStatus.Terminated:
        return "archived";
      default:
        return "upcoming";
    }
  }

  private isActionRequired(project: ProjectDto, partner: PartnerDto | null, section: Section): boolean {
    if (section === "archived" || section === "upcoming") {
      return false;
    }

    // if fc return warning if overdue or iar required
    if (partner && ((partner.claimsOverdue! > 0) || partner.claimStatus === PartnerClaimStatus.IARRequired)) {
      return true;
    }

    // mo or pm return warning if any claims overdue
    if ((project.roles & (ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager)) && project.claimsOverdue > 0) {
      return true;
    }

    // if fc return edit if claim is not submitted
    if (partner && (partner.claimStatus !== PartnerClaimStatus.ClaimSubmitted && partner.claimStatus !== PartnerClaimStatus.NoClaimsDue)) {
      return true;
    }

    // if mo return edit if claims to review
    if ((project.roles & ProjectRole.MonitoringOfficer) && project.claimsToReview > 0) {
      return true;
    }

    return false;
  }

  private getRightHandMessagesForFC(partner: PartnerDto | null) {
    const messages: React.ReactNode[] = [];
    switch (partner && partner.claimStatus) {
      case PartnerClaimStatus.ClaimDue:
        messages.push(<ACC.Content value={x => x.projectsDashboard.messages.claimToSubmit()} />);
        break;
      case PartnerClaimStatus.ClaimQueried:
        messages.push(<ACC.Content value={x => x.projectsDashboard.messages.claimQueried()} />);
        break;
      case PartnerClaimStatus.IARRequired:
        messages.push(<ACC.Content value={x => x.projectsDashboard.messages.claimRequiresIAR()} />);
        break;
    }
    return messages;
  }

  private getRightHandMessages(project: ProjectDto, partner: PartnerDto | null, section: Section): React.ReactNode[] {
    const messages: React.ReactNode[] = [];

    if (section === "archived") messages.push(project.statusName);

    if (section === "open" || section === "awaiting") {
      const isMo = !!(project.roles & ProjectRole.MonitoringOfficer);
      const isFc = !!(project.roles & ProjectRole.FinancialContact);
      const isPm = !!(project.roles & ProjectRole.ProjectManager);

      if (project.status === ProjectStatus.OnHold) {
        messages.push(<ACC.Content value={x => x.projectsDashboard.messages.projectOnHold()} />);
      }

      if (isMo) {
        messages.push(<ACC.Content value={x => x.projectsDashboard.messages.claimsToReview(project.claimsToReview)} />);
        messages.push(<ACC.Content value={x => x.projectsDashboard.messages.pcrsToReview(project.pcrsToReview)} />);
      }

      if (isFc) {
        messages.push(...this.getRightHandMessagesForFC(partner));
      }

      if (isPm) {
        if (project.pcrsQueried > 0) messages.push(<ACC.Content value={x => x.projectsDashboard.messages.pcrQueried()} />);
      }
    }

    return messages;
  }

  private getLeftHandMessages(project: ProjectDto, partner: PartnerDto | null, section: Section): React.ReactNode[] {
    const messages: React.ReactNode[] = [];

    // The lead partner will never have status === withdrawn,
    // so it doesn't matter that "withdrawn" is not getting appended to leadPartnerName
    // Caveat: they will be withdrawn for a few minutes while another lead partner is set, but we're not worrying about this
    messages.push(project.leadPartnerName);

    if (section === "upcoming") messages.push(<ACC.Renderers.ShortDateRange start={project.startDate} end={project.endDate} />);

    if (section === "open" || section === "awaiting") {

      const endedMessage = <ACC.Content value={x => x.projectsDashboard.messages.projectEnded()} />;
      const openMessage = (
        <React.Fragment>
          Period {project.periodId} of {project.totalPeriods}&nbsp;(<ACC.Renderers.ShortDateRange start={project.periodStartDate} end={project.periodEndDate} />)
        </React.Fragment>
      );
      messages.push(project.isPastEndDate || (partner && partner.isWithdrawn) ? endedMessage : openMessage);
    }

    return messages;
  }

  private renderSearch() {
    const formData = ({ projectSearchString: this.props.search });
    const Form = ACC.TypedForm<typeof formData>();
    return (
      <Form.Form data={formData} qa={"projectSearch"} isGet={true} onSubmit={() => { return; }} onChange={v => this.props.onSearch(v.projectSearchString)}>
        <Form.Fieldset heading={<ACC.Content value={x => x.projectsDashboard.searchTitle()} />}>
          <Form.Search width="one-half" hint={<ACC.Content value={x => x.projectsDashboard.searchHint()} />} label={<ACC.Content value={x => x.projectsDashboard.searchLabel()} />} labelHidden={true} name="search" value={x => x.projectSearchString} update={(x, v) => x.projectSearchString = v || ""} />
        </Form.Fieldset>
      </Form.Form>
    );
  }

  private renderProjectTitle(project: ProjectDto, links: boolean) {
    const text = `${project.projectNumber}: ${project.title}`;

    if (!links) {
      return <p className="govuk-heading-s govuk-!-margin-bottom-2">{text}</p>;
    }

    return <ACC.Link route={this.props.routes.projectOverview.getLink({ projectId: project.id })}>{text}</ACC.Link>;
  }

  private renderProject(project: ProjectDto, partner: PartnerDto | null, section: Section, index: number) {
    const actionRequired = this.isActionRequired(project, partner, section);
    const rightHandMessages: React.ReactNode[] = this.getRightHandMessages(project, partner, section);
    const leftHandMessages: React.ReactNode[] = this.getLeftHandMessages(project, partner, section);

    return (
      <ACC.ListItem actionRequired={actionRequired} key={`project_${index}`} qa={`project-${project.projectNumber}`}>
        <div className="govuk-grid-column-two-thirds" style={{ display: "inline-flex", alignItems: "center" }}>
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-2">
              {this.renderProjectTitle(project, section !== "upcoming")}
            </h3>
            {leftHandMessages.map((content, i) => <div key={`leftMessage${i}`} className="govuk-body-s govuk-!-margin-bottom-0">{content}</div>)}
          </div>
        </div>
        <div className="govuk-grid-column-one-third govuk-grid-column--right-align govuk-!-margin-top-2">
          {rightHandMessages.map((content, i) => <div key={`rightMessage${i}`} className="govuk-body-s govuk-!-margin-bottom-0 govuk-!-font-weight-bold">{content}</div>)}
        </div>
      </ACC.ListItem>
    );
  }
}

const ProjectDashboardContainer = (props: Params & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <ProjectDashboardComponent
          projects={stores.projects.getProjectsFilter(props.search)}
          totalNumberOfProjects={stores.projects.getProjects().then(x => x.length)}
          partners={stores.partners.getAll()}
          onSearch={(search) => stores.navigation.navigateTo(ProjectDashboardRoute.getLink({ search }), true)}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const ProjectDashboardRoute = defineRoute({
  routeName: "projectDashboard",
  routePath: "/projects/dashboard?:search",
  container: ProjectDashboardContainer,
  getParams: (r) => ({ search: r.params.search }),
  getTitle: ({ content }) => content.projectsDashboard.title()
});
