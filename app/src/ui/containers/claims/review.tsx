import { IEditorStore } from "../../redux";
import React from "react";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import * as ACC from "../../components";
import * as Selectors from "../../redux/selectors";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { ClaimDtoValidator } from "../../validators/claimDtoValidator";
import { ReviewClaimLineItemsRoute } from "./claimLineItems";
import { AllClaimsDashboardRoute, ClaimsDashboardRoute, ClaimsDetailsRoute} from ".";
import { ClaimDto, ClaimFrequency, ClaimStatus, PartnerDto, ProjectDto, ProjectRole } from "../../../types";
import { ForecastData, forecastDataLoadActions } from "./forecasts/common";

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
  claimDetailsSummary: Pending<ClaimDetailsSummaryDto[]>;
  editor: Pending<IEditorStore<ClaimDto, ClaimDtoValidator>>;
  forecastData: Pending<ForecastData>;
  isClient: boolean;
}

interface Callbacks {
  onChange: (partnerId: string, periodId: number, dto: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: CostCategoryDto[]) => void;
  onSave: (projectId: string, partnerId: string, periodId: number, dto: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: CostCategoryDto[]) => void;
}

interface CombinedData {
  project: ProjectDto;
  partner: PartnerDto;
  costCategories: CostCategoryDto[];
  claim: ClaimDto;
  claimDetails: ClaimDetailsSummaryDto[];
  editor: IEditorStore<ClaimDto, ClaimDtoValidator>;
}

class ReviewComponent extends ContainerBase<ReviewClaimParams, Data, Callbacks> {
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

  private renderContents(data: CombinedData) {
    const Form = ACC.TypedForm<ClaimDto>();
    const options: ACC.SelectOption[] = [
      { id: ClaimStatus.MO_QUERIED, value: "Query claim"},
      { id: ClaimStatus.AWAITING_IUK_APPROVAL, value: "Submit for approval"},
    ];
    const submitButtonLabel = this.getSubmitButtonLabel(data);
    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={AllClaimsDashboardRoute.getLink({ projectId: data.project.id })}>Claims dashboard</ACC.BackLink>
        </ACC.Section>
        <ACC.ErrorSummary error={data.editor.error} />
        <ACC.ValidationSummary validation={data.editor.validator} compressed={false} />
        <ACC.Projects.Title pageTitle="Claim" project={data.project} />
        <ACC.Claims.Navigation projectId={data.project.id} partnerId={data.partner.id} periodId={data.claim.periodId} currentRouteName={ClaimsDetailsRoute.routeName} />
        <ACC.Section title={this.getClaimPeriodTitle(data)}>
          <ACC.Claims.ClaimTable {...data} validation={data.editor.validator.claimDetails.results} getLink={costCategoryId => ReviewClaimLineItemsRoute.getLink({ partnerId: this.props.partnerId, projectId: this.props.projectId, periodId: this.props.periodId, costCategoryId })} />
        </ACC.Section>
        <ACC.Section>
          <ACC.Accordion>
            <ACC.AccordionItem  title="Forecast">
              <ACC.Loader
                pending={this.props.forecastData}
                render={(forecastData) => (
                  <ACC.Claims.ForecastTable data={forecastData} hideValidation={true} />
                )}
              />
            </ACC.AccordionItem>
          </ACC.Accordion>
        </ACC.Section>
        <Form.Form qa="review-form" data={data.editor.data} onSubmit={() => this.props.onSave(this.props.projectId, this.props.partnerId, this.props.periodId, data.editor.data, data.claimDetails, data.costCategories)} onChange={(dto) => this.props.onChange(this.props.partnerId, this.props.periodId, dto, data.claimDetails, data.costCategories)}>
          <Form.Fieldset heading="How do you want to proceed with this claim?">
            <Form.Radio name="status" options={options} value={(dto) => options.find(x => x.id === dto.status)} update={(dto, val) => this.updateStatus(dto, val)} validation={data.editor.validator.status}/>
            {!!submitButtonLabel ? <Form.Submit>{submitButtonLabel}</Form.Submit> : null}
          </Form.Fieldset>
        </Form.Form>
      </ACC.Page>
    );
  }

  private getSubmitButtonLabel(data: CombinedData) {
    let label: string | null = "Submit";

    if(this.props.isClient) {
      if(data.editor.data.status === ClaimStatus.MO_QUERIED) {
        label = "Send Query";
      }
      else if(data.editor.data.status !== ClaimStatus.AWAITING_IUK_APPROVAL) {
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
      costCategories:costCategoriesPending,
      claim: claimPending,
      claimDetailsSummary: Selectors.findClaimDetailsSummaryByPartnerAndPeriod(props.partnerId, props.periodId).getPending(state),
      editor: Selectors.getClaimEditor(props.partnerId, props.periodId).get(state, (dto) => initEditor(dto)),
      isClient: state.isClient,
      forecastData: Pending.combine(
        projectPending,
        partnerPending,
        claimPending,
        claimsPending,
        Selectors.findClaimDetailsByPartner(props.partnerId).getPending(state),
        Selectors.findForecastDetailsByPartner(props.partnerId).getPending(state),
        Selectors.findGolCostsByPartner(props.partnerId).getPending(state),
        costCategoriesPending,
        (project, partner, claim, claims, claimDetails, forecastDetails, golCosts, costCategories) => ({ project, partner, claim, claims, claimDetails, forecastDetails, golCosts, costCategories })
      )
    };
  },
  withCallbacks: (dispatch) => ({
    onChange: (partnerId, periodId, dto, details, costCategories) => dispatch(Actions.validateClaim(partnerId, periodId, dto, details, costCategories)),
    onSave: (projectId, partnerId, periodId, dto, details, costCategories) => dispatch(Actions.saveClaim(projectId, partnerId, periodId, dto, details, costCategories, () => dispatch(Actions.navigateTo(AllClaimsDashboardRoute.getLink({projectId}))))),
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
        Actions.loadClaimDetailsSummaryForPartner(params.projectId, params.partnerId, params.periodId),
        ...forecastDataLoadActions(params)
    ],
    container: ReviewClaim
});
