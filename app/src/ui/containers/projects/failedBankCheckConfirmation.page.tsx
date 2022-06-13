import { ProjectDto } from "@framework/dtos";
import { Pending } from "@shared/pending";
import { ProjectRole } from "@framework/constants";

import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useStores } from "@ui/redux";
import * as ACC from "@ui/components";
import { useContent } from "@ui/hooks";

export interface FailedBankCheckConfirmationParams {
  projectId: string;
  partnerId: string;
}

interface FailedBankCheckConfirmationProps extends BaseProps, FailedBankCheckConfirmationParams {
  projectId: string;
  project: Pending<ProjectDto>;
}

function FailedBankCheckConfirmation({ projectId, partnerId, routes, ...props }: FailedBankCheckConfirmationProps) {
  const { getContent } = useContent();

  const renderContents = (project: ProjectDto) => {
    const projectSetupRoute = routes.projectSetup.getLink({ projectId, partnerId });

    const failedConfirmationBackLink = getContent(x => x.failedBankCheckConfirmation.backLink);
    const backLink = <ACC.BackLink route={projectSetupRoute}>{failedConfirmationBackLink}</ACC.BackLink>;
    const pageTitle = <ACC.Projects.Title {...project} />;

    return (
      <ACC.Page backLink={backLink} pageTitle={pageTitle} project={project}>
        <ACC.Section qa="guidance">
          <ACC.Renderers.SimpleString>
            {getContent(x => x.failedBankCheckConfirmation.guidanceLine1)}
          </ACC.Renderers.SimpleString>

          <ACC.Renderers.SimpleString>
            {getContent(x => x.failedBankCheckConfirmation.guidanceLine2)}
          </ACC.Renderers.SimpleString>

          <ACC.Renderers.SimpleString>
            {getContent(x => x.failedBankCheckConfirmation.guidanceLine3)}
          </ACC.Renderers.SimpleString>

          <ACC.Renderers.SimpleString>
            {getContent(x => x.failedBankCheckConfirmation.guidanceListIntro)}
          </ACC.Renderers.SimpleString>

          <ACC.UL>
            <li>{getContent(x => x.failedBankCheckConfirmation.guidanceListItem1)}</li>
            <li>{getContent(x => x.failedBankCheckConfirmation.guidanceListItem2)}</li>
            <li>{getContent(x => x.failedBankCheckConfirmation.guidanceListItem3)}</li>
          </ACC.UL>
        </ACC.Section>

        <ACC.Section qa="return-to-setup-button">
          <ACC.Link styling="PrimaryButton" route={projectSetupRoute}>
            {getContent(x => x.failedBankCheckConfirmation.returnButton)}
          </ACC.Link>
        </ACC.Section>
      </ACC.Page>
    );
  };

  return <ACC.Loader pending={props.project} render={x => renderContents(x)} />;
}

function FailedBankCheckConfirmationContainer(props: FailedBankCheckConfirmationParams & BaseProps) {
  const { projects } = useStores();

  return <FailedBankCheckConfirmation {...props} project={projects.getById(props.projectId)} />;
}

export const FailedBankCheckConfirmationRoute = defineRoute<FailedBankCheckConfirmationParams>({
  routeName: "failedBankCheckConfirmation",
  routePath: "/projects/:projectId/setup/:partnerId/further-information-required",
  getParams: r => ({
    projectId: r.params.projectId,
    partnerId: r.params.partnerId,
  }),
  container: FailedBankCheckConfirmationContainer,
  accessControl: (auth, params) => auth.forProject(params.projectId).hasRole(ProjectRole.FinancialContact),
  getTitle: x => x.content.failedBankCheckConfirmation.title(),
});
