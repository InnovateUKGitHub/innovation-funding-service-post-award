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
import { ProjectRole } from "../../../../types";

interface Callbacks {
  onChange: (partnerId: string, data: ForecastDetailsDTO[], combined: ForecastData) => void;
  saveAndReturn: (updateClaim: boolean, projectId: string, partnerId: string, data: ForecastData) => void;
}

class UpdateForecastComponent extends ContainerBase<Params, PendingForecastData, Callbacks> {
  public render() {
    return <ACC.PageLoader pending={this.props.combined} render={data => this.renderContents(data)} />;
  }

  saveAndReturn(data: ForecastData) {
    this.props.saveAndReturn(false, this.props.projectId, this.props.partnerId, data);
  }

  handleChange(data: ForecastDetailsDTO[], combined: ForecastData) {
    this.props.onChange(this.props.partnerId, data, combined);
  }

  public renderContents(combined: ForecastData) {
    const Form = ACC.TypedForm<ForecastDetailsDTO[]>();
    const editor = combined.editor!;

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
            onChange={data => this.handleChange(data, combined)}
            onSubmit={() => this.saveAndReturn(combined)}
            qa="partner-forecast-form"
          >
            <ACC.Claims.ForecastTable data={combined} />
            <Form.Fieldset>
              <Form.Submit>Submit</Form.Submit>
              <ACC.Claims.ClaimLastModified partner={combined.partner} />
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
    onChange: (partnerId, data, combined) => dispatch(Actions.validateForecastDetails(partnerId, data, combined.claims, combined.claimDetails, combined.golCosts)),
    saveAndReturn: (updateClaim, projectId, partnerId, data) => dispatch(Actions.saveForecastDetails(updateClaim, partnerId, data.editor!.data, data.claims, data.claimDetails, data.golCosts, () => dispatch(Actions.navigateTo(ViewForecastRoute.getLink({ projectId, partnerId })))))
  })
});

export const UpdateForecastRoute = definition.route({
  routeName: "updateForecast",
  routePath: "/projects/:projectId/claims/:partnerId/updateForecast",
  getParams: forecastParams,
  getLoadDataActions: forecastDataLoadActions,
  container: UpdateForecast,
  accessControl: (user, params) => {
    const userRoles = user.roleInfo[params.projectId];
    if(!userRoles) return false;

    const partnerRoles = userRoles.partnerRoles[params.partnerId];
    return !!partnerRoles && !!(userRoles.projectRoles & ProjectRole.FinancialContact) && !!(partnerRoles & ProjectRole.FinancialContact);
  }
});
