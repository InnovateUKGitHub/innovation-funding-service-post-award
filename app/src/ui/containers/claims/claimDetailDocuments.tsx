import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as ACC from "@ui/components";
import { Pending } from "@shared/pending";
import { ProjectDto, ProjectRole } from "@framework/types";
import { getFileSize } from "@framework/util";
import { IEditorStore } from "@ui/redux/reducers";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators/documentUploadValidator";
import { StoresConsumer } from "@ui/redux";

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
  onChange: (saveing: boolean, dto: MultipleDocumentUploadDto) => void;
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

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private renderDocuments(editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, documents: DocumentSummaryDto[]) {
    return documents.length > 0 ? (
      <ACC.Section subtitle="All documents open in a new window.">
        <ACC.DocumentListWithDelete onRemove={(document) => this.props.onDelete(editor.data, document)} documents={documents} qa="supporting-documents" />
      </ACC.Section>
    ) : (
        <ACC.Section>
          <ACC.ValidationMessage message="No documents uploaded." messageType="info" />
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
        backLink={<ACC.BackLink route={back}>{`Back to ${costCategory.name.toLowerCase()}`}</ACC.BackLink>}
        error={(editor.error)}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title project={project} />}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />
        {this.renderDocuments(editor, documents)}
        <ACC.Section title="Upload">
          <UploadForm.Form
            enctype="multipart"
            editor={editor}
            onSubmit={() => this.props.onChange(true, editor.data)}
            onChange={(dto) => this.props.onChange(false, dto)}
            qa="claimDetailDocuments"
          >
            <UploadForm.Fieldset>
              <ACC.DocumentGuidance/>
              <UploadForm.MulipleFileUpload
                label="Upload documents"
                labelHidden={true}
                name="attachment"
                validation={editor.validator.files}
                value={(data) => data.files}
                update={(dto, files) => dto.files = files || []}
              />
            </UploadForm.Fieldset>
            <UploadForm.Submit>Upload documents</UploadForm.Submit>
          </UploadForm.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const ClaimDetailDocumentsContainer = (props: ClaimDetailDocumentsPageParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <ClaimDetailDocumentsComponent
          project={stores.projects.getById(props.projectId)}
          costCategories={stores.costCategories.getAll()}
          documents={stores.claimDetailDocuments.getClaimDetailDocuments(props.projectId, props.partnerId, props.periodId, props.costCategoryId)}
          editor={stores.claimDetailDocuments.getClaimDetailDocumentsEditor(props.projectId, props.partnerId, props.periodId, props.costCategoryId)}
          onChange={(saving, dto) => {
            stores.messages.clearMessages();
            const successMessage = dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.`;
            stores.claimDetailDocuments.updateClaimDetailDocumentsEditor(saving, props.projectId, props.partnerId, props.periodId, props.costCategoryId, dto, successMessage);
          }}
          onDelete={(dto, document) => {
            stores.messages.clearMessages();
            stores.claimDetailDocuments.deleteClaimDetailDocumentsEditor(props.projectId, props.partnerId, props.periodId, props.costCategoryId, dto, document);
          }}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

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
  getTitle: (store, params, stores) => {
    const costCatName = stores.costCategories.get(params.costCategoryId).then(x => x.name).data;
    return {
      htmlTitle: costCatName ? `Add documents for ${costCatName}` : "Add documents",
      displayTitle: costCatName ? `${costCatName} documents` : "Claim documents"
    };
  },
});
