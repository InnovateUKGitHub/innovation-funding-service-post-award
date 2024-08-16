import { DateFormat } from "@framework/constants/enums";
import { ProjectRole, ProjectStatus } from "@framework/constants/project";
import { ClaimDto } from "@framework/dtos/claimDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDtoGql } from "@framework/dtos/projectDto";
import { getAuthRoles } from "@framework/types/authorisation";
import { formatDate } from "@framework/util/dateHelpers";
import { roundCurrency } from "@framework/util/numberHelper";
import { getLeadPartner } from "@framework/util/partnerHelper";
import { Accordion } from "@ui/components/atoms/Accordion/Accordion";
import { AccordionItem } from "@ui/components/atoms/Accordion/AccordionItem";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { Content } from "@ui/components/molecules/Content/content";
import { Messages } from "@ui/components/molecules/Messages/messages";
import { Section } from "@ui/components/molecules/Section/section";
import { createTypedTable } from "@ui/components/molecules/Table/Table";
import { ValidationMessage } from "@ui/components/molecules/validation/ValidationMessage/ValidationMessage";
import {
  ClaimDetailsLink,
  getClaimDetailsStatusType,
} from "@ui/components/organisms/claims/ClaimDetailsLink/claimDetailsLink";
import { ClaimPeriodDate } from "@ui/components/organisms/claims/ClaimPeriodDate/claimPeriodDate";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { getPartnerName } from "@ui/components/organisms/partners/utils/partnerName";
import { ProjectBackLink } from "@ui/components/organisms/projects/ProjectBackLink/projectBackLink";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { IRoutes } from "@ui/routing/routeConfig";
import { DateTime } from "luxon";
import { ClaimsDashboardGuidance } from "../components/ClaimsDashboardGuidance";
import { useAllClaimsDashboardData } from "./allClaimsDashboard.logic";
import { PeriodTitle } from "@ui/components/molecules/PeriodTitle/periodTitle";

export interface AllClaimsDashboardParams {
  projectId: ProjectId;
}

type ClaimType = Pick<
  ClaimDto,
  | "approvedDate"
  | "forecastCost"
  | "isApproved"
  | "lastModifiedDate"
  | "paidDate"
  | "partnerId"
  | "periodEndDate"
  | "periodId"
  | "periodStartDate"
  | "status"
  | "statusLabel"
  | "totalCost"
>;

type ProjectType = Pick<ProjectDtoGql, "roles" | "id" | "status" | "isActive" | "periodEndDate" | "periodStartDate">;

type PartnerType = Pick<
  PartnerDto,
  "id" | "name" | "isWithdrawn" | "isLead" | "accountId" | "roles" | "partnerStatus" | "overdueProject"
>;

const ClaimTable = createTypedTable<ClaimType>();

const AllClaimsDashboardPage = (props: AllClaimsDashboardParams & BaseProps) => {
  const { project, partners, claims, fragmentRef } = useAllClaimsDashboardData(props.projectId);

  const isMultipleParticipants = partners.length > 1;

  const { isCombinationOfSBRI } = checkProjectCompetition(project.competitionType);
  const { isFc } = getAuthRoles(project.roles);

  const leadPartner = getLeadPartner(partners);
  const isLeadPartnerFc = leadPartner && getAuthRoles(leadPartner.roles).isFc;
  const hasWithdrawnPartners = partners.some(partner => partner.isWithdrawn);

  const previousClaims = claims.filter(x => x.isApproved);
  const currentClaims = claims.filter(x => !x.isApproved);

  return (
    <Page
      backLink={<ProjectBackLink projectId={project.id} />}
      fragmentRef={fragmentRef}
      partnerId={isLeadPartnerFc ? leadPartner.id : undefined}
    >
      {isMultipleParticipants && isFc && renderGuidanceMessage(isCombinationOfSBRI, partners)}

      {hasWithdrawnPartners && (
        <ValidationMessage messageType="info" message={x => x.claimsMessages.hasWithdrawnPartner} />
      )}

      <Messages messages={props.messages} />

      <Section qa="current-claims-section" title={x => x.claimsLabels.openSectionTitle}>
        {renderCurrentClaimsPerPeriod(currentClaims, project, partners, props.routes)}
      </Section>

      <Section qa="closed-claims-section" title={x => x.claimsLabels.closedSectionTitle}>
        {renderPreviousClaimsSections(project, partners, previousClaims, props.routes)}
      </Section>
    </Page>
  );
};

const renderGuidanceMessage = (isCombinationOfSBRI: boolean, partners: PartnerType[]) => {
  // Note: we can ensure that the PM as we can check isLead as only one FC can have this
  const isCurrentOverduePartner = partners.find(x => x.isLead && x.overdueProject);

  if (!isCurrentOverduePartner && isCombinationOfSBRI) {
    return (
      <SimpleString qa="theFinalClaimApprovedNotificationMessage">
        <Content value={x => x.pages.allClaimsDashboard.sbriGuidanceMessage} />
      </SimpleString>
    );
  }

  return <ClaimsDashboardGuidance overdueProject={!!isCurrentOverduePartner?.overdueProject} />;
};

const groupClaimsByPeriod = (claims: ClaimType[]) => {
  const distinctPeriods = [...new Set(claims.map(x => x.periodId))].sort((a, b) => a - b);
  return distinctPeriods.map(period => {
    const periodClaims = claims.filter(x => x.periodId === period);
    return {
      periodId: period,
      claims: periodClaims,
      start: periodClaims[0].periodStartDate,
      end: periodClaims[0].periodEndDate,
    };
  });
};

const renderCurrentClaimsPerPeriod = (
  claims: ClaimType[],
  project: ProjectType,
  partners: PartnerType[],
  routes: IRoutes,
) => {
  const groupedClaims = groupClaimsByPeriod(claims);
  if (groupedClaims.length === 0) {
    if (project.status === ProjectStatus.Terminated || project.status === ProjectStatus.Closed) {
      return (
        <SimpleString qa="theFinalClaimApprovedNotificationMessage">
          <Content value={x => x.claimsMessages.noRemainingClaims} />
        </SimpleString>
      );
    }

    if (!project.periodEndDate) return null;
    const date = DateTime.fromJSDate(project.periodEndDate).plus({ days: 1 }).toJSDate();
    return (
      <SimpleString qa="notificationMessage">
        <Content
          value={x => x.claimsMessages.noOpenClaims({ nextClaimStartDate: formatDate(date, DateFormat.FULL_DATE) })}
        />
      </SimpleString>
    );
  }
  return groupedClaims.map((x, i) =>
    renderCurrentClaims(x.periodId, x.start, x.end, x.claims, project, partners, i, routes),
  );
};

const renderCurrentClaims = (
  periodId: number,
  start: Date | null,
  end: Date | null,
  claims: ClaimType[],
  project: ProjectType,
  partners: PartnerType[],
  index: number,
  routes: IRoutes,
) => {
  const renderPartnerName = (x: ClaimType) => {
    const p = partners.filter(y => y.id === x.partnerId)[0];
    if (p) return getPartnerName(p, true);
    return null;
  };

  return (
    <Section
      title={<PeriodTitle periodId={periodId} periodStartDate={start} periodEndDate={end} />}
      qa="current-claims-section"
      key={index}
    >
      <ClaimTable.Table
        data={claims}
        bodyRowFlag={x => (getBodyRowFlag(x, project, partners) ? "edit" : null)}
        caption={<Content value={x => x.claimsLabels.openCaption} />}
        qa="current-claims-table"
      >
        <ClaimTable.Custom header={x => x.claimsLabels.partner} qa="partner" value={renderPartnerName} />
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
        <ClaimTable.String header={x => x.claimsLabels.status} qa="status" value={x => x.statusLabel} />
        <ClaimTable.ShortDate
          header={x => x.claimsLabels.lastUpdatedDate}
          qa="last-update"
          value={x => x.paidDate || x.approvedDate || x.lastModifiedDate}
        />
        <ClaimTable.Custom
          header={x => x.claimsLabels.actionHeader}
          hideHeader
          qa="link"
          value={x => (
            <ClaimDetailsLink
              claim={x}
              project={project}
              partner={partners.find(p => p.id === x.partnerId) as PartnerDto}
              routes={routes}
            />
          )}
        />
      </ClaimTable.Table>
    </Section>
  );
};

const getBodyRowFlag = (claim: ClaimType, project: ProjectType, partners: PartnerType[]) => {
  if (project.isActive) return false;

  const partner = partners.find(x => x.id === claim.partnerId);
  if (!partner) return false;

  const linkType = getClaimDetailsStatusType({ claim, project, partner });

  return linkType === "edit" || linkType === "review";
};

const renderPreviousClaimsSections = (
  project: ProjectType,
  partners: PartnerType[],
  previousClaims: ClaimType[],
  routes: IRoutes,
) => {
  const grouped = partners.map(x => ({ partner: x, claims: previousClaims.filter(y => y.partnerId === x.id) }));

  return (
    <Accordion qa="previous-claims">
      {grouped.map((x, i) => {
        const partnerName = getPartnerName(x.partner, true);

        return (
          <AccordionItem key={i} title={partnerName} qa={`accordion-item-${i}`}>
            {previousClaimsSection(project, x.partner, x.claims, routes)}
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

const previousClaimsSection = (
  project: ProjectType,
  partner: PartnerType,
  previousClaims: ClaimType[],
  routes: IRoutes,
) => {
  if (previousClaims.length === 0) {
    return (
      <SimpleString qa={`noClosedClaims-${partner.accountId}`}>
        <Content value={x => x.claimsMessages.noClosedClaims} />
      </SimpleString>
    );
  }

  const partnerName = getPartnerName(partner);

  return (
    <div>
      <ClaimTable.Table data={previousClaims} caption={partnerName} qa={`previousClaims-${partner.accountId}`}>
        <ClaimTable.Custom qa="period" value={x => <ClaimPeriodDate claim={x} />} />
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
        <ClaimTable.String header={x => x.claimsLabels.status} qa="status" value={x => x.statusLabel} />
        <ClaimTable.ShortDate
          header={x => x.claimsLabels.lastUpdatedDate}
          qa="last-update"
          value={x => x.paidDate || x.approvedDate || x.lastModifiedDate}
        />
        <ClaimTable.Custom
          header={x => x.claimsLabels.actionHeader}
          hideHeader
          qa="link"
          value={x => <ClaimDetailsLink claim={x} project={project} partner={partner} routes={routes} />}
        />
      </ClaimTable.Table>
    </div>
  );
};

export const AllClaimsDashboardRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "allClaimsDashboard",
  routePath: "/projects/:projectId/claims/dashboard",
  container: AllClaimsDashboardPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.allClaimsDashboard.title),
  accessControl: (auth, { projectId }) =>
    auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager),
});
