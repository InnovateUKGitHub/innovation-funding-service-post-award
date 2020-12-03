import React from "react";
import * as ACC from "../../../components";
import { PartnerDto, ProjectDto } from "@framework/types";
import { useStores } from "@ui/redux";
import { Pending } from "@shared/pending";
import { BaseProps, ContainerBase, defineRoute } from "../../containerBase";

import { DashboardProjectList } from "./DashboardProjectList";
import { DashboardProjectCount } from "./DashboardProjectCount";
import { generateFilteredProjects } from "./dashboard.logic";

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

class ProjectDashboardComponent extends ContainerBase<Params, Data, Callbacks> {
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

  private renderBackLink() {
    const { config } = this.props;

    const displayBackLink: boolean = config.ssoEnabled;

    return displayBackLink ? (
      // Note: This has been added as the content component cannot infer the static string length of min 4 characters
      // tslint:disable-next-line: react-a11y-anchors
      <a className="govuk-back-link" href={`${config.ifsRoot}/dashboard-selection`}>
        <ACC.Content value={x => x.projectsDashboard.backToDashboard} />
      </a>
    ) : (
      <ACC.BackLink route={this.props.routes.home.getLink({})}>
        <ACC.Content value={x => x.projectsDashboard.backToHomepage} />
      </ACC.BackLink>
    );
  }

  render() {
    const { config, partners, projects, totalNumberOfProjects } = this.props;

    const combined = Pending.combine({ totalNumberOfProjects, projects, partners });

    return (
      <ACC.PageLoader
        pending={combined}
        render={data => {
          const sectionUpcomingTitle = "Upcoming";
          const sectionArchivedTitle = "Archived";

          const backLinkElement = this.renderBackLink();
          const displaySearchUi: boolean = data.totalNumberOfProjects >= config.options.numberOfProjectsToSearch;

          const { curatedProjects, curatedTotals, totalProjects } = generateFilteredProjects(
            data.projects,
            data.partners,
          );

          const projectListProps = {
            routes: this.props.routes,
            searchEnabled: !!this.props.search,
          };

          return (
            <ACC.Page backLink={backLinkElement} pageTitle={<ACC.PageTitle />}>
              {displaySearchUi && this.renderSearch()}

              <DashboardProjectCount curatedTotals={curatedTotals} totalProjectCount={totalProjects} />

              <ACC.Section qa="pending-and-open-projects">
                <DashboardProjectList projects={curatedProjects.pending} {...projectListProps} />

                <DashboardProjectList projects={curatedProjects.open} {...projectListProps} errorType="live" />
              </ACC.Section>

              <ACC.Accordion>
                <ACC.AccordionItem title={sectionUpcomingTitle} qa="upcoming-projects">
                  <DashboardProjectList
                    projects={curatedProjects.upcoming}
                    {...projectListProps}
                    errorType="upcoming"
                  />
                </ACC.AccordionItem>

                <ACC.AccordionItem title={sectionArchivedTitle} qa="archived-projects">
                  <DashboardProjectList
                    projects={curatedProjects.archived}
                    {...projectListProps}
                    errorType="archived"
                  />
                </ACC.AccordionItem>
              </ACC.Accordion>
            </ACC.Page>
          );
        }}
      />
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
