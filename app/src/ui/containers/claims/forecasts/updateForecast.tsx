import React from "react";
import * as ACC from "../../../components";
import * as Actions from "../../../redux/actions";
import { ContainerBase, ReduxContainer } from "../../containerBase";
import { ViewForecastRoute } from "./viewForecast";
import {
  CombinedData,
  Data,
  forecastDataLoadActions,
  forecastParams,
  Params,
  renderWarning,
  withDataEditor
} from "./common";

interface Callbacks {
  onChange: (partnerId: string, periodId: number, data: ForecastDetailsDTO[], combined: CombinedData) => void;
  saveAndReturn: (updateClaim: boolean, projectId: string, partnerId: string, periodId: number, data: CombinedData) => void;
}

class UpdateForecastComponent extends ContainerBase<Params, Data, Callbacks> {
  public render() {
    const Loader = ACC.TypedLoader<CombinedData>();
    return <Loader pending={this.props.combined} render={data => this.renderContents(data)} />;
  }

  saveAndReturn(data: CombinedData) {
    this.props.saveAndReturn(false, this.props.projectId, this.props.partnerId, this.props.periodId, data);
  }

  handleChange(data: ForecastDetailsDTO[], combined: CombinedData) {
    this.props.onChange(this.props.partnerId, this.props.periodId, data, combined);
  }

  public renderContents(combined: CombinedData) {
    const Form = ACC.TypedForm<ForecastDetailsDTO[]>();
    const editor = combined.editor!;

    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={ViewForecastRoute.getLink({ projectId: this.props.projectId, partnerId: this.props.partnerId, periodId: this.props.periodId })}>Back</ACC.BackLink>
        </ACC.Section>
        <ACC.ValidationSummary validation={editor.validator} compressed={false} />
        {renderWarning(combined)}
        <ACC.Projects.Title pageTitle="Update forecasts" project={combined.project} />
        <ACC.Section title={combined.partner.name + " forecasts table"} qa="partner-forecast" >
          <Form.Form
            data={editor.data}
            onChange={data => this.handleChange(data, combined)}
            onSubmit={() => this.saveAndReturn(combined)}
            qa="partner-forecast-form"
          >
            <ACC.Claims.ForecastTable data={combined} />
            <Form.Fieldset>
              <Form.Submit>Submit forecasts changes</Form.Submit>
              <ACC.Renderers.SimpleString>Changes last saved:
                <ACC.Renderers.ShortDateTime value={combined.claim.forecastLastModified} />
              </ACC.Renderers.SimpleString>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(UpdateForecastComponent);

const UpdateForecast = definition.connect({
  withData: (state, props) => withDataEditor(state, props),
  withCallbacks: dispatch => ({
    onChange: (partnerId, periodId, data, combined) => dispatch(Actions.validateForecastDetails(partnerId, periodId, data, combined.claimDetails, combined.golCosts, combined.costCategories)),
    saveAndReturn: (updateClaim, projectId, partnerId, periodId, data) => dispatch(Actions.saveForecastDetails(updateClaim, partnerId, periodId, data.editor!.data, data.claimDetails, data.golCosts, data.costCategories, () => dispatch(Actions.navigateTo(ViewForecastRoute.getLink({ projectId, partnerId, periodId })))))
  })
});

export const UpdateForecastRoute = definition.route({
  routeName: "updateForecast",
  routePath: "/projects/:projectId/claims/:partnerId/updateForecast/:periodId",
  getParams: forecastParams,
  getLoadDataActions: forecastDataLoadActions,
  container: UpdateForecast
});
