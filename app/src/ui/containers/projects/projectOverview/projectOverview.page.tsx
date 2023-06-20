import { BaseProps, defineRoute } from "../../containerBase";
import FCProjectOverviewDetails from "./projectOverviewFC";
import PMProjectOverviewDetails from "./projectOverviewPM";
import ProjectOverviewTiles from "./projectOverviewTiles";
import { useProjectOverviewData, isPartnerWithdrawn } from "./projectOverview.logic";
import { ProjectRole } from "@framework/constants/project";
import { Content } from "@ui/components/content";
import { Page } from "@ui/components/layout/page";
import { Section } from "@ui/components/layout/section";
import { BackLink } from "@ui/components/links";
import { ShortDateRange } from "@ui/components/renderers/date";
import { Title } from "@ui/components/projects/title";

type Props = {
  projectId: ProjectId;
};

const ProjectOverviewPage = (props: Props & BaseProps) => {
  const { project, partners, isProjectClosed, highlightedPartner, user, accessControlOptions } = useProjectOverviewData(
    props.projectId,
  );

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
      pageTitle={<Title projectNumber={project.projectNumber} title={project.title} />}
      projectStatus={project.status}
      partnerStatus={highlightedPartner?.partnerStatus}
    >
      <Section qa="period-information" className="govuk-!-padding-bottom-6" title={title} subtitle={subtitle}>
        {highlightedPartner && project.roles.isPm ? (
          <PMProjectOverviewDetails project={project} partner={highlightedPartner} />
        ) : highlightedPartner && project.roles.isFc ? (
          <FCProjectOverviewDetails partner={highlightedPartner} />
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
      .hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.projectOverview.title),
});
