import { DateTime } from "luxon";
import { ProjectParticipantsHoc } from "@ui/components/atomicDesign/atoms/providers/ProjectParticipants/project-participants";
import { Pending } from "../../../../shared/pending";
import { BaseProps, ContainerBase, defineRoute } from "../../containerBase";
import { GetProjectStatus } from "../../app/project-active";
import { ClaimsDashboardGuidance } from "./components/ClaimsDashboardGuidance";
import { DateFormat } from "@framework/constants/enums";
import { ProjectRole } from "@framework/constants/project";
import { ClaimDto } from "@framework/dtos/claimDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { formatDate } from "@framework/util/dateHelpers";
import { roundCurrency } from "@framework/util/numberHelper";
import { useStores } from "@ui/redux/storesProvider";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { PageLoader } from "@ui/components/bjss/loading";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { createTypedTable } from "@ui/components/atomicDesign/molecules/Table/Table";
import { ClaimPeriodDate } from "@ui/components/atomicDesign/organisms/claims/ClaimPeriodDate/claimPeriodDate";
import { ProjectBackLink } from "@ui/components/atomicDesign/organisms/projects/ProjectBackLink/projectBackLink";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import {
  ClaimDetailsLink,
  getClaimDetailsStatusType,
} from "@ui/components/atomicDesign/organisms/claims/ClaimDetailsLink/claimDetailsLink";

export interface ClaimDashboardPageParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

interface Data {
  projectDetails: Pending<ProjectDto>;
  partnerDetails: Pending<PartnerDto>;
  previousClaims: Pending<ClaimDto[]>;
  currentClaim: Pending<ClaimDto | null>;
}

const ClaimTable = createTypedTable<ClaimDto>();

class Component extends ContainerBase<ClaimDashboardPageParams, Data> {
  public render() {
    const combined = Pending.combine({
      project: this.props.projectDetails,
      partner: this.props.partnerDetails,
      previousClaims: this.props.previousClaims,
      currentClaim: this.props.currentClaim,
    });

    return (
      <PageLoader
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
      <Page
        pageTitle={<Title {...project} />}
        backLink={<ProjectBackLink routes={this.props.routes} projectId={project.id} />}
        project={project}
        partner={partner}
      >
        <ProjectParticipantsHoc>
          {state => state.isMultipleParticipants && <ClaimsDashboardGuidance {...partner} />}
        </ProjectParticipantsHoc>

        <Messages messages={this.props.messages} />
        <Section qa="current-claims-section" title={x => x.claimsLabels.openSectionTitle}>
          {this.renderCurrentClaims(
            currentClaim ? [currentClaim] : [],
            "current-claims-table",
            project,
            partner,
            previousClaims,
          )}
        </Section>
        <Section qa="previous-claims-section" title={x => x.claimsLabels.closedSectionTitle}>
          {this.renderPreviousClaims(previousClaims, "previous-claims-table", project, partner)}
        </Section>
      </Page>
    );
  }

  private renderNoCurrentClaimsMessage(endDate: Date, previousClaims: ClaimDto[]) {
    const date = DateTime.fromJSDate(endDate).plus({ days: 1 }).toJSDate();
    // If the final claim has been approved
    if (previousClaims && previousClaims.find(x => x.isFinalClaim)) {
      return (
        <SimpleString qa="yourFinalClaimApprovedNotificationMessage">
          <Content value={x => x.claimsMessages.noRemainingClaims} />
        </SimpleString>
      );
    }
    return (
      <SimpleString>
        <Content
          value={x => x.claimsMessages.noOpenClaims({ nextClaimStartDate: formatDate(date, DateFormat.FULL_DATE) })}
        />
      </SimpleString>
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
      <SimpleString>
        <Content value={x => x.claimsMessages.noClosedClaims} />
      </SimpleString>
    );
  }

  private renderClaimsTable(
    data: ClaimDto[],
    tableQa: string,
    project: ProjectDto,
    partner: PartnerDto,
    tableCaption?: string,
  ) {
    return (
      <GetProjectStatus>
        {projectStatus => (
          <ClaimTable.Table
            data={data.sort((a, b) => a.periodId - b.periodId)}
            bodyRowFlag={claim => (projectStatus.isActive ? this.hasBodyRowFlag(claim, project, partner) : null)}
            qa={tableQa}
            caption={tableCaption}
          >
            <ClaimTable.Custom
              header={x => x.claimsLabels.period}
              qa="period"
              value={x => <ClaimPeriodDate claim={x} />}
            />
            <ClaimTable.Currency
              header={x => x.claimsLabels.forecastCosts}
              qa="forecast-cost"
              value={x => x.forecastCost}
            />
            <ClaimTable.Currency header={x => x.claimsLabels.actualCosts} qa="actual-cost" value={x => x.totalCost} />
            <ClaimTable.Currency
              header={x => x.claimsLabels.difference}
              qa="diff"
              value={x => roundCurrency(x.forecastCost - x.totalCost)}
            />
            <ClaimTable.Custom header={x => x.claimsLabels.status} qa="status" value={x => x.statusLabel} />
            <ClaimTable.ShortDate
              header={x => x.claimsLabels.lastUpdatedDate}
              qa="date"
              value={x => x.paidDate || x.approvedDate || x.lastModifiedDate}
            />
            <ClaimTable.Custom
              header={x => x.claimsLabels.actionHeader}
              hideHeader
              qa="link"
              value={x => <ClaimDetailsLink claim={x} project={project} partner={partner} routes={this.props.routes} />}
            />
          </ClaimTable.Table>
        )}
      </GetProjectStatus>
    );
  }

  private hasBodyRowFlag(claim: ClaimDto, project: ProjectDto, partner: PartnerDto) {
    const linkType = getClaimDetailsStatusType({ claim, project, partner });

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
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
  }),
  accessControl: (auth, params) => {
    const isFC = auth.forPartner(params.projectId, params.partnerId).hasRole(ProjectRole.FinancialContact);
    const isMoOrPm = auth
      .forProject(params.projectId)
      .hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);

    return isFC && !isMoOrPm;
  },
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.claimsDashboard.title),
});
