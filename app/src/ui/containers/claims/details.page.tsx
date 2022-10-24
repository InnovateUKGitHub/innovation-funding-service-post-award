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
import * as ACC from "@ui/components";
import { ForecastData } from "@ui/components/claims";
import { Pending } from "../../../shared/pending";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";

interface Params {
  projectId: string;
  partnerId: string;
  periodId: number;
}

interface Data {
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  costCategories: Pending<CostCategoryDto[]>;
  claim: Pending<ClaimDto>;
  documents: Pending<DocumentSummaryDto[]>;
  costsSummaryForPeriod: Pending<CostsSummaryForPeriodDto[]>;
  forecastData: Pending<ACC.Claims.ForecastData> | null;
  statusChanges: Pending<ClaimStatusChangeDto[]>;
}

interface CombinedData {
  project: ProjectDto;
  partner: PartnerDto;
  costCategories: CostCategoryDto[];
  claim: ClaimDto;
  documents: DocumentSummaryDto[];
  claimDetails: CostsSummaryForPeriodDto[];
}

export class ClaimsDetailsComponent extends ContainerBase<Params, Data, {}> {
  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      costCategories: this.props.costCategories,
      claim: this.props.claim,
      documents: this.props.documents,
      claimDetails: this.props.costsSummaryForPeriod,
    });

    return <ACC.PageLoader pending={combined} render={data => this.renderContents(data)} />;
  }

  private renderContents(data: CombinedData) {
    const { isPmOrMo } = getAuthRoles(data.project.roles);
    const backLink = isPmOrMo
      ? this.props.routes.allClaimsDashboard.getLink({ projectId: data.project.id })
      : this.props.routes.claimsDashboard.getLink({ projectId: data.project.id, partnerId: data.partner.id });

    return (
      <ACC.Page
        backLink={
          <ACC.BackLink route={backLink}>
            <ACC.Content value={x => x.pages.claimDetails.backLink} />
          </ACC.BackLink>
        }
        pageTitle={<ACC.Projects.Title {...data.project} />}
        partner={data.partner}
      >
        {data.claim.isFinalClaim && (
          <ACC.ValidationMessage messageType="info" message={x => x.claimsMessages.finalClaim} />
        )}
        {data.partner.isWithdrawn && (
          <ACC.ValidationMessage messageType="info" message={x => x.claimsMessages.partnerWithdrawn} />
        )}
        {this.renderPageSubtitle(data)}
        {this.renderCostsAndGrantSummary(data)}
        {this.renderTableSection(data)}
        {this.renderAccordionSection(data)}
        {this.renderCommentsFromFC(data.project, data.claim)}
      </ACC.Page>
    );
  }

  private renderCostsAndGrantSummary(data: CombinedData) {
    const { isFc } = getAuthRoles(data.project.roles);
    if (!isFc || !data.claim || !data.claim.isApproved) {
      return null;
    }

    const ClaimSummaryDetails = ACC.TypedDetails<ClaimDto>();

    return (
      <ACC.Section>
        <ACC.SectionPanel qa="claims-summary">
          <ACC.DualDetails>
            <ClaimSummaryDetails.Details
              title={<ACC.Content value={x => x.pages.claimDetails.costsAndGrantSummaryTitle} />}
              data={data.claim}
              qa="claim-costs-summary"
            >
              <ClaimSummaryDetails.Currency
                label={<ACC.Content value={x => x.claimsLabels.costsClaimed} />}
                qa="costs-claimed"
                value={x => x.totalCostsSubmitted}
              />
              <ClaimSummaryDetails.Currency
                label={<ACC.Content value={x => x.claimsLabels.costsApproved} />}
                qa="costs-approved"
                value={x => x.totalCostsApproved}
              />
              <ClaimSummaryDetails.Currency
                label={<ACC.Content value={x => x.claimsLabels.costsDeferred} />}
                qa="costs-deferred"
                value={x => x.totalDeferredAmount}
              />
            </ClaimSummaryDetails.Details>

            <ClaimSummaryDetails.Details data={data.claim} qa="claim-grant-summary">
              <ClaimSummaryDetails.Currency
                label={<ACC.Content value={x => x.claimsLabels.totalGrantPaid} />}
                qa="total-grant-paid"
                value={x => x.periodCostsToBePaid}
              />
            </ClaimSummaryDetails.Details>
          </ACC.DualDetails>
        </ACC.SectionPanel>
      </ACC.Section>
    );
  }

  private renderPageSubtitle(data: CombinedData) {
    return <ACC.Section title={this.getClaimPeriodTitle(data)} />;
  }

  private renderTableSection(data: CombinedData) {
    return <ACC.Section>{this.renderTable(data)}</ACC.Section>;
  }

  private renderAccordionSection(data: CombinedData) {
    const isArchived =
      data.claim.status === ClaimStatus.PAID ||
      data.claim.status === ClaimStatus.APPROVED ||
      ClaimStatus.PAYMENT_REQUESTED;
    const { isMo } = getAuthRoles(data.project.roles);
    const showForecast = this.props.forecastData && !(isArchived && isMo);
    return (
      <ACC.Section>
        <ACC.Accordion>
          {showForecast && this.renderForecastItem(this.props.forecastData as Pending<ForecastData>)}

          {this.renderLogsItem()}

          {isMo && (
            <ACC.AccordionItem qa="documents-list-accordion" title={x => x.claimsLabels.documentListTitle}>
              <ACC.DocumentView hideHeader qa="claim-detail-documents" documents={data.documents} />
            </ACC.AccordionItem>
          )}
        </ACC.Accordion>
      </ACC.Section>
    );
  }

  private renderCommentsFromFC(project: ProjectDto, claim: ClaimDto) {
    const { isMo } = getAuthRoles(project.roles);
    if (isMo && (claim.status === ClaimStatus.DRAFT || claim.status === ClaimStatus.MO_QUERIED) && claim.comments) {
      return (
        <ACC.Section title={x => x.pages.claimDetails.sectionTitleComments} qa="additionalComments">
          <ACC.Renderers.SimpleString multiline>{claim.comments}</ACC.Renderers.SimpleString>
        </ACC.Section>
      );
    }

    return null;
  }

  private renderTable(data: CombinedData) {
    const { isFc } = getAuthRoles(data.partner.roles);

    return isFc ? (
      <ACC.Claims.ClaimTable
        getLink={x => this.getLink(x, data.project, data.partner)}
        standardOverheadRate={this.props.config.options.standardOverheadRate}
        {...data}
      />
    ) : (
      <ACC.Claims.ClaimReviewTable
        getLink={x => this.getLink(x, data.project, data.partner)}
        standardOverheadRate={this.props.config.options.standardOverheadRate}
        {...data}
      />
    );
  }

  private getLink(costCategoryId: string, project: ProjectDto, partner: PartnerDto): ILinkInfo | null {
    // can only link if monitoring officer for project or, pm or fc at partner level
    // ie pm can not see other partners line items but can see own
    const { isMo: isProjectMo } = getAuthRoles(project.roles);
    const { isPm: isPartnerPm, isFc: isPartnerFc } = getAuthRoles(partner.roles);
    const partnerHasCorrectRole = isProjectMo || isPartnerPm || isPartnerFc;

    if (!partnerHasCorrectRole) return null;

    return this.props.routes.claimLineItems.getLink({
      partnerId: this.props.partnerId,
      projectId: this.props.projectId,
      periodId: this.props.periodId,
      costCategoryId,
    });
  }

  private getClaimPeriodTitle(data: CombinedData) {
    return <ACC.Claims.ClaimPeriodDate claim={data.claim} partner={data.partner} />;
  }

  private renderForecastItem(pendingForecastData: Pending<ACC.Claims.ForecastData>) {
    return (
      <ACC.AccordionItem title={x => x.claimsLabels.accordionTitleForecast} qa="forecast-accordion">
        <ACC.Loader
          pending={pendingForecastData}
          render={forecastData => <ACC.Claims.ForecastTable data={forecastData} hideValidation />}
        />
      </ACC.AccordionItem>
    );
  }

  private renderLogsItem() {
    return (
      <ACC.AccordionItem title={x => x.claimsLabels.accordionTitleClaimLog} qa="claim-status-change-accordion">
        {/* Keeping logs inside loader because accordion defaults to closed*/}
        <ACC.Loader
          pending={this.props.statusChanges}
          render={statusChanges => <ACC.Logs qa="claim-status-change-table" data={statusChanges} />}
        />
      </ACC.AccordionItem>
    );
  }
}

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

  const forecastData: Pending<ACC.Claims.ForecastData> | null =
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

  return (
    <ClaimsDetailsComponent
      project={project}
      partner={partner}
      costCategories={costCategories}
      claim={claim}
      documents={stores.claimDocuments.getClaimDocuments(props.projectId, props.partnerId, props.periodId)}
      forecastData={forecastData}
      statusChanges={stores.claims.getStatusChanges(props.projectId, props.partnerId, props.periodId)}
      costsSummaryForPeriod={stores.costsSummaries.getForPeriod(props.projectId, props.partnerId, props.periodId)}
      {...props}
    />
  );
};

export const ClaimsDetailsRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "claimDetails",
  routePath: "/projects/:projectId/claims/:partnerId/details/:periodId",
  container: ClaimsDetailsContainer,
  getParams: route => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    periodId: parseInt(route.params.periodId, 10),
  }),
  accessControl: (auth, params) =>
    auth.forProject(params.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager) ||
    auth.forPartner(params.projectId, params.partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.claimDetails.title),
});
