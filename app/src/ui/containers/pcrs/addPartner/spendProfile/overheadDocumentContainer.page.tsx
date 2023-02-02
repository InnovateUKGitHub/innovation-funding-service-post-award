import * as ACC from "@ui/components";
import { IEditorStore, useStores } from "@ui/redux";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators";
import { PCRItemForPartnerAdditionDto, ProjectDto } from "@framework/dtos";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { DocumentDescription, ProjectRole } from "@framework/constants";
import { Pending } from "@shared/pending";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";

export interface OverheadDocumentsPageParams {
  projectId: ProjectId;
  pcrId: string;
  costCategoryId: string;
  itemId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcrItem: Pending<PCRItemForPartnerAdditionDto>;
  costCategories: Pending<CostCategoryDto[]>;
  documents: Pending<DocumentSummaryDto[]>;
  editor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>>;
}

interface CombinedData {
  project: ProjectDto;
  pcrItem: PCRItemForPartnerAdditionDto;
  costCategories: CostCategoryDto[];
  documents: DocumentSummaryDto[];
  editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
}

interface Callbacks {
  onFileChange: (isSaving: boolean, dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

const UploadForm = ACC.createTypedForm<MultipleDocumentUploadDto>();

export class OverheadDocumentsComponent extends ContainerBase<OverheadDocumentsPageParams, Data, Callbacks> {
  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      pcrItem: this.props.pcrItem,
      costCategories: this.props.costCategories,
      documents: this.props.documents,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={data => this.renderContents(data)} />;
  }

  private renderContents({ project, costCategories, documents, editor, pcrItem }: CombinedData) {
    const cost = pcrItem.spendProfile.costs.find(x => x.costCategoryId === this.props.costCategoryId);
    if (!cost) throw new Error(`Cannot find cost matching ${this.props.costCategoryId}`);
    const back = this.props.routes.pcrPrepareSpendProfileEditCost.getLink({
      projectId: project.id,
      pcrId: this.props.pcrId,
      itemId: this.props.itemId,
      costCategoryId: this.props.costCategoryId,
      costId: cost.id,
    });
    const costCategory = costCategories.find(x => x.id === this.props.costCategoryId) || ({} as CostCategoryDto);

    return (
      <ACC.Page
        backLink={
          <ACC.BackLink route={back}>
            <ACC.Content
              value={x => x.pages.pcrSpendProfilePrepareCost.backLink({ costCategoryName: costCategory.name })}
            />
          </ACC.BackLink>
        }
        error={editor.error}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title {...project} />}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />

        {this.renderForm(editor)}

        <ACC.Section>
          <ACC.DocumentEdit
            qa="overhead-calculation-document"
            onRemove={document => this.props.onFileDelete(editor.data, document)}
            documents={documents}
          />
        </ACC.Section>
        <ACC.Link styling="PrimaryButton" route={back}>
          <ACC.Content value={x => x.pages.pcrSpendProfileOverheadDocuments.buttonSubmit} />
        </ACC.Link>
      </ACC.Page>
    );
  }

  private renderForm(
    documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>,
  ): React.ReactNode {
    return (
      <>
        <ACC.Section title={x => x.pages.pcrSpendProfileOverheadDocuments.guidanceHeading}>
          <ACC.Content markdown value={x => x.pages.pcrSpendProfileOverheadDocuments.guidanceDocumentUpload} />
        </ACC.Section>

        <ACC.Section>
          <UploadForm.Form
            enctype="multipart"
            editor={documentsEditor}
            onChange={dto => this.props.onFileChange(false, dto)}
            qa="projectChangeRequestItemUpload"
          >
            <UploadForm.Fieldset heading={x => x.pages.pcrSpendProfileOverheadDocuments.headingTemplate} qa="template">
              {this.renderTemplateLink()}
            </UploadForm.Fieldset>

            <UploadForm.Fieldset
              qa="documentUpload"
              heading={x => x.pages.pcrSpendProfileOverheadDocuments.documentUploadHeading}
            >
              <UploadForm.Hidden name="description" value={() => DocumentDescription.OverheadCalculationSpreadsheet} />
              <ACC.DocumentGuidance />
              <UploadForm.MultipleFileUpload
                label={x => x.documentLabels.uploadInputLabel}
                name="attachment"
                labelHidden
                value={data => data.files}
                update={(dto, files) => {
                  dto.files = files || [];
                  dto.description = DocumentDescription.OverheadCalculationSpreadsheet;
                }}
                validation={documentsEditor.validator.files}
              />
            </UploadForm.Fieldset>
            <UploadForm.Fieldset>
              <UploadForm.Button
                name="uploadFile"
                styling="Secondary"
                onClick={() => this.props.onFileChange(true, documentsEditor.data)}
              >
                <ACC.Content value={x => x.documentMessages.uploadTitle} />
              </UploadForm.Button>
            </UploadForm.Fieldset>
          </UploadForm.Form>
        </ACC.Section>
      </>
    );
  }

  private renderTemplateLink() {
    const links = [{ text: "Overhead calculation spreadsheet", url: "/ifspa-assets/pcr_templates/overheads.ods" }];
    return (
      <ACC.Section>
        <ACC.LinksList data-qa="template-link" links={links} />
      </ACC.Section>
    );
  }
}

const OverheadDocumentContainer = (props: OverheadDocumentsPageParams & BaseProps) => {
  const stores = useStores();

  return (
    <OverheadDocumentsComponent
      {...props}
      project={stores.projects.getById(props.projectId)}
      costCategories={stores.costCategories.getAllUnfiltered()}
      pcrItem={
        stores.projectChangeRequests.getItemById(
          props.projectId,
          props.pcrId,
          props.itemId,
        ) as Pending<PCRItemForPartnerAdditionDto>
      }
      documents={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.projectId, props.itemId)}
      editor={stores.projectChangeRequestDocuments.getPcrOrPcrItemDocumentsEditor(props.projectId, props.itemId)}
      onFileChange={(isSaving, dto) => {
        stores.messages.clearMessages();
        // show message if remaining on page
        const successMessage = isSaving
          ? dto.files.length === 1
            ? "Your document has been uploaded."
            : `${dto.files.length} documents have been uploaded.`
          : undefined;
        stores.projectChangeRequestDocuments.updatePcrOrPcrItemDocumentsEditor(
          isSaving,
          props.projectId,
          props.itemId,
          dto,
          true,
          successMessage,
        );
      }}
      onFileDelete={(dto, document) => {
        stores.messages.clearMessages();
        stores.projectChangeRequestDocuments.deletePcrOrPcrItemDocumentsEditor(
          props.projectId,
          props.itemId,
          dto,
          document,
          "Your document has been removed.",
        );
      }}
    />
  );
};

export const PCRSpendProfileOverheadDocumentRoute = defineRoute<OverheadDocumentsPageParams>({
  routeName: "pcrSpendProfileOverheadDocument",
  // This is a generic route which could in theory be used to support documents for other spend profiles.
  // However the page itself is currently closely tied to overhead costs. This could be adapted if required.
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/spendProfile/:costCategoryId/cost/documents",
  container: OverheadDocumentContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId,
    costCategoryId: route.params.costCategoryId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrSpendProfileOverheadDocuments.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});
