import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import * as ACC from "../../components";
import { ClaimLineItemsRoute } from "./claimLineItems";
import { ClaimsDashboardRoute } from "./dashboard";
import { ClaimDto, PartnerDto, ProjectDto, ProjectRole } from "../../../types";
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
}

export class ClaimsDetailsComponent extends ContainerBase<Params, Data, {}> {

    public render() {
        const combined = Pending.combine({
          project: this.props.project,
          partner: this.props.partner,
          costCategories: this.props.costCategories,
          claim: this.props.claim,
          claimDetails: this.props.claimDetailsSummary,
        });

        return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
    }

    private getClaimPeriodTitle(data: CombinedData) {
      return <ACC.Claims.ClaimPeriodDate claim={data.claim} partner={data.partner} />;
    }

    private renderIarSection(claim: ClaimDto, project: ProjectDto, partner: PartnerDto, iarDocument?: DocumentSummaryDto | null) {
      if (!claim.isIarRequired || !claim.isApproved || !iarDocument) return null;

      if(this.hasRoleOnPartner(project, partner)) {
        return (
          <ACC.Section qa="claim-iar" title={"Independent accountant's report"}>
            <ACC.DocumentSingle document={iarDocument} openNewWindow={true}/>
          </ACC.Section>
        );
      }
      return <SimpleString>{iarDocument.fileName}</SimpleString>;
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
                    <ACC.Claims.ClaimTable
                      {...data}
                      standardOverheadRate={this.props.standardOverheadRate}
                      getLink={costCategoryId => this.getClaimLineItemLink(costCategoryId, data)}
                    />
                </ACC.Section>
                { this.renderIarSection(data.claim, data.project, data.partner, this.props.iarDocument.data) }
                {/*
                This was started but not required fot the story.... will be finished in a future story
                <Details.Details data={data}>
                    <Details.MultilineString label="Addition information" value={x => x.claim.comments || "N/A"}/>
                </Details.Details>
                */}
            </ACC.Page>
        );
    }

    private getClaimLineItemLink(costCategoryId: string, data: CombinedData) {
      return this.hasRoleOnPartner(data.project, data.partner)
        ? ClaimLineItemsRoute.getLink({partnerId: this.props.partnerId, projectId: this.props.projectId, periodId: this.props.periodId, costCategoryId})
        : null;
    }

    private hasRoleOnPartner(project: ProjectDto, partner: PartnerDto): boolean {
      const isFC = !!(partner.roles & ProjectRole.FinancialContact);
      const isMO = !!(project.roles & ProjectRole.MonitoringOfficer);
      const pmOnParticipant = !!(partner.roles & ProjectRole.ProjectManager);
      return isFC || isMO || pmOnParticipant;
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
    container: ClaimsDetails
});
