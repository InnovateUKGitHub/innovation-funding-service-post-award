import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { PartnerDto, ProjectDto } from "@framework/types";
import { useStores } from "@ui/redux";
import { Pending } from "@shared/pending";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { noop } from "@ui/helpers/noop";
import * as ACC from "@ui/components";

import { useMounted } from "@ui/features/has-mounted/mounted.context";
import { PageTitle } from "@ui/features/page-title";
import { BroadcastsViewer } from "../Broadcast/BroadcastsViewer";
import { DashboardProjectList } from "./DashboardProjectList";
import { DashboardProjectCount } from "./DashboardProjectCount";
import { FilterOptions } from "./Dashboard.interface";
import { generateFilteredProjects, getAvailableProjectFilters } from "./dashboard.logic";

interface ProjectDashboardParams {
  search?: string | number;
  arrayFilters?: FilterOptions[];
}

interface ProjectDashboardProps extends BaseProps, ProjectDashboardParams {
  totalNumberOfProjects: number;
  projects: ProjectDto[];
  unfilteredObjects: ProjectDto[];
  partners: PartnerDto[];
  onSearch: (searchParams: ProjectDashboardParams) => void;
}

function ProjectDashboard({
  config,
  partners,
  projects,
  unfilteredObjects,
  totalNumberOfProjects,
  search: searchQuery,
  ...props
}: ProjectDashboardProps) {
  // TODO: Ideally this would be an api which would be non-js / js agnostic
  // Note: 'unfilteredObjects' is needed as the filter options are derived from projects, when filtered there could be nothing to search.
  const [filterOptions] = useState(() => getAvailableProjectFilters(unfilteredObjects));
  const search = searchQuery === undefined ? "" : "" + searchQuery;

  const { isServer } = useMounted();
  const [arrayFilters, setFilters] = useState<FilterOptions[]>(props.arrayFilters ?? []);
  const { curatedProjects, curatedTotals, totalProjects } = generateFilteredProjects(arrayFilters, projects, partners);

  const searchFilterState = {
    searchValue: search,
    filterValue: arrayFilters,
  };

  const projectListProps = {
    routes: props.routes,
    isFiltering: !!search || arrayFilters.length !== filterOptions.length,
  };

  const displaySearch: boolean = totalNumberOfProjects >= config.options.numberOfProjectsToSearch;
  const options: ACC.SelectOption[] = filterOptions.map(x => ({ id: x.id, value: x.label }));

  const Form = ACC.TypedForm<typeof searchFilterState>();

  return (
    <ACC.Page
      pageTitle={<PageTitle />}
      backLink={
        config.ssoEnabled ? (
          // Note: This has been added as the content component cannot infer the static string length of min 4 characters
          <a className="govuk-back-link" href={`${config.ifsRoot}/dashboard-selection`}>
            <ACC.Content value={x => x.projectsDashboard.backToDashboard} />
          </a>
        ) : (
          <ACC.BackLink route={props.routes.home.getLink({})}>
            <ACC.Content value={x => x.projectsDashboard.backToHomepage} />
          </ACC.BackLink>
        )
      }
    >
      <BroadcastsViewer />

      <ACC.H2>
        <ACC.Content value={x => x.projectsDashboard.projectsTitle} />
      </ACC.H2>

      {displaySearch && (
        <Form.Form
          data={searchFilterState}
          qa="projectSearch"
          isGet
          onSubmit={noop}
          onChange={model =>
            props.onSearch({
              search: model.searchValue,
              arrayFilters,
            })
          }
        >
          <Form.Fieldset heading={x => x.projectsDashboard.searchTitle}>
            <Form.Search
              width="one-half"
              hint={x => x.projectsDashboard.searchHint}
              label={x => x.projectsDashboard.searchLabel}
              labelHidden
              name="search"
              value={x => x.searchValue}
              update={(x, v) => (x.searchValue = v ?? "")}
            />
          </Form.Fieldset>

          <Form.Fieldset heading="Filter options">
            <Form.Checkboxes
              hint="You can select more than one."
              name="arrayFilters"
              options={options}
              value={() =>
                arrayFilters.length ? options.filter(x => arrayFilters.includes(x.id as FilterOptions)) : null
              }
              update={(_, selectOptions) => {
                const latestFilters = selectOptions!.map(x => x.id) as FilterOptions[];
                setFilters(latestFilters);
              }}
            />
          </Form.Fieldset>

          {isServer && <Form.Submit>Search projects</Form.Submit>}
        </Form.Form>
      )}

      <DashboardProjectCount curatedTotals={curatedTotals} totalProjectCount={totalProjects} />

      <ACC.Section qa="pending-and-open-projects">
        <DashboardProjectList
          {...projectListProps}
          projects={[...curatedProjects.pending, ...curatedProjects.open]}
          errorType="live"
        />
      </ACC.Section>

      <ACC.Accordion>
        <ACC.AccordionItem title="Upcoming" qa="upcoming-projects">
          <DashboardProjectList errorType="upcoming" {...projectListProps} projects={curatedProjects.upcoming} />
        </ACC.AccordionItem>

        <ACC.AccordionItem title="Archived" qa="archived-projects">
          <DashboardProjectList errorType="archived" {...projectListProps} projects={curatedProjects.archived} />
        </ACC.AccordionItem>
      </ACC.Accordion>
    </ACC.Page>
  );
}

const ProjectDashboardContainer = (props: ProjectDashboardParams & BaseProps) => {
  const stores = useStores();
  const projects = stores.projects.getProjectsFilter(props.search?.toString());
  const unfilteredObjects = stores.projects.getProjects();
  const partners = stores.partners.getAll();

  const navigate = useNavigate();

  return (
    <ACC.PageLoader
      pending={Pending.combine({ projects, unfilteredObjects, partners })}
      render={resolvedPending => (
        <ProjectDashboard
          {...props}
          {...resolvedPending}
          totalNumberOfProjects={resolvedPending.unfilteredObjects.length}
          onSearch={searchParams => {
            const routeInfo = ProjectDashboardRoute.getLink(searchParams);
            return navigate(routeInfo.path, { replace: true });
          }}
        />
      )}
    />
  );
};

export const ProjectDashboardRoute = defineRoute({
  routeName: "projectDashboard",
  routePath: "/projects/dashboard",
  routePathWithQuery: "/projects/dashboard?:search",
  container: ProjectDashboardContainer,
  getParams: () => ({}),
  getTitle: x => x.content.projectsDashboard.title(),
});
