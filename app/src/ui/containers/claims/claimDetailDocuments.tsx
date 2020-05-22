import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as ACC from "@ui/components";
import { Pending } from "@shared/pending";
import { ClaimDto, DocumentDescription, ProjectDto, ProjectRole } from "@framework/types";
import { IEditorStore } from "@ui/redux/reducers";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators/documentUploadValidator";
import { StoresConsumer } from "@ui/redux";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";

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
  draftClaim: Pending<ClaimDto | null>;
}

interface CombinedData {
  project: ProjectDto;
  costCategories: CostCategoryDto[];
  documents: DocumentSummaryDto[];
  editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>;
  draftClaim: ClaimDto | null;
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
      draftClaim: this.props.draftClaim,
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private renderDocuments(editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, documents: DocumentSummaryDto[]) {
    if (!documents.length) {
      return (
        <ACC.Section>
          <ACC.ValidationMessage message="No documents uploaded." messageType="info" />
        </ACC.Section>
      );
    }

    return (
      <ACC.Section subtitle="All documents open in a new window">
        <ACC.DocumentTable onRemove={(document) => this.props.onDelete(editor.data, document)} documents={documents} qa="supporting-documents"/>
      </ACC.Section>
    );
  }

  private renderContents({ project, costCategories, documents, editor, draftClaim }: CombinedData) {
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
        {this.renderInterimClaimDisclaimer(project, draftClaim)}
        <ACC.Renderers.SimpleString qa="guidanceText">Evidence for each expenditure might include, but is not limited to, invoices, timesheets, receipts and spreadsheets for capital usage.</ACC.Renderers.SimpleString>
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
              <UploadForm.Hidden name="description" value={dto => dto.description}/>
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

  private renderInterimClaimDisclaimer(project: ProjectDto, draftClaim: ClaimDto | null) {
    if (!draftClaim || draftClaim.periodId !== project.periodId) return null;
    return <ACC.ValidationMessage messageType="alert" qa="interim-document-detail-warning-FC" message="Do not remove any documents for previous months' costs." />;
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
          editor={stores.claimDetailDocuments.getClaimDetailDocumentsEditor(props.projectId, props.partnerId, props.periodId, props.costCategoryId, (dto) => dto.description = DocumentDescription.Evidence)}
          onChange={(saving, dto) => {
            stores.messages.clearMessages();
            const successMessage = dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.`;
            stores.claimDetailDocuments.updateClaimDetailDocumentsEditor(saving, props.projectId, props.partnerId, props.periodId, props.costCategoryId, dto, successMessage);
          }}
          onDelete={(dto, document) => {
            stores.messages.clearMessages();
            stores.claimDetailDocuments.deleteClaimDetailDocumentsEditor(props.projectId, props.partnerId, props.periodId, props.costCategoryId, dto, document);
          }}
          // TODO Used for interim solution to claim monthly. Can be removed once full solution is in place.
          draftClaim={stores.claims.getDraftClaimForPartner(props.partnerId)}
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
  getTitle: ({ params, stores }) => {
    const costCatName = stores.costCategories.get(params.costCategoryId).then(x => x.name).data;
    return {
      htmlTitle: costCatName ? `Add documents for ${costCatName}` : "Add documents",
      displayTitle: costCatName ? `${costCatName} documents` : "Claim documents"
    };
  },
});
