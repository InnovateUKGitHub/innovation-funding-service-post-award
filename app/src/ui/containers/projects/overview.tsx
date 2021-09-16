import * as Dtos from "@framework/dtos";
import { getAuthRoles } from "@framework/types";
import { Pending } from "@shared/pending";
import { IClientUser, PartnerClaimStatus, PartnerDto, ProjectDto, ProjectRole, ProjectStatus } from "@framework/types";
import * as ACC from "@ui/components";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { StoresConsumer } from "@ui/redux";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { IRoutes } from "@ui/routing";
import { Content } from "@content/content";
import { getLeadPartner } from "@framework/util/partnerHelper";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";

interface Data {
  projectDetails: Pending<Dtos.ProjectDto>;
  partners: Pending<Dtos.PartnerDto[]>;
  user: IClientUser;
  config: IClientConfig;
}

interface Params {
  projectId: string;
}

class ProjectOverviewComponent extends ContainerBase<Params, Data, {}> {
  render() {
    const combined = Pending.combine({
      project: this.props.projectDetails,
      partners: this.props.partners,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.partners)} />;
  }

  private isPartnerWithdrawn(project: Dtos.ProjectDto, partners: Dtos.PartnerDto[]) {
    const { isPm } = getAuthRoles(project.roles);
    if (isPm) {
      const leadPartner = getLeadPartner(partners);
      return leadPartner && leadPartner.isWithdrawn;
    }
    return partners.some(p => !!(p.roles & ProjectRole.FinancialContact) && p.isWithdrawn);
  }

  private renderContents(project: Dtos.ProjectDto, partners: Dtos.PartnerDto[]) {
    // find first partner with role
    const partner = partners.filter(x => x.roles !== ProjectRole.Unknown)[0];

    const isProjectClosed = project.status === ProjectStatus.Closed || project.status === ProjectStatus.Terminated;

    const title =
      isProjectClosed || project.isPastEndDate || this.isPartnerWithdrawn(project, partners) ? (
        <ACC.Content value={x => x.projectOverview.messages.projectEnded} />
      ) : (
        <ACC.Content
          value={x => x.projectOverview.messages.currentPeriodInfo(project.periodId, project.numberOfPeriods)}
        />
      );

    const subtitle = isProjectClosed ? undefined : project.isPastEndDate ||
      this.isPartnerWithdrawn(project, partners) ? (
      <ACC.Content value={x => x.projectOverview.messages.finalClaimPeriod} />
    ) : (
      <ACC.Renderers.ShortDateRange start={project.periodStartDate} end={project.periodEndDate} />
    );

    return (
      <ACC.Page
        backLink={
          <ACC.BackLink route={this.props.routes.projectDashboard.getLink({})}>
            {<ACC.Content value={x => x.projectOverview.backToProjects} />}
          </ACC.BackLink>
        }
        pageTitle={<ACC.Projects.Title {...project} />}
        project={project}
        partner={partner}
      >
        <ACC.Section qa="period-information" className="govuk-!-padding-bottom-6" title={title} subtitle={subtitle}>
          {this.renderProjectOverviewDetails(project, partner)}
        </ACC.Section>
        {this.renderLinks(project, partner || partners[0], this.props.routes)}
      </ACC.Page>
    );
  }

  private renderProjectOverviewDetails(project: ProjectDto, partner: PartnerDto) {
    const { isPm, isFc } = getAuthRoles(project.roles);

    if (partner && isPm)  return this.renderPMOverviewDetails(project, partner);
    if (partner && isFc) return this.renderFCOverviewDetails(partner);

    return null;
  }

  private renderFCOverviewDetails(partner: PartnerDto) {
    const PartnerSummaryDetails = ACC.TypedDetails<PartnerDto>();
    const partnerName = ACC.getPartnerName(partner);

    return (
      <ACC.SectionPanel
        qa="claims-totals"
        title={
          <>
            {partnerName} {<ACC.Content value={x => x.projectOverview.costsToDateMessage} />}
          </>
        }
      >
        <ACC.DualDetails>
          <PartnerSummaryDetails.Details qa="claims-totals-col-0" data={partner}>
            <PartnerSummaryDetails.Currency
              label={<ACC.Content value={x => x.projectOverview.labels.totalEligibleCosts} />}
              qa="gol-costs"
              value={x => x.totalParticipantGrant}
            />

            <PartnerSummaryDetails.Currency
              label={<ACC.Content value={x => x.projectOverview.labels.totalEligibleCostsClaimed} />}
              qa="claimed-costs"
              value={x => x.totalParticipantCostsClaimed || 0}
            />

            <PartnerSummaryDetails.Percentage
              label={<ACC.Content value={x => x.projectOverview.labels.percentageEligibleCostsClaimed} />}
              qa="percentage-costs"
              value={x => x.percentageParticipantCostsClaimed}
            />
          </PartnerSummaryDetails.Details>
        </ACC.DualDetails>
      </ACC.SectionPanel>
    );
  }

  private renderPMOverviewDetails(project: ProjectDto, partner: PartnerDto) {
    const ProjectSummaryDetails = ACC.TypedDetails<ProjectDto>();
    const PartnerSummaryDetails = ACC.TypedDetails<PartnerDto>();

    return (
      <ACC.SectionPanel qa="claims-summary">
        <ACC.DualDetails>
          <ProjectSummaryDetails.Details
            title={<ACC.Content value={x => x.projectOverview.labels.projectCosts} />}
            data={project}
            qa="project-summary"
          >
            <ProjectSummaryDetails.Currency
              label={<ACC.Content value={x => x.projectOverview.labels.totalEligibleCosts} />}
              qa="gol-costs"
              value={x => x.grantOfferLetterCosts}
            />
            <ProjectSummaryDetails.Currency
              label={<ACC.Content value={x => x.projectOverview.labels.totalEligibleCostsClaimed} />}
              qa="claimed-costs"
              value={x => x.costsClaimedToDate || 0}
            />
            <ProjectSummaryDetails.Percentage
              label={<ACC.Content value={x => x.projectOverview.labels.percentageEligibleCostsClaimed} />}
              qa="claimed-percentage"
              value={x => x.claimedPercentage}
            />
          </ProjectSummaryDetails.Details>
          <PartnerSummaryDetails.Details
            data={partner}
            title={
              <>
                {ACC.getPartnerName(partner)} {<ACC.Content value={x => x.projectOverview.costsToDateMessage} />}
              </>
            }
            qa="lead-partner-summary"
          >
            <PartnerSummaryDetails.Currency
              label={<ACC.Content value={x => x.projectOverview.labels.totalEligibleCosts} />}
              qa="gol-costs"
              value={x => x.totalParticipantGrant}
            />
            <PartnerSummaryDetails.Currency
              label={<ACC.Content value={x => x.projectOverview.labels.totalEligibleCostsClaimed} />}
              qa="claimed-costs"
              value={x => x.totalParticipantCostsClaimed || 0}
            />
            <PartnerSummaryDetails.Percentage
              label={<ACC.Content value={x => x.projectOverview.labels.percentageEligibleCostsClaimed} />}
              qa="claimed-percentage"
              value={x => x.percentageParticipantCostsClaimed}
            />
          </PartnerSummaryDetails.Details>
        </ACC.DualDetails>
      </ACC.SectionPanel>
    );
  }

  private renderLinks(project: ProjectDto, partner: PartnerDto, routes: IRoutes) {
    const { isPmOrMo } = getAuthRoles(project.roles);
    const projectId = project.id;
    const partnerId = partner.id;

    let links = [
      {
        textContent: (x: Content) => x.projectOverview.links.claims,
        link: routes.allClaimsDashboard.getLink({ projectId }),
        messages: () => this.getClaimMessages(project, partner),
      },
      {
        textContent: (x: Content) => x.projectOverview.links.claims,
        link: routes.claimsDashboard.getLink({ projectId, partnerId }),
        messages: () => this.getClaimMessages(project, partner),
      },
      {
        textContent: (x: Content) => x.projectOverview.links.monitoringReport,
        link: routes.monitoringReportDashboard.getLink({ projectId }),
      },
      {
        textContent: (x: Content) => x.projectOverview.links.forecast,
        link: routes.forecastDashboard.getLink({ projectId }),
        messages: () => this.getForecastMessages(partner),
      },
      {
        textContent: (x: Content) => x.projectOverview.links.forecasts,
        link: routes.forecastDetails.getLink({ projectId, partnerId }),
        messages: () => this.getForecastMessages(partner),
      },
      {
        textContent: (x: Content) => x.projectOverview.links.projectChangeRequests,
        link: routes.pcrsDashboard.getLink({ projectId }),
        messages: () => this.getPcrMessages(project),
      },
      {
        textContent: (x: Content) => x.projectOverview.links.documents,
        link: routes.projectDocuments.getLink({ projectId }),
      },
      {
        textContent: (x: Content) => x.projectOverview.links.details,
        link: routes.projectDetails.getLink({ projectId }),
      },
      {
        textContent: (x: Content) => x.projectOverview.links.summary,
        link: routes.financeSummary.getLink({ projectId, partnerId }),
      },
    ];

    // filter out links the current user doesn't have access to
    links = links.filter(x => x.link.accessControl(this.props.user, this.props.config));

    // special case if not fc shouldn't have link to ViewForecastRoute from this page... the view forecast route has permission from the project forecasts route
    if (isPmOrMo) {
      links = links.filter(x => x.link.routeName !== routes.forecastDetails.routeName);
    }

    return (
      <ACC.NavigationCardsGrid>
        {links.map((x, i) => (
          <ACC.NavigationCard
            label={<ACC.Content value={x.textContent} />}
            route={x.link}
            key={i}
            qa={`overview-link-${x.link.routeName}`}
            messages={x.messages && x.messages()}
          />
        ))}
      </ACC.NavigationCardsGrid>
    );
  }

  private getPcrMessages(project: ProjectDto) {
    const { isPm, isMo } = getAuthRoles(project.roles);
    const result: ACC.NavigationCardMessage[] = [];

    if (isPm && project.pcrsQueried > 0) {
      result.push({
        message: <ACC.Content value={x => x.projectOverview.messages.pcrQueried} />,
        qa: "message-pcrQueried",
      });
    }
    if (isMo) {
      result.push({
        message: <ACC.Content value={x => x.projectOverview.messages.pcrsToReview(project.pcrsToReview)} />,
        qa: "message-pcrsToReview",
      });
    }
    return result;
  }

  private getForecastMessages(partner: PartnerDto) {
    const { isFc } = getAuthRoles(partner.roles);
    const result: ACC.NavigationCardMessage[] = [];

    if (isFc && partner.newForecastNeeded) {
      result.push({
        message: <ACC.Content value={x => x.projectOverview.messages.checkForecast} />,
        qa: "message-newForecastNeeded",
      });
    }

    return result;
  }

  private getClaimMessages(project: ProjectDto, partner: PartnerDto) {
    const { isFc, isMo } = getAuthRoles(project.roles);
    const { isKTP } = checkProjectCompetition(partner.competitionType);

    const result: ACC.NavigationCardMessage[] = [];

    if (isFc) {
      switch (partner.claimStatus) {
        case PartnerClaimStatus.NoClaimsDue:
          result.push({
            message: <ACC.Content value={x => x.projectOverview.messages.noClaimDue} />,
            qa: "message-NoClaimsDue",
          });
          break;
        case PartnerClaimStatus.ClaimDue:
          result.push({
            message: <ACC.Content value={x => x.projectOverview.messages.claimDue} />,
            qa: "message-ClaimDue",
          });
          break;
        case PartnerClaimStatus.ClaimsOverdue:
          result.push({
            message: <ACC.Content value={x => x.projectOverview.messages.claimOverdue} />,
            qa: "message-ClaimsOverdue",
          });
          break;
        case PartnerClaimStatus.ClaimQueried:
          result.push({
            message: <ACC.Content value={x => x.projectOverview.messages.claimQueried} />,
            qa: "message-ClaimQueried",
          });
          break;
        case PartnerClaimStatus.ClaimSubmitted:
          result.push({
            message: <ACC.Content value={x => x.projectOverview.messages.claimSubmitted} />,
            qa: "message-ClaimSubmitted",
          });
          break;
        case PartnerClaimStatus.IARRequired: {
          if (isKTP) {
            result.push({
              message: <ACC.Content value={x => x.projectOverview.messages.schedule3Required} />,
              qa: "message-Schedule3Required",
            });
          } else {
            result.push({
              message: <ACC.Content value={x => x.projectOverview.messages.iarRequired} />,
              qa: "message-IARRequired",
            });
          }

          break;
        }
      }
    }

    if (isMo) {
      result.push({
        message: <ACC.Content value={x => x.projectOverview.messages.claimsToReview(project.claimsToReview)} />,
        qa: "message-claimsToReview",
      });
    }

    return result;
  }
}

const ProjectOverviewContainer = (props: Params & BaseProps) => {
  return (
    <StoresConsumer>
      {stores => (
        <ProjectOverviewComponent
          projectDetails={stores.projects.getById(props.projectId)}
          partners={stores.partners.getPartnersForProject(props.projectId)}
          user={stores.users.getCurrentUser()}
          {...props}
        />
      )}
    </StoresConsumer>
  );
};

export const ProjectOverviewRoute = defineRoute({
  routeName: "projectOverview",
  routePath: "/projects/:projectId/overview",
  getParams: r => ({ projectId: r.params.projectId }),
  container: ProjectOverviewContainer,
  accessControl: (auth, params) =>
    auth
      .forProject(params.projectId)
      .hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
  getTitle: ({ content }) => content.projectOverview.title(),
});
