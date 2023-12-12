import { ProjectRole } from "@framework/constants/project";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { AwardRateOverridesMessage } from "@ui/components/atomicDesign/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage.withFragment";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Page } from "@ui/components/bjss/Page/page";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { Helmet } from "react-helmet";
import { ClaimLineItemNavigationArrows } from "./ClaimLineItemNavigationArrows";
import { ClaimLineItemsParams, getParams, useBackLink, useClaimLineItemsData } from "./ClaimLineItems.logic";
import { SupportingDocumentsSection } from "./SupportingDocumentsSection";
import { ClaimLineItemsTable } from "./ClaimLineItemsTable";
import { ClaimLineItemClaimDetailComments } from "./ClaimLineItemClaimDetailComments";

interface ViewClaimLineItemsProps extends ClaimLineItemsParams {
  mode: "details" | "review";
}

const ViewClaimLineItemsPage = ({
  projectId,
  partnerId,
  periodId,
  costCategoryId,
  mode,
}: BaseProps & ViewClaimLineItemsProps) => {
  const { getContent } = useContent();
  const backLink = useBackLink({ projectId, partnerId, periodId }, mode);
  const {
    project,
    partner,
    claimDetails,
    currentCostCategory,
    costCategories,
    forecastDetail,
    documents,
    fragmentRef,
  } = useClaimLineItemsData(projectId, partnerId, periodId, costCategoryId);

  return (
    <Page
      backLink={<BackLink route={backLink}>{getContent(x => x.pages.claimLineItems.backLink)}</BackLink>}
      pageTitle={
        <Title title={project.title} projectNumber={project.projectNumber} heading={currentCostCategory.name} />
      }
      fragmentRef={fragmentRef}
    >
      {/* Update the HTML title to include the costCategoryName */}
      <Helmet>
        {mode === "details" && (
          <title>{getContent(x => x.pages.claimLineItems.htmlViewTitle({ title: currentCostCategory.name }))}</title>
        )}
        {mode === "review" && (
          <title>{getContent(x => x.pages.claimLineItems.htmlReviewTitle({ title: currentCostCategory.name }))}</title>
        )}
      </Helmet>

      <AwardRateOverridesMessage />

      <Section>
        <ClaimLineItemsTable
          lineItems={claimDetails.lineItems}
          forecastDetail={forecastDetail}
          differenceRow={true}
          boldTotalCosts={true}
        />
      </Section>

      <SupportingDocumentsSection mode={mode} project={project} documents={documents} />
      <ClaimLineItemClaimDetailComments claimDetails={claimDetails} />

      <ClaimLineItemNavigationArrows
        mode={mode}
        project={project}
        partner={partner}
        costCategories={costCategories}
        params={{ projectId, partnerId, periodId, costCategoryId }}
      />
    </Page>
  );
};

const ClaimLineItemsRoute = defineRoute<ClaimLineItemsParams>({
  allowRouteInActiveAccess: true,
  routeName: "claimLineItemsView",
  routePath: "/projects/:projectId/claims/:partnerId/details/:periodId/costs/:costCategoryId",
  container: props => <ViewClaimLineItemsPage {...props} mode="details" />,
  getParams: route => getParams(route),
});

const ReviewClaimLineItemsRoute = defineRoute<ClaimLineItemsParams>({
  routeName: "claimLineItemsReview",
  routePath: "/projects/:projectId/claims/:partnerId/review/:periodId/costs/:costCategoryId",
  container: props => <ViewClaimLineItemsPage {...props} mode="review" />,
  getParams: route => getParams(route),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager) ||
    auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer),
});

export { ClaimLineItemsParams, ClaimLineItemsRoute, ReviewClaimLineItemsRoute };
