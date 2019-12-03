import React from "react";
import * as ACC from "@ui/components";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { ClaimDtoValidator } from "@ui/validators/claimDtoValidator";
import { Pending } from "@shared/pending";
import { ClaimDto, ClaimStatus, ClaimStatusChangeDto, PartnerDto, ProjectDto, ProjectRole } from "@framework/types";

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
  claims: Pending<ClaimDto[]>;
  claimDetails: Pending<ClaimDetailsSummaryDto[]>;
  costsSummaryForPeriod: Pending<CostsSummaryForPeriodDto[]>;
  forecastDetails: Pending<ForecastDetailsDTO[]>;
  golCosts: Pending<GOLCostDto[]>;
  statusChanges: Pending<ClaimStatusChangeDto[]>;
  editor: Pending<IEditorStore<ClaimDto, ClaimDtoValidator>>;
}

interface Callbacks {
  onUpdate: (saving: boolean, dto: ClaimDto) => void;
}

interface CombinedData {
  project: ProjectDto;
  partner: PartnerDto;
  costCategories: CostCategoryDto[];
  claim: ClaimDto;
  claimDetails: CostsSummaryForPeriodDto[];
  statusChanges: ClaimStatusChangeDto[];
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
      statusChanges: this.props.statusChanges,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private getClaimPeriodTitle(data: CombinedData) {
    return <ACC.Claims.ClaimPeriodDate claim={data.claim} partner={data.partner} />;
  }

  private renderContents(data: CombinedData) {

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.allClaimsDashboard.getLink({ projectId: data.project.id })}>Back to claims</ACC.BackLink>}
        error={data.editor.error}
        validator={data.editor.validator}
        pageTitle={<ACC.Projects.Title project={data.project} />}
      >
        {this.renderClaimReview(data)}
      </ACC.Page>
    );
  }

  private renderClaimReview(data: CombinedData) {
    return (
      <React.Fragment>
        <ACC.Section title={this.getClaimPeriodTitle(data)}>
          <ACC.Claims.ClaimReviewTable
            {...data}
            standardOverheadRate={this.props.config.standardOverheadRate}
            validation={data.editor.validator.claimDetails.results}
            getLink={costCategoryId => this.getClaimLineItemLink(costCategoryId)}
          />
        </ACC.Section>
        {this.renderForecastSection()}
        {this.renderLogSection(data)}
        {this.renderForm(data)}
      </React.Fragment>
    );
  }

  private renderForecastSection() {
    const pendingForcastData: Pending<ACC.Claims.ForecastData> = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      claim: this.props.claim,
      claims: this.props.claims,
      claimDetails: this.props.claimDetails,
      forecastDetails: this.props.forecastDetails,
      golCosts: this.props.golCosts,
      costCategories: this.props.costCategories
    });

    return (
      <ACC.Section>
        <ACC.Accordion>
          <ACC.AccordionItem title="Forecast" qa="forecast-accordion">
            <ACC.Loader
              pending={pendingForcastData}
              render={(forecastData) => (<ACC.Claims.ForecastTable data={forecastData} hideValidation={true} />)}
            />
          </ACC.AccordionItem>
        </ACC.Accordion>
      </ACC.Section>
    );
  }

  private getClaimLineItemLink(costCategoryId: string) {
    return this.props.routes.reviewClaimLineItems.getLink({ partnerId: this.props.partnerId, projectId: this.props.projectId, periodId: this.props.periodId, costCategoryId });
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
        onSubmit={() => this.props.onUpdate(true, data.editor.data)}
        onChange={(dto) => this.props.onUpdate(false, dto)}
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

  private renderLogSection(data: CombinedData) {
    return (
      <ACC.Accordion>
        <ACC.AccordionItem title="Log" qa="log-accordion">
          <ACC.Logs qa="claim-status-change-table" data={data.statusChanges} />
        </ACC.AccordionItem>
      </ACC.Accordion>
    );
  }
}

const initEditor = (dto: ClaimDto) => {
  // if the status hasn't already been set to "MO Queried" or "Awaiting IUK Approval" then set the status to New so that the validation kicks in a forces a change
  if (dto.status !== ClaimStatus.MO_QUERIED && dto.status !== ClaimStatus.AWAITING_IUK_APPROVAL) {
    dto.status = ClaimStatus.UNKNOWN;
  }
};

const ReviewContainer = (props: ReviewClaimParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <ReviewComponent
          project={stores.projects.getById(props.projectId)}
          partner={stores.partners.getById(props.partnerId)}
          costCategories={stores.costCategories.getAll()}
          claim={stores.claims.get(props.partnerId, props.periodId)}
          claims={stores.claims.getAllClaimsForPartner(props.partnerId)}
          costsSummaryForPeriod={stores.costsSummaries.getForPeriod(props.projectId, props.partnerId, props.periodId)}
          claimDetails={stores.claimDetails.getAllByPartner(props.partnerId)}
          forecastDetails={stores.forecastDetails.getAllByPartner(props.partnerId)}
          golCosts={stores.forecastGolCosts.getAllByPartner(props.partnerId)}
          statusChanges={stores.claims.getStatusChanges(props.projectId, props.partnerId, props.periodId)}
          editor={stores.claims.getClaimEditor(props.projectId, props.partnerId, props.periodId, initEditor)}
          onUpdate={(saving, dto) => {
            const message = dto.status === ClaimStatus.MO_QUERIED ? "You have queried this claim." : "You have approved this claim.";
            stores.claims.updateClaimEditor(saving, props.projectId, props.partnerId, props.periodId, dto, message, () => stores.navigation.navigateTo(props.routes.allClaimsDashboard.getLink({ projectId: props.projectId })));
          }}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const ReviewClaimRoute = defineRoute({
  routeName: "reviewClaim",
  routePath: "/projects/:projectId/claims/:partnerId/review/:periodId",
  container: ReviewContainer,
  getParams: (route) => ({ projectId: route.params.projectId, partnerId: route.params.partnerId, periodId: parseInt(route.params.periodId, 10) }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: () => ({
    htmlTitle: "Review claim",
    displayTitle: "Claim"
  }),
});
