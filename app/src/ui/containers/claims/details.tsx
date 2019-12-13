import * as ACC from "../../components";
import React from "react";
import { Pending } from "../../../shared/pending";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import {
  ClaimDto,
  ClaimStatus,
  ClaimStatusChangeDto,
  ILinkInfo,
  PartnerDto,
  ProjectDto,
  ProjectRole,
} from "@framework/types";

import { StoresConsumer } from "@ui/redux";

interface Params {
  projectId: string;
  partnerId: string;
  periodId: number;
}

interface Data {
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  costCategories: Pending<CostCategoryDto[]>;
  claim: Pending<ClaimDto>;
  costsSummaryForPeriod: Pending<CostsSummaryForPeriodDto[]>;
  forecastData: Pending<ACC.Claims.ForecastData> | null;
  statusChanges: Pending<ClaimStatusChangeDto[]>;
}

interface CombinedData {
  project: ProjectDto;
  partner: PartnerDto;
  costCategories: CostCategoryDto[];
  claim: ClaimDto;
  claimDetails: CostsSummaryForPeriodDto[];
}

export class ClaimsDetailsComponent extends ContainerBase<Params, Data, {}> {

  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      costCategories: this.props.costCategories,
      claim: this.props.claim,
      claimDetails: this.props.costsSummaryForPeriod,
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private renderContents(data: CombinedData) {
    const isPmOrMo = (data.project.roles & (ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer)) !== ProjectRole.Unknown;
    const backLink = isPmOrMo ? this.props.routes.allClaimsDashboard.getLink({ projectId: data.project.id }) : this.props.routes.claimsDashboard.getLink({ projectId: data.project.id, partnerId: data.partner.id });

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={backLink}>Back to claims</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={data.project} />}
      >
        {data.claim.isFinalClaim && <ACC.ValidationMessage messageType="info" message="This is the final claim."/>}
        {this.renderTableSection(data)}
        {this.renderAccordionSection(data)}
        {this.renderCommentsFromFC(data.project, data.claim)}
      </ACC.Page>
    );
  }

  private renderTableSection(data: CombinedData) {
    return (
      <ACC.Section title={this.getClaimPeriodTitle(data)}>
        {this.renderTable(data)}
      </ACC.Section>
    );
  }

  private renderAccordionSection(data: CombinedData) {
    const isArchived = data.claim.status === ClaimStatus.PAID || data.claim.status === ClaimStatus.APPROVED;
    const isMO = data.project.roles & ProjectRole.MonitoringOfficer;
    const showForecast = this.props.forecastData && !(isArchived && isMO);
    return (
      <ACC.Section>
        <ACC.Accordion>
          {showForecast && this.renderForecastItem(this.props.forecastData!)}
          {this.renderLogsItem()}
        </ACC.Accordion>
      </ACC.Section>
    );
  }

  private renderCommentsFromFC(project: ProjectDto, claim: ClaimDto) {
    if (project.roles & ProjectRole.MonitoringOfficer && (claim.status === ClaimStatus.DRAFT || claim.status === ClaimStatus.MO_QUERIED) && claim.comments) {
      return (
        <ACC.Section title="Comments" qa="additionalComments">
          <ACC.Renderers.SimpleString multiline={true}>
            {claim.comments}
          </ACC.Renderers.SimpleString>
        </ACC.Section>
      );
    }

    return null;
  }

  private renderTable(data: CombinedData) {
    const isFC = (data.partner.roles & ProjectRole.FinancialContact) === ProjectRole.FinancialContact;

    if (isFC) {
      return <ACC.Claims.ClaimTable getLink={x => this.getLink(x, data.project, data.partner)} standardOverheadRate={this.props.config.standardOverheadRate} {...data} />;
    }

    return <ACC.Claims.ClaimReviewTable getLink={x => this.getLink(x, data.project, data.partner)} standardOverheadRate={this.props.config.standardOverheadRate} {...data} />;
  }

  private getLink(costCategoryId: string, project: ProjectDto, partner: PartnerDto): ILinkInfo | null {
    // can only link if monitoring officer for project or, pm or fc at partner level
    // ie pm can not see other partners line items but can see own
    const isMo = !!(project.roles & ProjectRole.MonitoringOfficer);
    const isPartnerPM = !!(partner.roles & ProjectRole.ProjectManager);
    const isFC = !!(partner.roles & ProjectRole.FinancialContact);

    if (isMo || isPartnerPM || isFC) {
      return this.props.routes.claimLineItems.getLink({ partnerId: this.props.partnerId, projectId: this.props.projectId, periodId: this.props.periodId, costCategoryId });
    }
    return null;
  }

  private getClaimPeriodTitle(data: CombinedData) {
    return <ACC.Claims.ClaimPeriodDate claim={data.claim} partner={data.partner} />;
  }

  private renderForecastItem(pendingForecastData: Pending<ACC.Claims.ForecastData>) {
    return (
      <ACC.AccordionItem title="Forecast" qa="forecast-accordion">
        <ACC.Loader
          pending={pendingForecastData}
          render={(forecastData) => (
            <ACC.Claims.ForecastTable data={forecastData} hideValidation={true}/>
          )}
        />
      </ACC.AccordionItem>
    );
  }

  private renderLogsItem() {
    return (
      <ACC.AccordionItem title="Status and comments log" qa="claim-status-change-accordion">
        {/* Keeping logs inside loader because accordion defaults to closed*/}
        <ACC.Loader
          pending={this.props.statusChanges}
          render={(statusChanges) => (
            <ACC.Logs qa="claim-status-change-table" data={statusChanges} />
          )}
        />
      </ACC.AccordionItem>
    );
  }
}

const ClaimsDetailsContainer = (props: Params & BaseProps) => (
  <StoresConsumer>
    {
      stores => {
        const auth = stores.users.getCurrentUserAuthorisation();
        const isMoOrPM = auth.forProject(props.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
        const isFC = auth.forPartner(props.projectId, props.partnerId).hasRole(ProjectRole.FinancialContact);

        const project = stores.projects.getById(props.projectId);
        const partner = stores.partners.getById(props.partnerId);
        const costCategories = stores.costCategories.getAll();
        const claim = stores.claims.get(props.partnerId, props.periodId);

        const forecastData: Pending<ACC.Claims.ForecastData> | null = isMoOrPM && !isFC ? Pending.combine({
          project,
          partner,
          claim,
          claims: stores.claims.getAllClaimsForPartner(props.partnerId),
          claimDetails: stores.claimDetails.getAllByPartner(props.partnerId),
          forecastDetails: stores.forecastDetails.getAllByPartner(props.partnerId),
          golCosts: stores.forecastGolCosts.getAllByPartner(props.partnerId),
          costCategories,
        }) : null;

        return (
          <ClaimsDetailsComponent
            project={project}
            partner={partner}
            costCategories={costCategories}
            claim={claim}
            forecastData={forecastData}
            statusChanges={stores.claims.getStatusChanges(props.projectId, props.partnerId, props.periodId)}
            costsSummaryForPeriod={stores.costsSummaries.getForPeriod(props.projectId, props.partnerId, props.periodId)}
            {...props}
          />
        );
      }
    }
  </StoresConsumer>
);

export const ClaimsDetailsRoute = defineRoute({
  routeName: "claimDetails",
  routePath: "/projects/:projectId/claims/:partnerId/details/:periodId",
  container: ClaimsDetailsContainer,
  getParams: (route) => ({ projectId: route.params.projectId, partnerId: route.params.partnerId, periodId: parseInt(route.params.periodId, 10) }),
  accessControl: (auth, params) => auth.forProject(params.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager) || auth.forPartner(params.projectId, params.partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: () => ({
    displayTitle: "Claim",
    htmlTitle: "View claim"
  }),
});
