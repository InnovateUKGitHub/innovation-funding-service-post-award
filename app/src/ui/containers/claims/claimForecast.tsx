import React from "react";
import {ContainerBase, ReduxContainer} from "../containerBase";
import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import {Pending} from "../../../shared/pending";
import * as Dtos from "../../models";
import {routeConfig} from "../../routing";
import {IEditorStore} from "../../redux/reducers/editorsReducer";
import {ClaimDtoValidator} from "../../validators/claimDtoValidator";
import {ClaimsDashboardRoute} from "./dashboard";
import {ClaimDto, ClaimDetailsSummaryDto, CostCategoryDto} from "../../models";
import { RootState } from "../../redux";

interface Params {
  projectId: string;
  partnerId: string;
  periodId: number;
}
interface Data {
  project: Pending<Dtos.ProjectDto>;
  claim: Pending<Dtos.ClaimDto>;
  details: Pending<Dtos.ClaimDetailsSummaryDto[]>;
  partner: Pending<Dtos.PartnerDto>;
  costCategories: Pending<Dtos.CostCategoryDto[]>;
  editor: Pending<IEditorStore<Dtos.ClaimDto, ClaimDtoValidator>>;
}

interface CombinedData {
  project: Dtos.ProjectDto;
  partner: Dtos.PartnerDto;
  claim: Dtos.ClaimDto;
  details: Dtos.ClaimDetailsSummaryDto[];
  costCategories:Dtos.CostCategoryDto[];
  editor: IEditorStore<Dtos.ClaimDto, ClaimDtoValidator>;
}

interface Callbacks {
  saveAndReturn: (projectId: string, partnerId: string, periodId: number, dto: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: CostCategoryDto[]) => void;
  onChange: (partnerId: string, periodId: number, dto: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: CostCategoryDto[]) => void;
}

export class ClaimForecastComponent extends ContainerBase<Params, Data, Callbacks> {

  public render() {
    const combined = Pending.combine(
      this.props.project,
      this.props.partner,
      this.props.claim,
      this.props.details,
      this.props.costCategories,
      this.props.editor,
      (project, partner, claim, details, costCategories, editor) => ({ project, partner, claim, details, costCategories, editor })
    );

    const Loader = ACC.TypedLoader<CombinedData>();
    return <Loader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private onChange(dto: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: CostCategoryDto[]){
    this.props.onChange(this.props.partnerId, this.props.periodId, dto, details, costCategories);
  }

  private saveAndReturn(dto: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: CostCategoryDto[]) {
    this.props.saveAndReturn(this.props.projectId, this.props.partnerId, this.props.periodId, dto, details, costCategories);
  }

  public renderContents(data: CombinedData) {
    const Form = ACC.TypedForm<Dtos.ClaimDto>();

    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={routeConfig.prepareClaim.getLink({ projectId: this.props.projectId, partnerId: this.props.partnerId, periodId: this.props.periodId })}>Back</ACC.BackLink>
        </ACC.Section>
        <ACC.Projects.Title pageTitle="Claim" project={data.project} />
        <ACC.Section>
          <Form.Form data={data.editor.data} onChange={(dto) => this.onChange(dto, data.details, data.costCategories)} onSubmit={() => this.saveAndReturn(data.editor.data, data.details, data.costCategories)}>
            <Form.Fieldset>
              <Form.Submit>Submit claim and forecast changes</Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }
}
const goBack = (dispatch: any, projectId: string, partnerId: string) => {
  dispatch(Actions.navigateTo(ClaimsDashboardRoute.getLink({projectId, partnerId})));
};

const definition = ReduxContainer.for<Params, Data, Callbacks>(ClaimForecastComponent);

export const ForecastClaim = definition.connect({
  withData: (state: RootState, props: Params) => ({
    project: Selectors.getProject(props.projectId).getPending(state),
    claim: Selectors.getClaim(props.partnerId, props.periodId).getPending(state),
    costCategories: Selectors.getCostCategories().getPending(state),
    details: Selectors.findClaimDetailsSummaryByPartnerAndPeriod(props.partnerId, props.periodId).getPending(state),
    partner: Selectors.getPartner(props.partnerId).getPending(state),
    editor: Selectors.editClaim(props.partnerId, props.periodId).get(state, x => {x.status = "Submitted"})
  }),
  withCallbacks: (dispatch) => ({
    onChange: (partnerId, periodId, dto, details, costCategories) => dispatch(Actions.validateClaim(partnerId, periodId, dto, details, costCategories)),
    saveAndReturn: (projectId, partnerId, periodId, dto, details, costCategories) => dispatch(Actions.saveClaim(partnerId, periodId, dto, details, costCategories, () => goBack(dispatch, projectId, partnerId)))
  })
});

export const ClaimForecastRoute = definition.route({
  routeName: "claimForecast",
  routePath: "/projects/:projectId/claims/:partnerId/forecast/:periodId",
  getParams: (route) => ({ projectId: route.params.projectId, partnerId: route.params.partnerId, periodId: parseInt(route.params.periodId, 10) }),
  getLoadDataActions: ({ projectId, partnerId, periodId }) => [
    Actions.loadProject(projectId),
    Actions.loadPartner(partnerId),
    Actions.loadClaim(partnerId, periodId)
  ],
  container: ForecastClaim
});
