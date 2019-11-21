import React from "react";

import { BaseProps, ContainerBase } from "../containerBase";
import { ProjectDto } from "@framework/types";

import * as ACC from "@ui/components";
import { Pending } from "@shared/pending";
import { PCRDto, PCRItemDto, PCRItemTypeDto } from "@framework/dtos";
import { EditorStatus, IEditorStore, StoresConsumer, } from "@ui/redux";
import * as Items from "./items";
import * as Validators from "@ui/validators/pcrDtoValidator";
import { PCRItemStatus, PCRItemType } from "@framework/constants";

interface ProjectChangeRequestPrepareItemParams {
  projectId: string;
  pcrId: string;
  itemId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  pcrItem: Pending<PCRItemDto>;
  pcrItemType: Pending<PCRItemTypeDto>;
  editor: Pending<IEditorStore<PCRDto, Validators.PCRDtoValidator>>;
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
      pcrItemType: this.props.pcrItemType,
      editor: this.props.editor,
    });

    return <ACC.Loader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.pcrItem, x.pcrItemType, x.editor)} />;
  }

  private renderContents(project: ProjectDto, pcr: PCRDto, pcrItem: PCRItemDto, pcrItemType: PCRItemTypeDto, editor: IEditorStore<PCRDto, Validators.PCRDtoValidator>) {
    return (
      <React.Fragment>
        {this.renderGuidanceSection(pcrItem)}
        {this.renderTemplateLinks(pcrItemType)}
        {this.renderForm(project, pcr, editor)}
      </React.Fragment>
    );
  }

  private renderGuidanceSection(pcr: PCRItemDto) {
    if (!pcr.guidance) return null;
    return (
      <ACC.Section qa="guidance">
        <ACC.Renderers.Markdown value={pcr.guidance}/>
      </ACC.Section>
    );
  }

  private renderTemplateLinks(itemType: PCRItemTypeDto) {
    if(!itemType.files || !itemType.files.length) {
      return null;
    }
    return(
      <ACC.Section title="Templates" qa="templates">
        <ACC.LinksList links={itemType.files.map(x => ({text: x.name, url: x.relativeUrl}))}/>
      </ACC.Section>
    );
  }

  renderForm(project: ProjectDto, pcr: PCRDto, editor: IEditorStore<PCRDto, Validators.PCRDtoValidator>): React.ReactNode {
    const status = editor.status || EditorStatus.Editing;
    const item = editor.data.items.find(x => x.id === this.props.itemId);
    const validator = editor.validator.items.results.find(x => x.model.id === this.props.itemId)!;
    if (item) {
      switch (item.type) {
        case PCRItemType.TimeExtension:
          return <Items.TimeExtensionEdit project={project} projectChangeRequestItem={item} validator={validator as Validators.PCRTimeExtensionItemDtoValidator} status={status} onChange={itemDto => this.onChange(editor.data, itemDto)} onSave={() => this.onSave(editor.data)} />;
        case PCRItemType.ProjectSuspension:
          return <Items.ProjectSuspensionEdit project={project} projectChangeRequestItem={item} validator={validator as Validators.PCRProjectSuspensionItemDtoValidator} status={status} onChange={itemDto => this.onChange(editor.data, itemDto)} onSave={() => this.onSave(editor.data)} />;
        case PCRItemType.MultiplePartnerFinancialVirement:
        case PCRItemType.PartnerAddition:
        case PCRItemType.PartnerWithdrawal:
        case PCRItemType.SinglePartnerFinancialVirement:
          return <Items.StandardItemEdit projectChangeRequest={pcr} projectChangeRequestItem={item} validator={validator as Validators.PCRStandardItemDtoValidator} status={status} onChange={itemDto => this.onChange(editor.data, itemDto)} onSave={() => this.onSave(editor.data)} routes={this.props.routes} />;
      }
    }
    return <ACC.ValidationMessage messageType="error" message="Type not handled" />;
  }

  private onChange(dto: PCRDto, itemDto: PCRItemDto): void {
    const index = dto.items.findIndex(x => x.id === this.props.itemId);
    dto.items[index] = itemDto;
    this.props.onChange(false, dto);
  }

  private onSave(dto: PCRDto): void {
    // if the status is todo and we are saving should change it to incomplete
    const index = dto.items.findIndex(x => x.id === this.props.itemId);
    if (dto.items[index].status === PCRItemStatus.ToDo) {
      dto.items[index].status = PCRItemStatus.Incomplete;
    }
    this.props.onChange(true, dto);
  }
}

export const PCRPrepareItemContainer = (props: ProjectChangeRequestPrepareItemParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <PCRPrepareItemComponent
          project={stores.projects.getById(props.projectId)}
          pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
          pcrItem={stores.projectChangeRequests.getItemById(props.projectId, props.pcrId, props.itemId)}
          pcrItemType={stores.projectChangeRequests.getPcrTypeForItem(props.projectId, props.pcrId, props.itemId)}
          editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId)}
          onChange={(save, dto) => {
            stores.messages.clearMessages();
            stores.projectChangeRequests.updatePcrEditor(save, props.projectId, dto, "Your document has been removed.", () => stores.navigation.navigateTo(props.routes.pcrPrepare.getLink({ projectId: props.projectId, pcrId: props.pcrId })));
          }}
          {...props}
        />
      )
    }
  </StoresConsumer>
);
