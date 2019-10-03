import React from "react";

import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "@ui/components";
import { Pending } from "@shared/pending";
import { PCRDto, PCRItemDto, PCRItemForTimeExtensionDto, PCRStandardItemDto } from "@framework/dtos";
import { ProjectChangeRequestPrepareRoute } from "@ui/containers";
import { EditorStatus, IEditorStore, StoresConsumer, } from "@ui/redux";
import { ProjectChangeRequestItemStatus, ProjectChangeRequestItemTypeEntity } from "@framework/entities";
import { PCRDtoValidator, PCRStandardItemDtoValdiator, PCRTimeExtentionItemDtoValidator } from "@ui/validators";
import * as Items from "./items";

export interface ProjectChangeRequestPrepareItemParams {
  projectId: string;
  pcrId: string;
  itemId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  pcrItem: Pending<PCRItemDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
}

interface Callbacks {
  onChange: (save: boolean, dto: PCRDto) => void;
}

class PCRPrepareItemComponent extends ContainerBase<ProjectChangeRequestPrepareItemParams, Data, Callbacks> {
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
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={ProjectChangeRequestPrepareRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to prepare project change request</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        error={editor.error}
        validator={[editor.validator]}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />

        <ACC.Section qa="guidance">
          <ACC.Renderers.SimpleString>{pcrItem.guidance}</ACC.Renderers.SimpleString>
        </ACC.Section>

        {this.renderForm(project, pcr, editor)}

      </ACC.Page>
    );
  }

  renderForm(project: ProjectDto, pcr: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>): React.ReactNode {
    const status = editor.status || EditorStatus.Editing;
    const item = editor.data.items.find(x => x.id === this.props.itemId);
    const validator = editor.validator.items.results.find(x => x.model.id === this.props.itemId)!;
    if (item) {
      switch (item.type) {
        case ProjectChangeRequestItemTypeEntity.TimeExtension:
           return <Items.TimeExtensionEdit project={project} projectChangeRequestItem={item} validator={validator as PCRTimeExtentionItemDtoValidator}  status={status} onChange={itemDto => this.onChange(editor.data, itemDto)} onSave={() => this.onSave(editor.data)}/>;
        case ProjectChangeRequestItemTypeEntity.AccountNameChange:
        case ProjectChangeRequestItemTypeEntity.MultiplePartnerFinancialVirement:
        case ProjectChangeRequestItemTypeEntity.PartnerAddition:
        case ProjectChangeRequestItemTypeEntity.PartnerWithdrawal:
        case ProjectChangeRequestItemTypeEntity.ProjectSuspension:
        case ProjectChangeRequestItemTypeEntity.ProjectTermination:
        case ProjectChangeRequestItemTypeEntity.ScopeChange:
        case ProjectChangeRequestItemTypeEntity.SinglePartnerFinancialVirement:
          return <Items.StandardItemEdit projectChangeRequest={pcr} projectChangeRequestItem={item} validator={validator as PCRStandardItemDtoValdiator} status={status} onChange={itemDto => this.onChange(editor.data, itemDto)} onSave={() => this.onSave(editor.data)} />;
      }
    }
    return <ACC.ValidationMessage messageType="error" message="Type not handled" />;
  }

  private onChange(dto: PCRDto, itemDto: PCRStandardItemDto|PCRItemForTimeExtensionDto): void {
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

const PCRPrepareItemContainer = (props: ProjectChangeRequestPrepareItemParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <PCRPrepareItemComponent
          project={stores.projects.getById(props.projectId)}
          pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
          pcrItem={stores.projectChangeRequests.getItemById(props.projectId, props.pcrId, props.itemId)}
          editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId)}
          onChange={(save, dto) => {
            stores.messages.clearMessages();
            stores.projectChangeRequests.updatePcrEditor(save, props.projectId, dto, "Your document has been removed.", () => stores.navigation.navigateTo(ProjectChangeRequestPrepareRoute.getLink({ projectId: props.projectId, pcrId: props.pcrId })));
          }}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const ProjectChangeRequestPrepareItemRoute = defineRoute({
  routeName: "projectChangeRequestPrepareItem",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId",
  container: PCRPrepareItemContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId
  }),
  getTitle: (store, params, stores) => {
    const typeName = stores.projectChangeRequests.getItemById(params.projectId, params.pcrId, params.itemId).then(x => x.typeName).data;
    return {
      htmlTitle: typeName ? `Upload files to ${typeName}` : "Upload files to project change request item",
      displayTitle: typeName ? `Upload files to ${typeName}` : "Upload files to project change request item",
    };
  },
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
