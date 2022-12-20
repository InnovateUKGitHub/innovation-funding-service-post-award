import { useProjectRolesFragment } from "@gql/hooks/useProjectRolesQuery";
import {
  Accordion,
  AccordionItem,
  BackLink,
  Content,
  createTypedForm,
  H2,
  Page,
  Section,
  SelectOption,
} from "@ui/components";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { HomeRoute } from "@ui/containers/developer/home.page";
import { useMountedState } from "@ui/features";
import { PageTitle } from "@ui/features/page-title";
import { noop } from "@ui/helpers/noop";
import { useEffect, useState } from "react";
import { useLazyLoadQuery } from "react-relay";
import { useNavigate } from "react-router-dom";
import { graphql } from "relay-hooks";
import { BroadcastsViewer } from "../Broadcast/BroadcastsViewer";
import { getFilteredProjects, getFilterOptions } from "./dashboard.logic";
import {
  DashboardProjectList,
  getPartnerOnProject,
  getProjectSection,
  IDashboardProjectData,
} from "./DashboardProject";
import { DashboardProjectCount } from "./DashboardProjectCount";
import { DashboardProjectDashboardQuery } from "./__generated__/DashboardProjectDashboardQuery.graphql";

const query = graphql`
  query DashboardProjectDashboardQuery {
    accProjectCustom(
      orderBy: [
        { accClaimsForReviewCustom: DESC_NULLS_LAST }
        { accPcRsForReviewCustom: DESC_NULLS_LAST }
        { accPcRsUnderQueryCustom: DESC_NULLS_LAST }
        { accProjectTitleCustom: ASC_NULLS_LAST }
      ]
    ) {
      ...ProjectSortableFragment
      id
      accProjectNumberCustom
      accProjectTitleCustom
      accLeadParticipantNameCustom
      accLeadParticipantIdCustom
      accNumberofPeriodsCustom
      accCurrentPeriodNumberCustom
      accStartDateCustom
      accEndDateCustom
      accClaimsForReviewCustom
      accPcRsForReviewCustom
      accPcRsUnderQueryCustom
      accClaimsOverdueCustom
      accClaimsUnderQueryCustom
      accNumberOfOpenClaimsCustom
      accProjectStatusCustom
      accCurrentPeriodStartDateCustom
      accCurrentPeriodEndDateCustom
      accProjectParticipantsProjectReference {
        accAccountIdCustom {
          name
          id
        }
        id
        accNewForecastNeededCustom
        accParticipantStatusCustom
        accTrackingClaimsCustom
        accOpenClaimStatusCustom
      }
    }
    clientConfig {
      ifsRoot
      ssoEnabled
      options {
        numberOfProjectsToSearch
      }
    }
  }
`;

type filterKeys =
  | "PCRS_QUERIED"
  | "CLAIMS_TO_REVIEW"
  | "PCRS_TO_REVIEW"
  | "SETUP_REQUIRED"
  | "CLAIMS_TO_SUBMIT"
  | "CLAIMS_TO_UPLOAD_REPORT"
  | "CLAIMS_TO_RESPOND";

interface ProjectDashboardParams {
  search?: string | number;
  arrayFilters?: filterKeys[];
}

const Form = createTypedForm<null>();

/**
 * Project Dashboard Page
 *
 * @author Leondro Lio <leondro.lio@iuk.ukri.org>
 * @returns Project Dashboard Page
 */
const ProjectDashboardContainer = (props: ProjectDashboardParams & BaseProps) => {
  const roles = useProjectRolesFragment();
  const data = useLazyLoadQuery<DashboardProjectDashboardQuery>(query, {});

  const { isServer } = useMountedState();

  // Filtering options
  // Automatically initialises to the search parameter values
  const [searchQuery, setSearchQuery] = useState<string>(String(props.search ?? "").trim());
  const [pcrsQueried, setPcrsQueried] = useState<boolean>(props.arrayFilters?.includes("PCRS_QUERIED") ?? false);
  const [claimsToReview, setClaimsToReview] = useState<boolean>(
    props.arrayFilters?.includes("CLAIMS_TO_REVIEW") ?? false,
  );
  const [pcrsToReview, setPcrsToReview] = useState<boolean>(props.arrayFilters?.includes("PCRS_TO_REVIEW") ?? false);
  const [setupRequired, setSetupRequired] = useState<boolean>(props.arrayFilters?.includes("SETUP_REQUIRED") ?? false);
  const [claimsToSubmit, setClaimsToSubmit] = useState<boolean>(
    props.arrayFilters?.includes("CLAIMS_TO_SUBMIT") ?? false,
  );
  const [claimsToUploadReport, setClaimsToUploadReport] = useState<boolean>(
    props.arrayFilters?.includes("CLAIMS_TO_UPLOAD_REPORT") ?? false,
  );
  const [claimsToRespond, setClaimsToRespond] = useState<boolean>(
    props.arrayFilters?.includes("CLAIMS_TO_RESPOND") ?? false,
  );

  const navigate = useNavigate();

  useEffect(() => {
    // When the search filters are adjusted...
    // Collate the params
    const arrayFilters: filterKeys[] = [];
    if (pcrsQueried) arrayFilters.push("PCRS_QUERIED");
    if (claimsToReview) arrayFilters.push("CLAIMS_TO_REVIEW");
    if (pcrsToReview) arrayFilters.push("PCRS_TO_REVIEW");
    if (setupRequired) arrayFilters.push("SETUP_REQUIRED");
    if (claimsToSubmit) arrayFilters.push("CLAIMS_TO_SUBMIT");
    if (claimsToUploadReport) arrayFilters.push("CLAIMS_TO_UPLOAD_REPORT");
    if (claimsToRespond) arrayFilters.push("CLAIMS_TO_RESPOND");

    const params: ProjectDashboardParams = {};

    // Add to URL search bar if any values exist
    if (arrayFilters.length || searchQuery.length) {
      params.arrayFilters = arrayFilters;
      params.search = searchQuery;
    }

    // Create the new path
    const { path } = ProjectDashboardRoute.getLink(params);

    // Replace the current path with the same path, but with new search parameters.
    // Use "replace" to avoid filling up the user's back button.
    navigate(path, {
      replace: true,
    });
  }, [
    searchQuery,
    pcrsQueried,
    claimsToReview,
    pcrsToReview,
    setupRequired,
    claimsToSubmit,
    claimsToUploadReport,
    claimsToRespond,
    navigate,
  ]);

  const allProjects = [...data.accProjectCustom]
    .map(project => {
      const partner = getPartnerOnProject({ project, roles });
      const projectSection = getProjectSection({ project, partner, roles });

      const data: IDashboardProjectData = {
        project,
        partner,
        roles,
        projectSection,
      };

      return data;
    })
    .sort((a, b) => {
      // Bubble "pending" to the top.
      // PCR/Claim sorting is performed in the GraphQL query.
      if (a.projectSection === "pending" && b.projectSection !== "pending") return -1;
      if (b.projectSection === "pending") return 1;
      return 0;
    });

  // Only display the search bar if there's enough projects.
  const displaySearch = data.accProjectCustom.length >= data.clientConfig.options.numberOfProjectsToSearch;

  const { currentProjects, upcomingProjects, archivedProjects, openAndAwaitingProjects, pendingProjects, isFiltering } =
    getFilteredProjects({
      searchQuery,
      pcrsQueried,
      claimsToReview,
      pcrsToReview,
      setupRequired,
      claimsToSubmit,
      claimsToUploadReport,
      claimsToRespond,
      projects: allProjects,
      roles,
    });

  return (
    <Page
      pageTitle={<PageTitle />}
      backLink={
        data.clientConfig.ssoEnabled ? (
          // Note: This has been added as the content component cannot infer the static string length of min 4 characters
          <a className="govuk-back-link" href={`${data.clientConfig.ifsRoot}/dashboard-selection`}>
            <Content value={x => x.pages.projectsDashboard.backToDashboard} />
          </a>
        ) : (
          <BackLink route={HomeRoute.getLink({})}>
            <Content value={x => x.pages.projectsDashboard.backToHomepage} />
          </BackLink>
        )
      }
    >
      <BroadcastsViewer />

      <H2>
        <Content value={x => x.pages.projectsDashboard.projectsTitle} />
      </H2>

      {displaySearch && (
        <Form.Form data={null} qa="projectSearch" onSubmit={noop} isGet>
          <Form.Fieldset heading={x => x.pages.projectsDashboard.searchTitle}>
            <Form.Search
              width="one-half"
              hint={x => x.pages.projectsDashboard.searchHint}
              label={x => x.pages.projectsDashboard.searchLabel}
              labelHidden
              name="search"
              value={() => searchQuery}
              update={(_, v) => setSearchQuery(v || "")}
            />
          </Form.Fieldset>

          <Form.Fieldset heading="Filter options">
            <Form.Checkboxes
              hint="You can select more than one."
              name="arrayFilters"
              options={getFilterOptions({ projects: allProjects, roles })}
              value={() => {
                const options: SelectOption[] = [];

                if (pcrsQueried) options.push({ id: "PCRS_QUERIED", value: "PCR's being queried" });
                if (claimsToReview) options.push({ id: "CLAIMS_TO_REVIEW", value: "Claims to review" });
                if (pcrsToReview) options.push({ id: "PCRS_TO_REVIEW", value: "PCR's to review" });
                if (setupRequired) options.push({ id: "SETUP_REQUIRED", value: "Not completed setup" });
                if (claimsToSubmit) options.push({ id: "CLAIMS_TO_SUBMIT", value: "Claims to submit" });
                if (claimsToUploadReport)
                  options.push({ id: "CLAIMS_TO_UPLOAD_REPORT", value: "Claims missing documents" });
                if (claimsToRespond) options.push({ id: "CLAIMS_TO_RESPOND", value: "Claims needing responses" });

                return options;
              }}
              update={(_, selectOptions) => {
                setPcrsQueried(!!selectOptions?.some(x => x.id === "PCRS_QUERIED"));
                setClaimsToReview(!!selectOptions?.some(x => x.id === "CLAIMS_TO_REVIEW"));
                setPcrsToReview(!!selectOptions?.some(x => x.id === "PCRS_TO_REVIEW"));
                setSetupRequired(!!selectOptions?.some(x => x.id === "SETUP_REQUIRED"));
                setClaimsToSubmit(!!selectOptions?.some(x => x.id === "CLAIMS_TO_SUBMIT"));
                setClaimsToUploadReport(!!selectOptions?.some(x => x.id === "CLAIMS_TO_UPLOAD_REPORT"));
                setClaimsToRespond(!!selectOptions?.some(x => x.id === "CLAIMS_TO_RESPOND"));
              }}
            />
          </Form.Fieldset>

          {isServer && <Form.Submit>Search projects</Form.Submit>}
        </Form.Form>
      )}

      <DashboardProjectCount
        curatedTotals={{
          archived: archivedProjects.length,
          open: openAndAwaitingProjects.length,
          upcoming: upcomingProjects.length,
          pending: pendingProjects.length,
        }}
      />

      <Section qa="pending-and-open-projects">
        <DashboardProjectList
          isFiltering={isFiltering}
          displaySection="live"
          projectsData={currentProjects}
          roles={roles}
        />
      </Section>

      <Accordion>
        <AccordionItem title="Upcoming" qa="upcoming-projects">
          <DashboardProjectList
            isFiltering={isFiltering}
            displaySection="upcoming"
            projectsData={upcomingProjects}
            roles={roles}
          />
        </AccordionItem>

        <AccordionItem title="Archived" qa="archived-projects">
          <DashboardProjectList
            isFiltering={isFiltering}
            displaySection="archived"
            projectsData={archivedProjects}
            roles={roles}
          />
        </AccordionItem>
      </Accordion>
    </Page>
  );
};

export const ProjectDashboardRoute = defineRoute({
  routeName: "projectDashboard",
  routePath: "/projects/dashboard",
  routePathWithQuery: "/projects/dashboard?:search&:arrayFilters",
  container: ProjectDashboardContainer,
  getParams: () => ({}),
  getTitle: x => x.content.getTitleCopy(x => x.pages.projectsDashboard.title),
});
