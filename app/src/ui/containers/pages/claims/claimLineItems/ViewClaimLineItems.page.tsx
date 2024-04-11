import { ProjectRole } from "@framework/constants/project";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { AwardRateOverridesMessage } from "@ui/components/atomicDesign/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage.withFragment";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page.withFragment";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { Helmet } from "react-helmet";
import { ClaimLineItemNavigationArrows } from "./ClaimLineItemNavigationArrows";
import { getParams, useBackLink, useClaimLineItemsData } from "./ClaimLineItems.logic";
import type { ClaimLineItemsParams } from "./ClaimLineItems.logic";
import { SupportingDocumentsSection } from "./SupportingDocumentsSection";
import { ClaimLineItemsTable } from "./ClaimLineItemsTable";
import { ClaimLineItemClaimDetailComments } from "./ClaimLineItemClaimDetailComments";

type ViewClaimLineItemsProps = ClaimLineItemsParams & {
  mode: "details" | "review";
};

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

  const pageTitleHeading =
    mode === "details"
      ? getContent(x => x.pages.claimLineItems.htmlViewTitle({ title: currentCostCategory.name.toLowerCase() }))
      : mode === "review"
      ? getContent(x => x.pages.claimLineItems.htmlReviewTitle({ title: currentCostCategory.name.toLowerCase() }))
      : "";

  return (
    <Page
      backLink={<BackLink route={backLink}>{getContent(x => x.pages.claimLineItems.backLink)}</BackLink>}
      fragmentRef={fragmentRef}
      heading={currentCostCategory.name}
    >
      {/* Update the HTML title to include the costCategoryName */}
      <Helmet>
        <title>{pageTitleHeading}</title>
      </Helmet>

      <AwardRateOverridesMessage currentCostCategoryId={costCategoryId} currentPeriod={periodId} />

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
