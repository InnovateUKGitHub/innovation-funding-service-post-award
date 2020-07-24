import React from "react";
import { Pending } from "@shared/pending";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import * as ACC from "../../components";
import {IEditorStore, StoresConsumer} from "@ui/redux";
import * as Dtos from "@framework/dtos";
import {PartnerDtoValidator} from "@ui/validators/partnerValidator";

export interface ProjectSetupParams {
  projectId: string;
  partnerId: string;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  partner: Pending<Dtos.PartnerDto>;
  editor: Pending<IEditorStore<Dtos.PartnerDto, PartnerDtoValidator>>;
}

interface Callbacks {
  onUpdate: (saving: boolean, dto: Dtos.PartnerDto) => void;
}

interface CombinedData {
  project: Dtos.ProjectDto;
  partner: Dtos.PartnerDto;
  editor: IEditorStore<Dtos.PartnerDto, PartnerDtoValidator>;
}

class ProjectSetupComponent extends ContainerBase<ProjectSetupParams, Data, Callbacks> {

  render() {
    const combined = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x)}/>;
  }

  private renderContents({ project, partner, editor }: CombinedData) {
    const Form = ACC.TypedForm<Dtos.PartnerDto>();

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.projectDashboard.getLink({})}>
          <ACC.Content value={x => x.projectSetup.backLink()} />
        </ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        error={editor.error}
        validator={editor.validator}
        project={project}
      >
        <ACC.Section qa="guidance">
          <ACC.Renderers.SimpleString>
            <ACC.Content value={x => x.projectSetup.projectMessages.setupGuidance()}/>
          </ACC.Renderers.SimpleString>
        </ACC.Section>
        <ACC.TaskList qa="taskList">
          <ACC.TaskListSection step={1} titleContent={x => x.projectSetup.taskList().sectionTitleEnterInfo()} qa="WhatDoYouWantToDo">
            <ACC.Task
              nameContent={x => x.projectSetup.setSpendProfile()}
              status={partner.spendProfileStatusLabel as ACC.TaskStatus}
              route={this.props.routes.projectSetupSpendProfile.getLink({partnerId: partner.id, projectId: project.id})}
            />
            <ACC.Task
              nameContent={x => x.projectSetup.provideBankDetails()}
              status={partner.bankDetailsTaskStatusLabel as ACC.TaskStatus}
              route={this.props.routes.projectSetupBankDetails.getLink({partnerId: partner.id, projectId: project.id})}
            />
          </ACC.TaskListSection>
        </ACC.TaskList>
        <Form.Form
            data={partner}
            editor={editor}
            onSubmit={() => this.props.onUpdate(true, editor.data)}
            qa="projectSetupForm"
        >
          <Form.Fieldset>
            <Form.Submit><ACC.Content value={x => x.projectSetup.complete()}/></Form.Submit>
          </Form.Fieldset>
        </Form.Form>
      </ACC.Page>
    );
  }
}

const ProjectSetupContainer = (props: ProjectSetupParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <ProjectSetupComponent
          project={stores.projects.getById(props.projectId)}
          partner={stores.partners.getById(props.partnerId)}
          editor={stores.partners.getPartnerEditor(props.projectId, props.partnerId)}
          onUpdate={(saving, dto) =>
              stores.partners.updatePartner(saving, props.partnerId, dto, () =>
                  stores.navigation.navigateTo(props.routes.projectDashboard.getLink({})))}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const ProjectSetupRoute = defineRoute<ProjectSetupParams>({
  routeName: "projectSetup",
  routePath: "/projects/:projectId/setup/:partnerId",
  getParams: (r) => ({ projectId: r.params.projectId, partnerId: r.params.partnerId }),
  container: ProjectSetupContainer,
  accessControl: (auth, params) => auth.forProject(params.projectId).hasRole(Dtos.ProjectRole.FinancialContact),
  getTitle: ({ content }) => content.projectSetup.title(),
});
