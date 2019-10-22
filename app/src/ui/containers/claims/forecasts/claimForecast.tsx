import React from "react";
import * as ACC from "@ui/components";
import * as Actions from "@ui/redux/actions";
import * as Selectors from "@ui/redux/selectors";
import { ContainerBase, ReduxContainer } from "@ui/containers/containerBase";
import { isNumber } from "@framework/util";
import { ProjectDto, ProjectRole } from "@framework/types";
import { ForecastData, forecastDataLoadActions} from "./common";
import { IRoutes } from "@ui/routing";
import { Pending } from "@shared/pending";
import { ForecastDetailsDtosValidator } from "@ui/validators";
import { IEditorStore } from "@ui/redux";

export interface ClaimForecastParams {
  projectId: string;
  partnerId: string;
  periodId: number;
}

interface Data {
  data: Pending<ForecastData>;
  editor: Pending<IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>>;
}

interface Callbacks {
  onChange: (partnerId: string, data: ForecastDetailsDTO[], combined: ForecastData) => void;
  saveAndReturn: (updateClaim: boolean, projectId: string, partnerId: string, periodId: number, data: ForecastDetailsDTO[], combined: ForecastData, message?: string) => void;
}

class ClaimForecastComponent extends ContainerBase<ClaimForecastParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ data: this.props.data, editor: this.props.editor });
    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.data, x.editor)} />;
  }

  saveAndReturn(data: ForecastDetailsDTO[], combined: ForecastData, updateClaim: boolean, periodId: number, message?: string) {
    this.props.saveAndReturn(updateClaim, this.props.projectId, this.props.partnerId, periodId, data, combined, message);
  }

  handleChange(data: ForecastDetailsDTO[], combined: ForecastData) {
    this.props.onChange(this.props.partnerId, data, combined);
  }

  renderOverheadsRate(overheadRate: number | null) {
    if (!isNumber(overheadRate)) return null;

    return <ACC.Renderers.SimpleString qa="overhead-costs">Overhead costs: <ACC.Renderers.Percentage value={overheadRate} /></ACC.Renderers.SimpleString>;
  }

  renderContents(combined: ForecastData, editor: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>) {
    const Form = ACC.TypedForm<ForecastDetailsDTO[]>();

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.prepareClaim.getLink({ periodId: this.props.periodId, projectId: this.props.projectId, partnerId: this.props.partnerId })}>Back to claim</ACC.BackLink>}
        error={editor.error}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title project={combined.project} />}
      >
        <ACC.Section qa="partner-name">
          <ACC.Renderers.AriaLive>
            <ACC.ValidationMessage messageType="info" message={`This is your last chance to change the forecast for period ${combined.project.periodId}.`} />
          </ACC.Renderers.AriaLive>
          <ACC.Forecasts.Warning {...combined} editor={editor}/>
          {this.renderOverheadsRate(combined.partner.overheadRate)}
          <Form.Form
            editor={editor}
            onChange={data => this.handleChange(data, combined)}
            onSubmit={() => this.saveAndReturn(editor.data, combined, true, this.props.periodId, "You have submitted your claim for this period.")}
            qa="claim-forecast-form"
          >
            <ACC.Claims.ForecastTable data={combined} editor={editor} isSubmitting={true} />
            <Form.Fieldset>
            <ACC.Claims.ClaimLastModified partner={combined.partner} />
              <Form.Submit>Submit forecast and claim</Form.Submit>
            </Form.Fieldset>
            <Form.Fieldset qa="save-button">
              <Form.Button name="save" onClick={() => this.saveAndReturn(editor.data, combined, false, this.props.periodId)}>Save and return to claim</Form.Button>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const updateRedirect = (updateClaim: boolean, dispatch: any, project: ProjectDto, partnerId: string, periodId: number, routes: IRoutes) => {
  const projectId = project.id;

  if (!updateClaim) {
    return dispatch(Actions.navigateTo(routes.prepareClaim.getLink({ projectId, partnerId, periodId })));
  }

  if (project.roles & ProjectRole.ProjectManager && project.roles & ProjectRole.FinancialContact) {
    return dispatch(Actions.navigateTo(routes.allClaimsDashboard.getLink({ projectId })));
  }

  return dispatch(Actions.navigateTo(routes.claimsDashboard.getLink({ projectId, partnerId })));
};

const definition = ReduxContainer.for<ClaimForecastParams, Data, Callbacks>(ClaimForecastComponent);

const ForecastClaim = definition.connect({
  withData: (state, props) => ({
    data: Pending.combine({
      project: Selectors.getActiveProject(props.projectId, state),
      partner: Selectors.getPartner(props.partnerId).getPending(state),
      claim: Selectors.getCurrentClaim(state, props.partnerId),
      claims: Selectors.findClaimsByPartner(props.partnerId).getPending(state),
      claimDetails: Selectors.findClaimDetailsByPartner(props.partnerId).getPending(state),
      forecastDetails: Selectors.findForecastDetailsByPartner(props.partnerId).getPending(state),
      golCosts: Selectors.findGolCostsByPartner(props.partnerId).getPending(state),
      costCategories: Selectors.getCostCategories().getPending(state),
    }),
    editor: Selectors.getForecastDetailsEditor(props.partnerId).get(state),
  }),
  withCallbacks: (dispatch, routes) => ({
    onChange: (partnerId, data, combined) => {
      dispatch(Actions.validateForecastDetails(partnerId, data, combined.claims, combined.claimDetails, combined.golCosts));
    },
    saveAndReturn: (updateClaim, projectId, partnerId, periodId, data, combined, message) => {
      dispatch(Actions.saveForecastDetails(
        updateClaim,
        projectId,
        partnerId,
        data,
        combined.claims,
        combined.claimDetails,
        combined.golCosts,
        () => updateRedirect(updateClaim, dispatch, combined.project, partnerId, periodId, routes),
        message
        )
      );
    }
  })
});

export const ClaimForecastRoute = definition.route({
  routeName: "claimForecast",
  routePath: "/projects/:projectId/claims/:partnerId/forecast/:periodId",
  getParams: (route) => ({ projectId: route.params.projectId, partnerId: route.params.partnerId, periodId: parseInt(route.params.periodId, 10) }),
  getLoadDataActions: forecastDataLoadActions,
  container: ForecastClaim,
  accessControl: (auth, { projectId, partnerId }) => auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: (store, params) => {
    return {
      htmlTitle: "Update forecast",
      displayTitle: "Update forecast"
    };
  }
});
