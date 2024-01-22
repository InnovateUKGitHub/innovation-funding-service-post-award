import { BaseProps, defineRoute } from "../../../containerBase";
import { ProjectOverviewSinglePartnerDetails } from "./projectOverviewSinglePartner";
import { ProjectOverviewAllPartnersDetails } from "./projectOverviewAllPartners";
import ProjectOverviewTiles from "./projectOverviewTiles";
import { useProjectOverviewData, isPartnerWithdrawn } from "./projectOverview.logic";
import { ProjectRole } from "@framework/constants/project";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { ShortDateRange } from "@ui/components/atomicDesign/atoms/Date";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";

type Props = {
  projectId: ProjectId;
};

const ProjectOverviewPage = (props: Props & BaseProps) => {
  const { project, partners, isProjectClosed, highlightedPartner, user, accessControlOptions } = useProjectOverviewData(
    props.projectId,
  );

  console.log("project", project);
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
        {highlightedPartner && (project.roles.isPm || project.roles.isMo) ? (
          <ProjectOverviewAllPartnersDetails project={project} partner={highlightedPartner} />
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
