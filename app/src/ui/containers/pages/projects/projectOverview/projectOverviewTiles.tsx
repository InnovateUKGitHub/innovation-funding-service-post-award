import type { Project, Partner } from "./projectOverview.logic";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import type { ContentSelector } from "@copy/type";
import { IAccessControlOptions } from "@framework/types/IAccessControlOptions";
import { PartnerClaimStatus } from "@framework/constants/partner";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IClientUser } from "@framework/types/IUser";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import {
  NavigationCardMessage,
  NavigationCardsGrid,
  NavigationCard,
} from "@ui/components/atomicDesign/molecules/NavigationCard/navigationCard";
import { IRoutes } from "@ui/routing/routeConfig";

interface ILinks {
  textContent: ContentSelector;
  link: ILinkInfo;
  messages?: () => NavigationCardMessage[];
}

/**
 * gets pcr type messages
 */
function getPcrMessages(project: Project) {
  const { isPm, isMo } = project.roles;
  const result: NavigationCardMessage[] = [];

  if (isPm && project.pcrsQueried > 0) {
    result.push({
      message: <Content value={x => x.projectMessages.pcrQueried} />,
      qa: "message-pcrQueried",
    });
  }
  if (isMo && project.pcrsToReview > 0) {
    result.push({
      message: (
        <Content
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

/**
 * gets forecast messages
 */
function getForecastMessages(partner: Partner) {
  const { isFc } = partner.roles;
  const result: NavigationCardMessage[] = [];

  if (isFc && partner.newForecastNeeded) {
    result.push({
      message: <Content value={x => x.projectMessages.checkForecast} />,
      qa: "message-newForecastNeeded",
    });
  }

  return result;
}

/**
 * gets claim messages
 */
function getClaimMessages(project: Project, partner: Partner) {
  const { isFc, isMo } = project.roles;
  const { isKTP } = checkProjectCompetition(project.competitionType);

  const result: NavigationCardMessage[] = [];

  if (isFc) {
    switch (partner.claimStatus) {
      case PartnerClaimStatus.NoClaimsDue:
        result.push({
          message: <Content value={x => x.projectMessages.noClaimDueMessage} />,
          qa: "message-NoClaimsDue",
        });
        break;
      case PartnerClaimStatus.ClaimDue:
        result.push({
          message: <Content value={x => x.projectMessages.claimDueMessage} />,
          qa: "message-ClaimDue",
        });
        break;
      case PartnerClaimStatus.ClaimsOverdue:
        result.push({
          message: <Content value={x => x.projectMessages.claimOverdueMessage} />,
          qa: "message-ClaimsOverdue",
        });
        break;
      case PartnerClaimStatus.ClaimQueried:
        result.push({
          message: <Content value={x => x.projectMessages.claimQueriedMessage} />,
          qa: "message-ClaimQueried",
        });
        break;
      case PartnerClaimStatus.ClaimSubmitted:
        result.push({
          message: <Content value={x => x.projectMessages.claimSubmittedMessage} />,
          qa: "message-ClaimSubmitted",
        });
        break;
      case PartnerClaimStatus.IARRequired: {
        if (isKTP) {
          result.push({
            message: <Content value={x => x.projectMessages.schedule3RequiredMessage} />,
            qa: "message-Schedule3Required",
          });
        } else {
          result.push({
            message: <Content value={x => x.projectMessages.iarRequiredMessage} />,
            qa: "message-IARRequired",
          });
        }

        break;
      }
    }
  }

  if (isMo && project.claimsToReview > 0) {
    result.push({
      message: <Content value={x => x.projectMessages.claimsToReviewMessage({ count: project.claimsToReview })} />,
      qa: "message-claimsToReview",
    });
  }

  return result;
}

const ProjectOverviewTiles = ({
  project,
  partner,
  routes,
  user,
  accessControlOptions,
}: {
  project: Project;
  partner: Partner;
  routes: IRoutes;
  user: IClientUser;
  accessControlOptions: IAccessControlOptions;
}) => {
  const { isLoans } = checkProjectCompetition(project.competitionType);
  const isPmOrMo = project?.roles?.isPm || project?.roles?.isMo;
  const projectId = project.id;
  const partnerId = partner.id;

  let links: ILinks[] = [
    {
      textContent: x => x.pages.projectOverview.claimsLink,
      link: routes.allClaimsDashboard.getLink({ projectId }),
      messages: () => getClaimMessages(project, partner),
    },
    {
      textContent: x => x.pages.projectOverview.claimsLink,
      link: routes.claimsDashboard.getLink({ projectId, partnerId }),
      messages: () => getClaimMessages(project, partner),
    },
    {
      textContent: x => x.pages.projectOverview.monitoringReportLink,
      link: routes.monitoringReportDashboard.getLink({ projectId, periodId: 0 }),
    },
    {
      textContent: x => x.pages.projectOverview.forecastsLink,
      link: routes.forecastDashboard.getLink({ projectId }),
      messages: () => getForecastMessages(partner),
    },
    {
      textContent: x => x.pages.projectOverview.forecastLink,
      link: routes.viewForecast.getLink({ projectId, partnerId }),
      messages: () => getForecastMessages(partner),
    },
    {
      textContent: x => x.pages.projectOverview.projectChangeRequestsLink,
      link: routes.pcrsDashboard.getLink({ projectId }),
      messages: () => getPcrMessages(project),
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

  links = links.filter(x => x.link.accessControl(user, accessControlOptions));

  // special case if not fc shouldn't have link to ViewForecastRoute from this page... the view forecast route has permission from the project forecasts route
  if (isPmOrMo) {
    links = links.filter(x => x.link.routeName !== routes.viewForecast.routeName);
  }

  return (
    <NavigationCardsGrid>
      {links.map((x, i) => (
        <NavigationCard
          label={<Content value={x.textContent} />}
          route={x.link}
          key={i}
          qa={`overview-link-${x.link.routeName}`}
          messages={x.messages && x.messages()}
        />
      ))}
    </NavigationCardsGrid>
  );
};

export default ProjectOverviewTiles;
