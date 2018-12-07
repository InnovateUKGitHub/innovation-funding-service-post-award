import * as Selectors from "../../redux/selectors";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import * as ACC from "../../components";
import React from "react";
import { DateTime } from "luxon";
import { IEditorStore } from "../../redux/reducers/editorsReducer";
import { ClaimDtoValidator } from "../../validators/claimDtoValidator";
import { ClaimForecastRoute, ClaimsDashboardRoute } from ".";
import { EditClaimLineItemsRoute } from "./editClaimLineItems";
import { ClaimsDetailsRoute } from "./details";
import { ClaimDto, ClaimFrequency, ClaimStatus, ProjectDto } from "../../../types";

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
    claimDetailsSummary: Pending<ClaimDetailsSummaryDto[]>;
    editor: Pending<IEditorStore<ClaimDto, ClaimDtoValidator>>;
}

interface Callbacks {
    onChange: (partnerId: string, periodId: number, dto: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: CostCategoryDto[]) => void;
    saveAndProgress: (projectId: string, partnerId: string, periodId: number, dto: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: CostCategoryDto[]) => void;
    saveAndReturn: (projectId: string, partnerId: string, periodId: number, dto: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: CostCategoryDto[]) => void;
}

interface CombinedData {
    project: ProjectDto;
    partner: PartnerDto;
    costCategories: CostCategoryDto[];
    claim: ClaimDto;
    claimDetails: ClaimDetailsSummaryDto[];
    editor: IEditorStore<ClaimDto, ClaimDtoValidator>;
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

        return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
    }

    private getClaimPeriodTitle(data: CombinedData) {
      return <ACC.Claims.ClaimPeriodDate claim={data.claim} />;
    }

    private saveAndProgress(dto: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: CostCategoryDto[]) {
        this.props.saveAndProgress(this.props.projectId, this.props.partnerId, this.props.periodId, dto, details, costCategories);
    }

    private saveAndReturn(dto: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: CostCategoryDto[]) {
        this.props.saveAndReturn(this.props.projectId, this.props.partnerId, this.props.periodId, dto, details, costCategories);
    }

    private onChange(dto: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: CostCategoryDto[]) {
        this.props.onChange(this.props.partnerId, this.props.periodId, dto, details, costCategories);
    }

    private renderContents(data: CombinedData) {
        const Form = ACC.TypedForm<ClaimDto>();
        const commentsLabel = "Additional information (optional)";
        const commentsHint = "These comments will be seen by your Monitoring Officer when they review your claim.";
        return (
            <ACC.Page>
                <ACC.Section>
                    <ACC.BackLink route={ClaimsDashboardRoute.getLink({ projectId: data.project.id, partnerId: data.partner.id })}>Claims dashboard</ACC.BackLink>
                </ACC.Section>
                <ACC.ErrorSummary error={data.editor.error} />
                <ACC.ValidationSummary validation={data.editor.validator} compressed={false} />
                <ACC.Projects.Title pageTitle="Claim" project={data.project} />
                <ACC.Claims.Navigation projectId={data.project.id} partnerId={data.partner.id} periodId={data.claim.periodId} currentRouteName={ClaimsDetailsRoute.routeName} />
                <ACC.Section title={this.getClaimPeriodTitle(data)}>
                    <ACC.Claims.ClaimTable {...data} validation={data.editor.validator.claimDetails.results} getLink={costCategoryId => EditClaimLineItemsRoute.getLink({partnerId: this.props.partnerId, projectId: this.props.projectId, periodId: this.props.periodId, costCategoryId})} />
                    <Form.Form data={data.editor.data} onChange={(dto) => this.onChange(dto, data.claimDetails, data.costCategories)} onSubmit={() => this.saveAndProgress(data.editor.data, data.claimDetails, data.costCategories)}>
                        <Form.Fieldset heading={commentsLabel} qa="additional-info-form" headingQa="additional-info-heading">
                            <Form.MultilineString hint={commentsHint} name="comments" value={m => m.comments} update={(m, v) => m.comments = v} validation={data.editor.validator.comments} qa="info-text-area"/>
                        </Form.Fieldset>
                        <ACC.Renderers.SimpleString>
                            You need to review your forecasts before you can submit your claim.
                        </ACC.Renderers.SimpleString>
                        <Form.Fieldset qa="save-and-continue">
                            <Form.Submit>Review forecast</Form.Submit>
                        </Form.Fieldset>
                        <Form.Fieldset qa="save-and-return">
                            <Form.Button name="return" onClick={() => this.saveAndReturn(data.editor.data, data.claimDetails, data.costCategories)}>Save and return to project</Form.Button>
                        </Form.Fieldset>
                    </Form.Form>
                </ACC.Section>
            </ACC.Page>
        );
    }
}

const progress = (dispatch: any, projectId: string, partnerId: string) => {
    dispatch(Actions.navigateTo(ClaimForecastRoute.getLink({ projectId, partnerId })));
};

const goBack = (dispatch: any, projectId: string, partnerId: string) => {
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
    editor: Selectors.getClaimEditor(props.partnerId, props.periodId).get(state, x => { x.status = ClaimStatus.DRAFT; })
  }),
  withCallbacks: (dispatch) => ({
    onChange: (partnerId, periodId, dto, details, costCategories) => dispatch(Actions.validateClaim(partnerId, periodId, dto, details, costCategories)),
    saveAndProgress: (projectId, partnerId, periodId, dto, details, costCategories) => dispatch(Actions.saveClaim(partnerId, periodId, dto, details, costCategories, () => progress(dispatch, projectId, partnerId))),
    saveAndReturn: (projectId, partnerId, periodId, dto, details, costCategories) => dispatch(Actions.saveClaim(partnerId, periodId, dto, details, costCategories, () => goBack(dispatch, projectId, partnerId)))
  })
});

export const PrepareClaimRoute = definition.route({
    routeName: "prepareClaim",
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
