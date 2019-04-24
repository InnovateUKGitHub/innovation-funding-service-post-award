import * as ACC from "../../components";
import React from "react";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { ClaimLineItemsRoute } from "./claimLineItems";
import { ClaimsDashboardRoute } from "./dashboard";
import { ClaimDto, ILinkInfo, PartnerDto, ProjectDto, ProjectRole } from "../../../types";
import { AllClaimsDashboardRoute } from "./allClaimsDashboard";
import { SimpleString } from "../../components/renderers";

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
  claimDetailsSummary: Pending<ClaimDetailsSummaryDto[]>;
  iarDocument: Pending<DocumentSummaryDto | null>;
  standardOverheadRate: number;
}

interface CombinedData {
  project: ProjectDto;
  partner: PartnerDto;
  costCategories: CostCategoryDto[];
  claim: ClaimDto;
  claimDetails: ClaimDetailsSummaryDto[];
  iarDocument: DocumentSummaryDto | null;
}

export class ClaimsDetailsComponent extends ContainerBase<Params, Data, {}> {

  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      costCategories: this.props.costCategories,
      claim: this.props.claim,
      claimDetails: this.props.claimDetailsSummary,
      iarDocument: this.props.iarDocument
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private renderContents(data: CombinedData) {
    const isPmOrMo = (data.project.roles & (ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer)) !== ProjectRole.Unknown;
    const backLink = isPmOrMo ? AllClaimsDashboardRoute.getLink({ projectId: data.project.id }) : ClaimsDashboardRoute.getLink({ projectId: data.project.id, partnerId: data.partner.id });

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={backLink}>Back to project</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title pageTitle="Review claim" project={data.project} />}
        tabs={<ACC.Claims.Navigation projectId={data.project.id} partnerId={data.partner.id} periodId={data.claim.periodId} currentRouteName={ClaimsDetailsRoute.routeName} />}
      >
        <ACC.Section title={this.getClaimPeriodTitle(data)}>
          {this.renderTable(data)}
        </ACC.Section>
        {this.renderIarSection(data.claim, data.project, data.partner, data.iarDocument)}
      </ACC.Page>
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

}

const definition = ReduxContainer.for<Params, Data, {}>(ClaimsDetailsComponent);

export const ClaimsDetails = definition.connect({
  withData: (state, props) => ({
    id: props.projectId,
    project: Selectors.getProject(props.projectId).getPending(state),
    partner: Selectors.getPartner(props.partnerId).getPending(state),
    costCategories: Selectors.getCostCategories().getPending(state),
    claim: Selectors.getClaim(props.partnerId, props.periodId).getPending(state),
    claimDetailsSummary: Selectors.findClaimDetailsSummaryByPartnerAndPeriod(props.partnerId, props.periodId).getPending(state),
    iarDocument: Selectors.getIarDocument(state, props.partnerId, props.periodId),
    standardOverheadRate: state.config.standardOverheadRate
  }),
  withCallbacks: () => ({})
});

export const ClaimsDetailsRoute = definition.route({
  routeName: "claimDetails",
  routePath: "/projects/:projectId/claims/:partnerId/details/:periodId",
  getParams: (route) => ({ projectId: route.params.projectId, partnerId: route.params.partnerId, periodId: parseInt(route.params.periodId, 10) }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPartnersForProject(params.projectId),
    Actions.loadPartner(params.partnerId),
    Actions.loadCostCategories(),
    Actions.loadClaim(params.partnerId, params.periodId),
    Actions.loadClaimDetailsSummaryForPartner(params.projectId, params.partnerId, params.periodId),
    Actions.loadIarDocuments(params.partnerId, params.periodId)
  ],
  accessControl: (auth, params) => auth.forProject(params.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager) || auth.forPartner(params.projectId, params.partnerId).hasRole(ProjectRole.FinancialContact),
  container: ClaimsDetails
});
