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
import { ProjectRole } from "../../../../types";

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

    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={PrepareClaimRoute.getLink({ periodId: this.props.periodId, projectId: this.props.projectId, partnerId: this.props.partnerId })}>Back to claim</ACC.BackLink>
        </ACC.Section>
        <ACC.ErrorSummary error={editor.error} />
        <ACC.ValidationSummary validation={editor.validator} compressed={false} />
        <ACC.Projects.Title pageTitle="Update forecast" project={combined.project} />
        <ACC.Section qa="partner-name">
          {renderWarning(combined)}
          <Form.Form
            data={editor.data}
            onChange={data => this.handleChange(data, combined)}
            onSubmit={() => this.saveAndReturn(combined, true, this.props.periodId)}
            qa="claim-forecast-form"
          >
            <ACC.Claims.ForecastTable data={combined} />
            <Form.Fieldset>
              <Form.Submit>Submit forecast and claim</Form.Submit>
              <ACC.Claims.ClaimLastModified partner={data.partner} />
            </Form.Fieldset>
            <Form.Fieldset qa="save-button">
              <Form.Button name="save" onClick={() => this.saveAndReturn(combined, false, this.props.periodId)}>Save and return to claim</Form.Button>
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
    onChange: (partnerId, data, combined) => dispatch(Actions.validateForecastDetails(partnerId, data, combined.claims, combined.claimDetails, combined.golCosts)),
    saveAndReturn: (updateClaim, projectId, partnerId, periodId, data) => dispatch(Actions.saveForecastDetails(updateClaim, partnerId, data.editor!.data, data.claims, data.claimDetails, data.golCosts, () => updateRedirect(updateClaim, dispatch, projectId, partnerId, periodId)))
  })
});

export const ClaimForecastRoute = definition.route({
  routeName: "claimForecast",
  routePath: "/projects/:projectId/claims/:partnerId/forecast/:periodId",
  getParams: (route) => ({ projectId: route.params.projectId, partnerId: route.params.partnerId, periodId: parseInt(route.params.periodId, 10) }),
  getLoadDataActions: forecastDataLoadActions,
  container: ForecastClaim,
  accessControl: (user, params) => {
    const userRoles = user.roleInfo[params.projectId];
    if(!userRoles) return false;

    const partnerRoles = userRoles.partnerRoles[params.partnerId];
    return !!partnerRoles && !!(userRoles.projectRoles & ProjectRole.FinancialContact) && !!(partnerRoles & ProjectRole.FinancialContact);
  }
});
