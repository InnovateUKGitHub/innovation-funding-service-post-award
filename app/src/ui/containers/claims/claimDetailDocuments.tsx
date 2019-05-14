import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as ACC from "../../components";
import { Pending } from "../../../shared/pending";
import { EditClaimLineItemsRoute } from "./index";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { ProjectDto, ProjectRole } from "@framework/types";
import { IEditorStore } from "../../redux/reducers";
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
    const combined = Pending.combine({
      project: this.props.project,
      costCategories: this.props.costCategories,
      documents: this.props.documents,
      editor: this.props.editor,
      deleteEditor: this.props.deleteEditor
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private onChange(dto: DocumentUploadDto) {
    const key = {
      projectId: this.props.projectId,
      partnerId: this.props.partnerId,
      periodId: this.props.periodId,
      costCategoryId: this.props.costCategoryId
    };
    this.props.validate(key, dto);
  }

  private onSave(dto: DocumentUploadDto) {
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
        <p className="govuk-body-m govuk-!-margin-bottom-0 govuk-!-margin-right-2">No documents uploaded.</p>
      </ACC.Section>
    );
  }

  private renderContents({project, costCategories, documents, editor, deleteEditor}: CombinedData) {
    const back = EditClaimLineItemsRoute.getLink({
      projectId: project.id,
      partnerId: this.props.partnerId,
      periodId: this.props.periodId,
      costCategoryId: this.props.costCategoryId
    });
    const costCategory = costCategories.find(x => x.id === this.props.costCategoryId)! || {};
    const UploadForm = ACC.TypedForm<{file: File | null }>();

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={back}>{`Back to ${costCategory.name.toLowerCase()}`}</ACC.BackLink>}
        error={(editor.error) || (deleteEditor.error)}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title project={project} />}
      >
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
              <UploadForm.FileUpload
                label="Upload documents"
                labelHidden={true}
                name="attachment"
                validation={editor.validator.file}
                value={(data) => data.file}
                update={(dto, file) => dto.file = file}
                hint={<span>Give your files a name that describes their contents and includes today's date.<br/>For example, 'LabourCosts_2017-11-15'.</span>}
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
      project: Selectors.getProject(props.projectId).getPending(state),
      costCategories: Selectors.getCostCategories().getPending(state),
      documents: Selectors.getClaimDetailDocuments(props.partnerId, props.periodId, props.costCategoryId).getPending(state),
      editor: Selectors.getClaimDetailDocumentEditor({projectId: props.projectId, partnerId: props.partnerId, periodId: props.periodId, costCategoryId: props.costCategoryId}).get(state),
      deleteEditor: Selectors.getClaimDetailDocumentDeleteEditor(state, {projectId: props.projectId, partnerId: props.partnerId, periodId: props.periodId, costCategoryId: props.costCategoryId}).get(state),
    };
  },
  withCallbacks: (dispatch) => ({
    validate: (claimDetailKey, dto) =>
      dispatch(Actions.updateClaimDetailDocumentEditor(claimDetailKey, dto)),
    deleteFile: (claimDetailKey, dto) =>
      dispatch(Actions.deleteClaimDetailDocument(claimDetailKey, dto, () =>
        dispatch(Actions.loadClaimDetailDocuments(claimDetailKey.projectId, claimDetailKey.partnerId, claimDetailKey.periodId, claimDetailKey.costCategoryId)))),
    uploadFile: (claimDetailKey, file) =>
      dispatch(Actions.uploadClaimDetailDocument(claimDetailKey, file, () =>
        dispatch(Actions.loadClaimDetailDocuments(claimDetailKey.projectId, claimDetailKey.partnerId, claimDetailKey.periodId, claimDetailKey.costCategoryId))))
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
    Actions.loadClaimDetailDocuments(params.projectId, params.partnerId, params.periodId, params.costCategoryId)
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
