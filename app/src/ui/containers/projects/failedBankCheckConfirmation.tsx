import React from "react";
import {StoresConsumer} from "@ui/redux";
import {ProjectDto, ProjectRole} from "@framework/dtos";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import * as ACC from "../../components";

export interface FailedBankCheckConfirmationParams {
  projectId: string;
  partnerId: string;
}

interface Data {
  project: ProjectDto;
}

class FailedBankCheckConfirmationComponent extends ContainerBase<FailedBankCheckConfirmationParams, Data> {
  render() {
    const { projectId, partnerId, project } = this.props;
    const projectSetupRoute = this.props.routes.projectSetup.getLink({ projectId, partnerId });

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={projectSetupRoute}> <ACC.Content value={x => x.failedBankCheckConfirmation.backLink} /></ACC.BackLink>}
        pageTitle={<ACC.Projects.Title {...project} />}
        project={project}
      >
        <ACC.Section qa="guidance">
          <ACC.Renderers.SimpleString>
            <ACC.Content value={x => x.failedBankCheckConfirmation.guidance} />
          </ACC.Renderers.SimpleString>
        </ACC.Section>
        <ACC.Section qa="return-to-setup-button">
          <ACC.Link styling="PrimaryButton" route={projectSetupRoute}><ACC.Content value={x => x.failedBankCheckConfirmation.returnButton} /></ACC.Link>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const FailedBankCheckConfirmationContainer = (props: FailedBankCheckConfirmationParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => {
        return <ACC.Loader
          pending={stores.projects.getById(props.projectId)}
          render={x => <FailedBankCheckConfirmationComponent project={x} {...props}/>}
        />;
      }
    }
  </StoresConsumer>
);

export const FailedBankCheckConfirmationRoute = defineRoute<FailedBankCheckConfirmationParams>({
  routeName: "failedBankCheckConfirmation",
  routePath: "/projects/:projectId/setup/:partnerId/further-information-required",
  getParams: (r) => ({ projectId: r.params.projectId, partnerId: r.params.partnerId }),
  container: FailedBankCheckConfirmationContainer,
  accessControl: (auth, params) => auth.forProject(params.projectId)
    .hasRole(ProjectRole.FinancialContact),
  getTitle: ({ content }) => content.failedBankCheckConfirmation.title(),
});
