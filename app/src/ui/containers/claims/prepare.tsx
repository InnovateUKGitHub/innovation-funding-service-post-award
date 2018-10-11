import { routeConfig } from "../../routing";
import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import * as Dtos from "../../models";
import * as ACC from "../../components";
import * as Selectors from "../../redux/selectors";
import { DateTime } from "luxon";
import { IEditorStore } from "../../redux/reducers/editorsReducer";
import { ClaimDtoValidator } from "../../validators/claimDtoValidator";
import { ClaimDto } from "../../models";
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
    editor: IEditorStore<Dtos.ClaimDto, ClaimDtoValidator>;
}

interface Callbacks {
    onChange: (partnerId: string, periodId: number, dto: ClaimDto) => void;
    saveAndProgress: (dto: ClaimDto, projectId: string, partnerId: string, periodId: number) => void;
    saveAndReturn: (dto: ClaimDto, projectId: string, partnerId: string, periodId: number) => void;
}

interface CombinedData {
    project: Dtos.ProjectDto;
    partner: Dtos.PartnerDto;
    costCategories: Dtos.CostCategoryDto[];
    claim: Dtos.ClaimDto;
    claimDetails: Dtos.ClaimDetailsSummaryDto[];
}

export class PrepareComponent extends ContainerBase<Params, Data, Callbacks> {

    public render() {
        const combined = Pending.combine(
            this.props.project,
            this.props.partner,
            this.props.costCategories,
            this.props.claim,
            this.props.claimDetailsSummary,
            (project, partner, costCategories, claim, claimDetails) => ({ project, partner, costCategories, claim, claimDetails })
        );

        const Loader = ACC.TypedLoader<CombinedData>();
        return <Loader pending={combined} render={(data) => this.renderContents(data, this.props.editor)} />;
    }

    private getClaimPeriodTitle(data: any) {
        if (data.project.claimFrequency === Dtos.ClaimFrequency.Monthly) {
            return `${data.partner.name} claim for P${data.claim.periodId} ${DateTime.fromJSDate(data.claim.periodStartDate).toFormat("MMMM yyyy")}`;
        }
        return `${data.partner.name} claim for P${data.claim.periodId} ${DateTime.fromJSDate(data.claim.periodStartDate).toFormat("MMMM")} to ${DateTime.fromJSDate(data.claim.periodEndDate).toFormat("MMMM yyyy")}`;
    }

    private renderContents(data: { project: Dtos.ProjectDto, partner: Dtos.PartnerDto, costCategories: Dtos.CostCategoryDto[], claim: Dtos.ClaimDto, claimDetails: Dtos.ClaimDetailsSummaryDto[] }, editor: IEditorStore<ClaimDto, ClaimDtoValidator>) {

        const title = this.getClaimPeriodTitle(data);
        const Form = ACC.TypedForm<Dtos.ClaimDto>();
        const commentsLabel = "Additional information (optional)";
        const commentsHint = "These comments will be seen by your Monitoring Officer when they review your claim.";

        const saveAndProgress = () => {
            this.props.saveAndProgress(this.props.editor.data, this.props.projectId, this.props.partnerId, this.props.periodId);
        };

        const saveAndReturn = () => {
            this.props.saveAndReturn(this.props.editor.data, this.props.projectId, this.props.partnerId, this.props.periodId);
        };

        return (
            <ACC.Page>
                <ACC.Section>
                    <ACC.BackLink route={routeConfig.claimsDashboard.getLink({ projectId: data.project.id, partnerId: data.partner.id })}>Claims dashboard</ACC.BackLink>
                </ACC.Section>
                <ACC.Projects.Title pageTitle="Claim" project={data.project} />
                <ACC.Claims.Navigation projectId={data.project.id} partnerId={data.partner.id} periodId={data.claim.periodId} currentRouteName={routeConfig.claimDetails.routeName} />
                <ACC.Section title={title}>
                    <ACC.ValidationMessage message={editor.validator.comments} />
                    {/* TODO: Fix error display */}
                    {this.props.editor.error ? <ACC.ValidationMessage message={new Result(null, true, false, this.props.editor.error.details || this.props.editor.error, false)} /> : null}
                    <ACC.Claims.ClaimTable {...data} getLink={costCategoryId => EditClaimLineItemsRoute.getLink({partnerId: this.props.partnerId, projectId: this.props.projectId, periodId: this.props.periodId, costCategoryId})} />
                    <Form.Form data={editor.data} onChange={(dto) => this.props.onChange(this.props.partnerId, this.props.periodId, dto)} onSubmit={() => saveAndProgress()}>
                        <Form.Fieldset heading={() => commentsLabel} qa="additional-info-form" headingQa="additional-info-heading">
                            <Form.MultilineString label="" hint={commentsHint} name="comments" value={m => m.comments} update={(m, v) => m.comments = v} validation={editor.validator.comments} qa="info-text-area"/>
                        </Form.Fieldset>
                        <Form.Fieldset qa="review-forecasts-button">
                            <Form.Submit >Review forecasts</Form.Submit>
                        </Form.Fieldset>
                        <Form.Fieldset qa="save-button">
                            <Form.Button name="return" onClick={() => saveAndReturn()}>Save and return to claim dashboard</Form.Button>
                        </Form.Fieldset>
                    </Form.Form>
                </ACC.Section>
            </ACC.Page>
        );
    }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(PrepareComponent);
const getEditor = (editor: IEditorStore<Dtos.ClaimDto, ClaimDtoValidator>, original: Pending<Dtos.ClaimDto>) => {
    if (editor) {
        return editor;
    }
    return original.then(x => {
        const clone = JSON.parse(JSON.stringify(x!)) as Dtos.ClaimDto;
        const updatedClaimDto = { ...clone, status: "Draft" };
        return {
            data: updatedClaimDto,
            validator: new ClaimDtoValidator(x!, false),
            error: null
        };
    }).data!;
};

const progress = (dispatch: any, projectId: string, partnerId: string, periodId: number) => {
    dispatch(Actions.navigateTo(ClaimForecastRoute.getLink({ projectId, partnerId, periodId })));
};

const goBack = (dispatch: any, projectId: string, partnerId: string, periodId: number) => {
    dispatch(Actions.navigateTo(ClaimsDashboardRoute.getLink({ projectId, partnerId })));
};

export const PrepareClaim = definition.connect({
  withData: (state, props) => ({
    project: Selectors.getProject(props.projectId).getPending(state),
    partner: Selectors.getPartner(props.partnerId).getPending(state),
    costCategories: Selectors.getCostCategories().getPending(state),
    claim: Selectors.getClaim(props.partnerId, props.periodId).getPending(state),
    claimDetailsSummary: Selectors.findClaimDetailsSummaryByPartnerAndPeriod(props.partnerId, props.periodId).getPending(state),
    editor: getEditor(state.editors.claim[props.partnerId + "_" + props.periodId], Pending.create(state.data.claim[props.partnerId + "_" + props.periodId]))
  }),
  withCallbacks: (dispatch) => ({
    onChange: (partnerId, periodId, dto) => dispatch(Actions.validateClaim(partnerId, periodId, dto)),
    saveAndProgress: (dto, projectId, partnerId, periodId) => dispatch(Actions.saveClaim(partnerId, periodId, dto, () => progress(dispatch, projectId, partnerId, periodId))),
    saveAndReturn: (dto, projectId, partnerId, periodId) => dispatch(Actions.saveClaim(partnerId, periodId, dto, () => goBack(dispatch, projectId, partnerId, periodId)))
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
