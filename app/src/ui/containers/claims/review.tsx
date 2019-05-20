import React from "react";
import * as ACC from "@ui/components";
import * as Actions from "@ui/redux/actions";
import * as Selectors from "@ui/redux/selectors";
import { IEditorStore } from "@ui/redux";
import { ContainerBase, ReduxContainer } from "@ui/containers/containerBase";
import { ClaimDtoValidator } from "@ui/validators/claimDtoValidator";
import { Pending } from "@shared/pending";
import { ClaimDto, ClaimStatus, ClaimStatusChangeDto, PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { ForecastData, forecastDataLoadActions } from "./forecasts/common";
import { AllClaimsDashboardRoute, ReviewClaimLineItemsRoute } from "@ui/containers";

export interface ReviewClaimParams {
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
  forecastData: Pending<ForecastData>;
  iarDocument: Pending<DocumentSummaryDto | null>;
  isClient: boolean;
  standardOverheadRate: number;
  statusChanges: Pending<ClaimStatusChangeDto[]>;
}

interface Callbacks {
  onChange: (partnerId: string, periodId: number, dto: ClaimDto, details: CostsSummaryForPeriodDto[], costCategories: CostCategoryDto[]) => void;
  onSave: (projectId: string, partnerId: string, periodId: number, dto: ClaimDto, details: CostsSummaryForPeriodDto[], costCategories: CostCategoryDto[], message: string) => void;
}

interface CombinedData {
  project: ProjectDto;
  partner: PartnerDto;
  costCategories: CostCategoryDto[];
  claim: ClaimDto;
  claimDetails: CostsSummaryForPeriodDto[];
  iarDocument: DocumentSummaryDto | null;
  editor: IEditorStore<ClaimDto, ClaimDtoValidator>;
}

class ReviewComponent extends ContainerBase<ReviewClaimParams, Data, Callbacks> {
  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      costCategories: this.props.costCategories,
      claim: this.props.claim,
      claimDetails: this.props.costsSummaryForPeriod,
      iarDocument: this.props.iarDocument,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private getClaimPeriodTitle(data: CombinedData) {
    return <ACC.Claims.ClaimPeriodDate claim={data.claim} partner={data.partner} />;
  }

  private onClaimSubmit(data: CombinedData) {
    const message = data.editor.data.status === ClaimStatus.MO_QUERIED ? "You have queried this claim." : "You have approved this claim.";
    this.props.onSave(this.props.projectId, this.props.partnerId, this.props.periodId, data.editor.data, data.claimDetails, data.costCategories, message);
  }

  private renderContents(data: CombinedData) {

    const tabs: ACC.HashTabItem[] = [
      { text: "Details", hash: "details", content: this.renderDetailsTab(data), default: true },
      { text: "Log", hash: "logs", content: this.renderLogsTab() },
    ];

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={AllClaimsDashboardRoute.getLink({ projectId: data.project.id })}>Back to project</ACC.BackLink>}
        error={data.editor.error}
        validator={data.editor.validator}
        pageTitle={<ACC.Projects.Title project={data.project} />}
        tabs={<ACC.HashTabs tabList={tabs} />}
      >
        <ACC.HashTabsContent tabList={tabs} />
      </ACC.Page>
    );
  }

  private renderDetailsTab(data: CombinedData) {
    return (
      <React.Fragment>
        <ACC.Section title={this.getClaimPeriodTitle(data)}>
          <ACC.Claims.ClaimReviewTable
            {...data}
            standardOverheadRate={this.props.standardOverheadRate}
            validation={data.editor.validator.claimDetails.results}
            getLink={costCategoryId => this.getClaimLineItemLink(costCategoryId)}
          />
        </ACC.Section>
        <ACC.Section>
          <ACC.Accordion>
            <ACC.AccordionItem title="Forecast" qa="forecast-accordion">
              <ACC.Loader
                pending={this.props.forecastData}
                render={(forecastData) => (<ACC.Claims.ForecastTable data={forecastData} hideValidation={true} />)}
              />
            </ACC.AccordionItem>
          </ACC.Accordion>
        </ACC.Section>
        {this.renderIarSection(data.claim, data.iarDocument)}
        {this.renderForm(data)}
      </React.Fragment>
    );
  }

  private getClaimLineItemLink(costCategoryId: string) {
    return ReviewClaimLineItemsRoute.getLink({ partnerId: this.props.partnerId, projectId: this.props.projectId, periodId: this.props.periodId, costCategoryId });
  }

  private renderIarSection(claim: ClaimDto, iarDocument?: DocumentSummaryDto | null) {
    if (!claim.isIarRequired || !claim.isApproved || !iarDocument) return null;

    return (
      <ACC.Section qa="claim-iar" title={"Independent accountant's report"}>
        <ACC.DocumentSingle document={iarDocument} openNewWindow={true} />
      </ACC.Section>
    );
  }

  private renderForm(data: CombinedData) {
    const Form = ACC.TypedForm<ClaimDto>();
    const options: ACC.SelectOption[] = [
      { id: ClaimStatus.MO_QUERIED, value: "Query claim" },
      { id: ClaimStatus.AWAITING_IUK_APPROVAL, value: "Submit for approval" },
    ];
    const submitButtonLabel = this.getSubmitButtonLabel(data);

    return (
      <Form.Form
        editor={data.editor}
        onSubmit={() => this.onClaimSubmit(data)}
        onChange={(dto) => this.props.onChange(this.props.partnerId, this.props.periodId, dto, data.claimDetails, data.costCategories)}
        qa="review-form"
      >
        <Form.Fieldset heading="How do you want to proceed with this claim?">
          <Form.Radio
            name="status"
            options={options}
            value={(dto) => options.find(x => x.id === dto.status)}
            update={(dto, val) => this.updateStatus(dto, val)}
            validation={data.editor.validator.status}
            inline={true}
          />
          {this.renderCommentsSection(Form, data.editor)}
          {!!submitButtonLabel ? <Form.Submit>{submitButtonLabel}</Form.Submit> : null}
        </Form.Fieldset>
      </Form.Form>
    );
  }

  private renderCommentsSection(Form: ACC.FormBuilder<ClaimDto>, editor: IEditorStore<ClaimDto, ClaimDtoValidator>) {
    // on client if the status hasnt yet been set by the readio buttons then dont show
    // if server rendering we need to always show
    if (!editor.data.status && this.props.isClient) {
      return null;
    }

    return (
      <Form.Fieldset heading={"Additional information"} qa="additional-info-form" headingQa="additional-info-heading">
        <Form.MultilineString
          label="additional-info"
          labelHidden={true}
          hint={"If you query the claim, you must explain what the partner needs to amend. If you approve the claim, you may add a comment to Innovate UK in support of the claim."}
          name="comments"
          value={m => m.comments}
          update={(m, v) => m.comments = v}
          validation={editor.validator.comments}
          qa="info-text-area"
        />
      </Form.Fieldset>
    );

  }

  private getSubmitButtonLabel(data: CombinedData) {
    let label: string | null = "Submit";

    if (this.props.isClient) {
      if (data.editor.data.status === ClaimStatus.MO_QUERIED) {
        label = "Send query";
      }
      else if (data.editor.data.status !== ClaimStatus.AWAITING_IUK_APPROVAL) {
        label = null;
      }
    }

    return label;
  }

  private updateStatus(dto: ClaimDto, option: ACC.SelectOption | null | undefined) {
    if (option && (option.id === ClaimStatus.MO_QUERIED || option.id === ClaimStatus.AWAITING_IUK_APPROVAL)) {
      dto.status = option.id;
    }
  }

  private renderLogsTab() {
    return (
      <ACC.Loader
        pending={this.props.statusChanges}
        render={(statusChanges) => (
          <ACC.Section>
            {statusChanges.length ? <ACC.Logs qa="claim-status-change-table" data={statusChanges} /> : null}
            {!statusChanges.length ? <ACC.Renderers.SimpleString>There are no changes for this claim.</ACC.Renderers.SimpleString> : null}
          </ACC.Section>
        )}
      />
    );
  }
}

const initEditor = (dto: ClaimDto) => {
  // if the status hasn't already been set to "MO Queried" or "Awaiting IUK Approval" then set the status to New so that the validation kicks in a forces a change
  if (dto.status !== ClaimStatus.MO_QUERIED && dto.status !== ClaimStatus.AWAITING_IUK_APPROVAL) {
    dto.status = ClaimStatus.UNKNOWN;
  }
};

const definition = ReduxContainer.for<ReviewClaimParams, Data, Callbacks>(ReviewComponent);

// ToDo: sort out with data as its a mess!
export const ReviewClaim = definition.connect({
  withData: (state, props): Data => {
    const projectPending = Selectors.getProject(props.projectId).getPending(state);
    const partnerPending = Selectors.getPartner(props.partnerId).getPending(state);
    const costCategoriesPending = Selectors.getCostCategories().getPending(state);
    const claimPending = Selectors.getClaim(props.partnerId, props.periodId).getPending(state);
    const claimsPending = Selectors.findClaimsByPartner(props.partnerId).getPending(state);
    return {
      project: projectPending,
      partner: partnerPending,
      costCategories: costCategoriesPending,
      claim: claimPending,
      costsSummaryForPeriod: Selectors.getCostsSummaryForPeriod(props.partnerId, props.periodId).getPending(state),
      editor: Selectors.getClaimEditor(props.partnerId, props.periodId).get(state, (dto) => initEditor(dto)),
      isClient: state.isClient,
      iarDocument: Selectors.getIarDocument(state, props.partnerId, props.periodId),
      statusChanges: Selectors.getClaimStatusChanges(props.projectId, props.partnerId, props.periodId).getPending(state),
      forecastData: Pending.combine({
        project: projectPending,
        partner: partnerPending,
        claim: claimPending,
        claims: claimsPending,
        claimDetails: Selectors.findClaimDetailsByPartner(props.partnerId).getPending(state),
        forecastDetails: Selectors.findForecastDetailsByPartner(props.partnerId).getPending(state),
        golCosts: Selectors.findGolCostsByPartner(props.partnerId).getPending(state),
        costCategories: costCategoriesPending,
      }),
      standardOverheadRate: state.config.standardOverheadRate
    };
  },
  withCallbacks: (dispatch) => ({
    onChange: (partnerId, periodId, dto, details, costCategories) =>
      dispatch(Actions.validateClaim(partnerId, periodId, dto, details, costCategories)),
    onSave: (projectId, partnerId, periodId, dto, details, costCategories, message) =>
      dispatch(Actions.saveClaim(projectId, partnerId, periodId, dto, details, costCategories, () => dispatch(Actions.navigateBackTo(AllClaimsDashboardRoute.getLink({ projectId }))), message)),
  })
});

export const ReviewClaimRoute = definition.route({
  routeName: "reviewClaim",
  routePath: "/projects/:projectId/claims/:partnerId/review/:periodId",
  getParams: (route) => ({ projectId: route.params.projectId, partnerId: route.params.partnerId, periodId: parseInt(route.params.periodId, 10) }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPartner(params.partnerId),
    Actions.loadPartnersForProject(params.projectId),
    Actions.loadCostCategories(),
    Actions.loadClaim(params.partnerId, params.periodId),
    Actions.loadCostsSummaryForPeriod(params.projectId, params.partnerId, params.periodId),
    Actions.loadIarDocuments(params.partnerId, params.periodId),
    Actions.loadClaimStatusChanges(params.projectId, params.partnerId, params.periodId),
    ...forecastDataLoadActions(params)
  ],
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: (store, params) => {
    return {
      htmlTitle: "Review claim",
      displayTitle: "Claim"
    };
  },
  container: ReviewClaim
});
