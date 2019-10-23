import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";

import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";
import { Pending } from "@shared/pending";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { PCRItemType } from "@framework/constants";

export interface ProjectChangeRequestAddTypeParams {
  projectId: string;
  projectChangeRequestId: string;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  itemTypes: Pending<Dtos.PCRItemTypeDto[]>;
  editor: Pending<IEditorStore<Dtos.PCRDto, PCRDtoValidator>>;
  projectChangeRequest: Pending<Dtos.PCRDto>;
}

interface Callbacks {
  onChange: (saving: boolean, dto: Dtos.PCRDto) => void;
  createNewChangeRequestItem: (itemType: Dtos.PCRItemTypeDto) => (Dtos.PCRItemDto);
}

class PCRAddTypeComponent extends ContainerBase<ProjectChangeRequestAddTypeParams, Data, Callbacks> {

  render() {
    const combined = Pending.combine({ project: this.props.project, editor: this.props.editor, projectChangeRequest: this.props.projectChangeRequest, itemTypes: this.props.itemTypes });
    return <ACC.PageLoader pending={combined} render={d => this.renderContents(d.project, d.editor, d.projectChangeRequest, d.itemTypes)} />;
  }

  private renderContents(project: Dtos.ProjectDto, editor: IEditorStore<Dtos.PCRDto, PCRDtoValidator>, original: Dtos.PCRDto, itemTypes: Dtos.PCRItemTypeDto[]) {
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.pcrPrepare.getLink({ projectId: this.props.projectId, pcrId: this.props.projectChangeRequestId })}>Back to requests</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.Section qa="pcr-AddType">
          {this.renderForm(editor, original, itemTypes)}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderForm(pcrEditor: IEditorStore<Dtos.PCRDto, PCRDtoValidator>, original: Dtos.PCRDto, itemTypes: Dtos.PCRItemTypeDto[]): React.ReactNode {
    const PCRForm = ACC.TypedForm<Dtos.PCRDto>();
    const preselectedItems: PCRItemType[] = original.items.map(x => x.type);
    const options = itemTypes.map<ACC.SelectOption>(x => ({ id: x.type.toString(), value: x.displayName, disabled: preselectedItems.indexOf(x.type) >= 0 }));
    const selected = options.filter(x => pcrEditor.data.items.some(y => y.type.toString() === x.id));

    return (
      <React.Fragment>
        <PCRForm.Form editor={pcrEditor} onSubmit={() => this.props.onChange(true, pcrEditor.data)} onChange={dto => this.props.onChange(false, dto)} qa="pcr-AddTypeForm">
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
          <PCRForm.Submit>Add to request</PCRForm.Submit>
        </PCRForm.Form>
        <ACC.Link styling="SecondaryButton" route={this.props.routes.pcrPrepare.getLink({ projectId: this.props.projectId, pcrId: this.props.projectChangeRequestId })}>Cancel</ACC.Link>
      </React.Fragment>
    );
  }
}

const PCRAddTypeContainer = (props: ProjectChangeRequestAddTypeParams & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <PCRAddTypeComponent
        project={stores.projects.getById(props.projectId)}
        itemTypes={stores.projectChangeRequests.getAllPcrTypes()}
        projectChangeRequest={stores.projectChangeRequests.getById(props.projectId, props.projectChangeRequestId)}
        editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.projectChangeRequestId)}
        onChange={(saving, dto) => stores.projectChangeRequests.updatePcrEditor(saving, props.projectId, dto, undefined, () => stores.navigation.navigateTo(props.routes.pcrPrepare.getLink({ projectId: props.projectId, pcrId: props.projectChangeRequestId })))}
        createNewChangeRequestItem={(itemType: Dtos.PCRItemTypeDto) => stores.projectChangeRequests.createNewChangeRequestItem(itemType)}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const ProjectChangeRequestAddTypeRoute = defineRoute({
  routeName: "projectChangeRequestAddType",
  routePath: "/projects/:projectId/pcrs/:projectChangeRequestId/prepare/add",
  container: PCRAddTypeContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    projectChangeRequestId: route.params.projectChangeRequestId,
  }),
  getTitle: () => ({
    htmlTitle: "Add types",
    displayTitle: "Add types"
  }),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(Dtos.ProjectRole.ProjectManager)
});
