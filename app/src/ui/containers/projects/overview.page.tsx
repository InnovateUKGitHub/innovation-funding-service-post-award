import * as Dtos from "@framework/dtos";
import { getAuthRoles, ILinkInfo } from "@framework/types";
import { Pending } from "@shared/pending";
import { IClientUser, PartnerClaimStatus, PartnerDto, ProjectDto, ProjectRole, ProjectStatus } from "@framework/types";
import * as ACC from "@ui/components";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { useStores } from "@ui/redux";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { ProjectParticipantsHoc } from "@ui/features/project-participants";
import { IRoutes } from "@ui/routing";
import { Copy } from "@copy/Copy";
import type { ContentSelector } from "@copy/type";
import { getLeadPartner } from "@framework/util/partnerHelper";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { NavigationCardMessage } from "@ui/components";

interface Data {
  projectDetails: Pending<Dtos.ProjectDto>;
  partners: Pending<Dtos.PartnerDto[]>;
  user: IClientUser;
  config: IClientConfig;
}

interface Params {
  projectId: string;
}

interface ILinks {
  textContent: ContentSelector;
  link: ILinkInfo;
  messages?: () => NavigationCardMessage[];
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
        <ACC.Content value={x => x.projectMessages.projectEndedMessage} />
      ) : (
        <ACC.Content
          value={x =>
            x.projectMessages.currentPeriodInfo({
              currentPeriod: project.periodId,
              numberOfPeriods: project.numberOfPeriods,
            })
          }
        />
      );

    const subtitle = isProjectClosed ? undefined : project.isPastEndDate ||
      this.isPartnerWithdrawn(project, partners) ? (
      <ACC.Content value={x => x.projectMessages.finalClaimPeriodMessage} />
    ) : (
      <ACC.Renderers.ShortDateRange start={project.periodStartDate} end={project.periodEndDate} />
    );

    return (
      <ACC.Page
        backLink={
          <ACC.BackLink route={this.props.routes.projectDashboard.getLink({})}>
            {<ACC.Content value={x => x.pages.projectOverview.backToProjects} />}
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

    if (partner && isPm) return this.renderPMOverviewDetails(project, partner);
    if (partner && isFc) return this.renderFCOverviewDetails(partner);

    return null;
  }

  private renderFCOverviewDetails(partner: PartnerDto) {
    const PartnerSummaryDetails = ACC.TypedDetails<PartnerDto>();
    const partnerName = ACC.getPartnerName(partner);

    return (
      <ACC.SectionPanel
        qa="claims-totals"
        title={<ACC.Content value={x => x.pages.projectOverview.costsToDateMessage({ partnerName })} />}
      >
        <ACC.DualDetails>
          <PartnerSummaryDetails.Details qa="claims-totals-col-0" data={partner}>
            <PartnerSummaryDetails.Currency
              label={<ACC.Content value={x => x.projectLabels.totalEligibleCostsClaimedLabel} />}
              qa="gol-costs"
              value={x => x.totalParticipantGrant}
            />

            <PartnerSummaryDetails.Currency
              label={<ACC.Content value={x => x.projectLabels.totalEligibleCostsClaimedLabel} />}
              qa="claimed-costs"
              value={x => x.totalParticipantCostsClaimed || 0}
            />

            <PartnerSummaryDetails.Percentage
              label={<ACC.Content value={x => x.projectLabels.percentageEligibleCostsClaimedLabel} />}
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
      <ProjectParticipantsHoc>
        {state => (
          <ACC.SectionPanel qa="claims-summary">
            <ACC.DualDetails>
              <ProjectSummaryDetails.Details
                title={<ACC.Content value={x => x.projectLabels.projectCostsLabel} />}
                data={project}
                qa="project-summary"
              >
                <ProjectSummaryDetails.Currency
                  label={<ACC.Content value={x => x.projectLabels.totalEligibleCostsLabel} />}
                  qa="gol-costs"
                  value={x => x.grantOfferLetterCosts}
                />

                <ProjectSummaryDetails.Currency
                  label={<ACC.Content value={x => x.projectLabels.totalEligibleCostsClaimedLabel} />}
                  qa="claimed-costs"
                  value={x => x.costsClaimedToDate || 0}
                />

                <ProjectSummaryDetails.Percentage
                  label={<ACC.Content value={x => x.projectLabels.percentageEligibleCostsClaimedLabel} />}
                  qa="claimed-percentage"
                  value={x => x.claimedPercentage}
                />
              </ProjectSummaryDetails.Details>

              {state.isMultipleParticipants && (
                <PartnerSummaryDetails.Details
                  data={partner}
                  title={
                    <ACC.Content
                      value={x =>
                        x.pages.projectOverview.costsToDateMessage({ partnerName: ACC.getPartnerName(partner) })
                      }
                    />
                  }
                  qa="lead-partner-summary"
                >
                  <PartnerSummaryDetails.Currency
                    label={<ACC.Content value={x => x.projectLabels.totalEligibleCostsLabel} />}
                    qa="gol-costs"
                    value={x => x.totalParticipantGrant}
                  />
                  <PartnerSummaryDetails.Currency
                    label={<ACC.Content value={x => x.projectLabels.totalEligibleCostsClaimedLabel} />}
                    qa="claimed-costs"
                    value={x => x.totalParticipantCostsClaimed || 0}
                  />
                  <PartnerSummaryDetails.Percentage
                    label={<ACC.Content value={x => x.projectLabels.percentageEligibleCostsClaimedLabel} />}
                    qa="claimed-percentage"
                    value={x => x.percentageParticipantCostsClaimed}
                  />
                </PartnerSummaryDetails.Details>
              )}
            </ACC.DualDetails>
          </ACC.SectionPanel>
        )}
      </ProjectParticipantsHoc>
    );
  }

  private renderLinks(project: ProjectDto, partner: PartnerDto, routes: IRoutes) {
    const { isLoans } = checkProjectCompetition(partner.competitionType);
    const { isPmOrMo } = getAuthRoles(project.roles);
    const projectId = project.id;
    const partnerId = partner.id;

    let links: ILinks[] = [
      {
        textContent: x => x.pages.projectOverview.claimsLink,
        link: routes.allClaimsDashboard.getLink({ projectId }),
        messages: () => this.getClaimMessages(project, partner),
      },
      {
        textContent: x => x.pages.projectOverview.claimsLink,
        link: routes.claimsDashboard.getLink({ projectId, partnerId }),
        messages: () => this.getClaimMessages(project, partner),
      },
      {
        textContent: x => x.pages.projectOverview.monitoringReportLink,
        link: routes.monitoringReportDashboard.getLink({ projectId }),
      },
      {
        textContent: x => x.pages.projectOverview.forecastLink,
        link: routes.forecastDashboard.getLink({ projectId }),
        messages: () => this.getForecastMessages(partner),
      },
      {
        textContent: x => x.pages.projectOverview.forecastsLink,
        link: routes.forecastDetails.getLink({ projectId, partnerId }),
        messages: () => this.getForecastMessages(partner),
      },
      {
        textContent: x => x.pages.projectOverview.projectChangeRequestsLink,
        link: routes.pcrsDashboard.getLink({ projectId }),
        messages: () => this.getPcrMessages(project),
      },
      {
        textContent: x => x.pages.projectOverview.documentsLink,
        link: routes.projectDocuments.getLink({ projectId }),
      },
      {
        textContent: x => x.pages.projectOverview.detailsLink,
        link: routes.projectDetails.getLink({ projectId }),
      },
      {
        textContent: x => x.pages.projectOverview.summaryLink,
        link: routes.financeSummary.getLink({ projectId, partnerId }),
      },
    ];

    if (isLoans) {
      links.unshift({
        textContent: x => x.pages.projectOverview.loansLink,
        link: routes.loansSummary.getLink({ projectId }),
      });
    }

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
        message: <ACC.Content value={x => x.projectMessages.pcrQueried} />,
        qa: "message-pcrQueried",
      });
    }
    if (isMo) {
      result.push({
        message: (
          <ACC.Content
            value={x =>
              x.projectMessages.pcrsToReview({
                count: project.pcrsToReview,
              })
            }
          />
        ),
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
        message: <ACC.Content value={x => x.projectMessages.checkForecast} />,
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
            message: <ACC.Content value={x => x.projectMessages.noClaimDueMessage} />,
            qa: "message-NoClaimsDue",
          });
          break;
        case PartnerClaimStatus.ClaimDue:
          result.push({
            message: <ACC.Content value={x => x.projectMessages.claimDueMessage} />,
            qa: "message-ClaimDue",
          });
          break;
        case PartnerClaimStatus.ClaimsOverdue:
          result.push({
            message: <ACC.Content value={x => x.projectMessages.claimOverdueMessage} />,
            qa: "message-ClaimsOverdue",
          });
          break;
        case PartnerClaimStatus.ClaimQueried:
          result.push({
            message: <ACC.Content value={x => x.projectMessages.claimQueriedMessage} />,
            qa: "message-ClaimQueried",
          });
          break;
        case PartnerClaimStatus.ClaimSubmitted:
          result.push({
            message: <ACC.Content value={x => x.projectMessages.claimSubmittedMessage} />,
            qa: "message-ClaimSubmitted",
          });
          break;
        case PartnerClaimStatus.IARRequired: {
          if (isKTP) {
            result.push({
              message: <ACC.Content value={x => x.projectMessages.schedule3RequiredMessage} />,
              qa: "message-Schedule3Required",
            });
          } else {
            result.push({
              message: <ACC.Content value={x => x.projectMessages.iarRequiredMessage} />,
              qa: "message-IARRequired",
            });
          }

          break;
        }
      }
    }

    if (isMo) {
      result.push({
        message: (
          <ACC.Content value={x => x.projectMessages.claimsToReviewMessage({ count: project.claimsToReview })} />
        ),
        qa: "message-claimsToReview",
      });
    }

    return result;
  }
}

function ProjectOverviewContainer(props: Params & BaseProps) {
  const stores = useStores();

  return (
    <ProjectOverviewComponent
      {...props}
      projectDetails={stores.projects.getById(props.projectId)}
      partners={stores.partners.getPartnersForProject(props.projectId)}
      user={stores.users.getCurrentUser()}
    />
  );
}

export const ProjectOverviewRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "projectOverview",
  routePath: "/projects/:projectId/overview",
  getParams: r => ({ projectId: r.params.projectId }),
  container: ProjectOverviewContainer,
  accessControl: (auth, params) =>
    auth
      .forProject(params.projectId)
      .hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.projectOverview.title),
});
