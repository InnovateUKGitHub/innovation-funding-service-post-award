import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as ACC from "../../components";
import { Pending } from "../../../shared/pending";
import { EditClaimLineItemsRoute } from "./index";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { ProjectDto } from "../../../types";
import {IEditorStore} from "../../redux/reducers";
import { DocumentUploadValidator } from "../../validators/documentUploadValidator";
import { Results } from "../../validation/results";

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
  editor: Pending<IEditorStore<DocumentUploadDto, DocumentUploadValidator>>;
  deleteEditor: Pending<IEditorStore<DocumentSummaryDto[], Results<DocumentSummaryDto[]>>>;
}

interface CombinedData {
  project: ProjectDto;
  costCategories: CostCategoryDto[];
  documents: DocumentSummaryDto[];
  editor: IEditorStore<DocumentUploadDto, DocumentUploadValidator>;
  deleteEditor: IEditorStore<DocumentSummaryDto[], Results<DocumentSummaryDto[]>>;
}

interface Callbacks {
  validate: (key: ClaimDetailKey, dto: DocumentUploadDto) => void;
  uploadFile: (key: ClaimDetailKey, dto: DocumentUploadDto) => void;
  deleteFile: (key: ClaimDetailKey, dto: DocumentSummaryDto) => void;
}

export class ClaimDetailDocumentsComponent extends ContainerBase<ClaimDetailDocumentsPageParams, Data, Callbacks> {

  public render() {
    const combined = Pending.combine(
      this.props.project,
      this.props.costCategories,
      this.props.documents,
      this.props.editor,
      this.props.deleteEditor,
      (project, costCategories, documents, editor, deleteEditor) => ({ project, costCategories, documents, editor, deleteEditor })
    );
    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private onChange(dto: DocumentUploadDto) {
    const key = {partnerId: this.props.partnerId, periodId: this.props.periodId, costCategoryId: this.props.costCategoryId};
    this.props.validate(key, dto);
  }

  private onSave(dto: DocumentUploadDto) {
    const claimDetailKey = {
      partnerId: this.props.partnerId,
      periodId: this.props.periodId,
      costCategoryId: this.props.costCategoryId,
    };
    this.props.uploadFile(claimDetailKey, dto);
  }

  private onDelete(dto: DocumentSummaryDto) {
    const claimDetailKey = {
      partnerId: this.props.partnerId,
      periodId: this.props.periodId,
      costCategoryId: this.props.costCategoryId,
    };
    this.props.deleteFile(claimDetailKey, dto);
  }

  private renderContents({project, costCategories, documents, editor, deleteEditor}: CombinedData) {
    const back = EditClaimLineItemsRoute.getLink({ projectId: project.id, partnerId: this.props.partnerId, periodId: this.props.periodId, costCategoryId: this.props.costCategoryId });
    const costCategory = costCategories.find(x => x.id === this.props.costCategoryId)! || {};

    const UploadForm = ACC.TypedForm<{file: File | null }>();

    const validationMessage = editor && <ACC.ValidationSummary validation={editor.validator} compressed={false} />;

    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={back}>Back</ACC.BackLink>
        </ACC.Section>
        <ACC.ErrorSummary error={(editor && editor.error) || (deleteEditor && deleteEditor.error)} />
        {validationMessage}
        <ACC.Projects.Title pageTitle={`${costCategory.name}`} project={project} />
        <ACC.Section title={`${costCategory.name} documents`} subtitle={documents.length > 0 ? "All documents open in a new window." : ""}>
          {documents.length > 0 ?
            <ACC.DocumentListWithDelete onRemove={(document) => this.onDelete(document)} documents={documents} qa="supporting-documents"/> :
            <p className="govuk-body-m govuk-!-margin-bottom-0 govuk-!-margin-right-2">No documents uploaded.</p> }
        </ACC.Section>
        <ACC.Section>
          <UploadForm.Form enctype="multipart/form-data" qa="claimDetailDocuments" data={editor.data} onSubmit={() => this.onSave(editor.data)} onChange={(dto) => this.onChange(dto)}>
            <UploadForm.Fieldset heading="Upload">
              <UploadForm.FileUpload label="Upload documents" labelHidden={true} name="attachment" validation={editor.validator.file} value={(data) => data.file} hint={<span>Give your files a name that describes their contents and includes today's date.<br/>For example, 'LabourCosts_2017-11-15'.</span>} update={(dto, file) => dto.file = file}/>
            </UploadForm.Fieldset>
            <UploadForm.Submit>Upload documents</UploadForm.Submit>
          </UploadForm.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const definition = ReduxContainer.for<ClaimDetailDocumentsPageParams, Data, Callbacks>(ClaimDetailDocumentsComponent);

export const ClaimDetailDocuments = definition.connect({
  withData: (state, props) => {
    return {
      project: Selectors.getProject(props.projectId).getPending(state),
      costCategories: Selectors.getCostCategories().getPending(state),
      documents: Selectors.getClaimDetailDocuments(props.partnerId, props.periodId, props.costCategoryId).getPending(state),
      editor: Selectors.getClaimDetailDocumentEditor({partnerId: props.partnerId, periodId: props.periodId, costCategoryId: props.costCategoryId}).get(state),
      deleteEditor: Selectors.getClaimDetailDocumentDeleteEditor(state, {partnerId: props.partnerId, periodId: props.periodId, costCategoryId: props.costCategoryId}).get(state),
    };
  },
  withCallbacks: (dispatch) => ({
    validate: (claimDetailKey, dto) =>
      dispatch(Actions.updateClaimDetailDocumentEditor(claimDetailKey, dto)),
    deleteFile: (claimDetailKey, dto) =>
      dispatch(Actions.deleteClaimDetailDocument(claimDetailKey, dto, () =>
        dispatch(Actions.loadClaimDetailDocuments(claimDetailKey.partnerId, claimDetailKey.periodId, claimDetailKey.costCategoryId)))),
    uploadFile: (claimDetailKey, file) =>
      dispatch(Actions.uploadClaimDetailDocument(claimDetailKey, file, () =>
        dispatch(Actions.loadClaimDetailDocuments(claimDetailKey.partnerId, claimDetailKey.periodId, claimDetailKey.costCategoryId))))
  })
});

export const ClaimDetailDocumentsRoute = definition.route({
  routeName: "claimDetailDocuments",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/costs/:costCategoryId/documents",
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    costCategoryId: route.params.costCategoryId,
    periodId: parseInt(route.params.periodId, 10)
  }),
  getLoadDataActions: (params) => [
    Actions.loadCostCategories(),
    Actions.loadProject(params.projectId),
    Actions.loadClaimDetailDocuments(params.partnerId, params.periodId, params.costCategoryId)
  ],
  container: ClaimDetailDocuments
});
