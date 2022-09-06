import { ClaimDto, PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { DateTime } from "luxon";
import { getClaimDetailsLinkType } from "@ui/components/claims/claimDetailsLink";
import { useStores } from "@ui/redux";
import { roundCurrency } from "@framework/util";
import { ProjectParticipantsHoc } from "@ui/features/project-participants";
import { Pending } from "../../../shared/pending";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as Acc from "../../components";

import { GetProjectStatus } from "../app/project-active";
import { ClaimsDashboardGuidance } from "./components";

export interface ClaimDashboardPageParams {
  projectId: string;
  partnerId: string;
}

interface Data {
  projectDetails: Pending<ProjectDto>;
  partnerDetails: Pending<PartnerDto>;
  previousClaims: Pending<ClaimDto[]>;
  currentClaim: Pending<ClaimDto | null>;
}

class Component extends ContainerBase<ClaimDashboardPageParams, Data, {}> {
  public render() {
    const combined = Pending.combine({
      project: this.props.projectDetails,
      partner: this.props.partnerDetails,
      previousClaims: this.props.previousClaims,
      currentClaim: this.props.currentClaim,
    });

    return (
      <Acc.PageLoader
        pending={combined}
        render={x => this.renderContents(x.project, x.partner, x.currentClaim, x.previousClaims)}
      />
    );
  }

  private renderContents(
    project: ProjectDto,
    partner: PartnerDto,
    currentClaim: ClaimDto | null,
    previousClaims: ClaimDto[],
  ) {
    return (
      <Acc.Page
        pageTitle={<Acc.Projects.Title {...project} />}
        backLink={<Acc.Projects.ProjectBackLink project={project} routes={this.props.routes} />}
        project={project}
        partner={partner}
      >
        <ProjectParticipantsHoc>
          {state => state.isMultipleParticipants && <ClaimsDashboardGuidance {...partner} />}
        </ProjectParticipantsHoc>

        <Acc.Renderers.Messages messages={this.props.messages} />
        <Acc.Section qa="current-claims-section" title={x => x.claimsDashboard.labels.openSectionTitle}>
          {this.renderCurrentClaims(
            currentClaim ? [currentClaim] : [],
            "current-claims-table",
            project,
            partner,
            previousClaims,
          )}
        </Acc.Section>
        <Acc.Section qa="previous-claims-section" title={x => x.claimsDashboard.labels.closedSectionTitle}>
          {this.renderPreviousClaims(previousClaims, "previous-claims-table", project, partner)}
        </Acc.Section>
      </Acc.Page>
    );
  }

  private renderNoCurrentClaimsMessage(endDate: Date, previousClaims: ClaimDto[]) {
    const date = DateTime.fromJSDate(endDate).plus({ days: 1 }).toJSDate();
    // If the final claim has been approved
    if (previousClaims && previousClaims.find(x => x.isFinalClaim)) {
      return (
        <Acc.Renderers.SimpleString qa="yourFinalClaimApprovedNotificationMessage">
          <Acc.Content value={x => x.claimsDashboard.messages.noRemainingClaims} />
        </Acc.Renderers.SimpleString>
      );
    }
    return (
      <Acc.Renderers.SimpleString>
        <Acc.Content value={x => x.claimsDashboard.messages.noOpenClaimsMessage(date)} />
      </Acc.Renderers.SimpleString>
    );
  }

  private renderCurrentClaims(
    currentClaims: ClaimDto[],
    tableQa: string,
    project: ProjectDto,
    partner: PartnerDto,
    previousClaims: ClaimDto[],
  ) {
    if (currentClaims.length) {
      return this.renderClaimsTable(currentClaims, tableQa, project, partner, "Open");
    }

    if (project.periodEndDate) {
      return this.renderNoCurrentClaimsMessage(project.periodEndDate, previousClaims);
    }

    return null;
  }

  private renderPreviousClaims(data: ClaimDto[], tableQa: string, project: ProjectDto, partner: PartnerDto) {
    if (data.length) {
      return this.renderClaimsTable(data, tableQa, project, partner, "Closed");
    }

    return (
      <Acc.Renderers.SimpleString>
        <Acc.Content value={x => x.claimsDashboard.messages.noClosedClaims} />
      </Acc.Renderers.SimpleString>
    );
  }

  private renderClaimsTable(
    data: ClaimDto[],
    tableQa: string,
    project: ProjectDto,
    partner: PartnerDto,
    tableCaption?: string,
  ) {
    const ClaimTable = Acc.TypedTable<ClaimDto>();

    return (
      <GetProjectStatus>
        {projectStatus => (
          <ClaimTable.Table
            data={data}
            bodyRowFlag={claim => (projectStatus.isActive ? this.hasBodyRowFlag(claim, project, partner) : null)}
            qa={tableQa}
            caption={tableCaption}
          >
            <ClaimTable.Custom
              header={x => x.claimsDashboard.labels.period}
              qa="period"
              value={x => <Acc.Claims.ClaimPeriodDate claim={x} />}
            />

            <ClaimTable.Currency
              header={x => x.claimsDashboard.labels.forecastCosts}
              qa="forecast-cost"
              value={x => x.forecastCost}
            />

            <ClaimTable.Currency
              header={x => x.claimsDashboard.labels.actualCosts}
              qa="actual-cost"
              value={x => x.totalCost}
            />

            <ClaimTable.Currency
              header={x => x.claimsDashboard.labels.difference}
              qa="diff"
              value={x => roundCurrency(x.forecastCost - x.totalCost)}
            />
            <ClaimTable.Custom header={x => x.claimsDashboard.labels.status} qa="status" value={x => x.statusLabel} />

            <ClaimTable.ShortDate
              header={x => x.claimsDashboard.labels.lastUpdated}
              qa="date"
              value={x => x.paidDate || x.approvedDate || x.lastModifiedDate}
            />
            <ClaimTable.Custom
              header={x => x.claimsDashboard.labels.actionHeader}
              hideHeader
              qa="link"
              value={x => (
                <Acc.Claims.ClaimDetailsLink claim={x} project={project} partner={partner} routes={this.props.routes} />
              )}
            />
          </ClaimTable.Table>
        )}
      </GetProjectStatus>
    );
  }

  private hasBodyRowFlag(claim: ClaimDto, project: ProjectDto, partner: PartnerDto) {
    const linkType = getClaimDetailsLinkType({ claim, project, partner });

    return linkType === "edit" ? "edit" : null;
  }
}

const ClaimsDashboardRouteContainer = (props: ClaimDashboardPageParams & BaseProps) => {
  const stores = useStores();

  return (
    <Component
      {...props}
      projectDetails={stores.projects.getById(props.projectId)}
      partnerDetails={stores.partners.getById(props.partnerId)}
      previousClaims={stores.claims.getInactiveClaimsForPartner(props.partnerId)}
      currentClaim={stores.claims.getActiveClaimForPartner(props.partnerId)}
    />
  );
};

export const ClaimsDashboardRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "claimsDashboard",
  routePath: "/projects/:projectId/claims/",
  routePathWithQuery: "/projects/:projectId/claims?:partnerId",
  container: ClaimsDashboardRouteContainer,
  getParams: route => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
  }),
  accessControl: (auth, params) => {
    const isFC = auth.forPartner(params.projectId, params.partnerId).hasRole(ProjectRole.FinancialContact);
    const isMoOrPm = auth
      .forProject(params.projectId)
      .hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);

    return isFC && !isMoOrPm;
  },
  getTitle: ({ content }) => content.claimsDashboard.title(),
});
