import React from "react";
import * as ACC from "@ui/components";
import * as Actions from "@ui/redux/actions";
import * as Selectors from "@ui/redux/selectors";
import { ContainerBase, ReduxContainer } from "@ui/containers/containerBase";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { ClaimDtoValidator } from "@ui/validators/claimDtoValidator";
import { Pending } from "@shared/pending";
import { ClaimDto, ClaimStatusChangeDto, PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { IRoutes } from "@ui/routing";

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
  statusChanges: Pending<ClaimStatusChangeDto[]>;
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
    const isPmOrMo = (data.project.roles & (ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer)) !== ProjectRole.Unknown;
    const backLink = isPmOrMo ? this.props.routes.allClaimsDashboard.getLink({ projectId: data.project.id }) : this.props.routes.claimsDashboard.getLink({ projectId: data.project.id, partnerId: data.partner.id });

    const tabs: ACC.HashTabItem[] = [
      { text: "Details", hash: "details", content: this.renderDetailsTab(data), qa: "ClaimDetailTab"},
      { text: "Log", hash: "log", content: this.renderLogsTab(), qa: "ClaimDetailLogTab" },
    ];

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={backLink}>Back to claims</ACC.BackLink>}
        error={data.editor.error}
        validator={data.editor.validator}
        pageTitle={<ACC.Projects.Title project={data.project} />}
      >
        <ACC.HashTabs tabList={tabs} messages={this.props.messages}/>
      </ACC.Page>
    );
  }

  private renderDetailsTab(data: CombinedData) {
    const Form = ACC.TypedForm<ClaimDto>();
    const commentsLabel = "Add comments";
    const commentsHint = "If you want to explain anything to your monitoring officer or to Innovate UK, add it here.";

    return (
      <ACC.Section title={this.getClaimPeriodTitle(data)}>
        <ACC.Claims.ClaimTable
          {...data}
          validation={data.editor.validator.claimDetails.results}
          standardOverheadRate={this.props.standardOverheadRate}
          getLink={costCategoryId => this.props.routes.prepareClaimLineItems.getLink({ partnerId: this.props.partnerId, projectId: this.props.projectId, periodId: this.props.periodId, costCategoryId })}
        />
        <Form.Form
          editor={data.editor}
          onChange={(dto) => this.onChange(dto, data.claimDetails, data.costCategories)}
          onSubmit={() => this.saveAndProgress(data.editor.data, data.claimDetails, data.costCategories)}
        >
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
    );
  }

  private renderLogsTab() {
    return (
      <ACC.Loader
        pending={this.props.statusChanges}
        render={(statusChanges) => (
          <ACC.Section title="Log">
            <ACC.Logs qa="claim-status-change-table" data={statusChanges} />
          </ACC.Section>
        )}
      />
    );
  }

}

const progress = (dispatch: any, projectId: string, partnerId: string, periodId: number, routes: IRoutes) => {
  dispatch(Actions.navigateTo(routes.claimForecast.getLink({ projectId, partnerId, periodId })));
};

const goBack = (dispatch: any, projectId: string, partnerId: string, project: ProjectDto, routes: IRoutes) => {
  if (project.roles & ProjectRole.ProjectManager) {
    dispatch(Actions.navigateTo(routes.allClaimsDashboard.getLink({ projectId })));
  } else {
    dispatch(Actions.navigateTo(routes.claimsDashboard.getLink({ projectId, partnerId })));
  }
};

const definition = ReduxContainer.for<PrepareClaimParams, Data, Callbacks>(PrepareComponent);

export const PrepareClaim = definition.connect({
  withData: (state, props): Data => ({
    project: Selectors.getActiveProject(props.projectId, state),
    partner: Selectors.getPartner(props.partnerId).getPending(state),
    costCategories: Selectors.getCostCategories().getPending(state),
    claim: Selectors.getClaim(props.partnerId, props.periodId).getPending(state),
    costsSummaryForPeriod: Selectors.getCostsSummaryForPeriod(props.partnerId, props.periodId).getPending(state),
    editor: Selectors.getClaimEditor(props.partnerId, props.periodId).get(state),
    standardOverheadRate: state.config.standardOverheadRate,
    statusChanges: Selectors.getClaimStatusChanges(props.projectId, props.partnerId, props.periodId).getPending(state)
  }),
  withCallbacks: (dispatch, routes) => ({
    onChange: (partnerId, periodId, dto, details, costCategories) => dispatch(Actions.validateClaim(partnerId, periodId, dto, details, costCategories)),
    saveAndProgress: (projectId, partnerId, periodId, dto, details, costCategories) => dispatch(Actions.saveClaim(projectId, partnerId, periodId, dto, details, costCategories, () => progress(dispatch, projectId, partnerId, periodId, routes))),
    saveAndReturn: (projectId, partnerId, periodId, dto, details, costCategories, project) => dispatch(Actions.saveClaim(projectId, partnerId, periodId, dto, details, costCategories, () => goBack(dispatch, projectId, partnerId, project, routes), "You have saved your claim."))
  })
});

export const PrepareClaimRoute = definition.route({
  routeName: "prepareClaim",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId",
  getParams: (route) => ({ projectId: route.params.projectId, partnerId: route.params.partnerId, periodId: parseInt(route.params.periodId, 10) }),
  accessControl: (auth, { projectId, partnerId }) => auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPartner(params.partnerId),
    Actions.loadPartnersForProject(params.projectId),
    Actions.loadCostCategories(),
    Actions.loadClaim(params.partnerId, params.periodId),
    Actions.loadCostsSummaryForPeriod(params.projectId, params.partnerId, params.periodId),
    Actions.loadClaimStatusChanges(params.projectId, params.partnerId, params.periodId)
  ],
  getTitle: (store, params) => {
    return {
      htmlTitle: "Edit claim",
      displayTitle: "Claim"
    };
  },
  container: PrepareClaim
});
