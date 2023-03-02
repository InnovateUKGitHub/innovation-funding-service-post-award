import { DateFormat, ProjectRole, ProjectStatus } from "@framework/constants";
import { ClaimDto, PartnerDto, ProjectDto } from "@framework/dtos";
import { getAuthRoles } from "@framework/types";
import { formatDate, roundCurrency } from "@framework/util";
import { getLeadPartner } from "@framework/util/partnerHelper";
import { Pending } from "@shared/pending";
import { getPartnerName, Loader, Page, PageLoader, Projects, Section, ValidationMessage } from "@ui/components";
import { Content } from "@ui/components/content";
import { createTypedTable } from "@ui/components/table";
import { Accordion, AccordionItem } from "@ui/components/accordion";
import { ClaimPeriodDate } from "@ui/components/claims";
import { ClaimDetailsLink, getClaimDetailsLinkType } from "@ui/components/claims/claimDetailsLink";
import { Messages, ShortDateRange, SimpleString } from "@ui/components/renderers";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useProjectParticipants } from "@ui/features/project-participants";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { useProjectStatus } from "@ui/hooks";
import { useStores } from "@ui/redux";
import { IRoutes } from "@ui/routing";
import { DateTime } from "luxon";
import { ClaimsDashboardGuidance } from "./components";

export interface AllClaimsDashboardParams {
  projectId: string;
}

interface AllClaimsDashboardData {
  projectDetails: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
  currentClaims: Pending<ClaimDto[]>;
  previousClaims: Pending<ClaimDto[]>;
  routes: IRoutes;
  messages: string[];
}

const ClaimTable = createTypedTable<ClaimDto>();

const AllClaimsDashboardComponent = (props: AllClaimsDashboardParams & AllClaimsDashboardData & BaseProps) => {
  const { isMultipleParticipants } = useProjectParticipants();

  const { isActive: isProjectActive } = useProjectStatus();

  const combined = Pending.combine({
    projectDetails: props.projectDetails,
    partners: props.partners,
    previousClaims: props.previousClaims,
  });

  const renderContents = (projectDetails: ProjectDto, partners: PartnerDto[], previousClaims: ClaimDto[]) => {
    const { isCombinationOfSBRI } = checkProjectCompetition(projectDetails.competitionType);
    const { isFc } = getAuthRoles(projectDetails.roles);

    const leadPartner = getLeadPartner(partners);
    const isLeadPartnerFc = leadPartner && getAuthRoles(leadPartner.roles).isFc;
    const hasWithdrawnPartners = partners.some(partner => partner.isWithdrawn);

    return (
      <Page
        pageTitle={<Projects.Title {...projectDetails} />}
        backLink={<Projects.ProjectBackLink routes={props.routes} projectId={projectDetails.id} />}
        project={projectDetails}
        partner={isLeadPartnerFc ? leadPartner : undefined}
      >
        {isMultipleParticipants && isFc && renderGuidanceMessage(isCombinationOfSBRI, partners)}

        {hasWithdrawnPartners && (
          <ValidationMessage messageType="info" message={x => x.claimsMessages.hasWithdrawnPartner} />
        )}

        <Messages messages={props.messages} />

        <Section qa="current-claims-section" title={x => x.claimsLabels.openSectionTitle}>
          <Loader
            pending={props.currentClaims}
            render={(currentClaims, isLoading) =>
              isLoading ? (
                <SimpleString qa="claimsLoadingMessage">
                  <Content value={x => x.claimsMessages.loadingClaims} />
                </SimpleString>
              ) : (
                renderCurrentClaimsPerPeriod(currentClaims, projectDetails, partners)
              )
            }
          />
        </Section>

        <Section qa="closed-claims-section" title={x => x.claimsLabels.closedSectionTitle}>
          {renderPreviousClaimsSections(projectDetails, partners, previousClaims)}
        </Section>
      </Page>
    );
  };

  const renderGuidanceMessage = (isCombinationOfSBRI: boolean, partners: PartnerDto[]) => {
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

  const groupClaimsByPeriod = (claims: ClaimDto[]) => {
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

  const renderCurrentClaimsPerPeriod = (claims: ClaimDto[], project: ProjectDto, partners: PartnerDto[]) => {
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
    return groupedClaims.map((x, i) => renderCurrentClaims(x.periodId, x.start, x.end, x.claims, project, partners, i));
  };

  const renderCurrentClaims = (
    periodId: number,
    start: Date,
    end: Date,
    claims: ClaimDto[],
    project: ProjectDto,
    partners: PartnerDto[],
    index: number,
  ) => {
    const title = (
      <>
        Period {periodId}: <ShortDateRange start={start} end={end} />
      </>
    );
    const renderPartnerName = (x: ClaimDto) => {
      const p = partners.filter(y => y.id === x.partnerId)[0];
      if (p) return getPartnerName(p, true);
      return null;
    };

    return (
      <Section title={title} qa="current-claims-section" key={index}>
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
                routes={props.routes}
              />
            )}
          />
        </ClaimTable.Table>
      </Section>
    );
  };

  const getBodyRowFlag = (claim: ClaimDto, project: ProjectDto, partners: PartnerDto[]) => {
    if (isProjectActive) return false;

    const partner = partners.find(x => x.id === claim.partnerId);
    if (!partner) return false;

    const linkType = getClaimDetailsLinkType({ claim, project, partner });

    return linkType === "edit" || linkType === "review";
  };

  const renderPreviousClaimsSections = (project: ProjectDto, partners: PartnerDto[], previousClaims: ClaimDto[]) => {
    const grouped = partners.map(x => ({ partner: x, claims: previousClaims.filter(y => y.partnerId === x.id) }));

    return (
      <Accordion qa="previous-claims">
        {grouped.map((x, i) => {
          const partnerName = getPartnerName(x.partner, true);

          return (
            <AccordionItem key={i} title={partnerName} qa={`accordion-item-${i}`}>
              {previousClaimsSection(project, x.partner, x.claims)}
            </AccordionItem>
          );
        })}
      </Accordion>
    );
  };

  const previousClaimsSection = (project: ProjectDto, partner: PartnerDto, previousClaims: ClaimDto[]) => {
    if (previousClaims.length === 0) {
      return (
        <SimpleString qa={`noClosedClaims-${partner.accountId}`}>
          <Content value={x => x.claimsMessages.noClosedClaims} />
        </SimpleString>
      );
    }
    const ClaimTable = createTypedTable<ClaimDto>();
    const partnerName = getPartnerName(partner);

    return (
      <div>
        <ClaimTable.Table data={previousClaims} caption={partnerName} qa={`previousClaims-${partner.accountId}`}>
          <ClaimTable.Custom qa="period" value={x => renderClosedPeriodColumn(x)} />
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
            value={x => <ClaimDetailsLink claim={x} project={project} partner={partner} routes={props.routes} />}
          />
        </ClaimTable.Table>
      </div>
    );
  };

  const renderClosedPeriodColumn = (claim: ClaimDto) => {
    return <ClaimPeriodDate claim={claim} />;
  };

  return <PageLoader pending={combined} render={x => renderContents(x.projectDetails, x.partners, x.previousClaims)} />;
};

const AllClaimsDashboardContainer = (props: AllClaimsDashboardParams & BaseProps) => {
  const stores = useStores();

  return (
    <AllClaimsDashboardComponent
      {...props}
      projectDetails={stores.projects.getById(props.projectId)}
      partners={stores.partners.getPartnersForProject(props.projectId)}
      currentClaims={stores.claims.getActiveClaimsForProject(props.projectId)}
      previousClaims={stores.claims.getInactiveClaimsForProject(props.projectId)}
    />
  );
};

export const AllClaimsDashboardRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "allClaimsDashboard",
  routePath: "/projects/:projectId/claims/dashboard",
  container: AllClaimsDashboardContainer,
  getParams: route => ({
    projectId: route.params.projectId ?? "",
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.allClaimsDashboard.title),
  accessControl: (auth, { projectId }) =>
    auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager),
});
