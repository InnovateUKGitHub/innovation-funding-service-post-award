import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
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
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { H2 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/context/routesProvider";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { useForm } from "react-hook-form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { SearchInput } from "@ui/components/bjss/inputs/searchInput";
import { Checkbox, CheckboxList } from "@ui/components/atomicDesign/atoms/form/Checkbox/Checkbox";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";

interface ProjectDashboardParams {
  search?: string | number;
  arrayFilters?: FilterOptions[];
}

interface IProjectDashboardForm {
  searchValue: string;
  arrayFilters: FilterOptions[];
}

const ProjectDashboardPage = ({ config, search: searchQuery, ...props }: ProjectDashboardParams & BaseProps) => {
  const navigate = useNavigate();
  const { getContent } = useContent();
  const routes = useRoutes();

  const preloadedSearch = searchQuery ? String(searchQuery) : "";

  const { projects, unfilteredObjects, displaySearch, broadcasts } = useProjectsDashboardData(searchQuery, config);
  const onSearch = useCallback((searchParams: { search?: string | number; arrayFilters: FilterOptions[] }) => {
    const routeInfo = routes.projectDashboard.getLink(searchParams);
    return navigate(routeInfo.path, { replace: true });
  }, []);

  // Note: 'unfilteredObjects' is needed as the filter options are derived from projects, when filtered there could be nothing to search.
  const filterOptions = useAvailableProjectFilters(unfilteredObjects);
  const search = searchQuery === undefined ? "" : "" + searchQuery;

  const { isServer } = useMountedState();

  // const previousInputs = useServerInput<IProjectDashboardForm>();

  const { register, watch } = useForm<IProjectDashboardForm>({
    defaultValues: { arrayFilters: props.arrayFilters ?? [], searchValue: preloadedSearch },
  });

  const arrayFilters = watch("arrayFilters");
  const { curatedProjects, curatedTotals, totalProjects } = generateFilteredProjects(arrayFilters, projects);

  const projectListProps = {
    routes: props.routes,
    isFiltering: !!search || !!arrayFilters.length,
  };

  const [searchInputValue, setSearchInputValue] = useState<string>(preloadedSearch);

  useEffect(() => {
    onSearch({ search: searchInputValue, arrayFilters });
  }, [searchInputValue, arrayFilters, onSearch]);

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
        <Form data-qa="projectSearch" method="GET">
          <Fieldset>
            <FormGroup>
              <Label bold htmlFor="search">
                {getContent(x => x.pages.projectsDashboard.searchLabel)}
              </Label>
              <Hint id="hint-for-search">{getContent(x => x.pages.projectsDashboard.searchHint)}</Hint>
              <SearchInput
                ariaDescribedBy="hint-for-search"
                width="one-half"
                name="search"
                value={searchInputValue}
                onChange={searchValue => setSearchInputValue(searchValue?.trim() || "")}
                maxLength={100}
              />
            </FormGroup>
          </Fieldset>

          <Fieldset>
            <FormGroup>
              <Legend>{getContent(x => x.pages.projectsDashboard.filterOptions.title)}</Legend>
              <CheckboxList name="arrayFilters" register={register} id="arrayFilters">
                {filterOptions.map(x => (
                  <Checkbox
                    key={x.id}
                    label={x.label}
                    id={x.id}
                    value={x.id}
                    defaultChecked={(props.arrayFilters ?? []).includes(x.id)}
                  />
                ))}
              </CheckboxList>
            </FormGroup>
          </Fieldset>

          {isServer && (
            <Button type="submit" name="button_default">
              {getContent(x => x.pages.projectsDashboard.filterOptions.search)}
            </Button>
          )}
        </Form>
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
