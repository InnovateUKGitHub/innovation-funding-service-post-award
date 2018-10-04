import { routeConfig } from "../../routing";
import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions/thunks";
import * as Dtos from "../../models";
import * as ACC from "../../components";
import { DateTime } from "luxon";
import { IEditorStore } from "../../redux/reducers/editorsReducer";
import { ClaimDtoValidator } from "../../validators/claimDtoValidator";
import { ClaimDto } from "../../models";
import { navigateTo, saveClaim, validateClaim } from "../../redux/actions/thunks";
import { ClaimForecastRoute, ClaimsDashboardRoute } from ".";
import { Result as ValidationResult } from "../../validators/common";
import { EditClaimLineItemsRoute } from "./editClaimLineItems";

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
    claimDetails: Pending<Dtos.ClaimDetailsDto[]>;
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
    claimDetails: Dtos.ClaimDetailsDto[];
}

export class PrepareComponent extends ContainerBase<Params, Data, Callbacks> {

    public render() {
        const combined = Pending.combine(
            this.props.project,
            this.props.partner,
            this.props.costCategories,
            this.props.claim,
            this.props.claimDetails,
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

    private renderContents(data: { project: Dtos.ProjectDto, partner: Dtos.PartnerDto, costCategories: Dtos.CostCategoryDto[], claim: Dtos.ClaimDto, claimDetails: Dtos.ClaimDetailsDto[] }, editor: IEditorStore<ClaimDto, ClaimDtoValidator>) {

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
                    {this.props.editor.error ? <ACC.ValidationMessage message={new ValidationResult(null, true, false, this.props.editor.error.details || this.props.editor.error, false)} /> : null}
                    <ACC.Claims.ClaimTable {...data} getLink={costCategoryId => EditClaimLineItemsRoute.getLink({partnerId: this.props.partnerId, projectId: this.props.projectId, periodId: this.props.periodId, costCategoryId})} />
                    <Form.Form data={editor.data} onChange={(dto) => this.props.onChange(this.props.partnerId, this.props.periodId, dto)} onSubmit={() => saveAndProgress()}>
                        <Form.Fieldset heading={() => commentsLabel}>
                            <Form.MultilineString label="" hint={commentsHint} name="comments" value={m => m.comments} update={(m, v) => m.comments = v} validation={editor.validator.comments} />
                        </Form.Fieldset>
                        <Form.Fieldset>
                            <Form.Submit>Review forcasts</Form.Submit>
                        </Form.Fieldset>
                        <Form.Fieldset>
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
    dispatch(navigateTo(ClaimForecastRoute.getLink({ projectId, partnerId, periodId })));
};

const goBack = (dispatch: any, projectId: string, partnerId: string, periodId: number) => {
    dispatch(navigateTo(ClaimsDashboardRoute.getLink({ projectId, partnerId })));
};

export const PrepareClaim = definition.connect({
    withData: (store, params) => ({
        project: Pending.create(store.data.project[params.projectId]),
        partner: Pending.create(store.data.partner[params.partnerId]),
        costCategories: Pending.create(store.data.costCategories.all),
        claim: Pending.create(store.data.claim[params.partnerId + "_" + params.periodId]),
        claimDetails: Pending.create(store.data.claimDetails[params.partnerId + "_" + params.periodId]),
        editor: getEditor(store.editors.claim[params.partnerId + "_" + params.periodId], Pending.create(store.data.claim[params.partnerId + "_" + params.periodId]))
    }),
    withCallbacks: (dispatch) => ({
        onChange: (partnerId, periodId, dto) => dispatch(validateClaim(partnerId, periodId, dto)),
        saveAndProgress: (dto, projectId, partnerId, periodId) => dispatch(saveClaim(partnerId, periodId, dto, () => progress(dispatch, projectId, partnerId, periodId))),
        saveAndReturn: (dto, projectId, partnerId, periodId) => dispatch(saveClaim(partnerId, periodId, dto, () => goBack(dispatch, projectId, partnerId, periodId)))
    })
});

export const PrepareClaimRoute = definition.route({
    routeName: "prepare-claim",
    routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId",
    getParams: (route) => ({ projectId: route.params.projectId, partnerId: route.params.partnerId, periodId: parseInt(route.params.periodId, 10) }),
    getLoadDataActions: (params) => [
        Actions.loadProject(params.projectId),
        Actions.loadPartner(params.partnerId),
        Actions.loadPatnersForProject(params.projectId),
        Actions.loadCostCategories(),
        Actions.loadClaim(params.partnerId, params.periodId),
        Actions.loadClaimDetailsForPartner(params.partnerId, params.periodId)
    ],
    container: PrepareClaim
});
