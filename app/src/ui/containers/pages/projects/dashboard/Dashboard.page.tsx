import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { noop } from "@ui/helpers/noop";
import { useMountedState } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { PageTitle } from "@ui/features/page-title";
import { BroadcastsViewer } from "@ui/components/atomicDesign/organisms/BroadcastViewer/BroadcastsViewer";
import { DashboardProjectList } from "./DashboardProjectList";
import { DashboardProjectCount } from "./DashboardProjectCount";
import { FilterOptions } from "./Dashboard.interface";
import { generateFilteredProjects, useAvailableProjectFilters, useProjectsDashboardData } from "./dashboard.logic";
import { Accordion } from "@ui/components/atomicDesign/atoms/Accordion/Accordion";
import { AccordionItem } from "@ui/components/atomicDesign/atoms/Accordion/AccordionItem";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm, SelectOption } from "@ui/components/bjss/form/form";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { H2 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/redux/routesProvider";

interface ProjectDashboardParams {
  search?: string | number;
  arrayFilters?: FilterOptions[];
}

interface IProjectDashboardForm {
  searchValue: string;
  filterValue: FilterOptions[];
}

const Form = createTypedForm<IProjectDashboardForm>();

const ProjectDashboardPage = ({ config, search: searchQuery, ...props }: ProjectDashboardParams & BaseProps) => {
  const navigate = useNavigate();
  const { getContent } = useContent();
  const routes = useRoutes();

  const { projects, unfilteredObjects, displaySearch, broadcasts } = useProjectsDashboardData(searchQuery, config);

  const onSearch = (searchParams: { search?: string | number; arrayFilters: FilterOptions[] }) => {
    const routeInfo = routes.projectDashboard.getLink(searchParams);
    return navigate(routeInfo.path, { replace: true });
  };

  // TODO: Ideally this would be an api which would be non-js / js agnostic
  // Note: 'unfilteredObjects' is needed as the filter options are derived from projects, when filtered there could be nothing to search.
  const filterOptions = useAvailableProjectFilters(unfilteredObjects);
  const search = searchQuery === undefined ? "" : "" + searchQuery;

  const { isServer } = useMountedState();
  const [arrayFilters, setFilters] = useState<FilterOptions[]>(props.arrayFilters ?? []);
  const { curatedProjects, curatedTotals, totalProjects } = generateFilteredProjects(arrayFilters, projects);

  const searchFilterState = {
    searchValue: search,
    filterValue: arrayFilters,
  };

  const projectListProps = {
    routes: props.routes,
    isFiltering: !!search || !!arrayFilters.length,
  };

  const options: SelectOption[] = filterOptions.map(x => ({ id: x.id, value: x.label }));

  return (
    <Page
      pageTitle={<PageTitle />}
      backLink={
        config.ssoEnabled ? (
          // Note: This has been added as the content component cannot infer the static string length of min 4 characters
          <a className="govuk-back-link" href={`${config.ifsRoot}/dashboard-selection`}>
            <Content value={x => x.pages.projectsDashboard.backToDashboard} />
          </a>
        ) : (
          <BackLink route={props.routes.home.getLink({})}>
            <Content value={x => x.pages.projectsDashboard.backToHomepage} />
          </BackLink>
        )
      }
      isActive
    >
      <BroadcastsViewer broadcasts={broadcasts} />

      <H2>
        <Content value={x => x.pages.projectsDashboard.projectsTitle} />
      </H2>

      {displaySearch && (
        <Form.Form
          data={searchFilterState}
          qa="projectSearch"
          isGet
          onSubmit={noop}
          onChange={model =>
            onSearch({
              search: model.searchValue,
              arrayFilters,
            })
          }
        >
          <Form.Fieldset>
            <Form.Search
              width="one-half"
              hint={x => x.pages.projectsDashboard.searchHint}
              label={x => x.pages.projectsDashboard.searchLabel}
              labelBold
              name="search"
              value={x => x.searchValue}
              update={(x, v) => (x.searchValue = v?.substring(0, 100) ?? "")}
            />
          </Form.Fieldset>

          <Form.Fieldset heading={getContent(x => x.pages.projectsDashboard.filterOptions.title)}>
            <Form.Checkboxes
              hint={getContent(x => x.pages.projectsDashboard.filterOptions.hint)}
              name="arrayFilters"
              options={options}
              value={() =>
                arrayFilters.length ? options.filter(x => arrayFilters.includes(x.id as FilterOptions)) : null
              }
              update={(_, selectOptions) => {
                const latestFilters = selectOptions?.map(x => x.id) as FilterOptions[];
                setFilters(latestFilters);
              }}
            />
          </Form.Fieldset>

          {isServer && <Form.Submit>{getContent(x => x.pages.projectsDashboard.filterOptions.search)}</Form.Submit>}
        </Form.Form>
      )}

      <DashboardProjectCount curatedTotals={curatedTotals} totalProjectCount={totalProjects} />

      <Section qa="pending-and-open-projects">
        <DashboardProjectList
          {...projectListProps}
          projects={[...curatedProjects.pending, ...curatedProjects.open]}
          errorType="live"
        />
      </Section>

      <Accordion>
        <AccordionItem title="Upcoming" qa="upcoming-projects">
          <DashboardProjectList errorType="upcoming" {...projectListProps} projects={curatedProjects.upcoming} />
        </AccordionItem>

        <AccordionItem title="Archived" qa="archived-projects">
          <DashboardProjectList errorType="archived" {...projectListProps} projects={curatedProjects.archived} />
        </AccordionItem>
      </Accordion>
    </Page>
  );
};

export const ProjectDashboardRoute = defineRoute({
  routeName: "projectDashboard",
  routePath: "/projects/dashboard",
  routePathWithQuery: "/projects/dashboard?:search",
  container: ProjectDashboardPage,
  getParams: () => ({}),
  getTitle: x => x.content.getTitleCopy(x => x.pages.projectsDashboard.title),
});
