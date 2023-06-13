import {
  ClaimDto,
  ClaimStatus,
  ClaimStatusChangeDto,
  CostsSummaryForPeriodDto,
  DocumentSummaryDto,
  getAuthRoles,
  ILinkInfo,
  PartnerDto,
  ProjectDto,
  ProjectRole,
} from "@framework/types";
import { useStores } from "@ui/redux";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import {
  Page,
  BackLink,
  Section,
  Content,
  Projects,
  ValidationMessage,
  TypedDetails,
  SectionPanel,
  DualDetails,
  Accordion,
  AccordionItem,
  DocumentView,
  Renderers,
  PageLoader,
  Loader,
  Logs,
} from "@ui/components";
import { Pending } from "../../../shared/pending";
import { BaseProps, defineRoute } from "../containerBase";
import {
  ClaimPeriodDate,
  ClaimTable,
  ClaimReviewTable,
  ForecastTable,
  ForecastDataForTableLayout,
} from "@ui/components/claims";

interface Params {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
}

interface ClaimData {
  project: Pick<ProjectDto, "roles" | "id" | "projectNumber" | "title" | "competitionType">;
  partner: Pick<PartnerDto, "id" | "partnerStatus" | "isWithdrawn" | "isLead" | "name" | "roles" | "organisationType">;
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

  forecastData: Pending<ForecastDataForTableLayout> | null;
  statusChanges: Pending<Pick<ClaimStatusChangeDto, "newStatusLabel" | "createdBy" | "createdDate" | "comments">[]>;

  claimDetails: Pick<
    CostsSummaryForPeriodDto,
    | "costsClaimedToDate"
    | "costCategoryId"
    | "costsClaimedThisPeriod"
    | "forecastThisPeriod"
    | "offerTotal"
    | "remainingOfferCosts"
  >[];
}

export const ClaimsDetailsComponent = (props: Params & BaseProps & ClaimData) => {
  const { project, partner, claim, forecastData, statusChanges } = props;

  const data = props;
  const { isPmOrMo } = getAuthRoles(project.roles);
  const backLink = isPmOrMo
    ? props.routes.allClaimsDashboard.getLink({ projectId: project.id })
    : props.routes.claimsDashboard.getLink({ projectId: project.id, partnerId: partner.id });

  return (
    <Page
      backLink={
        <BackLink route={backLink}>
          <Content value={x => x.pages.claimDetails.backLink} />
        </BackLink>
      }
      pageTitle={<Projects.Title title={project.title} projectNumber={project.projectNumber} />}
      partnerStatus={partner.partnerStatus}
    >
      {/* If the partner is not withdrawn, and it's the final claim, show message. */}
      {!partner.isWithdrawn && claim.isFinalClaim && (
        <ValidationMessage messageType="info" message={x => x.claimsMessages.finalClaim} />
      )}
      <Section title={<ClaimPeriodDate claim={claim} partner={partner} />} />

      <Section>
        <CostsAndGrantSummary claim={claim} project={project} />
      </Section>

      <Section>
        <ClaimDetailsTable periodId={props.periodId} data={data} />
      </Section>

      <Section>
        <AccordionSection data={data} forecastData={forecastData} statusChanges={statusChanges} />
      </Section>

      <CommentsFromFC project={project} claim={claim} />
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
  forecastData,
  statusChanges,
}: {
  data: {
    claim: Pick<ClaimData["claim"], "status">;
    project: Pick<ClaimData["project"], "roles">;
    documents: ClaimData["documents"];
  };
  forecastData: ClaimData["forecastData"];
  statusChanges: ClaimData["statusChanges"];
}) => {
  const isArchived =
    data.claim.status === ClaimStatus.PAID ||
    data.claim.status === ClaimStatus.APPROVED ||
    ClaimStatus.PAYMENT_REQUESTED;
  const { isMo } = getAuthRoles(data.project.roles);
  const showForecast = forecastData && !(isArchived && isMo);
  return (
    <Accordion>
      {showForecast && <ForecastItem pendingForecastData={forecastData} />}

      <LogsItem statusChanges={statusChanges} />

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
        <Renderers.SimpleString multiline>{claim.comments}</Renderers.SimpleString>
      </Section>
    );
  }

  return null;
};

const ClaimDetailsTable = ({ data, periodId }: { data: ClaimData & BaseProps; periodId: PeriodId }) => {
  const { isFc } = getAuthRoles(data.partner.roles);

  return isFc ? (
    <ClaimTable getLink={x => getLink(x, data.project, data.partner, periodId, data.routes)} {...data} />
  ) : (
    <ClaimReviewTable getLink={x => getLink(x, data.project, data.partner, periodId, data.routes)} {...data} />
  );
};

const getLink = (
  costCategoryId: string,
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

const ForecastItem = ({ pendingForecastData }: { pendingForecastData: ClaimData["forecastData"] }) => {
  if (!pendingForecastData) return null;
  return (
    <AccordionItem title={x => x.claimsLabels.accordionTitleForecast} qa="forecast-accordion">
      <Loader
        pending={pendingForecastData}
        render={forecastData => <ForecastTable data={forecastData} hideValidation />}
      />
    </AccordionItem>
  );
};

const LogsItem = ({ statusChanges }: { statusChanges: ClaimData["statusChanges"] }) => {
  return (
    <AccordionItem title={x => x.claimsLabels.accordionTitleClaimLog} qa="claim-status-change-accordion">
      {/* Keeping logs inside loader because accordion defaults to closed*/}
      <Loader
        pending={statusChanges}
        render={statusChanges => <Logs qa="claim-status-change-table" data={statusChanges} />}
      />
    </AccordionItem>
  );
};

const ClaimsDetailsContainer = (props: Params & BaseProps) => {
  const stores = useStores();

  const auth = stores.users.getCurrentUserAuthorisation();
  const isMoOrPM = auth
    .forProject(props.projectId)
    .hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
  const isFC = auth.forPartner(props.projectId, props.partnerId).hasRole(ProjectRole.FinancialContact);

  const project = stores.projects.getById(props.projectId);
  const partner = stores.partners.getById(props.partnerId);
  const costCategories = stores.costCategories.getAllFiltered(props.partnerId);
  const claim = stores.claims.get(props.partnerId, props.periodId);

  const forecastData: ClaimData["forecastData"] | null =
    isMoOrPM && !isFC
      ? Pending.combine({
          project,
          partner,
          claim,
          claims: stores.claims.getAllClaimsForPartner(props.partnerId),
          claimDetails: stores.claimDetails.getAllByPartner(props.partnerId),
          forecastDetails: stores.forecastDetails.getAllByPartner(props.partnerId),
          golCosts: stores.forecastGolCosts.getAllByPartner(props.partnerId),
          costCategories,
        })
      : null;

  const combined = Pending.combine({
    project,
    partner,
    costCategories,
    claim,
    documents: stores.claimDocuments.getClaimDocuments(props.projectId, props.partnerId, props.periodId),
    claimDetails: stores.costsSummaries.getForPeriod(props.projectId, props.partnerId, props.periodId),
  });

  const statusChanges: ClaimData["statusChanges"] = stores.claims.getStatusChanges(
    props.projectId,
    props.partnerId,
    props.periodId,
  );
  return (
    <PageLoader
      pending={combined}
      render={data => (
        <ClaimsDetailsComponent statusChanges={statusChanges} forecastData={forecastData} {...data} {...props} />
      )}
    />
  );
};

export const ClaimsDetailsRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "claimDetails",
  routePath: "/projects/:projectId/claims/:partnerId/details/:periodId",
  container: ClaimsDetailsContainer,
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
