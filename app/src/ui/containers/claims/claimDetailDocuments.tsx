import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as ACC from "@ui/components";
import { Pending } from "@shared/pending";
import { DocumentDescription, ProjectDto, ProjectRole } from "@framework/types";
import { IEditorStore } from "@ui/redux/reducers";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators/documentUploadValidator";
import { StoresConsumer, useStores } from "@ui/redux";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { useContent } from "@ui/hooks";

export interface ClaimDetailDocumentsPageParams {
  projectId: string;
  partnerId: string;
  costCategoryId: string;
  periodId: number;
}

interface Data {
  project: Pending<ProjectDto>;
  costCategories: Pending<CostCategoryDto[]>;
  documents: Pending<DocumentSummaryDto[]>;
  editor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>>;
}

interface CombinedData {
  project: ProjectDto;
  costCategories: CostCategoryDto[];
  documents: DocumentSummaryDto[];
  editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>;
}

interface Callbacks {
  onChange: (saving: boolean, dto: MultipleDocumentUploadDto) => void;
  onDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

export class ClaimDetailDocumentsComponent extends ContainerBase<ClaimDetailDocumentsPageParams, Data, Callbacks> {

  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      costCategories: this.props.costCategories,
      documents: this.props.documents,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)}/>;
  }

  private renderDocuments(editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, documents: DocumentSummaryDto[]) {
    if (!documents.length) {
      return (
        <ACC.Section>
          <ACC.ValidationMessage message={x => x.claimDetailDocuments.messages.documentValidationMessage} messageType="info" />
        </ACC.Section>
      );
    }

    return (
      <ACC.Section subtitleContent={x => x.claimDetailDocuments.documentMessages.newWindow}>
        <ACC.DocumentTableWithDelete onRemove={(document) => this.props.onDelete(editor.data, document)} documents={documents} qa="supporting-documents"/>
      </ACC.Section>
    );
  }

  private renderContents({ project, costCategories, documents, editor }: CombinedData) {
    const back = this.props.routes.prepareClaimLineItems.getLink({
      projectId: project.id,
      partnerId: this.props.partnerId,
      periodId: this.props.periodId,
      costCategoryId: this.props.costCategoryId
    });
    const costCategory = costCategories.find(x => x.id === this.props.costCategoryId)! || {};
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={back}><ACC.Content value={x => x.claimDetailDocuments.documentMessages.backLink(costCategory.name)}/></ACC.BackLink>}
        error={(editor.error)}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title {...project} />}
      >
        <ACC.Renderers.SimpleString qa="guidanceText"><ACC.Content value={x => x.claimDetailDocuments.messages.documentDetailGuidance}/></ACC.Renderers.SimpleString>
        <ACC.Renderers.Messages messages={this.props.messages} />
        {this.renderDocuments(editor, documents)}
        <ACC.Section titleContent={x => x.claimDetailDocuments.documentMessages.uploadTitle}>
          <UploadForm.Form
            enctype="multipart"
            editor={editor}
            onSubmit={() => this.props.onChange(true, editor.data)}
            onChange={(dto) => this.props.onChange(false, dto)}
            qa="claimDetailDocuments"
          >
            <UploadForm.Fieldset>
              <ACC.DocumentGuidance/>
              <UploadForm.Hidden name="description" value={dto => dto.description}/>
              <UploadForm.MulipleFileUpload
                labelContent={x => x.claimDetailDocuments.documentMessages.uploadDocumentsLabel}
                labelHidden={true}
                name="attachment"
                validation={editor.validator.files}
                value={(data) => data.files}
                update={(dto, files) => dto.files = files || []}
              />
            </UploadForm.Fieldset>
            <UploadForm.Submit><ACC.Content value={x => x.claimDetailDocuments.documentMessages.uploadDocumentsLabel}/></UploadForm.Submit>
          </UploadForm.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const ClaimDetailDocumentsContainer = (props: ClaimDetailDocumentsPageParams & BaseProps) => {
  const stores = useStores();
  const { getContent } = useContent();

  const handleOnChange: Callbacks["onChange"] = (saving, dto) => {
    stores.messages.clearMessages();
    const successMessage = getContent(x => x.claimDetailDocuments.documentMessages.getDocumentUploadedMessage(dto.files.length));

    stores.claimDetailDocuments.updateClaimDetailDocumentsEditor(
      saving,
      props.projectId,
      props.partnerId,
      props.periodId,
      props.costCategoryId,
      dto,
      successMessage,
    );
  };

  const handleOnDelete: Callbacks["onDelete"] = (dto, document) => {
    stores.messages.clearMessages();
    stores.claimDetailDocuments.deleteClaimDetailDocumentsEditor(
      props.projectId,
      props.partnerId,
      props.periodId,
      props.costCategoryId,
      dto,
      document,
    );
  };

  return (
    <ClaimDetailDocumentsComponent
      project={stores.projects.getById(props.projectId)}
      costCategories={stores.costCategories.getAll()}
      documents={stores.claimDetailDocuments.getClaimDetailDocuments(
        props.projectId,
        props.partnerId,
        props.periodId,
        props.costCategoryId,
      )}
      editor={stores.claimDetailDocuments.getClaimDetailDocumentsEditor(
        props.projectId,
        props.partnerId,
        props.periodId,
        props.costCategoryId,
        (dto) => (dto.description = DocumentDescription.Evidence),
      )}
      onChange={handleOnChange}
      onDelete={handleOnDelete}
      {...props}
    />
  );
};

export const ClaimDetailDocumentsRoute = defineRoute({
  routeName: "claimDetailDocuments",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/costs/:costCategoryId/documents",
  container: ClaimDetailDocumentsContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    costCategoryId: route.params.costCategoryId,
    periodId: parseInt(route.params.periodId, 10)
  }),
  accessControl: (auth, { projectId, partnerId }) => auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ params, stores }) => {
    const costCatName = stores.costCategories.get(params.costCategoryId).then(x => x.name).data;
    return {
      htmlTitle: costCatName ? `Add documents for ${costCatName}` : "Add documents",
      displayTitle: costCatName ? `${costCatName} documents` : "Claim documents"
    };
  },
});
