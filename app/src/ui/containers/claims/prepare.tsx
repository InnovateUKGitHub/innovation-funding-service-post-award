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
import {ClaimForecastRoute, ClaimsDashboardRoute} from ".";

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
    claimDetails: Pending<Dtos.ClaimCostDto[]>;
    editor: IEditorStore<Dtos.ClaimDto, ClaimDtoValidator>;
}

interface Callbacks {
    onChange: (claimId: string, dto: ClaimDto) => void;
    saveAndProgress: (dto: ClaimDto, projectId: string, partnerId: string, claimId: string) => void;
    saveAndReturn: (dto: ClaimDto, projectId: string, partnerId: string, claimId: string) => void;
}

interface CombinedData {
    project: Dtos.ProjectDto;
    partner: Dtos.PartnerDto;
    costCategories: Dtos.CostCategoryDto[];
    claim: Dtos.ClaimDto;
    claimDetails: Dtos.ClaimCostDto[];
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
            return `${data.partner.name} claim for ${data.claim.periodId} ${DateTime.fromJSDate(data.claim.periodStartDate).toFormat("MMMM yyyy")}`;
        }
        return `${data.partner.name} claim for ${data.claim.periodId} ${DateTime.fromJSDate(data.claim.periodStartDate).toFormat("MMMM")} to ${DateTime.fromJSDate(data.claim.periodEndDate).toFormat("MMMM yyyy")}`;
    }

    private renderContents(data: { project: Dtos.ProjectDto, partner: Dtos.PartnerDto, costCategories: Dtos.CostCategoryDto[], claim: Dtos.ClaimDto, claimDetails: Dtos.ClaimCostDto[] }, editor: IEditorStore<ClaimDto, ClaimDtoValidator>) {

        const title = this.getClaimPeriodTitle(data);
        const Form = ACC.TypedForm<Dtos.ClaimDto>();
        const commentsLabel = "Additional information (optional)";
        const commentsHint = "These comments will be seen by your Monitoring Officer when they review your claim.";

        const saveAndProgress = () => {
          this.props.saveAndProgress(this.props.editor.data, this.props.projectId, data.partner.id, data.claim.id);
        };

        const saveAndReturn = () => {
          this.props.saveAndReturn(this.props.editor.data, this.props.projectId, data.partner.id, data.claim.id);
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
                    <ACC.Claims.ClaimTable {...data} />
                    <Form.Form data={editor.data} onChange={(dto) => this.props.onChange(data.claim.id, dto)} onSubmit={() => saveAndProgress()}>
                        <Form.Fieldset>
                            <Form.MultilineString label={commentsLabel} hint={commentsHint} name="comments" value={m => m.comments} update={(m, v) => m.comments = v} validation={editor.validator.comments} />
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

const progress = (dispatch: any, projectId: string, partnerId: string) => {
  dispatch(navigateTo(ClaimForecastRoute.getLink({projectId, partnerId})));
};

const goBack = (dispatch: any, projectId: string, partnerId: string) => {
  dispatch(navigateTo(ClaimsDashboardRoute.getLink({projectId, partnerId})));
};

export const PrepareClaim = definition.connect({
    withData: (store, params) => ({
        project: Pending.create(store.data.project[params.projectId]),
        // todo: fix to be partner for the claim rather than fist partner in project
        partner: Pending.create(store.data.partners[params.projectId]).then(x => x![0]),
        costCategories: Pending.create(store.data.costCategories.all),
        claim: Pending.create(store.data.claim[params.periodId.toString()]), // ToDo: wire up partner id and period id
        claimDetails: Pending.create(store.data.claimDetails[params.partnerId + "_" + params.periodId]),
        editor: getEditor(store.editors.claim[params.partnerId + "_" + params.periodId], Pending.create(store.data.claim[params.partnerId + "_" + params.periodId]))
    }),
    withCallbacks: (dispatch) => ({
        onChange: (id, dto) => dispatch(validateClaim(id, dto)),
        saveAndProgress: (dto, projectId, claimId) => dispatch(saveClaim(claimId, dto, () => progress(dispatch, projectId, claimId))),
        saveAndReturn: (dto, projectId, partnerId, claimId) => dispatch(saveClaim(claimId, dto, () => goBack(dispatch, projectId, partnerId)))
    })
});

export const PrepareClaimRoute = definition.route({
    routeName: "prepare-claim",
    routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId",
    getParams: (route) => ({ projectId: route.params.projectId, partnerId: route.params.partnerId, periodId: parseInt(route.params.periodId, 10)}),
    getLoadDataActions: (params) => [
        Actions.loadProject(params.projectId),
        Actions.loadPatnersForProject(params.projectId),
        Actions.loadCostCategories(),
        Actions.loadClaim(params.periodId.toString()), // ToDo: wire up to partner id, period id
        Actions.loadClaimDetailsForPartner(params.partnerId, params.periodId)
    ],
    container: PrepareClaim
});
