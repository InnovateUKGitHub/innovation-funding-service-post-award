import { ClaimStatus } from "@framework/constants/claimStatus";
import { ProjectRole } from "@framework/constants/project";
import { ClaimDto } from "@framework/dtos/claimDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { CostsSummaryForPeriodDto } from "@framework/dtos/costsSummaryForPeriodDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { getAuthRoles } from "@framework/types/authorisation";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Accordion } from "@ui/components/atomicDesign/atoms/Accordion/Accordion";
import { AccordionItem } from "@ui/components/atomicDesign/atoms/Accordion/AccordionItem";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { SectionPanel } from "@ui/components/atomicDesign/molecules/SectionPanel/sectionPanel";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { ClaimPeriodDate } from "@ui/components/atomicDesign/organisms/claims/ClaimPeriodDate/claimPeriodDate";
import { ClaimReviewTable } from "@ui/components/atomicDesign/organisms/claims/ClaimReviewTable/claimReviewTable";
import { ClaimTable } from "@ui/components/atomicDesign/organisms/claims/ClaimTable/claimTable";
import { ForecastTable } from "@ui/components/atomicDesign/organisms/claims/ForecastTable/forecastTable.standalone";
import { DocumentView } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { Page } from "@ui/components/bjss/Page/page";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title.withFragment";
import { TypedDetails, DualDetails } from "@ui/components/bjss/details/details";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useClaimDetailsPageData } from "./claimDetails.logic";
import { Logs } from "@ui/components/atomicDesign/molecules/Logs/logs.standalone";

interface Params {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
}

interface ClaimData {
  project: Pick<
    ProjectDto,
    | "claimedPercentage"
    | "claimFrequency"
    | "claimFrequencyName"
    | "claimsToReview"
    | "claimsWithParticipant"
    | "competitionType"
    | "costsClaimedToDate"
    | "id"
    | "numberOfPeriods"
    | "periodId"
    | "projectNumber"
    | "roles"
    | "title"
  >;
  partner: Pick<
    PartnerDto,
    "id" | "partnerStatus" | "isWithdrawn" | "isLead" | "name" | "roles" | "organisationType" | "overheadRate"
  >;
  costCategories: Pick<CostCategoryDto, "id" | "name" | "competitionType" | "organisationType">[];
  claim: Pick<
    ClaimDto,
    | "comments"
    | "isApproved"
    | "isFinalClaim"
    | "periodCostsToBePaid"
    | "periodEndDate"
    | "periodId"
    | "periodStartDate"
    | "status"
    | "totalCostsApproved"
    | "totalCostsSubmitted"
    | "totalDeferredAmount"
  >;
  documents: Pick<
    DocumentSummaryDto,
    "id" | "dateCreated" | "fileSize" | "fileName" | "link" | "uploadedBy" | "isOwner"
  >[];

  // strangely misnamed dto field that the claims table expects
  claimDetails: Pick<
    CostsSummaryForPeriodDto,
    | "costsClaimedToDate"
    | "costCategoryId"
    | "costsClaimedThisPeriod"
    | "forecastThisPeriod"
    | "offerTotal"
    | "remainingOfferCosts"
  >[];
  fragmentRef?: unknown;
}

export const ClaimsDetailsPage = (props: Params & BaseProps) => {
  const data = useClaimDetailsPageData(props.projectId, props.partnerId, props.periodId);
  const { isPmOrMo, isFc } = getAuthRoles(data.project.roles);
  const backLink = isPmOrMo
    ? props.routes.allClaimsDashboard.getLink({ projectId: props.projectId })
    : props.routes.claimsDashboard.getLink({ projectId: props.projectId, partnerId: props.partnerId });

  return (
    <Page
      backLink={
        <BackLink route={backLink}>
          <Content value={x => x.pages.claimDetails.backLink} />
        </BackLink>
      }
      pageTitle={<Title />}
      fragmentRef={data?.fragmentRef}
      projectId={props.projectId}
      partnerId={props.partnerId}
    >
      {/* If the partner is not withdrawn, and it's the final claim, show message. */}
      {!data.partner.isWithdrawn && data.claim?.isFinalClaim && (
        <ValidationMessage messageType="info" message={x => x.claimsMessages.finalClaim} />
      )}
      <Section title={<ClaimPeriodDate claim={data.claim} partner={data.partner} />} />

      <Section>
        <CostsAndGrantSummary claim={data.claim} project={data.project} />
      </Section>

      <Section>
        {isFc ? (
          <ClaimTable getLink={x => getLink(x, data.project, data.partner, props.periodId, props.routes)} {...data} />
        ) : (
          <ClaimReviewTable
            getLink={x => getLink(x, data.project, data.partner, props.periodId, props.routes)}
            {...data}
          />
        )}
      </Section>

      <Section>
        <AccordionSection
          data={data}
          projectId={props.projectId}
          partnerId={props.partnerId}
          periodId={props.periodId}
        />
      </Section>

      <CommentsFromFC project={data.project} claim={data.claim} />
    </Page>
  );
};

const ClaimSummaryDetails =
  TypedDetails<
    Pick<ClaimDto, "totalCostsSubmitted" | "totalCostsApproved" | "totalDeferredAmount" | "periodCostsToBePaid">
  >();

const CostsAndGrantSummary = ({
  claim,
  project,
}: {
  claim: Pick<
    ClaimDto,
    "isApproved" | "totalCostsSubmitted" | "totalCostsApproved" | "totalDeferredAmount" | "periodCostsToBePaid"
  >;
  project: Pick<ProjectDto, "roles">;
}) => {
  const { isFc } = getAuthRoles(project.roles);
  if (!isFc || !claim || !claim?.isApproved) {
    return null;
  }

  return (
    <SectionPanel qa="claims-summary">
      <DualDetails>
        <ClaimSummaryDetails.Details
          title={<Content value={x => x.pages.claimDetails.costsAndGrantSummaryTitle} />}
          data={claim}
          qa="claim-costs-summary"
        >
          <ClaimSummaryDetails.Currency
            label={<Content value={x => x.claimsLabels.costsClaimed} />}
            qa="costs-claimed"
            value={x => x.totalCostsSubmitted}
          />
          <ClaimSummaryDetails.Currency
            label={<Content value={x => x.claimsLabels.costsApproved} />}
            qa="costs-approved"
            value={x => x.totalCostsApproved}
          />
          <ClaimSummaryDetails.Currency
            label={<Content value={x => x.claimsLabels.costsDeferred} />}
            qa="costs-deferred"
            value={x => x.totalDeferredAmount}
          />
        </ClaimSummaryDetails.Details>

        <ClaimSummaryDetails.Details data={claim} qa="claim-grant-summary">
          <ClaimSummaryDetails.Currency
            label={<Content value={x => x.claimsLabels.totalGrantPaid} />}
            qa="total-grant-paid"
            value={x => x.periodCostsToBePaid}
          />
        </ClaimSummaryDetails.Details>
      </DualDetails>
    </SectionPanel>
  );
};

const AccordionSection = ({
  data,
  projectId,
  partnerId,
  periodId,
}: {
  data: {
    claim: Pick<ClaimData["claim"], "status">;
    project: Pick<ClaimData["project"], "roles">;
    documents: ClaimData["documents"];
  };
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
}) => {
  const isArchived =
    data.claim.status === ClaimStatus.PAID ||
    data.claim.status === ClaimStatus.APPROVED ||
    ClaimStatus.PAYMENT_REQUESTED;
  const { isMo } = getAuthRoles(data.project.roles);
  const showForecast = !(isArchived && isMo);
  return (
    <Accordion>
      {showForecast && (
        <AccordionItem title={x => x.claimsLabels.accordionTitleForecast} qa="forecast-accordion">
          <ForecastTable projectId={projectId} partnerId={partnerId} periodId={periodId} hideValidation />
        </AccordionItem>
      )}

      <AccordionItem title={x => x.claimsLabels.accordionTitleClaimLog} qa="claim-status-change-accordion">
        <Logs projectId={projectId} partnerId={partnerId} periodId={periodId} qa="claim-status-change-table" />
      </AccordionItem>

      {isMo && (
        <AccordionItem qa="documents-list-accordion" title={x => x.claimsLabels.documentListTitle}>
          <DocumentView hideHeader qa="claim-detail-documents" documents={data.documents} />
        </AccordionItem>
      )}
    </Accordion>
  );
};

const CommentsFromFC = ({
  project,
  claim,
}: {
  project: Pick<ProjectDto, "roles">;
  claim: Pick<ClaimDto, "comments" | "status">;
}) => {
  const { isMo } = getAuthRoles(project.roles);
  if (isMo && (claim.status === ClaimStatus.DRAFT || claim.status === ClaimStatus.MO_QUERIED) && claim.comments) {
    return (
      <Section title={x => x.pages.claimDetails.sectionTitleComments} qa="additionalComments">
        <SimpleString multiline>{claim.comments}</SimpleString>
      </Section>
    );
  }

  return null;
};

const getLink = (
  costCategoryId: CostCategoryId,
  project: Pick<ProjectDto, "id" | "roles">,
  partner: Pick<PartnerDto, "id" | "roles">,
  periodId: PeriodId,
  routes: BaseProps["routes"],
): ILinkInfo | null => {
  // can only link if monitoring officer for project or, pm or fc at partner level
  // ie pm can not see other partners line items but can see own
  const { isMo: isProjectMo } = getAuthRoles(project.roles);
  const { isPm: isPartnerPm, isFc: isPartnerFc } = getAuthRoles(partner.roles);
  const partnerHasCorrectRole = isProjectMo || isPartnerPm || isPartnerFc;

  if (!partnerHasCorrectRole) return null;

  return routes.claimLineItems.getLink({
    partnerId: partner.id,
    projectId: project.id,
    periodId: periodId,
    costCategoryId,
  });
};

export const ClaimsDetailsRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "claimDetails",
  routePath: "/projects/:projectId/claims/:partnerId/details/:periodId",
  container: ClaimsDetailsPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
    periodId: parseInt(route.params.periodId, 10) as PeriodId,
  }),
  accessControl: (auth, params) =>
    auth.forProject(params.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager) ||
    auth.forPartner(params.projectId, params.partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.claimDetails.title),
});
