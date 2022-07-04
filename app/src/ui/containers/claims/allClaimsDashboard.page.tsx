import { ClaimDto, PartnerDto, ProjectDto } from "@framework/dtos";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import * as Acc from "@ui/components";
import { Pending } from "@shared/pending";
import { DateTime } from "luxon";
import { useStores } from "@ui/redux";
import { getClaimDetailsLinkType } from "@ui/components/claims/claimDetailsLink";
import { getPartnerName } from "@ui/components";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { roundCurrency } from "@framework/util";
import { ProjectRole, ProjectStatus } from "@framework/constants";
import { IRoutes } from "@ui/routing";
import { getAuthRoles } from "@framework/types";
import { getLeadPartner } from "@framework/util/partnerHelper";
import { useProjectStatus } from "@ui/hooks";
import { useProjectParticipants } from "@ui/features/project-participants";
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

function AllClaimsDashboardComponent(props: AllClaimsDashboardParams & AllClaimsDashboardData & BaseProps) {
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
      <Acc.Page
        pageTitle={<Acc.Projects.Title {...projectDetails} />}
        backLink={<Acc.Projects.ProjectBackLink project={projectDetails} routes={props.routes} />}
        project={projectDetails}
        partner={isLeadPartnerFc ? leadPartner : undefined}
      >
        {isMultipleParticipants && isFc && renderGuidanceMessage(isCombinationOfSBRI, partners)}

        {hasWithdrawnPartners && (
          <Acc.ValidationMessage messageType="info" message={x => x.allClaimsDashboard.messages.hasWithdrawnPartners} />
        )}

        <Acc.Renderers.Messages messages={props.messages} />

        <Acc.Section qa="current-claims-section" title={x => x.allClaimsDashboard.labels.openSectionTitle}>
          <Acc.Loader
            pending={props.currentClaims}
            render={(currentClaims, isLoading) =>
              isLoading ? (
                <Acc.Renderers.SimpleString qa="claimsLoadingMessage">
                  <Acc.Content value={x => x.allClaimsDashboard.messages.loadingClaims} />
                </Acc.Renderers.SimpleString>
              ) : (
                renderCurrentClaimsPerPeriod(currentClaims, projectDetails, partners)
              )
            }
          />
        </Acc.Section>

        <Acc.Section qa="closed-claims-section" title={x => x.allClaimsDashboard.labels.closedSectionTitle}>
          {renderPreviousClaimsSections(projectDetails, partners, previousClaims)}
        </Acc.Section>
      </Acc.Page>
    );
  };

  const renderGuidanceMessage = (isCombinationOfSBRI: boolean, partners: PartnerDto[]) => {
    // Note: we can ensure that the PM as we can check isLead as only one FC can have this
    const isCurrentOverduePartner = partners.find(x => x.isLead && x.overdueProject);

    if (!isCurrentOverduePartner && isCombinationOfSBRI) {
      return (
        <Acc.Renderers.SimpleString qa="theFinalClaimApprovedNotificationMessage">
          <Acc.Content value={x => x.allClaimsDashboard.sbriGuidanceMessage} />
        </Acc.Renderers.SimpleString>
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
          <Acc.Renderers.SimpleString qa="theFinalClaimApprovedNotificationMessage">
            <Acc.Content value={x => x.allClaimsDashboard.messages.noRemainingClaims} />
          </Acc.Renderers.SimpleString>
        );
      }

      if (!project.periodEndDate) return null;
      const date = DateTime.fromJSDate(project.periodEndDate).plus({ days: 1 }).toJSDate();
      return (
        <Acc.Renderers.SimpleString qa="notificationMessage">
          <Acc.Content value={x => x.allClaimsDashboard.messages.noOpenClaimsMessage(date)} />
        </Acc.Renderers.SimpleString>
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
        Period {periodId}: <Acc.Renderers.ShortDateRange start={start} end={end} />
      </>
    );
    const ClaimTable = Acc.TypedTable<ClaimDto>();
    const renderPartnerName = (x: ClaimDto) => {
      const p = partners.filter(y => y.id === x.partnerId)[0];
      if (p) return Acc.getPartnerName(p, true);
      return null;
    };

    return (
      <Acc.Section title={title} qa="current-claims-section" key={index}>
        <ClaimTable.Table
          data={claims}
          bodyRowFlag={x => (getBodyRowFlag(x, project, partners) ? "edit" : null)}
          caption={<Acc.Content value={x => x.allClaimsDashboard.labels.openCaption} />}
          qa="current-claims-table"
        >
          <ClaimTable.Custom header={x => x.allClaimsDashboard.labels.partner} qa="partner" value={renderPartnerName} />
          <ClaimTable.Currency
            header={x => x.allClaimsDashboard.labels.forecastCosts}
            qa="forecast-cost"
            value={x => x.forecastCost}
          />
          <ClaimTable.Currency
            header={x => x.allClaimsDashboard.labels.actualCosts}
            qa="actual-cost"
            value={x => x.totalCost}
          />
          <ClaimTable.Currency
            header={x => x.allClaimsDashboard.labels.difference}
            qa="diff"
            value={x => roundCurrency(x.forecastCost - x.totalCost)}
          />
          <ClaimTable.String header={x => x.allClaimsDashboard.labels.status} qa="status" value={x => x.statusLabel} />
          <ClaimTable.ShortDate
            header={x => x.allClaimsDashboard.labels.lastUpdated}
            qa="last-update"
            value={x => x.paidDate || x.approvedDate || x.lastModifiedDate}
          />
          <ClaimTable.Custom
            header={x => x.allClaimsDashboard.labels.actionHeader}
            hideHeader
            qa="link"
            value={x => (
              <Acc.Claims.ClaimDetailsLink
                claim={x}
                project={project}
                partner={partners.find(p => p.id === x.partnerId)!}
                routes={props.routes}
              />
            )}
          />
        </ClaimTable.Table>
      </Acc.Section>
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
      <Acc.Accordion qa="previous-claims">
        {grouped.map((x, i) => {
          const partnerName = getPartnerName(x.partner, true);

          return (
            <Acc.AccordionItem key={i} title={partnerName} qa={`accordion-item-${i}`}>
              {previousClaimsSection(project, x.partner, x.claims)}
            </Acc.AccordionItem>
          );
        })}
      </Acc.Accordion>
    );
  };

  const previousClaimsSection = (project: ProjectDto, partner: PartnerDto, previousClaims: ClaimDto[]) => {
    if (previousClaims.length === 0) {
      return (
        <Acc.Renderers.SimpleString qa={`noClosedClaims-${partner.accountId}`}>
          <Acc.Content value={x => x.allClaimsDashboard.messages.noClosedClaims} />
        </Acc.Renderers.SimpleString>
      );
    }
    const ClaimTable = Acc.TypedTable<ClaimDto>();
    const partnerName = getPartnerName(partner);

    return (
      <div>
        <ClaimTable.Table data={previousClaims} caption={partnerName} qa={`previousClaims-${partner.accountId}`}>
          <ClaimTable.Custom qa="period" value={x => renderClosedPeriodColumn(x)} />
          <ClaimTable.Currency
            header={x => x.allClaimsDashboard.labels.forecastCosts}
            qa="forecast-cost"
            value={x => x.forecastCost}
          />
          <ClaimTable.Currency
            header={x => x.allClaimsDashboard.labels.actualCosts}
            qa="actual-cost"
            value={x => x.totalCost}
          />
          <ClaimTable.Currency
            header={x => x.allClaimsDashboard.labels.difference}
            qa="diff"
            value={x => roundCurrency(x.forecastCost - x.totalCost)}
          />
          <ClaimTable.String header={x => x.allClaimsDashboard.labels.status} qa="status" value={x => x.statusLabel} />
          <ClaimTable.ShortDate
            header={x => x.allClaimsDashboard.labels.lastUpdated}
            qa="last-update"
            value={x => x.paidDate || x.approvedDate || x.lastModifiedDate}
          />
          <ClaimTable.Custom
            header={x => x.allClaimsDashboard.labels.actionHeader}
            hideHeader
            qa="link"
            value={x => (
              <Acc.Claims.ClaimDetailsLink claim={x} project={project} partner={partner} routes={props.routes} />
            )}
          />
        </ClaimTable.Table>
      </div>
    );
  };

  const renderClosedPeriodColumn = (claim: ClaimDto) => {
    return <Acc.Claims.ClaimPeriodDate claim={claim} />;
  };

  return (
    <Acc.PageLoader pending={combined} render={x => renderContents(x.projectDetails, x.partners, x.previousClaims)} />
  );
}

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
  getTitle: ({ content }) => content.allClaimsDashboard.title(),
  accessControl: (auth, { projectId }) =>
    auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager),
});
