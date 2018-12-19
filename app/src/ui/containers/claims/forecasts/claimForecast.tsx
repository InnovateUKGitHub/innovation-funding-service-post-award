import React from "react";
import * as ACC from "../../../components";
import * as Actions from "../../../redux/actions";
import { ContainerBase, ReduxContainer } from "../../containerBase";
import { ClaimsDashboardRoute } from "../dashboard";
import { PrepareClaimRoute } from "../prepare";
import {
  ForecastData,
  forecastDataLoadActions,
  PendingForecastData,
  renderWarning,
  withDataEditor,
} from "./common";

export interface ClaimForcastParams {
  projectId: string;
  partnerId: string;
  periodId: number;
}
interface Callbacks {
  onChange: (partnerId: string, data: ForecastDetailsDTO[], combined: ForecastData) => void;
  saveAndReturn: (updateClaim: boolean, projectId: string, partnerId: string, periodId: number, data: ForecastData) => void;
}

class ClaimForecastComponent extends ContainerBase<ClaimForcastParams, PendingForecastData, Callbacks> {
  render() {
    return <ACC.PageLoader pending={this.props.combined} render={data => this.renderContents(data)} />;
  }

  saveAndReturn(data: ForecastData, updateClaim: boolean, periodId: number) {
    this.props.saveAndReturn(updateClaim, this.props.projectId, this.props.partnerId, periodId, data);
  }

  handleChange(data: ForecastDetailsDTO[], combined: ForecastData) {
    this.props.onChange(this.props.partnerId, data, combined);
  }

  renderContents(combined: ForecastData) {
    const Form = ACC.TypedForm<ForecastDetailsDTO[]>();
    const editor = combined.editor!;
    const periodId = combined.project.periodId;

    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={PrepareClaimRoute.getLink({ periodId, projectId: this.props.projectId, partnerId: this.props.partnerId })}>Back to claim</ACC.BackLink>
        </ACC.Section>
        <ACC.ErrorSummary error={editor.error} />
        <ACC.ValidationSummary validation={editor.validator} compressed={false} />
        <ACC.Projects.Title pageTitle="Update forecast" project={combined.project} />
        <ACC.Section qa="partner-name">
          {renderWarning(combined)}
          <Form.Form
            data={editor.data}
            onChange={data => this.handleChange(data, combined)}
            onSubmit={() => this.saveAndReturn(combined, true, periodId)}
            qa="claim-forecast-form"
          >
            <ACC.Claims.ForecastTable data={combined} projectPeriodId={periodId} />
            <Form.Fieldset>
              <Form.Submit>Submit forecast and claim</Form.Submit>
              <ACC.Claims.ClaimLastModified claim={combined.claim} />
            </Form.Fieldset>
            <Form.Fieldset qa="save-button">
              <Form.Button name="save" onClick={() => this.saveAndReturn(combined, false, periodId)}>Save and return to claim</Form.Button>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const updateRedirect = (updateClaim: boolean, dispatch: any, projectId: string, partnerId: string, periodId: number) => {
  return updateClaim
    ? dispatch(Actions.navigateTo(ClaimsDashboardRoute.getLink({ projectId, partnerId })))
    : dispatch(Actions.navigateTo(PrepareClaimRoute.getLink({ projectId, partnerId, periodId })));
};

const definition = ReduxContainer.for<ClaimForcastParams, PendingForecastData, Callbacks>(ClaimForecastComponent);

const ForecastClaim = definition.connect({
  withData: (state, props) => withDataEditor(state, props),
  withCallbacks: (dispatch) => ({
    onChange: (partnerId, data, combined) => dispatch(Actions.validateForecastDetails(partnerId, data, combined.claimDetails, combined.golCosts, combined.costCategories)),
    saveAndReturn: (updateClaim, projectId, partnerId, periodId, data) => dispatch(Actions.saveForecastDetails(updateClaim, partnerId, data.editor!.data, data.claimDetails, data.golCosts, data.costCategories, () => updateRedirect(updateClaim, dispatch, projectId, partnerId, periodId)))
  })
});

export const ClaimForecastRoute = definition.route({
  routeName: "claimForecast",
  routePath: "/projects/:projectId/claims/:partnerId/forecast/:periodId",
  getParams: (route) => ({ projectId: route.params.projectId, partnerId: route.params.partnerId, periodId: parseInt(route.params.periodId, 10) }),
  getLoadDataActions: forecastDataLoadActions,
  container: ForecastClaim
});
