import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { PCRItemForTimeExtensionDto, ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { PCRDto, PCRItemDto } from "@framework/dtos";
import { ProjectChangeRequestPrepareRoute } from "./prepare";
import { EditorStatus, IEditorStore, } from "@ui/redux";
import { ProjectChangeRequestItemStatus } from "@framework/entities";
import { PCRDtoValidator } from "@ui/validators";

export interface ProjectChangeRequestPrepareItemForTimeExtensionParams {
  projectId: string;
  pcrId: string;
  itemId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  pcrItem: Pending<PCRItemForTimeExtensionDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
}

interface Callbacks {
  onChange: (projectId: string, pcrId: string, dto: PCRDto) => void;
  onSave: (projectId: string, pcrId: string, dto: PCRDto) => void;
}

class PCRPrepareItemForTimeExtensionComponent extends ContainerBase<ProjectChangeRequestPrepareItemForTimeExtensionParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      pcr: this.props.pcr,
      pcrItem: this.props.pcrItem,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.pcrItem, x.editor)} />;
  }

  private renderContents(project: ProjectDto, pcr: PCRDto, pcrItem: PCRItemDto, editor: IEditorStore<PCRDto, PCRDtoValidator>) {
    const Form = ACC.TypedForm<PCRItemDto>();

    const options: ACC.SelectOption[] = [
      { id: "true", value: "This is ready to submit" }
    ];

    const index = pcr.items.findIndex(x => x.id === pcrItem.id);
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={ProjectChangeRequestPrepareRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to prepare project change request</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        error={editor.error}
        validator={editor.validator}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />

        <ACC.Section qa="guidance">
          <ACC.Renderers.SimpleString>{pcrItem.guidance}</ACC.Renderers.SimpleString>
        </ACC.Section>

        <ACC.Section>
          <Form.Form
            data={editor.data.items[index]}
            isSaving={editor.status === EditorStatus.Saving}
            onChange={dto => this.onChange(editor.data, dto)}
            onSubmit={() => this.onSave(editor.data)}
            qa="itemStatus"
          >
            <Form.Fieldset heading="Mark as complete">
              <Form.Checkboxes
                name="itemStatus"
                options={options}
                value={m => m.status === ProjectChangeRequestItemStatus.Complete ? [options[0]] : []}
                update={(m, v) => m.status = (v && v.some(x => x.id === "true")) ? ProjectChangeRequestItemStatus.Complete : ProjectChangeRequestItemStatus.Incomplete}
                validation={editor.validator.items.results[index].status}
              />
              <Form.Submit>Save and return to request</Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>

      </ACC.Page>
    );
  }

  private onChange(dto: PCRDto, itemDto: PCRItemDto): void {
    const index = dto.items.findIndex(x => x.id === this.props.itemId);
    dto.items[index] = itemDto;
    this.props.onChange(this.props.projectId, this.props.pcrId, dto);
  }

  private onSave(dto: PCRDto): void {
    // if the status is todo and we are saving should change it to incomplete
    const index = dto.items.findIndex(x => x.id === this.props.itemId);
    if (dto.items[index].status === ProjectChangeRequestItemStatus.ToDo) {
      dto.items[index].status = ProjectChangeRequestItemStatus.Incomplete;
    }
    this.props.onSave(this.props.projectId, this.props.pcrId, dto);
  }
}

const definition = ReduxContainer.for<ProjectChangeRequestPrepareItemForTimeExtensionParams, Data, Callbacks>(PCRPrepareItemForTimeExtensionComponent);

export const PCRPrepareItemForTimeExtension = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    pcr: Selectors.getPcr(params.projectId, params.pcrId).getPending(state),
    pcrItem: Selectors.getPcrItemForTimeExtension(state, params.projectId, params.pcrId, params.itemId),
    editor: Selectors.getPcrEditor(params.projectId, params.pcrId).get(state)
  }),
  withCallbacks: (dispatch) => ({
    onChange: (projectId: string, pcrId: string, dto: PCRDto) => dispatch(Actions.validatePCR(projectId, pcrId, dto)),
    onSave: (projectId: string, pcrId: string, dto: PCRDto) =>
      dispatch(Actions.savePCR(projectId, pcrId, dto, () =>
        dispatch(Actions.navigateTo(ProjectChangeRequestPrepareRoute.getLink({ projectId, pcrId }))))),
  })
});

export const ProjectChangeRequestPrepareItemForTimeExtensionRoute = definition.route({
  routeName: "projectChangeRequestPrepareItemForTimeExtension",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/time-extension/:itemId",
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPcr(params.projectId, params.pcrId),
    Actions.loadPcrTypes(),
  ],
  getTitle: (store, params) => {
    const typeName = Selectors.getPcrItem(params.projectId, params.pcrId, params.itemId).getPending(store).then(x => x.typeName).data;
    return {
      htmlTitle: typeName ? `Prepare ${typeName}` : "Prepare project change request item",
      displayTitle: typeName ? `Prepare ${typeName}` : "Prepare project change request item",
    };
  },
  container: PCRPrepareItemForTimeExtension,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
