import React from "react";
import * as ACC from "../../../components";
import * as Actions from "../../../redux/actions";
import { ContainerBase, ReduxContainer } from "../../containerBase";
import { ViewForecastRoute } from "./viewForecast";
import {
  ForecastData,
  forecastDataLoadActions,
  forecastParams,
  Params,
  PendingForecastData,
  renderWarning,
  withDataEditor,
} from "./common";

interface Callbacks {
  onChange: (partnerId: string, periodId: number, data: ForecastDetailsDTO[], combined: ForecastData) => void;
  saveAndReturn: (updateClaim: boolean, projectId: string, partnerId: string, periodId: number, data: ForecastData) => void;
}

class UpdateForecastComponent extends ContainerBase<Params, PendingForecastData, Callbacks> {
  public render() {
    return <ACC.PageLoader pending={this.props.combined} render={data => this.renderContents(data)} />;
  }

  saveAndReturn(data: ForecastData, periodId: number) {
    this.props.saveAndReturn(false, this.props.projectId, this.props.partnerId, periodId, data);
  }

  handleChange(data: ForecastDetailsDTO[], combined: ForecastData, periodId: number) {
    this.props.onChange(this.props.partnerId, periodId, data, combined);
  }

  public renderContents(combined: ForecastData) {
    const Form = ACC.TypedForm<ForecastDetailsDTO[]>();
    const editor = combined.editor!;
    const periodId = combined.project.periodId;

    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={ViewForecastRoute.getLink({ projectId: this.props.projectId, partnerId: this.props.partnerId })}>Back</ACC.BackLink>
        </ACC.Section>
        <ACC.ErrorSummary error={editor && editor.error} />
        <ACC.ValidationSummary validation={editor.validator} compressed={false} />
        <ACC.Projects.Title pageTitle="Update forecasts" project={combined.project} />
        <ACC.Section title="" qa="partner-forecast" >
          {renderWarning(combined)}
          <Form.Form
            data={editor.data}
            onChange={data => this.handleChange(data, combined, periodId)}
            onSubmit={() => this.saveAndReturn(combined, periodId)}
            qa="partner-forecast-form"
          >
            <ACC.Claims.ForecastTable data={combined} periodId={periodId} />
            <Form.Fieldset>
              <Form.Submit>Submit</Form.Submit>
              <ACC.Claims.ClaimLastModified claim={combined.claim} />
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const definition = ReduxContainer.for<Params, PendingForecastData, Callbacks>(UpdateForecastComponent);

const UpdateForecast = definition.connect({
  withData: (state, props) => withDataEditor(state, props),
  withCallbacks: dispatch => ({
    onChange: (partnerId, periodId, data, combined) => dispatch(Actions.validateForecastDetails(partnerId, periodId, data, combined.claimDetails, combined.golCosts, combined.costCategories)),
    saveAndReturn: (updateClaim, projectId, partnerId, periodId, data) => dispatch(Actions.saveForecastDetails(updateClaim, partnerId, periodId, data.editor!.data, data.claimDetails, data.golCosts, data.costCategories, () => dispatch(Actions.navigateTo(ViewForecastRoute.getLink({ projectId, partnerId })))))
  })
});

export const UpdateForecastRoute = definition.route({
  routeName: "updateForecast",
  routePath: "/projects/:projectId/claims/:partnerId/updateForecast",
  getParams: forecastParams,
  getLoadDataActions: forecastDataLoadActions,
  container: UpdateForecast
});
