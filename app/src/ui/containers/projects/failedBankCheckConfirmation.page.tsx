import { ProjectDto } from "@framework/dtos";
import { Pending } from "@shared/pending";
import { ProjectRole } from "@framework/constants";

import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useStores } from "@ui/redux";
import * as ACC from "@ui/components";
import { useContent } from "@ui/hooks";

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
    const backLink = <ACC.BackLink route={projectSetupRoute}>{failedConfirmationBackLink}</ACC.BackLink>;
    const pageTitle = <ACC.Projects.Title {...project} />;

    return (
      <ACC.Page backLink={backLink} pageTitle={pageTitle} project={project}>
        <ACC.Section qa="guidance">
          <ACC.Content markdown value={x => x.pages.failedBankCheckConfirmation.guidance} />
        </ACC.Section>

        <ACC.Section qa="return-to-setup-button">
          <ACC.Link styling="PrimaryButton" route={projectSetupRoute}>
            {getContent(x => x.pages.failedBankCheckConfirmation.returnToSetup)}
          </ACC.Link>
        </ACC.Section>
      </ACC.Page>
    );
  };

  return <ACC.Loader pending={props.project} render={x => renderContents(x)} />;
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
