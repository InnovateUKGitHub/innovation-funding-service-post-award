import * as ACC from "../../components";
import React from "react";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { ClaimLineItemsRoute } from "./claimLineItems";
import { ClaimsDashboardRoute } from "./dashboard";
import {
  ClaimDto,
  ClaimStatus,
  ClaimStatusChangeDto,
  ILinkInfo,
  PartnerDto,
  ProjectDto,
  ProjectRole,
} from "@framework/types";
import { AllClaimsDashboardRoute } from "./allClaimsDashboard";
import { SimpleString } from "../../components/renderers";
import { ForecastData, forecastDataLoadActions } from "./forecasts/common";

interface Params {
  projectId: string;
  partnerId: string;
  periodId: number;
}

interface Data {
  id: string;
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  costCategories: Pending<CostCategoryDto[]>;
  claim: Pending<ClaimDto>;
  costsSummaryForPeriod: Pending<CostsSummaryForPeriodDto[]>;
  iarDocument: Pending<DocumentSummaryDto | null>;
  standardOverheadRate: number;
  forecastData: Pending<ForecastData> | null;
  statusChanges: Pending<ClaimStatusChangeDto[]>;
}

interface CombinedData {
  project: ProjectDto;
  partner: PartnerDto;
  costCategories: CostCategoryDto[];
  claim: ClaimDto;
  claimDetails: CostsSummaryForPeriodDto[];
  iarDocument: DocumentSummaryDto | null;
}

export class ClaimsDetailsComponent extends ContainerBase<Params, Data, {}> {

  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      costCategories: this.props.costCategories,
      claim: this.props.claim,
      claimDetails: this.props.costsSummaryForPeriod,
      iarDocument: this.props.iarDocument
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private renderContents(data: CombinedData) {
    const isPmOrMo = (data.project.roles & (ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer)) !== ProjectRole.Unknown;
    const backLink = isPmOrMo ? AllClaimsDashboardRoute.getLink({ projectId: data.project.id }) : ClaimsDashboardRoute.getLink({ projectId: data.project.id, partnerId: data.partner.id });

    const tabs: ACC.HashTabItem[] = [
      { text: "Details", hash: "details", content: this.renderDetailsTab(data), default: true, qa: "ClaimDetailTab" },
      { text: "Log", hash: "log", content: this.renderLogsTab(), qa: "ClaimDetailLogTab" },
    ];

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={backLink}>Back to project</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={data.project} />}
        tabs={<ACC.HashTabs tabList={tabs} />}
      >
        <ACC.HashTabsContent tabList={tabs} />
      </ACC.Page>
    );
  }

  private renderDetailsTab(data: CombinedData) {
    return (
      <React.Fragment>
        {this.renderTableSection(data)}
        {this.renderIarSection(data.claim, data.project, data.partner, data.iarDocument)}
        {this.renderForecastSection(data)}
      </React.Fragment>
    );
  }

  private renderTableSection(data: CombinedData) {
    return (
      <ACC.Section title={this.getClaimPeriodTitle(data)}>
        {this.renderTable(data)}
      </ACC.Section>
    );
  }

  private renderTable(data: CombinedData) {
    const isFC = (data.partner.roles & ProjectRole.FinancialContact) === ProjectRole.FinancialContact;

    if (isFC) {
      return <ACC.Claims.ClaimTable getLink={x => this.getLink(x, data.project, data.partner)} standardOverheadRate={this.props.standardOverheadRate} {...data} />;
    }

    return <ACC.Claims.ClaimReviewTable getLink={x => this.getLink(x, data.project, data.partner)} standardOverheadRate={this.props.standardOverheadRate} {...data} />;
  }

  private getLink(costCategoryId: string, project: ProjectDto, partner: PartnerDto): ILinkInfo | null {
    // can only link if monitoring officer for project or, pm or fc at partner level
    // ie pm can not see other partners line items but can see own
    const isMo = !!(project.roles & ProjectRole.MonitoringOfficer);
    const isPartnerPM = !!(partner.roles & ProjectRole.ProjectManager);
    const isFC = !!(partner.roles & ProjectRole.FinancialContact);

    if (isMo || isPartnerPM || isFC) {
      return ClaimLineItemsRoute.getLink({ partnerId: this.props.partnerId, projectId: this.props.projectId, periodId: this.props.periodId, costCategoryId });
    }
    return null;
  }

  private getClaimPeriodTitle(data: CombinedData) {
    return <ACC.Claims.ClaimPeriodDate claim={data.claim} partner={data.partner} />;
  }

  private renderIarSection(claim: ClaimDto, project: ProjectDto, partner: PartnerDto, iarDocument?: DocumentSummaryDto | null) {
    if (!claim.isIarRequired || !claim.isApproved || !iarDocument) return null;

    if (!!(partner.roles & ProjectRole.FinancialContact) || !!(project.roles & ProjectRole.MonitoringOfficer)) {
      return (
        <ACC.Section qa="claim-iar" title={"Independent accountant's report"}>
          <ACC.DocumentSingle document={iarDocument} openNewWindow={true} />
        </ACC.Section>
      );
    }
    return <SimpleString>{iarDocument.fileName}</SimpleString>;
  }

  private renderForecastSection(data: CombinedData) {
    const isArchived = data.claim.status === ClaimStatus.PAID || data.claim.status === ClaimStatus.APPROVED;
    const isMO = data.project.roles & ProjectRole.MonitoringOfficer;

    if (!this.props.forecastData || (isArchived && isMO)) {
      return null;
    }

    return (
      <ACC.Section>
        <ACC.Accordion>
          <ACC.AccordionItem title="Forecast" qa="forecast-accordion">
            <ACC.Loader pending={this.props.forecastData} render={(x) => this.renderForecastTable(x)} />
          </ACC.AccordionItem>
        </ACC.Accordion>
      </ACC.Section>
    );
  }

  private renderForecastTable(forecastData: ForecastData) {
    return <ACC.Claims.ForecastTable data={forecastData} hideValidation={true} />;
  }

  private renderLogsTab() {
    return (
      <ACC.Loader
        pending={this.props.statusChanges}
        render={(statusChanges) => (
          <ACC.Section>
            <ACC.Logs qa="claim-status-change-table" data={statusChanges} />
          </ACC.Section>
        )}
      />
    );
  }
}

const definition = ReduxContainer.for<Params, Data, {}>(ClaimsDetailsComponent);

export const ClaimsDetails = definition.connect({
  withData: (state, props, auth) => {
    const isMoOrPM = auth.forProject(props.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
    const isFC = auth.forPartner(props.projectId, props.partnerId).hasRole(ProjectRole.FinancialContact);

    return {
      id: props.projectId,
      project: Selectors.getProject(props.projectId).getPending(state),
      partner: Selectors.getPartner(props.partnerId).getPending(state),
      costCategories: Selectors.getCostCategories().getPending(state),
      claim: Selectors.getClaim(props.partnerId, props.periodId).getPending(state),
      costsSummaryForPeriod: Selectors.getCostsSummaryForPeriod(props.partnerId, props.periodId).getPending(state),
      iarDocument: Selectors.getIarDocument(state, props.partnerId, props.periodId),
      standardOverheadRate: state.config.standardOverheadRate,
      statusChanges: Selectors.getClaimStatusChanges(props.projectId, props.partnerId, props.periodId).getPending(state),
      forecastData: isMoOrPM && !isFC ? Pending.combine({
        project: Selectors.getProject(props.projectId).getPending(state),
        partner: Selectors.getPartner(props.partnerId).getPending(state),
        claim: Selectors.getClaim(props.partnerId, props.periodId).getPending(state),
        claims: Selectors.findClaimsByPartner(props.partnerId).getPending(state),
        claimDetails: Selectors.findClaimDetailsByPartner(props.partnerId).getPending(state),
        forecastDetails: Selectors.findForecastDetailsByPartner(props.partnerId).getPending(state),
        golCosts: Selectors.findGolCostsByPartner(props.partnerId).getPending(state),
        costCategories: Selectors.getCostCategories().getPending(state),
      }) : null
    };
  },
  withCallbacks: () => ({})
});

export const ClaimsDetailsRoute = definition.route({
  routeName: "claimDetails",
  routePath: "/projects/:projectId/claims/:partnerId/details/:periodId",
  getParams: (route) => ({ projectId: route.params.projectId, partnerId: route.params.partnerId, periodId: parseInt(route.params.periodId, 10) }),
  getLoadDataActions: (params, auth) => {
    const isMoOrPM = auth.forProject(params.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
    const isFC = auth.forPartner(params.projectId, params.partnerId).hasRole(ProjectRole.FinancialContact);

    const standardActions = [
      Actions.loadProject(params.projectId),
      Actions.loadPartnersForProject(params.projectId),
      Actions.loadPartner(params.partnerId),
      Actions.loadCostCategories(),
      Actions.loadClaim(params.partnerId, params.periodId),
      Actions.loadCostsSummaryForPeriod(params.projectId, params.partnerId, params.periodId),
      Actions.loadIarDocuments(params.projectId, params.partnerId, params.periodId),
      Actions.loadClaimStatusChanges(params.projectId, params.partnerId, params.periodId)
    ];

    const forecastActions = isMoOrPM && !isFC ? forecastDataLoadActions(params) : [];

    return [...standardActions, ...forecastActions];
  },
  accessControl: (auth, params) => auth.forProject(params.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager) || auth.forPartner(params.projectId, params.partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: (store, params) => {
    return {
      displayTitle: "Claim",
      htmlTitle: "View claim"
    };
  },
  container: ClaimsDetails
});
