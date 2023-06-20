import { ProjectRole } from "@framework/constants/project";
import { ProjectDto } from "@framework/dtos/projectDto";
import { Pending } from "@shared/pending";
import { Content } from "@ui/components/content";
import { Page } from "@ui/components/layout/page";
import { Section } from "@ui/components/layout/section";
import { BackLink, Link } from "@ui/components/links";
import { Loader } from "@ui/components/loading";
import { Title } from "@ui/components/projects/title";
import { useContent } from "@ui/hooks/content.hook";
import { useStores } from "@ui/redux/storesProvider";
import { BaseProps, defineRoute } from "../containerBase";

export interface FailedBankCheckConfirmationParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

interface FailedBankCheckConfirmationProps extends BaseProps, FailedBankCheckConfirmationParams {
  projectId: ProjectId;
  project: Pending<ProjectDto>;
}

/**
 * ### FailedBankCheckConfirmation
 *
 * React Component Page when bank check confirmation failed
 */
function FailedBankCheckConfirmation({ projectId, partnerId, routes, ...props }: FailedBankCheckConfirmationProps) {
  const { getContent } = useContent();

  const renderContents = (project: ProjectDto) => {
    const projectSetupRoute = routes.projectSetup.getLink({ projectId, partnerId });

    const failedConfirmationBackLink = getContent(x => x.pages.failedBankCheckConfirmation.backLink);
    const backLink = <BackLink route={projectSetupRoute}>{failedConfirmationBackLink}</BackLink>;
    const pageTitle = <Title {...project} />;

    return (
      <Page backLink={backLink} pageTitle={pageTitle} project={project}>
        <Section qa="guidance">
          <Content markdown value={x => x.pages.failedBankCheckConfirmation.guidance} />
        </Section>

        <Section qa="return-to-setup-button">
          <Link styling="PrimaryButton" route={projectSetupRoute}>
            {getContent(x => x.pages.failedBankCheckConfirmation.returnToSetup)}
          </Link>
        </Section>
      </Page>
    );
  };

  return <Loader pending={props.project} render={x => renderContents(x)} />;
}

/**
 * ### FailedBankCheckConfirmationContainer
 *
 * React Page Container for when bank check confirmation failed
 */
function FailedBankCheckConfirmationContainer(props: FailedBankCheckConfirmationParams & BaseProps) {
  const { projects } = useStores();

  return <FailedBankCheckConfirmation {...props} project={projects.getById(props.projectId)} />;
}

export const FailedBankCheckConfirmationRoute = defineRoute<FailedBankCheckConfirmationParams>({
  routeName: "failedBankCheckConfirmation",
  routePath: "/projects/:projectId/setup/:partnerId/further-information-required",
  getParams: r => ({
    projectId: r.params.projectId as ProjectId,
    partnerId: r.params.partnerId as PartnerId,
  }),
  container: FailedBankCheckConfirmationContainer,
  accessControl: (auth, params) => auth.forProject(params.projectId).hasRole(ProjectRole.FinancialContact),
  getTitle: x => x.content.getTitleCopy(x => x.pages.failedBankCheckConfirmation.title),
});
