import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as ACC from "@ui/components";
import { Pending } from "@shared/pending";
import * as Actions from "@ui/redux/actions";
import * as Selectors from "@ui/redux/selectors";
import { ProjectDto, ProjectRole } from "@framework/types";
import { getFileSize } from "@framework/util";
import { IEditorStore } from "@ui/redux/reducers";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators/documentUploadValidator";
import { Results } from "@ui/validation/results";

export interface ClaimDetailDocumentsPageParams {
  projectId: string;
  partnerId: string;
  costCategoryId: string;
  periodId: number;
}

interface Data {
  project: Pending<ProjectDto>;
  maxFileSize: number;
  costCategories: Pending<CostCategoryDto[]>;
  documents: Pending<DocumentSummaryDto[]>;
  editor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>>;
  deleteEditor: Pending<IEditorStore<DocumentSummaryDto[], Results<DocumentSummaryDto[]>>>;
}

interface CombinedData {
  project: ProjectDto;
  costCategories: CostCategoryDto[];
  documents: DocumentSummaryDto[];
  editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>;
  deleteEditor: IEditorStore<DocumentSummaryDto[], Results<DocumentSummaryDto[]>>;
}

interface Callbacks {
  validate: (key: ClaimDetailKey, dto: MultipleDocumentUploadDto) => void;
  uploadFile: (key: ClaimDetailKey, dto: MultipleDocumentUploadDto) => void;
  deleteFile: (key: ClaimDetailKey, dto: DocumentSummaryDto) => void;
  clearMessage: () => void;
}

export class ClaimDetailDocumentsComponent extends ContainerBase<ClaimDetailDocumentsPageParams, Data, Callbacks> {

  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      costCategories: this.props.costCategories,
      documents: this.props.documents,
      editor: this.props.editor,
      deleteEditor: this.props.deleteEditor
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private onChange(dto: MultipleDocumentUploadDto) {
    const key = {
      projectId: this.props.projectId,
      partnerId: this.props.partnerId,
      periodId: this.props.periodId,
      costCategoryId: this.props.costCategoryId
    };
    this.props.clearMessage();
    this.props.validate(key, dto);
  }

  private onSave(dto: MultipleDocumentUploadDto) {
    const claimDetailKey = {
      projectId: this.props.projectId,
      partnerId: this.props.partnerId,
      periodId: this.props.periodId,
      costCategoryId: this.props.costCategoryId,
    };
    this.props.uploadFile(claimDetailKey, dto);
  }

  private onDelete(dto: DocumentSummaryDto) {
    const claimDetailKey = {
      projectId: this.props.projectId,
      partnerId: this.props.partnerId,
      periodId: this.props.periodId,
      costCategoryId: this.props.costCategoryId,
    };
    this.props.deleteFile(claimDetailKey, dto);
  }

  private renderSection(documents: DocumentSummaryDto[]) {
    return documents.length > 0 ? (
      <ACC.Section subtitle="All documents open in a new window.">
        <ACC.DocumentListWithDelete onRemove={(document) => this.onDelete(document)} documents={documents} qa="supporting-documents"/>
      </ACC.Section>
    ) : (
      <ACC.Section>
        <ACC.ValidationMessage message="No documents uploaded." messageType="info" />
      </ACC.Section>
    );
  }

  private renderContents({project, costCategories, documents, editor, deleteEditor}: CombinedData) {
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
        error={(editor.error) || (deleteEditor.error)}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title project={project} />}
      >
        <ACC.Renderers.Messages messages={this.props.messages}/>
        {this.renderSection(documents)}
        <ACC.Section>
          <UploadForm.Form
            enctype="multipart"
            editor={editor}
            onSubmit={() => this.onSave(editor.data)}
            onChange={(dto) => this.onChange(dto)}
            qa="claimDetailDocuments"
          >
            <UploadForm.Fieldset heading="Upload">
              <ACC.Info summary="What should I include?">
                <p>You should upload documents that show evidence of the costs you are submitting for this cost category. It is likely that without any documents, your monitoring officer will not accept your claim.</p>
                <p>There is no restriction on the type of file you can upload.</p>
                <p>Each document must be:</p>
                <ul>
                  <li>less than {getFileSize(this.props.maxFileSize)} in file size</li>
                  <li>given a unique file name that describes its contents</li>
                </ul>
              </ACC.Info>
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

const definition = ReduxContainer.for<ClaimDetailDocumentsPageParams, Data, Callbacks>(ClaimDetailDocumentsComponent);

export const ClaimDetailDocuments = definition.connect({
  withData: (state, props) => {
    return {
      project: Selectors.getActiveProject(props.projectId, state),
      maxFileSize: Selectors.getMaxFileSize(state),
      costCategories: Selectors.getCostCategories().getPending(state),
      documents: Selectors.getClaimDetailDocuments(props.partnerId, props.periodId, props.costCategoryId).getPending(state),
      editor: Selectors.getClaimDetailDocumentEditor({projectId: props.projectId, partnerId: props.partnerId, periodId: props.periodId, costCategoryId: props.costCategoryId}, state.config).get(state),
      deleteEditor: Selectors.getClaimDetailDocumentDeleteEditor(state, {projectId: props.projectId, partnerId: props.partnerId, periodId: props.periodId, costCategoryId: props.costCategoryId}).get(state),
    };
  },
  withCallbacks: (dispatch) => ({
    clearMessage: () => dispatch(Actions.removeMessages()),
    validate: (claimDetailKey, dto) =>
      dispatch(Actions.updateClaimDetailDocumentEditor(claimDetailKey, dto)),
    deleteFile: (claimDetailKey, dto) =>
      dispatch(Actions.deleteClaimDetailDocument(claimDetailKey, dto, () =>
        dispatch(Actions.loadClaimDetailDocuments(claimDetailKey)))),
    uploadFile: (claimDetailKey, dto) => {
      const successMessage = dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.`;
      dispatch(Actions.uploadClaimDetailDocument(claimDetailKey, dto,
        () => dispatch(Actions.loadClaimDetailDocuments(claimDetailKey)),
        successMessage));
      }
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
    Actions.loadClaimDetailDocuments({projectId: params.projectId, partnerId: params.partnerId, periodId: params.periodId, costCategoryId: params.costCategoryId})
  ],
  accessControl: (auth, {projectId, partnerId}) => auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: (store, params) => {
    const costCatName = Selectors.getCostCatetory(params.costCategoryId).getPending(store).then(x => x && x.name).data;
    return {
      htmlTitle: costCatName ? `Add documents for ${costCatName}` : "Add documents",
      displayTitle: costCatName ? `${costCatName} documents` : "Claim documents"
    };
  },
  container: ClaimDetailDocuments
});
