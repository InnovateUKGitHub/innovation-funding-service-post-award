import { BaseProps, defineRoute } from "../../../containerBase";
import { ProjectOverviewSinglePartnerDetails } from "./projectOverviewSinglePartner";
import { ProjectOverviewAllPartnersDetails } from "./projectOverviewAllPartners";
import ProjectOverviewTiles from "./projectOverviewTiles";
import { useProjectOverviewData, isPartnerWithdrawn } from "./projectOverview.logic";
import { ProjectRole } from "@framework/constants/project";
import { Content } from "@ui/components/molecules/Content/content";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { BackLink } from "@ui/components/atoms/Links/links";
import { ShortDateRange } from "@ui/components/atoms/Date";

type Props = {
  projectId: ProjectId;
};

const ProjectOverviewPage = (props: Props & BaseProps) => {
  const { project, partners, isProjectClosed, highlightedPartner, user, accessControlOptions, fragmentRef } =
    useProjectOverviewData(props.projectId);

  const isMultipleParticipants = partners.length > 1;
  const title =
    isProjectClosed || project.isPastEndDate || isPartnerWithdrawn(project.roles, partners) ? (
      <Content value={x => x.projectMessages.projectEndedMessage} />
    ) : (
      <Content
        value={x =>
          x.projectMessages.currentPeriodInfo({
            currentPeriod: project.periodId,
            numberOfPeriods: project.numberOfPeriods,
          })
        }
      />
    );

  const subtitle = isProjectClosed ? undefined : project.isPastEndDate ||
    isPartnerWithdrawn(project.roles, partners) ? (
    <Content value={x => x.projectMessages.finalClaimPeriodMessage} />
  ) : (
    <ShortDateRange start={project.periodStartDate} end={project.periodEndDate} />
  );

  return (
    <Page
      backLink={
        <BackLink route={props.routes.projectDashboard.getLink({})}>
          {<Content value={x => x.pages.projectOverview.backToProjects} />}
        </BackLink>
      }
      fragmentRef={fragmentRef}
      partnerId={highlightedPartner?.id}
    >
      <Section qa="period-information" className="govuk-!-padding-bottom-6" title={title} subtitle={subtitle}>
        {highlightedPartner && (project.roles.isPm || project.roles.isMo) ? (
          <ProjectOverviewAllPartnersDetails
            project={project}
            partner={highlightedPartner}
            isMultipleParticipants={isMultipleParticipants}
          />
        ) : highlightedPartner && project.roles.isFc ? (
          <ProjectOverviewSinglePartnerDetails partner={highlightedPartner} />
        ) : null}
      </Section>
      <ProjectOverviewTiles
        project={project}
        partner={highlightedPartner || partners[0]}
        routes={props.routes}
        user={user}
        accessControlOptions={accessControlOptions}
      />
    </Page>
  );
};

export const ProjectOverviewRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "projectOverview",
  routePath: "/projects/:projectId/overview",
  getParams: r => ({ projectId: r.params.projectId as ProjectId }),
  container: ProjectOverviewPage,
  accessControl: (auth, params) =>
    auth
      .forProject(params.projectId)
      .hasAnyRoles(
        ProjectRole.FinancialContact,
        ProjectRole.ProjectManager,
        ProjectRole.MonitoringOfficer,
        ProjectRole.Associate,
      ),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.projectOverview.title),
});
