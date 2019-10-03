import React from "react";

import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import { Pending } from "@shared/pending";
import { PCRDto, PCRItemForTimeExtensionDto, ProjectDto } from "@framework/dtos";
import { ProjectChangeRequestPrepareRoute } from "./prepare";
import { EditorStatus, IEditorStore, StoresConsumer, } from "@ui/redux";
import { ProjectChangeRequestItemStatus } from "@framework/entities";
import { PCRDtoValidator, PCRTimeExtentionItemDtoValidator } from "@ui/validators";

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
  onChange: (saving: boolean, dto: PCRDto) => void;
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

  private renderContents(project: ProjectDto, pcr: PCRDto, pcrItem: PCRItemForTimeExtensionDto, editor: IEditorStore<PCRDto, PCRDtoValidator>) {
    const Form = ACC.TypedForm<PCRItemForTimeExtensionDto>();

    const options: ACC.SelectOption[] = [
      { id: "true", value: "This is ready to submit" }
    ];

    const index = pcr.items.findIndex(x => x.id === pcrItem.id);

    const editItem = editor.data.items[index] as PCRItemForTimeExtensionDto;
    const validator = editor.validator.items.results[index] as PCRTimeExtentionItemDtoValidator;

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
            data={editItem}
            isSaving={editor.status === EditorStatus.Saving}
            onChange={dto => this.onChange(editor.data, dto)}
            onSubmit={() => this.onSave(editor.data)}
            qa="itemStatus"
          >
            <Form.Fieldset heading="Current end date">
              <Form.Custom
                name="currentEndDate"
                value={m => <ACC.Renderers.SimpleString><ACC.Renderers.FullDate value={project.periodEndDate} /></ACC.Renderers.SimpleString>}
                update={(m, v) => { return; }}
              />
            </Form.Fieldset>
            <Form.Fieldset heading="Set a new end date">
              <Form.Date
                name="endDate"
                value={m => m.projectEndDate}
                update={(m, v) => m.projectEndDate = v}
                validation={validator.projectEndDate}
                hint={"The date must be at the end of a month, for example 31 01 2021"}
              />
            </Form.Fieldset>
            <Form.Fieldset heading="Mark as complete">
              <Form.Checkboxes
                name="itemStatus"
                options={options}
                value={m => m.status === ProjectChangeRequestItemStatus.Complete ? [options[0]] : []}
                update={(m, v) => m.status = (v && v.some(x => x.id === "true")) ? ProjectChangeRequestItemStatus.Complete : ProjectChangeRequestItemStatus.Incomplete}
                validation={validator.status}
              />
              <Form.Submit>Save and return to request</Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>

      </ACC.Page>
    );
  }

  private onChange(dto: PCRDto, itemDto: PCRItemForTimeExtensionDto): void {
    const index = dto.items.findIndex(x => x.id === this.props.itemId);
    dto.items[index] = itemDto;
    this.props.onChange(false, dto);
  }

  private onSave(dto: PCRDto): void {
    // if the status is todo and we are saving should change it to incomplete
    const index = dto.items.findIndex(x => x.id === this.props.itemId);
    if (dto.items[index].status === ProjectChangeRequestItemStatus.ToDo) {
      dto.items[index].status = ProjectChangeRequestItemStatus.Incomplete;
    }
    this.props.onChange(true, dto);
  }
}

const PCRPrepareItemForTimeExtensionContainer = (props: ProjectChangeRequestPrepareItemForTimeExtensionParams & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <PCRPrepareItemForTimeExtensionComponent
        project={stores.projects.getById(props.projectId)}
        pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
        pcrItem={stores.projectChangeRequests.getTimeExtentionItemById(props.projectId, props.pcrId, props.itemId)}
        editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId)}
        onChange={(saving, dto) => stores.projectChangeRequests.updatePcrEditor(saving, props.projectId, dto, undefined,
          () => stores.navigation.navigateTo(ProjectChangeRequestPrepareRoute.getLink({ projectId: props.projectId, pcrId: props.pcrId }))
        )}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const ProjectChangeRequestPrepareItemForTimeExtensionRoute = defineRoute({
  routeName: "projectChangeRequestPrepareItemForTimeExtension",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/time-extension/:itemId",
  container: PCRPrepareItemForTimeExtensionContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId
  }),
  getTitle: (store, params, stores) => {
    const typeName = stores.projectChangeRequests.getItemById(params.projectId, params.pcrId, params.itemId).then(x => x.typeName).data;
    return {
      htmlTitle: typeName ? `Prepare ${typeName}` : "Prepare project change request item",
      displayTitle: typeName ? `Prepare ${typeName}` : "Prepare project change request item",
    };
  },
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
