import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../../containerBase";
import {
  ILinkInfo,
  PCRItemDto,
  PCRItemForPartnerAdditionDto,
  PCRItemType,
  ProjectDto,
  ProjectRole
} from "@framework/types";
import * as ACC from "../../../components";
import { Pending } from "@shared/pending";
import { PCRDto, PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator, PCRDtoValidator } from "@ui/validators";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";

export interface PcrSpendProfileCostsParams {
  projectId: string;
  pcrId: string;
  itemId: string;
  costCategoryId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  pcrItem: Pending<PCRItemDto>;
  pcrItemType: Pending<PCRItemTypeDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
  documentsEditor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>>;
  editableItemTypes: Pending<PCRItemType[]>;
 }

interface Callbacks {
  onChange: (dto: PCRDto) => void;
  onSave: (dto: PCRDto, link: ILinkInfo) => void;
}

class Component extends ContainerBase<PcrSpendProfileCostsParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      pcr: this.props.pcr,
      pcrItem: this.props.pcrItem,
      pcrItemType: this.props.pcrItemType,
      editor: this.props.editor,
      documentsEditor: this.props.documentsEditor,
      editableItemTypes: this.props.editableItemTypes,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.editor, x.documentsEditor, x.pcr, x.pcrItem, x.pcrItemType, x.editableItemTypes)} />;
  }

  private renderContents(project: ProjectDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, pcr: PCRDto, pcrItem: PCRItemDto, pcrItemType: PCRItemTypeDto, editableItemTypes: PCRItemType[]) {
    return (
      <ACC.Page
        backLink={"to do"}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        validator={null} // TODO
        error={editor.error || documentsEditor.error}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />
        <ACC.Link route={this.props.routes.pcrPrepareSpendProfileAddCost.getLink({itemId: this.props.itemId, pcrId: this.props.pcrId, projectId: this.props.projectId, costCategoryId: this.props.costCategoryId})}>Add cost</ACC.Link>
        {/*{(pcrItem as PCRItemForPartnerAdditionDto).spendProfile.costs.map(x => JSON.stringify(x))}*/}
      </ACC.Page>
    );
  }
}

const Container = (props: PcrSpendProfileCostsParams & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <Component
        project={stores.projects.getById(props.projectId)}
        pcrItem={stores.projectChangeRequests.getItemById(props.projectId, props.pcrId, props.itemId)}
        pcrItemType={stores.projectChangeRequests.getPcrTypeForItem(props.projectId, props.pcrId, props.itemId)}
        pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
        editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId)}
        documentsEditor={stores.projectChangeRequestDocuments.getPcrOrPcrItemDocumentsEditor(props.projectId, props.itemId)}
        editableItemTypes={stores.projectChangeRequests.getEditableItemTypes(props.projectId, props.pcrId)}
        onSave={(dto, link) => {
          stores.messages.clearMessages();
          stores.projectChangeRequests.updatePcrEditor(true, props.projectId, dto, undefined, () =>
            stores.navigation.navigateTo(link));
        }}
        onChange={(dto) => {
          stores.messages.clearMessages();
          stores.projectChangeRequests.updatePcrEditor(false, props.projectId, dto);
        }}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const PCRPrepareSpendProfileCostsRoute = defineRoute<PcrSpendProfileCostsParams>({
  routeName: "pcrPrepareSpendProfileCosts",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/spendProfile/:costCategoryId",
  container: (props) => <Container {...props} />,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId,
    costCategoryId: route.params.costCategoryId,
  }),
  getTitle: ({ params, stores }) => ({displayTitle: "to do", htmlTitle: "to do"}),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
