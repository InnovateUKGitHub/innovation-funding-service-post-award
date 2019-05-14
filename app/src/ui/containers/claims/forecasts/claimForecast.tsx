import React from "react";
import * as ACC from "@ui/components";
import * as Actions from "@ui/redux/actions";
import { AllClaimsDashboardRoute, ClaimsDashboardRoute, PrepareClaimRoute } from "@ui/containers";
import { ContainerBase, ReduxContainer } from "@ui/containers/containerBase";
import { isNumber } from "@framework/util";
import { ProjectDto, ProjectRole } from "@framework/types";
import { ForecastData, forecastDataLoadActions, PendingForecastData, renderWarning, withDataEditor, } from "./common";

export interface ClaimForcastParams {
  projectId: string;
  partnerId: string;
  periodId: number;
}
interface Callbacks {
  onChange: (partnerId: string, data: ForecastDetailsDTO[], combined: ForecastData) => void;
  saveAndReturn: (updateClaim: boolean, projectId: string, partnerId: string, periodId: number, data: ForecastData, message: string) => void;
}

class ClaimForecastComponent extends ContainerBase<ClaimForcastParams, PendingForecastData, Callbacks> {
  render() {
    return <ACC.PageLoader pending={this.props.combined} render={data => this.renderContents(data)} />;
  }

  saveAndReturn(data: ForecastData, updateClaim: boolean, periodId: number, message: string) {
    this.props.saveAndReturn(updateClaim, this.props.projectId, this.props.partnerId, periodId, data, message);
  }

  handleChange(data: ForecastDetailsDTO[], combined: ForecastData) {
    this.props.onChange(this.props.partnerId, data, combined);
  }

  renderOverheadsRate(overheadRate: number | null) {
    if(!isNumber(overheadRate)) return null;

    return <ACC.Renderers.SimpleString>Overhead costs: <ACC.Renderers.Percentage value={overheadRate}/></ACC.Renderers.SimpleString>;
  }

  renderContents(combined: ForecastData) {
    const Form = ACC.TypedForm<ForecastDetailsDTO[]>();
    const editor = combined.editor!;

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={PrepareClaimRoute.getLink({ periodId: this.props.periodId, projectId: this.props.projectId, partnerId: this.props.partnerId })}>Back to claim</ACC.BackLink>}
        error={editor.error}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title project={combined.project} />}
      >
        {this.renderOverheadsRate(combined.partner.overheadRate)}
        <ACC.Section qa="partner-name">
          {renderWarning(combined)}
          <Form.Form
            data={editor.data}
            onChange={data => this.handleChange(data, combined)}
            onSubmit={() => this.saveAndReturn(combined, true, this.props.periodId, "You have submitted your claim for this period.")}
            qa="claim-forecast-form"
          >
            <ACC.Claims.ForecastTable data={combined} />
            <Form.Fieldset>
              <Form.Submit>Submit forecast and claim</Form.Submit>
              <ACC.Claims.ClaimLastModified partner={combined.partner} />
            </Form.Fieldset>
            <Form.Fieldset qa="save-button">
              <Form.Button name="save" onClick={() => this.saveAndReturn(combined, false, this.props.periodId, "You have saved your claim.")}>Save and return to claim</Form.Button>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const updateRedirect = (updateClaim: boolean, dispatch: any, project: ProjectDto, partnerId: string, periodId: number) => {
  const projectId = project.id;

  if (!updateClaim) {
    return dispatch(Actions.navigateTo(PrepareClaimRoute.getLink({ projectId, partnerId, periodId })));
  }

  if (project.roles & ProjectRole.ProjectManager && project.roles & ProjectRole.FinancialContact) {
    return dispatch(Actions.navigateTo(AllClaimsDashboardRoute.getLink({ projectId })));
  }

  return dispatch(Actions.navigateTo(ClaimsDashboardRoute.getLink({ projectId, partnerId })));
};

const definition = ReduxContainer.for<ClaimForcastParams, PendingForecastData, Callbacks>(ClaimForecastComponent);

const ForecastClaim = definition.connect({
  withData: (state, props) => withDataEditor(state, props),
  withCallbacks: (dispatch) => ({
    onChange: (partnerId, data, combined) =>
      dispatch(Actions.validateForecastDetails(partnerId, data, combined.claims, combined.claimDetails, combined.golCosts)),
    saveAndReturn: (updateClaim, projectId, partnerId, periodId, data, message) =>
      dispatch(Actions.saveForecastDetails(
        updateClaim,
        projectId,
        partnerId,
        data.editor!.data,
        data.claims,
        data.claimDetails,
        data.golCosts,
        () => updateRedirect(updateClaim, dispatch, data.project, partnerId, periodId),
        message)
      )
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
