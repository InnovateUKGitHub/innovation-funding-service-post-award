import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import * as ACC from "../../components";
import * as Dtos from "../../models";
import * as Selectors from "../../redux/selectors";
import { IEditorStore } from "../../redux";
import { ClaimDtoValidator } from "../../validators/claimDtoValidator";
import { DateTime } from "luxon";
import { Result } from "../../validation/result";
import { ReviewClaimLineItemsRoute } from "./claimLineItems";
import { navigateTo } from "../../redux/actions";
import { ClaimsDashboardRoute, ClaimsDetailsRoute } from ".";

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
  editor: Pending<IEditorStore<Dtos.ClaimDto, ClaimDtoValidator>>;
}

interface Callbacks {
  onChange: (partnerId: string, periodId: number, dto: Dtos.ClaimDto, details: Dtos.ClaimDetailsSummaryDto[], costCategories: Dtos.CostCategoryDto[]) => void;
  onSave: (projectId: string, partnerId: string, periodId: number, dto: Dtos.ClaimDto, details: Dtos.ClaimDetailsSummaryDto[], costCategories: Dtos.CostCategoryDto[]) => void;
}

interface CombinedData {
  project: Dtos.ProjectDto;
  partner: Dtos.PartnerDto;
  costCategories: Dtos.CostCategoryDto[];
  claim: Dtos.ClaimDto;
  claimDetails: Dtos.ClaimDetailsSummaryDto[];
  editor: IEditorStore<Dtos.ClaimDto, ClaimDtoValidator>;
}

class ReviewComponent extends ContainerBase<Params, Data, Callbacks> {
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

    const Loader = ACC.TypedLoader<CombinedData>();
    return <Loader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private getClaimPeriodTitle(data: any) {
    if (data.project.claimFrequency === Dtos.ClaimFrequency.Monthly) {
      return `${data.partner.name} claim for P${data.claim.periodId} ${DateTime.fromJSDate(data.claim.periodStartDate).toFormat("MMMM yyyy")}`;
    }
    return `${data.partner.name} claim for P${data.claim.periodId} ${DateTime.fromJSDate(data.claim.periodStartDate).toFormat("MMMM")} to ${DateTime.fromJSDate(data.claim.periodEndDate).toFormat("MMMM yyyy")}`;
  }


  private renderContents(data: CombinedData) {
    const title = this.getClaimPeriodTitle(data);
    const Form = ACC.TypedForm<Dtos.ClaimDto>();
    const options : ACC.SelectOption[] = [
      {id: "MO Queried", value: "Query claim"},
      {id: "Awaiting IUK Approval", value: "Submit for approval"},
    ];
    const showButton = data.editor.data.status === "MO Queried" || data.editor.data.status === "Awaiting IUK Approval";

    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={ClaimsDashboardRoute.getLink({ projectId: data.project.id, partnerId: data.partner.id })}>Claims dashboard</ACC.BackLink>
        </ACC.Section>
        <ACC.ValidationSummary validation={data.editor.validator} compressed={false} />
        <ACC.Projects.Title pageTitle="Claim" project={data.project} />
        <ACC.Claims.Navigation projectId={data.project.id} partnerId={data.partner.id} periodId={data.claim.periodId} currentRouteName={ClaimsDetailsRoute.routeName} />
        <ACC.Section title={title}>
          {/* TODO: Fix error display */}
          {data.editor.error ? <ACC.ValidationMessage message={new Result(null, true, false, data.editor.error.details || data.editor.error, false)} /> : null}
          <ACC.Claims.ClaimTable {...data} validation={data.editor.validator.claimDetails.results} getLink={costCategoryId => ReviewClaimLineItemsRoute.getLink({ partnerId: this.props.partnerId, projectId: this.props.projectId, periodId: this.props.periodId, costCategoryId })} />
          <Form.Form data={data.editor.data} onSubmit={() => this.props.onSave(this.props.projectId, this.props.partnerId, this.props.periodId, data.editor.data, data.claimDetails, data.costCategories)} onChange={(dto) => this.props.onChange(this.props.partnerId, this.props.periodId, dto, data.claimDetails, data.costCategories)}>
            <Form.Fieldset heading={() => "How do you want to proceed with this claim?"}>
              <Form.Radio label="" name="status" options={options} value={(dto) => options.find(x => x.id === dto.status)} update={(dto, val) => this.updateStatus(dto, val)} validation={data.editor.validator.status}/>
              {showButton ? <Form.Submit>{data.editor.data.status === "MO Queried" ? "Send query" : "Submit"}</Form.Submit> : null}
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private updateStatus(dto: Dtos.ClaimDto, option: ACC.SelectOption | null | undefined){
    if(option && (option.id === "MO Queried" || option.id === "Awaiting IUK Approval")){
      dto.status = option.id;
    }
  }
}

const initEditor = (dto: Dtos.ClaimDto) => { 
  //if the status hasnt already been set to "MO Queried" or "Awaiting IUK Approval" then set the status to New so that the validation kicks in a forces a change
  if(dto.status !== "MO Queried" && dto.status !== "Awaiting IUK Approval"){
    dto.status = "New";
  }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(ReviewComponent);

export const ReviewClaim = definition.connect({
  withData: (state, props): Data => ({
    project: Selectors.getProject(props.projectId).getPending(state),
    partner: Selectors.getPartner(props.partnerId).getPending(state),
    costCategories: Selectors.getCostCategories().getPending(state),
    claim: Selectors.getClaim(props.partnerId, props.periodId).getPending(state),
    claimDetailsSummary: Selectors.findClaimDetailsSummaryByPartnerAndPeriod(props.partnerId, props.periodId).getPending(state),
    editor: Selectors.getClaimEditor(props.partnerId, props.periodId).get(state, (dto) => initEditor(dto))
  }),
  withCallbacks: (dispatch) => ({
    onChange: (partnerId, periodId, dto, details, costCategories) => dispatch(Actions.validateClaim(partnerId, periodId, dto, details, costCategories)),
    onSave: (projectId, partnerId, periodId, dto, details, costCategories) => dispatch(Actions.saveClaim(partnerId, periodId, dto, details, costCategories, () => dispatch(navigateTo(ClaimsDashboardRoute.getLink({partnerId, projectId}))))),
  })
});

export const ReviewClaimRoute = definition.route({
    routeName: "review-claim",
    routePath: "/projects/:projectId/claims/:partnerId/review/:periodId",
    getParams: (route) => ({ projectId: route.params.projectId, partnerId: route.params.partnerId, periodId: parseInt(route.params.periodId, 10) }),
    getLoadDataActions: (params) => [
        Actions.loadProject(params.projectId),
        Actions.loadPartner(params.partnerId),
        Actions.loadPartnersForProject(params.projectId),
        Actions.loadCostCategories(),
        Actions.loadClaim(params.partnerId, params.periodId),
        Actions.loadClaimDetailsSummaryForPartner(params.partnerId, params.periodId)
    ],
    container: ReviewClaim
});

