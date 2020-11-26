import React from "react";
import * as ACC from "../../../components";
import {
  getAuthRoles,
  PartnerClaimStatus,
  PartnerDto,
  PartnerStatus,
  ProjectDto,
  ProjectRole,
  ProjectStatus,
} from "@framework/types";
import { useStores } from "@ui/redux";
import { Pending } from "@shared/pending";
import { Content } from "@content/content";
import { ContentResult } from "@content/contentBase";
import { BaseProps, ContainerBase, defineRoute } from "../../containerBase";

import { Section } from "./Dashboard.interface";
import { DashboardProject } from "./DashboardProject";

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
  partner?: PartnerDto;
  projectSection: Section;
}

class ProjectDashboardComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      totalNumberOfProjects: this.props.totalNumberOfProjects,
      projects: this.props.projects,
      partners: this.props.partners,
    });

    return (
      <ACC.PageLoader
        pending={combined}
        render={x => this.renderContents(x.totalNumberOfProjects, x.projects, x.partners)}
      />
    );
  }

  private renderContents(totalNumberOfProjects: number, projects: ProjectDto[], partners: PartnerDto[]) {
    const { config } = this.props;

    const displayBackLink: boolean = config.ssoEnabled;
    const displaySearchUi: boolean = totalNumberOfProjects >= config.options.numberOfProjectsToSearch;

    const backLinkElement = displayBackLink ? (
      <a className="govuk-back-link" href={`${config.ifsRoot}/dashboard-selection`}>
        Back to dashboard
      </a>
    ) : (
      <ACC.BackLink route={this.props.routes.home.getLink({})}>Back to home page</ACC.BackLink>
    );

    return (
      <ACC.Page backLink={backLinkElement} pageTitle={<ACC.PageTitle />}>
        {displaySearchUi && this.renderSearch()}

        {this.renderProjectLists(projects, partners)}
      </ACC.Page>
    );
  }

  private renderProjectCount(
    live: ProjectData[],
    upcoming: ProjectData[],
    archived: ProjectData[],
    pending: ProjectData[],
  ) {
    const liveLength = live.length;
    const upcomingLength = upcoming.length;
    const archivedLength = archived.length;
    const pendingLength = pending.length;

    const projectsToCount = [liveLength, upcomingLength, archivedLength, pendingLength];
    const totalProjectCount: number = projectsToCount.reduce((acc, item) => acc + item, 0);

    if (!totalProjectCount) return null;

    const results: string[] = [];

    if (pendingLength) results.push(`${pendingLength} in project setup`);
    if (liveLength) results.push(`${liveLength} live`);
    if (upcomingLength) results.push(`${upcomingLength} upcoming`);
    if (archivedLength) results.push(`${archivedLength} archived`);

    const prefixMessage = `${totalProjectCount} ${totalProjectCount > 1 ? "projects" : "project"}`;
    const listOfProjects = `(${results.join(", ")})`;

    return (
      <ACC.Renderers.SimpleString qa="project-count">
        {prefixMessage} {listOfProjects}
      </ACC.Renderers.SimpleString>
    );
  }

  private renderProjectLists(projects: ProjectDto[], partners: PartnerDto[]) {
    const getPartnerInfo = (project: ProjectDto) => {
      const { isPm } = getAuthRoles(project.roles);

      const partner = isPm
        ? partners.find(y => y.projectId === project.id && y.isLead)!
        : partners.find(y => y.projectId === project.id && !!(y.roles & ProjectRole.FinancialContact));

      const projectSection: Section = this.getProjectSection(project, partner);

      return {
        project,
        partner,
        projectSection,
      };
    };

    const allProjects = projects.map(getPartnerInfo);

    const pendingProjects = allProjects.filter(x => x.projectSection === "pending");
    const openProjects = allProjects.filter(x => ["open", "awaiting"].indexOf(x.projectSection) !== -1);
    const upcomingProjects = allProjects.filter(x => x.projectSection === "upcoming");
    const archivedProjects = allProjects.filter(x => x.projectSection === "archived");

    return (
      <>
        {this.renderProjectCount(openProjects, upcomingProjects, archivedProjects, pendingProjects)}

        <ACC.Section qa="pending-and-open-projects">
          {this.renderProjectList(pendingProjects)}

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
      </>
    );
  }

  private renderProjectList(
    projects: ProjectData[],
    messages?: (x: Content) => { noProjects: ContentResult; noMatchingProjects: ContentResult },
  ) {
    const noProjectAvailable = !projects.length;

    return noProjectAvailable && messages ? (
      <ACC.Renderers.SimpleString>
        <ACC.Content
          value={x => {
            const type = messages(x);
            return this.props.search ? type.noMatchingProjects : type.noProjects;
          }}
        />
      </ACC.Renderers.SimpleString>
    ) : (
      projects.map(item => (
        <DashboardProject key={item.project.id} {...item} section={item.projectSection} routes={this.props.routes} />
      ))
    );
  }

  // tslint:disable-next-line: cognitive-complexity
  private getProjectSection(project: ProjectDto, partner?: PartnerDto): Section {
    // A pending participant status should override any project status, so check that first
    if (partner && partner.partnerStatus === PartnerStatus.Pending && getAuthRoles(partner.roles).isFc) {
      return "pending";
    }

    const { isFc, isPmMo } = getAuthRoles(project.roles);

    switch (project.status) {
      case ProjectStatus.Live:
      case ProjectStatus.FinalClaim:
      case ProjectStatus.OnHold:
        if (project.periodId === 0) {
          return "upcoming";
        }
        if (isPmMo) {
          return project.numberOfOpenClaims > 0 ? "open" : "awaiting";
        }
        if (isFc && partner) {
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

  private renderSearch() {
    const formData = { projectSearchString: this.props.search };
    const Form = ACC.TypedForm<typeof formData>();
    return (
      <Form.Form
        data={formData}
        qa={"projectSearch"}
        isGet={true}
        onSubmit={() => {
          return;
        }}
        onChange={v => this.props.onSearch(v.projectSearchString)}
      >
        <Form.Fieldset heading={<ACC.Content value={x => x.projectsDashboard.searchTitle} />}>
          <Form.Search
            width="one-half"
            hint={<ACC.Content value={x => x.projectsDashboard.searchHint} />}
            label={<ACC.Content value={x => x.projectsDashboard.searchLabel} />}
            labelHidden={true}
            name="search"
            value={x => x.projectSearchString}
            update={(x, v) => (x.projectSearchString = v || "")}
          />
        </Form.Fieldset>
      </Form.Form>
    );
  }
}

const ProjectDashboardContainer = (props: Params & BaseProps) => {
  const { projects, partners, navigation } = useStores();

  return (
    <ProjectDashboardComponent
      {...props}
      projects={projects.getProjectsFilter(props.search)}
      totalNumberOfProjects={projects.getProjects().then(x => x.length)}
      partners={partners.getAll()}
      onSearch={search => navigation.navigateTo(ProjectDashboardRoute.getLink({ search }), true)}
    />
  );
};

export const ProjectDashboardRoute = defineRoute({
  routeName: "projectDashboard",
  routePath: "/projects/dashboard?:search",
  container: ProjectDashboardContainer,
  getParams: r => ({ search: r.params.search }),
  getTitle: ({ content }) => content.projectsDashboard.title(),
});
