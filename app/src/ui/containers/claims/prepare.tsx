import * as Selectors from "../../redux/selectors";
import { routeConfig } from "../../routing";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import * as Dtos from "../../models";
import * as ACC from "../../components";
import React from "react";
import { DateTime } from "luxon";
import { IEditorStore } from "../../redux/reducers/editorsReducer";
import { ClaimDtoValidator } from "../../validators/claimDtoValidator";
import { ClaimDetailsSummaryDto, ClaimDto } from "../../models";
import { ClaimForecastRoute, ClaimsDashboardRoute } from ".";
import { EditClaimLineItemsRoute } from "./editClaimLineItems";
import { Result } from "../../validation/result";

interface Params {
    projectId: string;
    partnerId: string;
    periodId: number;
}

interface Data {
    project: Pending<Dtos.ProjectDto>;
    partner: Pending<Dtos.PartnerDto>;
    costCategories: Pending<Dtos.CostCategoryDto[]>;
    claim: Pending<Dtos.ClaimDto>;
    claimDetailsSummary: Pending<Dtos.ClaimDetailsSummaryDto[]>;
    editor: Pending<IEditorStore<Dtos.ClaimDto, ClaimDtoValidator>>;
}

interface Callbacks {
    onChange: (partnerId: string, periodId: number, dto: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: Dtos.CostCategoryDto[]) => void;
    saveAndProgress: (projectId: string, partnerId: string, periodId: number, dto: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: Dtos.CostCategoryDto[]) => void;
    saveAndReturn: (projectId: string, partnerId: string, periodId: number, dto: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: Dtos.CostCategoryDto[]) => void;
}

interface CombinedData {
    project: Dtos.ProjectDto;
    partner: Dtos.PartnerDto;
    costCategories: Dtos.CostCategoryDto[];
    claim: Dtos.ClaimDto;
    claimDetails: Dtos.ClaimDetailsSummaryDto[];
    editor: IEditorStore<Dtos.ClaimDto, ClaimDtoValidator>;
}

export class PrepareComponent extends ContainerBase<Params, Data, Callbacks> {

    public render() {
        const combined = Pending.combine(
            this.props.project,
            this.props.partner,
            this.props.costCategories,
            this.props.claim,
            this.props.claimDetailsSummary,
            this.props.editor,
            (project, partner, costCategories, claim, claimDetails, editor) => ({ project, partner, costCategories, claim, claimDetails, editor })
        );

        const Loader = ACC.TypedLoader<CombinedData>();
        return <Loader pending={combined} render={(data) => this.renderContents(data)} />;
    }

    private getClaimPeriodTitle(data: any) {
        if (data.project.claimFrequency === Dtos.ClaimFrequency.Monthly) {
            return `${data.partner.name} claim for P${data.claim.periodId} ${DateTime.fromJSDate(data.claim.periodStartDate).toFormat("MMMM yyyy")}`;
        }
        return `${data.partner.name} claim for P${data.claim.periodId} ${DateTime.fromJSDate(data.claim.periodStartDate).toFormat("MMMM")} to ${DateTime.fromJSDate(data.claim.periodEndDate).toFormat("MMMM yyyy")}`;
    }

    private saveAndProgress(dto: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: Dtos.CostCategoryDto[]) {
        this.props.saveAndProgress(this.props.projectId, this.props.partnerId, this.props.periodId, dto, details, costCategories);
    }

    private saveAndReturn(dto: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: Dtos.CostCategoryDto[]) {
        this.props.saveAndReturn(this.props.projectId, this.props.partnerId, this.props.periodId, dto, details, costCategories);
    }

    private onChange(dto: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: Dtos.CostCategoryDto[]) {
        this.props.onChange(this.props.partnerId, this.props.periodId, dto, details, costCategories);
    }

    private renderContents(data: CombinedData) {

        const title = this.getClaimPeriodTitle(data);
        const Form = ACC.TypedForm<Dtos.ClaimDto>();
        const commentsLabel = "Additional information (optional)";
        const commentsHint = "These comments will be seen by your Monitoring Officer when they review your claim.";

        return (
            <ACC.Page>
                <ACC.Section>
                    <ACC.BackLink route={routeConfig.claimsDashboard.getLink({ projectId: data.project.id, partnerId: data.partner.id })}>Claims dashboard</ACC.BackLink>
                </ACC.Section>
                <ACC.ValidationSummary validation={data.editor.validator} compressed={false} />
                <ACC.Projects.Title pageTitle="Claim" project={data.project} />
                <ACC.Claims.Navigation projectId={data.project.id} partnerId={data.partner.id} periodId={data.claim.periodId} currentRouteName={routeConfig.claimDetails.routeName} />
                <ACC.Section title={title}>
                    {/* TODO: Fix error display */}
                    {data.editor.error ? <ACC.ValidationMessage message={new Result(null, true, false, data.editor.error.details || data.editor.error, false)} /> : null}
                    <ACC.Claims.ClaimTable {...data} validation={data.editor.validator.claimDetails.results} getLink={costCategoryId => EditClaimLineItemsRoute.getLink({partnerId: this.props.partnerId, projectId: this.props.projectId, periodId: this.props.periodId, costCategoryId})} />
                    <Form.Form data={data.editor.data} onChange={(dto) => this.onChange(dto, data.claimDetails, data.costCategories)} onSubmit={() => this.saveAndProgress(data.editor.data, data.claimDetails, data.costCategories)}>
                        <Form.Fieldset heading={() => commentsLabel} qa="additional-info-form" headingQa="additional-info-heading">
                            <Form.MultilineString label="" hint={commentsHint} name="comments" value={m => m.comments} update={(m, v) => m.comments = v} validation={data.editor.validator.comments} qa="info-text-area"/>
                        </Form.Fieldset>
                        <Form.Fieldset qa="review-forecasts-button">
                            <Form.Submit>Review forecasts</Form.Submit>
                        </Form.Fieldset>
                        <Form.Fieldset qa="save-button">
                            <Form.Button name="return" onClick={() => this.saveAndReturn(data.editor.data, data.claimDetails, data.costCategories)}>Save and return to claim dashboard</Form.Button>
                        </Form.Fieldset>
                    </Form.Form>
                </ACC.Section>
            </ACC.Page>
        );
    }
}

const progress = (dispatch: any, projectId: string, partnerId: string, periodId: number) => {
    dispatch(Actions.navigateTo(ClaimForecastRoute.getLink({ projectId, partnerId, periodId })));
};

const goBack = (dispatch: any, projectId: string, partnerId: string, periodId: number) => {
    dispatch(Actions.navigateTo(ClaimsDashboardRoute.getLink({ projectId, partnerId })));
};

const definition = ReduxContainer.for<Params, Data, Callbacks>(PrepareComponent);

export const PrepareClaim = definition.connect({
  withData: (state, props): Data => ({
    project: Selectors.getProject(props.projectId).getPending(state),
    partner: Selectors.getPartner(props.partnerId).getPending(state),
    costCategories: Selectors.getCostCategories().getPending(state),
    claim: Selectors.getClaim(props.partnerId, props.periodId).getPending(state),
    claimDetailsSummary: Selectors.findClaimDetailsSummaryByPartnerAndPeriod(props.partnerId, props.periodId).getPending(state),
    editor: Selectors.getClaimEditor(props.partnerId, props.periodId).get(state, x => { x.status = "Draft"; })
  }),
  withCallbacks: (dispatch) => ({
    onChange: (partnerId, periodId, dto, details, costCategories) => dispatch(Actions.validateClaim(partnerId, periodId, dto, details, costCategories)),
    saveAndProgress: (projectId, partnerId, periodId, dto, details, costCategories) => dispatch(Actions.saveClaim(partnerId, periodId, dto, details, costCategories, () => progress(dispatch, projectId, partnerId, periodId))),
    saveAndReturn: (projectId, partnerId, periodId, dto, details, costCategories) => dispatch(Actions.saveClaim(partnerId, periodId, dto, details, costCategories, () => goBack(dispatch, projectId, partnerId, periodId)))
  })
});

export const PrepareClaimRoute = definition.route({
    routeName: "prepare-claim",
    routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId",
    getParams: (route) => ({ projectId: route.params.projectId, partnerId: route.params.partnerId, periodId: parseInt(route.params.periodId, 10) }),
    getLoadDataActions: (params) => [
        Actions.loadProject(params.projectId),
        Actions.loadPartner(params.partnerId),
        Actions.loadPartnersForProject(params.projectId),
        Actions.loadCostCategories(),
        Actions.loadClaim(params.partnerId, params.periodId),
        Actions.loadClaimDetailsSummaryForPartner(params.partnerId, params.periodId)
    ],
    container: PrepareClaim
});
