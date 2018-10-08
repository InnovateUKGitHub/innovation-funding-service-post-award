import React from "react";
import {ContainerBase, ReduxContainer} from "../containerBase";
import * as ACC from "../../components";
import * as Actions from "../../redux/actions/thunks";
import {Pending} from "../../../shared/pending";
import * as Dtos from "../../models";
import {routeConfig} from "../../routing";
import {IEditorStore} from "../../redux/reducers/editorsReducer";
import {ClaimDtoValidator} from "../../validators/claimDtoValidator";
import {ClaimsDashboardRoute} from "./dashboard";
import {ClaimDto} from "../../models";

interface Params {
  projectId: string;
  partnerId: string;
  periodId: number;
}
interface Data {
  project: Pending<Dtos.ProjectDto>;
  claim: Pending<Dtos.ClaimDto>;
  partner: Pending<Dtos.PartnerDto>;
  editor: IEditorStore<Dtos.ClaimDto, ClaimDtoValidator>;
}

interface CombinedData {
  project: Dtos.ProjectDto;
  partner: Dtos.PartnerDto;
  claim: Dtos.ClaimDto;
}

interface Callbacks {
  saveAndReturn: (dto: ClaimDto, projectId: string, partnerId: string, periodId: number) => void;
  onChange: (partnerId: string, periodId: number, dto: ClaimDto) => void;
}

export class ClaimForecastComponent extends ContainerBase<Params, Data, Callbacks> {

  public render() {
    const combined = Pending.combine(
      this.props.project,
      this.props.partner,
      this.props.claim,
      (project, partner, claim) => ({ project, partner, claim })
    );

    const Loader = ACC.TypedLoader<CombinedData>();
    return <Loader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private saveAndReturn() {
    this.props.saveAndReturn(this.props.editor.data, this.props.projectId, this.props.partnerId, this.props.periodId);
  }

  public renderContents({ project, partner }: CombinedData) {
    const Form = ACC.TypedForm<Dtos.ClaimDto>();

    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={routeConfig.prepareClaim.getLink({ projectId: project.id, partnerId: partner.id, periodId: this.props.periodId })}>Back</ACC.BackLink>
        </ACC.Section>
        <ACC.Projects.Title pageTitle="Claim" project={project} />
        <ACC.Section>
          <Form.Form data={this.props.editor.data} onChange={(dto) => this.props.onChange(this.props.partnerId, this.props.periodId, dto)} onSubmit={() => this.saveAndReturn()}>
            <Form.Fieldset>
              <Form.Submit>Submit claim and forecast changes</Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

// TODO extract shared function?
const getEditor = (editor: IEditorStore<Dtos.ClaimDto, ClaimDtoValidator>, original: Pending<Dtos.ClaimDto>) => {
  if (editor) {
    return editor;
  }
  return original.then(x => {
    const clone = JSON.parse(JSON.stringify(x!)) as Dtos.ClaimDto;
    const updatedClaimDto = { ...clone, status: "Submitted" };
    return {
      data: updatedClaimDto,
      validator: new ClaimDtoValidator(x!, false),
      error: null
    };
  }).data!;
};

const goBack = (dispatch: any, projectId: string, partnerId: string) => {
  dispatch(Actions.navigateTo(ClaimsDashboardRoute.getLink({projectId, partnerId})));
};

const definition = ReduxContainer.for<Params, Data, Callbacks>(ClaimForecastComponent);

export const ForecastClaim = definition.connect({
  withData: (store, params) => ({
    project: Pending.create(store.data.project[params.projectId]),
    claim: Pending.create(store.data.claim[params.partnerId + "_" + params.periodId]),
    partner: Pending.create(store.data.partner[params.partnerId]),
    editor: getEditor(store.editors.claim[params.partnerId + "_" + params.periodId], Pending.create(store.data.claim[params.partnerId + "_" + params.periodId]))
  }),
  withCallbacks: (dispatch) => ({
    onChange: (partnerId, periodId, dto) => dispatch(Actions.validateClaim(partnerId, periodId, dto)),
    saveAndReturn: (dto, projectId, partnerId, periodId) => dispatch(Actions.saveClaim(partnerId, periodId, dto, () => goBack(dispatch, projectId, partnerId)))
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
