import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { Pending } from "@shared/pending";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { ProjectRole } from "@framework/constants/project";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { ProjectDto } from "@framework/dtos/projectDto";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentGuidance } from "@ui/components/atomicDesign/organisms/documents/DocumentGuidance/DocumentGuidance";
import { DocumentEdit } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink, Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { LinksList } from "@ui/components/atomicDesign/atoms/LinksList/linksList";
import { PageLoader } from "@ui/components/bjss/loading";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";

export interface OverheadDocumentsPageParams {
  projectId: ProjectId;
  pcrId: PcrId;
  itemId: PcrItemId;
  costCategoryId: string;
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

const UploadForm = createTypedForm<MultipleDocumentUploadDto>();

export class OverheadDocumentsComponent extends ContainerBase<OverheadDocumentsPageParams, Data, Callbacks> {
  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      pcrItem: this.props.pcrItem,
      costCategories: this.props.costCategories,
      documents: this.props.documents,
      editor: this.props.editor,
    });

    return <PageLoader pending={combined} render={data => this.renderContents(data)} />;
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
      <Page
        backLink={
          <BackLink route={back}>
            <Content
              value={x => x.pages.pcrSpendProfilePrepareCost.backLink({ costCategoryName: costCategory.name })}
            />
          </BackLink>
        }
        error={editor.error}
        validator={editor.validator}
        pageTitle={<Title {...project} />}
      >
        <Messages messages={this.props.messages} />

        {this.renderForm(editor)}

        <Section>
          <DocumentEdit
            qa="overhead-calculation-document"
            onRemove={document => this.props.onFileDelete(editor.data, document)}
            documents={documents}
          />
        </Section>
        <Link styling="PrimaryButton" route={back}>
          <Content value={x => x.pages.pcrSpendProfileOverheadDocuments.buttonSubmit} />
        </Link>
      </Page>
    );
  }

  private renderForm(
    documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>,
  ): React.ReactNode {
    return (
      <>
        <Section title={x => x.pages.pcrSpendProfileOverheadDocuments.guidanceHeading}>
          <Content markdown value={x => x.pages.pcrSpendProfileOverheadDocuments.guidanceDocumentUpload} />
        </Section>

        <Section>
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
              <DocumentGuidance />
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
                <Content value={x => x.documentMessages.uploadTitle} />
              </UploadForm.Button>
            </UploadForm.Fieldset>
          </UploadForm.Form>
        </Section>
      </>
    );
  }

  private renderTemplateLink() {
    const links = [{ text: "Overhead calculation spreadsheet", url: "/ifspa-assets/pcr_templates/overheads.ods" }];
    return (
      <Section>
        <LinksList data-qa="template-link" links={links} />
      </Section>
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
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
    costCategoryId: route.params.costCategoryId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrSpendProfileOverheadDocuments.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});
