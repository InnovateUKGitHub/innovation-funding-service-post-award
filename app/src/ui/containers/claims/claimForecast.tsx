import React from "react";
import * as ACC from "@ui/components";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { isNumber } from "@framework/util";
import { ClaimDetailsSummaryDto, ClaimDto, ForecastDetailsDTO, GOLCostDto, ILinkInfo, PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { Pending } from "@shared/pending";
import { ForecastDetailsDtosValidator } from "@ui/validators";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";

export interface ClaimForecastParams {
  projectId: string;
  partnerId: string;
  periodId: number;
}

interface Data {
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  claim: Pending<ClaimDto | null>;
  claims: Pending<ClaimDto[]>;
  claimDetails: Pending<ClaimDetailsSummaryDto[]>;
  forecastDetails: Pending<ForecastDetailsDTO[]>;
  golCosts: Pending<GOLCostDto[]>;
  costCategories: Pending<CostCategoryDto[]>;
  editor: Pending<IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>>;
}

interface Callbacks {
  onUpdate: (saving: boolean, dto: ForecastDetailsDTO[], link?: ILinkInfo) => void;
}

class ClaimForecastComponent extends ContainerBase<ClaimForecastParams, Data, Callbacks> {
  render() {

    const combinedForecastData = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      claim: this.props.claim,
      claims: this.props.claims,
      claimDetails: this.props.claimDetails,
      forecastDetails: this.props.forecastDetails,
      golCosts: this.props.golCosts,
      costCategories: this.props.costCategories,
    });

    const combined = Pending.combine({ data: combinedForecastData, editor: this.props.editor });
    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.data, x.editor)} />;
  }

  renderOverheadsRate(overheadRate: number | null) {
    if (!isNumber(overheadRate)) return null;

    return <ACC.Renderers.SimpleString qa="overhead-costs"><ACC.Content value={x => x.claimForecast.overheadsCosts()}/><ACC.Renderers.Percentage value={overheadRate} /></ACC.Renderers.SimpleString>;
  }

  renderContents(combined: ACC.Claims.ForecastData, editor: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>) {
    const Form = ACC.TypedForm<ForecastDetailsDTO[]>();

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.claimDocuments.getLink({ projectId: this.props.projectId, partnerId: this.props.partnerId, periodId: this.props.periodId })}><ACC.Content value={x => x.claimForecast.backLink()}/></ACC.BackLink>}
        error={editor.error}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title project={combined.project} />}
      >
        <ACC.Section qa="partner-name">
          <ACC.Renderers.AriaLive>
            {combined.partner.newForecastNeeded && <ACC.ValidationMessage messageType="info" message={x => x.claimForecast.messages.frequencyChangeMessage} qa="period-change-warning" />}
            <ACC.ValidationMessage messageType="info" message={x => x.claimForecast.messages.lastChanceToChangeForecast(combined.project.periodId)} />
          </ACC.Renderers.AriaLive>
          <ACC.Forecasts.Warning {...combined} editor={editor} />
          {this.renderOverheadsRate(combined.partner.overheadRate)}
          <Form.Form
            editor={editor}
            onChange={data => this.props.onUpdate(false, data)}
            onSubmit={() => this.props.onUpdate(true, editor.data, this.props.routes.claimSummary.getLink({ projectId: this.props.projectId, partnerId: this.props.partnerId, periodId: this.props.periodId }))}
            qa="claim-forecast-form"
          >
            <ACC.Claims.ForecastTable data={combined} editor={editor} isSubmitting={true} />
            <Form.Fieldset qa="last-saved">
              <ACC.Claims.ClaimLastModified partner={combined.partner} />
            </Form.Fieldset>
            <Form.Fieldset qa="save-and-continue">
              <Form.Submit><ACC.Content value={x => x.claimForecast.continueToSummaryButton()} /></Form.Submit>
              <Form.Button name="save" onClick={() => this.props.onUpdate(true, editor.data, this.getBackLink(combined.project))}><ACC.Content value={x => x.claimForecast.saveAndReturnButton()} /></Form.Button>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private getBackLink(project: ProjectDto) {
    const isPmOrMo = (project.roles & (ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer)) !== ProjectRole.Unknown;
    return isPmOrMo
      ? this.props.routes.allClaimsDashboard.getLink({ projectId: project.id })
      : this.props.routes.claimsDashboard.getLink({ projectId: project.id, partnerId: this.props.partnerId });
  }
}

const ClaimForcastContainer = (props: ClaimForecastParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <ClaimForecastComponent
          project={stores.projects.getById(props.projectId)}
          partner={stores.partners.getById(props.partnerId)}
          claim={stores.claims.getActiveClaimForPartner(props.partnerId)}
          claims={stores.claims.getAllClaimsForPartner(props.partnerId)}
          claimDetails={stores.claimDetails.getAllByPartner(props.partnerId)}
          forecastDetails={stores.forecastDetails.getAllByPartner(props.partnerId)}
          golCosts={stores.forecastGolCosts.getAllByPartner(props.partnerId)}
          costCategories={stores.costCategories.getAll()}
          editor={stores.forecastDetails.getForecastEditor(props.partnerId)}
          onUpdate={(saving, dto, link) => {
            stores.forecastDetails.updateForcastEditor(saving, props.projectId, props.partnerId, dto, false,  "You have saved your claim.", () => {
              if (link) stores.navigation.navigateTo(link);
            });
          }}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const ClaimForecastRoute = defineRoute({
  routeName: "claimForecast",
  routePath: "/projects/:projectId/claims/:partnerId/forecast/:periodId",
  container: ClaimForcastContainer,
  getParams: (route) => ({ projectId: route.params.projectId, partnerId: route.params.partnerId, periodId: parseInt(route.params.periodId, 10) }),
  accessControl: (auth, { projectId, partnerId }) => auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: () => ({
    htmlTitle: "Update forecast",
    displayTitle: "Update forecast"
  })
});
