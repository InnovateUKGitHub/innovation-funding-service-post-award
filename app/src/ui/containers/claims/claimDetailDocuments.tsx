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

interface Params {
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
}

interface CombinedData {
  project: ProjectDto;
  costCategories: CostCategoryDto[];
  documents: DocumentSummaryDto[];
  editor: IEditorStore<DocumentUploadDto, DocumentUploadValidator>;
}

interface Callbacks {
  validate: (key: ClaimDetailKey, dto: DocumentUploadDto) => void;
  uploadFile: (key: ClaimDetailKey, dto: DocumentUploadDto) => void;
  deleteFile: (key: ClaimDetailKey, dto: DocumentSummaryDto) => void;
}

export class ClaimDetailDocumentsComponent extends ContainerBase<Params, Data, Callbacks> {

  public render() {
    const combined = Pending.combine(
      this.props.project,
      this.props.costCategories,
      this.props.documents,
      this.props.editor,
      (project, costCategories, documents, editor) => ({ project, costCategories, documents, editor })
    );
    const Loader = ACC.TypedLoader<CombinedData>();
    return <Loader pending={combined} render={(data) => this.renderContents(data)} />;
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

  private renderContents({project, costCategories, documents, editor}: CombinedData) {
    const back = EditClaimLineItemsRoute.getLink({ projectId: project.id, partnerId: this.props.partnerId, periodId: this.props.periodId, costCategoryId: this.props.costCategoryId });
    const costCategory = costCategories.find(x => x.id === this.props.costCategoryId)! || {};

    const UploadForm = ACC.TypedForm<{file: File | null }>();

    const validationMessage = editor && <ACC.ValidationSummary validation={editor.validator} compressed={false} />;

    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={back}>Back</ACC.BackLink>
        </ACC.Section>
        {validationMessage}
        <ACC.Section>
          <ACC.Projects.Title pageTitle={`Claim for ${costCategory.name}`} project={project} />
        </ACC.Section>
        <ACC.Section title="Supporting documents" subtitle={documents.length > 0 ? "(Documents open in a new window)" : ""}>
          {documents.length > 0 ?
            <ACC.DocumentListWithDelete onRemove={(document) => this.onDelete(document)} documents={documents} qa="supporting-documents"/> :
            <p className="govuk-body-m govuk-!-margin-bottom-0 govuk-!-margin-right-2">No documents attached</p> }
        </ACC.Section>
        <ACC.Section>
          <UploadForm.Form data={editor.data} onSubmit={() => this.onSave(editor.data)} onChange={(dto) => this.onChange(dto)}>
            <UploadForm.Fieldset heading="Upload documents">
              <UploadForm.FileUpload validation={editor.validator.file} value={(data) => data.file} hint="Make sure each file name includes the date and a description" name="Upload documents" update={(dto, file) => dto.file = file}/>
            </UploadForm.Fieldset>
            <UploadForm.Submit>Upload documents</UploadForm.Submit>
          </UploadForm.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(ClaimDetailDocumentsComponent);

export const ClaimDetailDocuments = definition.connect({
  withData: (state, props) => {
    return {
      project: Selectors.getProject(props.projectId).getPending(state),
      costCategories: Selectors.getCostCategories().getPending(state),
      documents: Selectors.getClaimDetailDocuments(props.partnerId, props.periodId, props.costCategoryId).getPending(state),
      editor: Selectors.getClaimDetailDocumentEditor({partnerId: props.partnerId, periodId: props.periodId, costCategoryId: props.costCategoryId}).get(state),
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
