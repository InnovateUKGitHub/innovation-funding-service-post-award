import React from "react";
import * as ACC from "@ui/components";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { ClaimDto, PartnerDto, PartnerStatus, ProjectDto, ProjectRole, ProjectStatus } from "@framework/dtos";
import { Pending } from "@shared/pending";
import { PrepareClaimRoute } from "@ui/containers";
import { StoresConsumer } from "@ui/redux";
import { PartnerName } from "@ui/components";

interface Params {
  projectId: string;
  partnerId: string;
}

interface Data {
  data: Pending<ACC.Claims.ForecastData>;
}

class ViewForecastComponent extends ContainerBase<Params, Data, {}> {
  public render() {
    return <ACC.PageLoader pending={this.props.data} render={data => this.renderContents(data)} />;
  }

  public renderContents(data: ACC.Claims.ForecastData) {
    const isFc = !!(data.partner.roles & ProjectRole.FinancialContact);
    // MO, PM & FC/PM should see partner name
    const isMoPm = !!(data.project.roles & (ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer));
    const partnerName = isMoPm ? <PartnerName partner={data.partner}/> : null;
    const backLink = isMoPm ? this.props.routes.forecastDashboard.getLink({ projectId: data.project.id }) : this.props.routes.projectOverview.getLink({ projectId: data.project.id });
    const backText = isMoPm ? <ACC.Content value={x => x.forecastsDetails.moOrPmBackLink}/> : <ACC.Content value={x => x.forecastsDetails.backLink}/>;

    return (
      <ACC.Page
        pageTitle={<ACC.Projects.Title project={data.project} />}
        backLink={<ACC.BackLink route={backLink}>{backText}</ACC.BackLink>}
        project={data.project}
        partner={data.partner}
      >
        {this.renderFinalClaimMessage(data, isFc)}
        <ACC.Section title={partnerName} qa="partner-name" className="govuk-!-padding-bottom-3">
          <ACC.Renderers.Messages messages={this.props.messages} />
          <ACC.Forecasts.Warning {...data}/>
          {(isFc && data.partner.newForecastNeeded) && <ACC.ValidationMessage qa="period-change-warning" messageType="info" message={x => x.forecastsDetails.messages.projectChangeWarning}/>}
          {this.renderOverheadsRate(data.partner.overheadRate)}
          <ACC.Claims.ForecastTable data={data} hideValidation={isMoPm} />
        </ACC.Section>
        <ACC.Section qa="viewForecastUpdate">
          <ACC.Claims.ClaimLastModified partner={data.partner} />
          {this.renderUpdateSection(data.project, data.partner, data.claims)}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderFinalClaimMessage(data: ACC.Claims.ForecastData, isFc: boolean) {
    const finalClaim = data.claims.find(x => x.isFinalClaim);

    if (!finalClaim) return null;

    const claimPageLink = PrepareClaimRoute.getLink({projectId: data.project.id, partnerId: data.partner.id, periodId: data.project.periodId});
    const isClaimApprovedOrPaid = finalClaim.isApproved || finalClaim.paidDate;

    if (isFc) {
      return (isClaimApprovedOrPaid || data.partner.isWithdrawn)
        ? <ACC.ValidationMessage qa="final-claim-message-FC" messageType="info" message={x => x.forecastsDetails.messages.projectEnded}/>
        : <ACC.ValidationMessage qa="final-claim-message-FC" messageType="info" message={<span><ACC.Content value={x => x.components.forecastDetails.finalClaimMessageFC} /><ACC.Link route={claimPageLink} styling="Link"><ACC.Content value={x => x.components.forecastDetails.submitLink} /></ACC.Link>.</span>}/>;
    }

    const isPm = data.project.roles & (ProjectRole.ProjectManager);

    if (isPm) return null;

    return finalClaim.isApproved
      ? <ACC.ValidationMessage qa="final-claim-message-MO" messageType="info" message={<React.Fragment><PartnerName partner={data.partner}/><ACC.Content value={x => x.components.forecastDetails.finalClaimMessageMO} /></React.Fragment>}/>
      : <ACC.ValidationMessage qa="final-claim-message-MO" messageType="info" message={<React.Fragment><PartnerName partner={data.partner}/><ACC.Content value={x => x.components.forecastDetails.finalClaimDueMessageMO} /></React.Fragment>}/>;
  }

  private renderOverheadsRate(overheadRate: number | null) {
    if (overheadRate === null || overheadRate === undefined) return null;

    return <ACC.Renderers.SimpleString qa="overhead-costs"><ACC.Content value={x => x.forecastsDetails.labels.overheadCosts}/><ACC.Renderers.Percentage value={overheadRate} /></ACC.Renderers.SimpleString>;
  }

  private renderUpdateSection(project: ProjectDto, partner: PartnerDto, claims: ClaimDto[]) {
    const finalClaim = claims.find(x => x.isFinalClaim);

    if (project.status === ProjectStatus.OnHold) return null;
    if (!(partner.roles & ProjectRole.FinancialContact)) return null;
    if (partner.isWithdrawn) return null;
    if (finalClaim) return null;
    if (partner.partnerStatus === PartnerStatus.OnHold) return null;

    return <ACC.Link id="update-forecast" styling="PrimaryButton" route={this.props.routes.forecastUpdate.getLink({ projectId: project.id, partnerId: partner.id })}><ACC.Content value={x => x.forecastsDetails.updateForecastLink}/></ACC.Link>;
  }
}

const ViewForecastContainer = (props: Params & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <ViewForecastComponent
        data={Pending.combine({
          project: stores.projects.getById(props.projectId),
          partner: stores.partners.getById(props.partnerId),
          claim: stores.claims.getActiveClaimForPartner(props.partnerId),
          claims: stores.claims.getAllClaimsForPartner(props.partnerId),
          claimDetails: stores.claimDetails.getAllByPartner(props.partnerId),
          forecastDetails: stores.forecastDetails.getAllByPartner(props.partnerId),
          golCosts: stores.forecastGolCosts.getAllByPartner(props.partnerId),
          costCategories: stores.costCategories.getAll(),
        })}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const ForecastDetailsRoute = defineRoute({
  routeName: "viewForecast",
  routePath: "/projects/:projectId/claims/:partnerId/viewForecast",
  container: ViewForecastContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
  }),
  accessControl: (auth, { projectId, partnerId }) => {
    const isMOOrPM = auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer);
    const isFC = auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact);
    return isMOOrPM || isFC;
  },
  getTitle: ({content}) => content.forecastsDetails.title()
});
