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
  claimId: string;
}

interface Data {
  projectId: string;
  project: Pending<Dtos.ProjectDto>;
  partner: Pending<Dtos.PartnerDto>;
  claim: Pending<Dtos.ClaimDto>;
  editor: IEditorStore<Dtos.ClaimDto, ClaimDtoValidator>;
}

interface CombinedData {
  project: Dtos.ProjectDto;
  partner: Dtos.PartnerDto;
  claim: Dtos.ClaimDto;
}

interface Callbacks {
  saveAndReturn: (dto: ClaimDto, projectId: string, partnerId: string, claimId: string) => void;
  onChange: (dto: ClaimDto) => void;
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

  public renderContents({ project, partner, claim }: CombinedData) {
    const Form = ACC.TypedForm<Dtos.ClaimDto>();

    const saveAndReturn = () => {
      this.props.saveAndReturn(this.props.editor.data, project.id, partner.id, claim.id);
    };

    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={routeConfig.prepareClaim.getLink({ projectId: project.id, claimId: claim.id })}>Back</ACC.BackLink>
        </ACC.Section>
        <ACC.Projects.Title pageTitle="Claim" project={project} />
        <ACC.Section>
          <Form.Form data={this.props.editor.data} onChange={(dto) => this.props.onChange(dto)} onSubmit={() => saveAndReturn()}>
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
const getEditor = (claimId: string, editor: IEditorStore<Dtos.ClaimDto, ClaimDtoValidator>, original: Pending<Dtos.ClaimDto>) => {
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
    projectId: params.projectId,
    project: Pending.create(store.data.project[params.projectId]),
    partner: Pending.create(store.data.partner[params.partnerId]),
    claim: Pending.create(store.data.claim[params.claimId]),
    editor: getEditor(params.claimId, store.editors.claim[params.claimId], Pending.create(store.data.claim[params.claimId]))
  }),
  withCallbacks: (dispach) => ({
    onChange: (dto) => dispach(Actions.validateClaim(dto.id, dto)),
    saveAndReturn: (dto, projectId, partnerId, claimId) => dispach(Actions.saveClaim(claimId, dto, () => goBack(dispach, projectId, partnerId)))
  })
});

export const ClaimForecastRoute = definition.route({
  routeName: "claimForecast",
  routePath: "/projects/:projectId/partners/:partnerId/claims/:claimId/forecast",
  getParams: (route) => ({projectId: route.params.projectId, partnerId: route.params.partnerId, claimId: route.params.claimId}),
  getLoadDataActions: ({ projectId, partnerId, claimId }) => [
    Actions.loadProject(projectId),
    Actions.loadPartner(partnerId),
    Actions.loadClaim(claimId)
  ],
  container: ForecastClaim
});
