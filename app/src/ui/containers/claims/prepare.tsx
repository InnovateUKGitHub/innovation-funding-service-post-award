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
import { updateEditorAction } from "../../redux/actions/editorActions";
import { navigateTo, saveClaim, validateClaim } from "../../redux/actions/thunks";
import { ClaimsDashboardRoute, ClaimsDetailsRoute } from ".";

interface Params {
    projectId: string;
    claimId: string;
}

interface Data {
    project: Pending<Dtos.ProjectDto>;
    partner: Pending<Dtos.PartnerDto>;
    costCategories: Pending<Dtos.CostCategoryDto[]>;
    claim: Pending<Dtos.ClaimDto>;
    claimCosts: Pending<Dtos.ClaimCostDto[]>;
    editor: IEditorStore<Dtos.ClaimDto, ClaimDtoValidator>;
}

interface Callbacks {
    onChange: (claimId: string, dto: ClaimDto) => void;
    onSave: (dto: ClaimDto, button: "normal" | "return", projectId: string, partnerId: string, claimId: string) => void;
}

interface CombinedData {
    project: Dtos.ProjectDto;
    partner: Dtos.PartnerDto;
    costCategories: Dtos.CostCategoryDto[];
    claim: Dtos.ClaimDto;
    claimCosts: Dtos.ClaimCostDto[];
}

export class PrepareComponent extends ContainerBase<Params, Data, Callbacks> {

    public render() {
        const combined = Pending.combine(
            this.props.project,
            this.props.partner,
            this.props.costCategories,
            this.props.claim,
            this.props.claimCosts,
            (project, partner, costCategories, claim, claimCosts) => ({ project, partner, costCategories, claim, claimCosts })
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

    private renderContents(data: { project: Dtos.ProjectDto, partner: Dtos.PartnerDto, costCategories: Dtos.CostCategoryDto[], claim: Dtos.ClaimDto, claimCosts: Dtos.ClaimCostDto[] }, editor: IEditorStore<ClaimDto, ClaimDtoValidator>) {

        const title = this.getClaimPeriodTitle(data);
        const Form = ACC.TypedForm<Dtos.ClaimDto>();
        const commentsLabel = "Additional information (optional)";
        const commentsHint = "These comments will be seen by your Monitoring Officer when they review your claim.";
        return (
            <ACC.Page>
                <ACC.Section>
                    <ACC.BackLink route={routeConfig.claimsDashboard.getLink({ projectId: data.project.id, partnerId: data.partner.id })}>Claims dashboard</ACC.BackLink>
                </ACC.Section>
                <ACC.Projects.Title pageTitle="Claim" project={data.project} />
                <ACC.Claims.Navigation projectId={data.project.id} claimId={data.claim.id} currentRouteName={routeConfig.claimDetails.routeName} />
                <ACC.Section title={title}>
                    <ACC.ValidationMessage message={editor.validator.comments} />
                    <ACC.Claims.ClaimTable {...data} />
                    <Form.Form data={editor.data} onChange={(dto) => this.props.onChange(this.props.claimId, dto)} onSubmit={() => this.onSave("normal")}>
                        <Form.Fieldset>
                            <Form.MultilineString label={commentsLabel} hint={commentsHint} name="comments" value={m => m.comments} update={(m, v) => m.comments = v} validation={editor.validator.comments} />
                        </Form.Fieldset>
                        <Form.Fieldset>
                            <Form.Submit>Review forcasts</Form.Submit>
                        </Form.Fieldset>
                        <Form.Fieldset>
                            <Form.Button name="return" onClick={() => this.onSave("return")}>Save and return to claim dashboard</Form.Button>
                        </Form.Fieldset>
                    </Form.Form>
                </ACC.Section>
            </ACC.Page>
        );
    }

    private onSave(button: "normal" | "return") {
        this.props.onSave(this.props.editor.data, button, this.props.projectId, this.props.partner.data!.id, this.props.claimId);
    }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(PrepareComponent);
const getEditor = (claimId: string, editor: IEditorStore<Dtos.ClaimDto, ClaimDtoValidator>, original: Pending<Dtos.ClaimDto>) => {
    if (!editor) {
        console.log("Createing editor", claimId, original);
        editor = original.then(x => ({ data: JSON.parse(JSON.stringify(x!)) as Dtos.ClaimDto, validator: new ClaimDtoValidator(x!, false), error: null })).data!;
    }
    return editor;
};

const navigateOnSave = (dispach: any, button: "normal"|"return", projectId: string, partnerId: string, claimId: string) => {
    if(button === "return") {
        dispach(navigateTo(ClaimsDashboardRoute.getLink({projectId, partnerId})));
    }
    else {
        dispach(navigateTo(ClaimsDetailsRoute.getLink({projectId, claimId})));
    }
};

export const PrepareClaim = definition.connect({
    withData: (store, params) => ({
        project: Pending.create(store.data.project[params.projectId]),
        // todo: fix to be partner for the claim rather than fist partner in project
        partner: Pending.create(store.data.partners[params.projectId]).then(x => x![0]),
        costCategories: Pending.create(store.data.costCategories.all),
        claim: Pending.create(store.data.claim[params.claimId]),
        claimCosts: Pending.create(store.data.claimCosts[params.claimId]),
        editor: getEditor(params.claimId, store.editors.claim[params.claimId], Pending.create(store.data.claim[params.claimId]))
    }),
    withCallbacks: (dispach) => ({
        onChange: (id, dto) => dispach(validateClaim(id, dto)),
        onSave: (dto, button, projectId, partnerId, claimId) => dispach(saveClaim(claimId, dto, () => navigateOnSave(dispach, button, projectId, partnerId, claimId)))
    })
});

export const PrepareClaimRoute = definition.route({
    routeName: "prepare-claim",
    routePath: "/projects/:projectId/claims/:claimId/prepare",
    getParams: (route) => ({ projectId: route.params.projectId, claimId: route.params.claimId }),
    getLoadDataActions: (params) => [
        Actions.loadProject(params.projectId),
        Actions.loadPatnersForProject(params.projectId),
        Actions.loadCostCategories(),
        Actions.loadClaim(params.claimId),
        Actions.loadClaimCosts(params.claimId)
    ],
    container: PrepareClaim
});
