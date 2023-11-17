import { DateTime } from "luxon";
import { ProjectParticipantsHoc } from "@ui/components/atomicDesign/atoms/providers/ProjectParticipants/project-participants";
import { Pending } from "../../../../shared/pending";
import { BaseProps, defineRoute } from "../../containerBase";
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
  project: Pick<ProjectDto, "status" | "title" | "projectNumber" | "id" | "roles" | "periodEndDate">;
  partner: Pick<PartnerDto, "partnerStatus" | "isWithdrawn" | "roles" | "id" | "competitionType" | "overdueProject">;
  previousClaims: Pick<
    ClaimDto,
    | "status"
    | "isFinalClaim"
    | "periodId"
    | "periodEndDate"
    | "periodStartDate"
    | "forecastCost"
    | "totalCost"
    | "approvedDate"
    | "lastModifiedDate"
    | "statusLabel"
    | "paidDate"
  >[];
  currentClaim: Nullable<
    Pick<
      ClaimDto,
      | "status"
      | "isFinalClaim"
      | "periodId"
      | "periodEndDate"
      | "periodStartDate"
      | "forecastCost"
      | "totalCost"
      | "approvedDate"
      | "lastModifiedDate"
      | "statusLabel"
      | "paidDate"
    >
  >;
}

const ClaimTable =
  createTypedTable<
    Pick<
      ClaimDto,
      | "status"
      | "forecastCost"
      | "totalCost"
      | "statusLabel"
      | "paidDate"
      | "approvedDate"
      | "lastModifiedDate"
      | "periodId"
      | "periodEndDate"
      | "periodStartDate"
    >
  >();

const ClaimDashboardComponent = (props: BaseProps & Data & ClaimDashboardPageParams) => {
  const { project, partner, previousClaims, currentClaim } = props;
  return (
    <Page
      pageTitle={<Title title={project.title} projectNumber={project.projectNumber} />}
      backLink={<ProjectBackLink routes={props.routes} projectId={project.id} />}
      projectStatus={project.status}
      partnerStatus={partner.partnerStatus}
    >
      <ProjectParticipantsHoc>
        {state => state.isMultipleParticipants && <ClaimsDashboardGuidance {...partner} />}
      </ProjectParticipantsHoc>

      <Messages messages={props.messages} />
      <Section qa="current-claims-section" title={x => x.claimsLabels.openSectionTitle}>
        <CurrentClaims
          currentClaims={currentClaim ? [currentClaim] : []}
          tableQa="current-claims-table"
          project={project}
          partner={partner}
          previousClaims={previousClaims}
          routes={props.routes}
        />
      </Section>
      <Section qa="previous-claims-section" title={x => x.claimsLabels.closedSectionTitle}>
        <PreviousClaims
          tableQa="previous-claims-table"
          data={previousClaims}
          project={project}
          partner={partner}
          routes={props.routes}
        />
      </Section>
    </Page>
  );
};

const NoCurrentClaimsMessage = ({
  endDate,
  previousClaims,
}: {
  endDate: Date;
  previousClaims: Data["previousClaims"];
}) => {
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
};

const CurrentClaims = ({
  currentClaims,
  tableQa,
  project,
  partner,
  previousClaims,
  routes,
}: {
  currentClaims: NonNullable<Data["currentClaim"]>[];
  tableQa: string;
  project: Data["project"];
  partner: Data["partner"];
  previousClaims: Data["previousClaims"];
  routes: BaseProps["routes"];
}) => {
  if (currentClaims.length) {
    return (
      <ClaimsTable
        data={currentClaims}
        tableQa={tableQa}
        project={project}
        partner={partner}
        tableCaption="Open"
        routes={routes}
      />
    );
  }

  if (project.periodEndDate) {
    return <NoCurrentClaimsMessage endDate={project.periodEndDate} previousClaims={previousClaims} />;
  }

  return null;
};

const PreviousClaims = ({
  data,
  tableQa,
  project,
  partner,
  routes,
}: {
  data: Data["previousClaims"];
  tableQa: string;
  project: Data["project"];
  partner: Data["partner"];
  routes: BaseProps["routes"];
}) => {
  if (data.length) {
    return (
      <ClaimsTable
        data={data}
        tableQa={tableQa}
        project={project}
        partner={partner}
        tableCaption="Closed"
        routes={routes}
      />
    );
  }

  return (
    <SimpleString>
      <Content value={x => x.claimsMessages.noClosedClaims} />
    </SimpleString>
  );
};

const ClaimsTable = ({
  data,
  tableQa,
  project,
  partner,
  tableCaption,
  routes,
}: {
  data: Data["previousClaims"];
  tableQa: string;
  project: Data["project"];
  partner: Data["partner"];
  tableCaption?: string;
  routes: BaseProps["routes"];
}) => {
  return (
    <GetProjectStatus>
      {projectStatus => (
        <ClaimTable.Table
          data={data.sort((a, b) => a.periodId - b.periodId)}
          bodyRowFlag={claim => (projectStatus.isActive ? hasBodyRowFlag(claim, project, partner) : null)}
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
            value={x => <ClaimDetailsLink claim={x} project={project} partner={partner} routes={routes} />}
          />
        </ClaimTable.Table>
      )}
    </GetProjectStatus>
  );
};

const hasBodyRowFlag = (claim: Pick<ClaimDto, "status">, project: Data["project"], partner: Data["partner"]) => {
  const linkType = getClaimDetailsStatusType({ claim, project, partner });

  return linkType === "edit" ? "edit" : null;
};

const ClaimsDashboardRouteContainer = (props: ClaimDashboardPageParams & BaseProps) => {
  const stores = useStores();

  const combined = Pending.combine({
    project: stores.projects.getById(props.projectId),
    partner: stores.partners.getById(props.partnerId),
    previousClaims: stores.claims.getInactiveClaimsForPartner(props.partnerId),
    currentClaim: stores.claims.getActiveClaimForPartner(props.partnerId),
  });

  return <PageLoader pending={combined} render={x => <ClaimDashboardComponent {...x} {...props} />} />;
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
