import * as Selectors from "../../redux/selectors";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import * as ACC from "../../components";
import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { IEditorStore } from "../../redux/reducers/editorsReducer";
import { ClaimDtoValidator } from "../../validators/claimDtoValidator";
import { AllClaimsDashboardRoute, ClaimForecastRoute, ClaimsDashboardRoute } from ".";
import { EditClaimLineItemsRoute } from "./editClaimLineItems";
import { ClaimsDetailsRoute } from "./details";
import { ClaimDto, PartnerDto, ProjectDto, ProjectRole } from "../../../types";

export interface PrepareClaimParams {
  projectId: string;
  partnerId: string;
  periodId: number;
}

interface Data {
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  costCategories: Pending<CostCategoryDto[]>;
  claim: Pending<ClaimDto>;
  costsSummaryForPeriod: Pending<CostsSummaryForPeriodDto[]>;
  editor: Pending<IEditorStore<ClaimDto, ClaimDtoValidator>>;
  standardOverheadRate: number;
}

interface Callbacks {
  onChange: (partnerId: string, periodId: number, dto: ClaimDto, details: CostsSummaryForPeriodDto[], costCategories: CostCategoryDto[]) => void;
  saveAndProgress: (projectId: string, partnerId: string, periodId: number, dto: ClaimDto, details: CostsSummaryForPeriodDto[], costCategories: CostCategoryDto[]) => void;
  saveAndReturn: (projectId: string, partnerId: string, periodId: number, dto: ClaimDto, details: CostsSummaryForPeriodDto[], costCategories: CostCategoryDto[], project: ProjectDto) => void;
}

interface CombinedData {
  project: ProjectDto;
  partner: PartnerDto;
  costCategories: CostCategoryDto[];
  claim: ClaimDto;
  claimDetails: CostsSummaryForPeriodDto[];
  editor: IEditorStore<ClaimDto, ClaimDtoValidator>;
}

export class PrepareComponent extends ContainerBase<PrepareClaimParams, Data, Callbacks> {

  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      costCategories: this.props.costCategories,
      claim: this.props.claim,
      claimDetails: this.props.costsSummaryForPeriod,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private getClaimPeriodTitle(data: CombinedData) {
    return <ACC.Claims.ClaimPeriodDate claim={data.claim} />;
  }

  private saveAndProgress(dto: ClaimDto, details: CostsSummaryForPeriodDto[], costCategories: CostCategoryDto[]) {
    this.props.saveAndProgress(this.props.projectId, this.props.partnerId, this.props.periodId, dto, details, costCategories);
  }

  private saveAndReturn(dto: ClaimDto, details: CostsSummaryForPeriodDto[], costCategories: CostCategoryDto[], project: ProjectDto) {
    this.props.saveAndReturn(this.props.projectId, this.props.partnerId, this.props.periodId, dto, details, costCategories, project);
  }

  private onChange(dto: ClaimDto, details: CostsSummaryForPeriodDto[], costCategories: CostCategoryDto[]) {
    this.props.onChange(this.props.partnerId, this.props.periodId, dto, details, costCategories);
  }

  private renderContents(data: CombinedData) {
    const Form = ACC.TypedForm<ClaimDto>();
    const commentsLabel = "Additional information";
    const commentsHint = "Explain any difference between a category's forecast and its claim, and answer any queries after you submit your claim.";
    const isPmOrMo = (data.project.roles & (ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer)) !== ProjectRole.Unknown;
    const backLink = isPmOrMo ? AllClaimsDashboardRoute.getLink({ projectId: data.project.id }) : ClaimsDashboardRoute.getLink({ projectId: data.project.id, partnerId: data.partner.id });

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={backLink}>Back to project</ACC.BackLink>}
        error={data.editor.error}
        validator={data.editor.validator}
        pageTitle={<ACC.Projects.Title project={data.project} />}
        tabs={<ACC.Claims.Navigation project={data.project} partnerId={data.partner.id} periodId={data.claim.periodId} currentRouteName={ClaimsDetailsRoute.routeName} />}
        messages={this.props.messages || []}
      >
        <ACC.Section title={this.getClaimPeriodTitle(data)}>
          <ACC.Claims.ClaimTable
            {...data}
            validation={data.editor.validator.claimDetails.results}
            standardOverheadRate={this.props.standardOverheadRate}
            getLink={costCategoryId => EditClaimLineItemsRoute.getLink({ partnerId: this.props.partnerId, projectId: this.props.projectId, periodId: this.props.periodId, costCategoryId })}
          />
          <Form.Form data={data.editor.data} onChange={(dto) => this.onChange(dto, data.claimDetails, data.costCategories)} onSubmit={() => this.saveAndProgress(data.editor.data, data.claimDetails, data.costCategories)}>
            <Form.Fieldset heading={commentsLabel} qa="additional-info-form" headingQa="additional-info-heading">
              <Form.MultilineString label="additional-info" labelHidden={true} hint={commentsHint} name="comments" value={m => m.comments} update={(m, v) => m.comments = v} validation={data.editor.validator.comments} qa="info-text-area" />
            </Form.Fieldset>
            <Form.Fieldset qa="save-and-continue">
              <Form.Submit>Review forecast</Form.Submit>
            </Form.Fieldset>
            <Form.Fieldset qa="save-and-return">
              <Form.Button name="return" onClick={() => this.saveAndReturn(data.editor.data, data.claimDetails, data.costCategories, data.project)}>Save and return to project</Form.Button>
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

const goBack = (dispatch: any, projectId: string, partnerId: string, project: ProjectDto) => {
  if (project.roles & ProjectRole.ProjectManager) {
    dispatch(Actions.navigateTo(AllClaimsDashboardRoute.getLink({ projectId })));
  } else {
    dispatch(Actions.navigateTo(ClaimsDashboardRoute.getLink({ projectId, partnerId })));
  }
};

const definition = ReduxContainer.for<PrepareClaimParams, Data, Callbacks>(PrepareComponent);

export const PrepareClaim = definition.connect({
  withData: (state, props): Data => ({
    project: Selectors.getProject(props.projectId).getPending(state),
    partner: Selectors.getPartner(props.partnerId).getPending(state),
    costCategories: Selectors.getCostCategories().getPending(state),
    claim: Selectors.getClaim(props.partnerId, props.periodId).getPending(state),
    costsSummaryForPeriod: Selectors.getCostsSummaryForPeriod(props.partnerId, props.periodId).getPending(state),
    editor: Selectors.getClaimEditor(props.partnerId, props.periodId).get(state),
    standardOverheadRate: state.config.standardOverheadRate,
  }),
  withCallbacks: (dispatch) => ({
    onChange: (partnerId, periodId, dto, details, costCategories) => dispatch(Actions.validateClaim(partnerId, periodId, dto, details, costCategories)),
    saveAndProgress: (projectId, partnerId, periodId, dto, details, costCategories) => dispatch(Actions.saveClaim(projectId, partnerId, periodId, dto, details, costCategories, () => progress(dispatch, projectId, partnerId, periodId))),
    saveAndReturn: (projectId, partnerId, periodId, dto, details, costCategories, project) => dispatch(Actions.saveClaim(projectId, partnerId, periodId, dto, details, costCategories, () => goBack(dispatch, projectId, partnerId, project), "You have saved your claim."))
  })
});

export const PrepareClaimRoute = definition.route({
  routeName: "prepareClaim",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId",
  getParams: (route) => ({ projectId: route.params.projectId, partnerId: route.params.partnerId, periodId: parseInt(route.params.periodId, 10) }),
  accessControl: (auth, {projectId, partnerId}) => auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPartner(params.partnerId),
    Actions.loadPartnersForProject(params.projectId),
    Actions.loadCostCategories(),
    Actions.loadClaim(params.partnerId, params.periodId),
    Actions.loadCostsSummaryForPeriod(params.projectId, params.partnerId, params.periodId)
  ],
  getTitle: (store, params) => {
    return {
      htmlTitle: "Edit claim",
      displayTitle: "Claim"
    };
  },
  container: PrepareClaim
});
