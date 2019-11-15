import React from "react";
import * as ACC from "../../components";
import { PartnerClaimStatus, PartnerDto, ProjectDto, ProjectRole, ProjectStatus } from "@framework/types";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { StoresConsumer } from "@ui/redux";
import { Pending } from "@shared/pending";
import { BaseProps, ContainerBaseWithState, ContainerProps, defineRoute } from "../containerBase";

interface Data {
  projectsFilter: (searchString: string) => Pending<ProjectDto[]>;
  partners: Pending<PartnerDto[]>;
  config: IClientConfig;
}

interface State {
  showRequestsToReview: boolean;
  showClaimsToReview: boolean;
  showClaimsWithParticipant: boolean;
  projectSearchString: string;
}

interface ProjectData {
  project: ProjectDto;
  partner: PartnerDto | null;
  projectSection: Section;
}

type Section = "archived" | "open" | "awaiting" | "upcoming";

class ProjectDashboardComponent extends ContainerBaseWithState<{}, Data, {}, State> {

  constructor(props: ContainerProps<{}, Data, {}>) {
    super(props);
    this.state = {
      showRequestsToReview: false,
      showClaimsToReview: false,
      showClaimsWithParticipant: false,
      projectSearchString: ""
    };
  }

  render() {
    return <ACC.PageLoader pending={this.props.partners} render={x => this.renderContent(x)} />;
  }

  private renderContent(partners: PartnerDto[]) {
    return (
      <ACC.Page
        backLink={this.getBackLink()}
        pageTitle={<ACC.PageTitle />}
      >
        {this.renderContents(partners)}
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

  private renderContents(partners: PartnerDto[]) {
    return (
      <React.Fragment>
        {this.renderSearch()}
        <ACC.Loader
          pending={this.props.projectsFilter(this.state.projectSearchString)}
          render={(projects) => this.renderProjectLists(projects, partners)}
        />
      </React.Fragment>
    );
  }

  private renderProjectLists(projects: ProjectDto[], partners: PartnerDto[]) {
    const combinedData = projects
      .map(project => {
        const partner = partners.find(y => (y.projectId === project.id) && !!(y.roles & ProjectRole.FinancialContact)) || null;
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
        {this.renderProjectList(openProjects, "open-projects", "section-open", "You currently do not have any open projects.")}
        <ACC.Accordion>
          <ACC.AccordionItem title="Upcoming Projects">
            {this.renderProjectList(upcomingProjects, "upcoming-projects", "section-upcoming", "You do not have any upcoming projects.")}
          </ACC.AccordionItem>
          <ACC.AccordionItem title="Archived Projects">
            {this.renderProjectList(archivedProjects, "archived-projects", "section-archived", "You do not have any archived projects.")}
          </ACC.AccordionItem>
        </ACC.Accordion>
      </React.Fragment>
    );
  }

  private renderProjectList(data: ProjectData[], qa: string, key: string, noProjectsMessage: string) {
    const stateFiltered = data
      .filter(x => !this.state.showClaimsToReview || x.project.claimsToReview > 0)
      .filter(x => !this.state.showClaimsWithParticipant || x.project.claimsWithParticipant > 0);
    return (
      <ACC.Section qa={qa} key={key}>
        {stateFiltered.map((x, i) => this.renderProject(x.project, x.partner, x.projectSection, i))}
        {this.renderNoProjectsMessage(stateFiltered, noProjectsMessage)}
      </ACC.Section>
    );
  }

  private renderNoProjectsMessage(combinedFiltersData: ProjectData[], noProjectsMessage: string) {
    if (!!combinedFiltersData.length) return null;
    return <ACC.Renderers.SimpleString>{noProjectsMessage}</ACC.Renderers.SimpleString>;
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

  private isActionRequired(project: ProjectDto, partner: PartnerDto | null, section: Section): boolean {
    if(section === "archived" || section === "upcoming") {
      return false;
    }

    // if fc return warning if overdue or iar required
    if (partner && ((partner.claimsOverdue! > 0) || partner.status === PartnerClaimStatus.IARRequired)) {
      return true;
    }

    // mo or pm return warning if any claims overdue
    if ((project.roles & (ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager)) && project.claimsOverdue > 0) {
      return true;
    }

    // if fc return edit if claim is not submitted
    if (partner && (partner.status !== PartnerClaimStatus.ClaimSubmitted && partner.status !== PartnerClaimStatus.NoClaimsDue)) {
      return true;
    }

    // if mo return edit if claims to review
    if ((project.roles & ProjectRole.MonitoringOfficer) && project.claimsToReview > 0) {
      return true;
    }

    return false;
  }

  private getRightHandMessages(project: ProjectDto, partner: PartnerDto | null, section: Section): React.ReactNode[] {
    const messages: React.ReactNode[] = [];

    if (section === "archived") messages.push(project.statusName);

    if (section === "open" || section === "awaiting") {
      const isMo = !!(project.roles & ProjectRole.MonitoringOfficer);
      const isFc = !!(project.roles & ProjectRole.FinancialContact);

      if(project.status === ProjectStatus.OnHold) {
        messages.push("On hold");
      }

      if (isMo) {
        messages.push(`Claims to review: ${project.claimsToReview}`);
      }

      if (isFc) {
        switch (partner && partner.status) {
          case PartnerClaimStatus.ClaimDue:
            messages.push(`You need to submit your claim.`);
            break;
          case PartnerClaimStatus.ClaimQueried:
            messages.push(`Your claim has been queried. Please respond.`);
            break;
          case PartnerClaimStatus.IARRequired:
            messages.push(`You need to submit your IAR.`);
            break;
        }
      }
    }

    return messages;
  }

  private getLeftHandMessages(project: ProjectDto, section: Section): React.ReactNode[] {
    const messages: React.ReactNode[] = [];

    if (section === "upcoming") messages.push(<ACC.Renderers.ShortDateRange start={project.startDate} end={project.endDate} />);

    if (section === "archived") messages.push(project.leadPartnerName);

    if (section === "open" || section === "awaiting") {
      messages.push(project.leadPartnerName);
      messages.push(
        <React.Fragment>
          {`Period ${project.periodId} of ${project.totalPeriods}`}
          &nbsp;(<ACC.Renderers.ShortDateRange start={project.periodStartDate} end={project.periodEndDate} />)
        </React.Fragment>
      );
    }

    return messages;
  }

  private renderSearch() {
    const formData = ({ projectSearchString: this.state.projectSearchString });
    const Form = ACC.TypedForm<{ projectSearchString: string }>();
    return (
      <Form.Form data={formData} qa={"projectSearch"} onSubmit={() => { return; }} onChange={v => this.setState({ projectSearchString: v.projectSearchString })}>
        <Form.Fieldset heading="Search">
          <Form.Search width="one-half" hint="Project number, project or lead partner" label="search" labelHidden={true} name="search" value={x => x.projectSearchString} update={(x, v) => x.projectSearchString = v || ""} />
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
    const leftHandMessages: React.ReactNode[] = this.getLeftHandMessages(project, section);

    return (
      <ACC.ListItem actionRequired={actionRequired} key={`project_${index}`} qa={`project-${project.projectNumber}`}>
        <div className="govuk-grid-column-one-half" style={{ display: "inline-flex", alignItems: "center" }}>
          <div>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-2">
              {this.renderProjectTitle(project, section !== "upcoming")}
            </h3>
            {leftHandMessages.map((content, i) => <div key={`leftMessage${i}`} className="govuk-body govuk-!-margin-bottom-0">{content}</div>)}
          </div>
        </div>
        <div className="govuk-grid-column-one-half govuk-!-margin-top-2" style={{ textAlign: "right" }}>
          {rightHandMessages.map((content, i) => <div key={`rightMessage${i}`} className="govuk-body govuk-!-margin-bottom-0">{content}</div>)}
        </div>
      </ACC.ListItem>
    );
  }
}

const ProjectDashboardContainer = (props: BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <ProjectDashboardComponent
          projectsFilter={(searchString) => stores.projects.getProjectsFilter(searchString)}
          partners={stores.partners.getAll()}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const ProjectDashboardRoute = defineRoute({
  routeName: "projectDashboard",
  routePath: "/projects/dashboard",
  container: ProjectDashboardContainer,
  getParams: () => ({}),
  getTitle: () => ({
    htmlTitle: "Projects",
    displayTitle: "Projects"
  }),
});
