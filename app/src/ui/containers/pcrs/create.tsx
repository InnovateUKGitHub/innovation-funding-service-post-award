import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";

import * as ACC from "../../components";
import * as Dtos from "@framework/dtos";
import { Pending } from "@shared/pending";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { ProjectChangeRequestItemTypeEntity } from "@framework/entities";
import { PCRsDashboardRoute } from "./dashboard";
import { ProjectChangeRequestPrepareRoute } from "@ui/containers";
import { ProjectChangeRequestDtoValidatorForCreate } from "@ui/validators/projectChangeRequestDtoValidatorForCreate";

export interface CreateProjectChangeRequestParams {
  projectId: string;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  itemTypes: Pending<Dtos.PCRItemTypeDto[]>;
  editor: Pending<IEditorStore<Dtos.PCRDto, ProjectChangeRequestDtoValidatorForCreate>>;
  editableItemTypes: Pending<ProjectChangeRequestItemTypeEntity[]>;
}

interface Callbacks {
  onChange: (saving: boolean, dto: Dtos.PCRDto) => void;
  createNewChangeRequestItem: (itemType: Dtos.PCRItemTypeDto) => (Dtos.TypedPcrItemDto);
}

class PCRCreateComponent extends ContainerBase<CreateProjectChangeRequestParams, Data, Callbacks> {

  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.editor, itemTypes: this.props.itemTypes, editableItemTypes: this.props.editableItemTypes });
    return <ACC.PageLoader pending={combined} render={d => this.renderContents(d.project, d.pcr, d.itemTypes, d.editableItemTypes)} />;
  }

  private renderContents(project: Dtos.ProjectDto, editor: IEditorStore<Dtos.PCRDto, ProjectChangeRequestDtoValidatorForCreate>, itemTypes: Dtos.PCRItemTypeDto[], editableItemTypes: ProjectChangeRequestItemTypeEntity[]) {
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={PCRsDashboardRoute.getLink({ projectId: this.props.projectId })}>Back to project change requests</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.Section qa="pcr-create">
          {this.renderForm(editor, itemTypes, editableItemTypes)}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderForm(pcrEditor: IEditorStore<Dtos.PCRDto, ProjectChangeRequestDtoValidatorForCreate>, itemTypes: Dtos.PCRItemTypeDto[], editableItemTypes: ProjectChangeRequestItemTypeEntity[]): React.ReactNode {
    const PCRForm = ACC.TypedForm<Dtos.PCRDto>();
    const options = itemTypes.map<ACC.SelectOption>(x => ({ id: x.type.toString(), value: x.displayName }));
    const selected = options.filter(x => pcrEditor.data.items.some(y => y.type.toString() === x.id));

    return (
      <React.Fragment>
        <PCRForm.Form editor={pcrEditor} onSubmit={() => this.props.onChange(true, pcrEditor.data)} onChange={dto => this.props.onChange(false, dto)} qa="pcr-create-form">
          <PCRForm.Fieldset heading="Select request types">
            <PCRForm.Checkboxes
              hint="You can select more than one."
              options={options}
              name="types"
              validation={pcrEditor.validator.items}
              value={x => selected}
              update={(model, selectedValue) => {
                model.items = itemTypes
                  .filter(x => (selectedValue || []).some(y => y.id === x.type.toString()))
                  .map(x => model.items.find(y => x.type === y.type) || this.props.createNewChangeRequestItem(x));
              }}
            />
          </PCRForm.Fieldset>
          <PCRForm.Submit>Create request</PCRForm.Submit>
        </PCRForm.Form>
        <ACC.Link styling="SecondaryButton" route={PCRsDashboardRoute.getLink({ projectId: this.props.projectId })}>Cancel</ACC.Link>
      </React.Fragment>
    );
  }
}

const PCRCreateContainer = (props: CreateProjectChangeRequestParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <PCRCreateComponent
          project={stores.projects.getById(props.projectId)}
          itemTypes={stores.projectChangeRequests.getAllPcrTypes()}
          editor={stores.projectChangeRequests.getPcrCreateEditor(props.projectId)}
          onChange={(saving, dto) => stores.projectChangeRequests.updatePcrEditor(saving, props.projectId, dto, undefined, (created) => stores.navigation.navigateTo(ProjectChangeRequestPrepareRoute.getLink({ projectId: dto.projectId, pcrId: created.id })))}
          editableItemTypes={stores.projectChangeRequests.getEditableItemTypes(props.projectId, null)}
          createNewChangeRequestItem={(itemType: Dtos.PCRItemTypeDto) => stores.projectChangeRequests.createNewChangeRequestItem(itemType)}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const PCRCreateRoute = defineRoute({
  routeName: "pcrCreate",
  routePath: "/projects/:projectId/pcrs/create",
  container: PCRCreateContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
  }),
  getTitle: () => ({
    htmlTitle: "Start a new request",
    displayTitle: "Start a new request"
  }),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(Dtos.ProjectRole.ProjectManager)
});
