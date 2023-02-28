import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentDescription, ProjectDto, ProjectRole } from "@framework/types";
import { Pending } from "@shared/pending";
import { BackLink, Page, PageLoader, Projects, Section } from "@ui/components";
import { createTypedForm } from "@ui/components/form";
import { Content } from "@ui/components/content";
import { DocumentEdit, DocumentGuidance } from "@ui/components/documents";
import { Messages, SimpleString } from "@ui/components/renderers";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { useContent } from "@ui/hooks";
import { useStores } from "@ui/redux";
import { IEditorStore } from "@ui/redux/reducers";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";

export interface ClaimDetailDocumentsPageParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  costCategoryId: string;
  periodId: number;
}

interface Data {
  project: Pending<ProjectDto>;
  costCategories: Pending<CostCategoryDto[]>;
  documents: Pending<DocumentSummaryDto[]>;
  editor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>>;
}

interface CombinedData {
  project: ProjectDto;
  costCategories: CostCategoryDto[];
  documents: DocumentSummaryDto[];
  editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
}

interface Callbacks {
  onChange: (saving: boolean, dto: MultipleDocumentUploadDto) => void;
  onDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

const UploadForm = createTypedForm<MultipleDocumentUploadDto>();

export class ClaimDetailDocumentsComponent extends ContainerBase<ClaimDetailDocumentsPageParams, Data, Callbacks> {
  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      costCategories: this.props.costCategories,
      documents: this.props.documents,
      editor: this.props.editor,
    });

    return <PageLoader pending={combined} render={data => this.renderContents(data)} />;
  }

  private renderContents({ project, costCategories, documents, editor }: CombinedData) {
    const back = this.props.routes.prepareClaimLineItems.getLink({
      projectId: project.id,
      partnerId: this.props.partnerId,
      periodId: this.props.periodId,
      costCategoryId: this.props.costCategoryId,
    });
    const costCategory = costCategories.find(x => x.id === this.props.costCategoryId) || ({} as CostCategoryDto);
    const { isCombinationOfSBRI } = checkProjectCompetition(project.competitionType);

    return (
      <Page
        backLink={
          <BackLink route={back}>
            <Content value={x => x.documentMessages.backLink({ previousPage: costCategory.name })} />
          </BackLink>
        }
        error={editor.error}
        validator={editor.validator}
        pageTitle={<Projects.Title {...project} />}
      >
        {isCombinationOfSBRI ? (
          <>
            <SimpleString qa="sbriDocumentGuidance">
              <Content
                value={x => x.claimsMessages.sbriDocumentDetailGuidance({ costCategoryName: costCategory.name })}
              />
            </SimpleString>
            <SimpleString qa="sbriSupportingDocumentGuidance">
              <Content value={x => x.claimsMessages.sbriSupportingDocumentGuidance} />
            </SimpleString>
          </>
        ) : (
          <SimpleString qa="guidanceText">
            <Content value={x => x.claimsMessages.documentDetailGuidance} />
          </SimpleString>
        )}

        <Messages messages={this.props.messages} />

        <Section title={x => x.documentMessages.uploadTitle}>
          <UploadForm.Form
            enctype="multipart"
            editor={editor}
            onSubmit={() => this.props.onChange(true, editor.data)}
            onChange={dto => this.props.onChange(false, dto)}
            qa="claimDetailDocuments"
          >
            <UploadForm.Fieldset>
              <DocumentGuidance />

              <UploadForm.Hidden name="description" value={dto => dto.description} />

              <UploadForm.MultipleFileUpload
                label={x => x.documentMessages.uploadDocuments}
                labelHidden
                name="attachment"
                validation={editor.validator.files}
                value={data => data.files}
                update={(dto, files) => (dto.files = files || [])}
              />
            </UploadForm.Fieldset>

            <UploadForm.Submit>
              <Content value={x => x.documentMessages.uploadDocuments} />
            </UploadForm.Submit>
          </UploadForm.Form>
        </Section>

        <Section className="govuk-!-margin-bottom-4">
          <DocumentEdit
            qa="supporting-documents"
            onRemove={document => this.props.onDelete(editor.data, document)}
            documents={documents}
          />
        </Section>
      </Page>
    );
  }
}

const ClaimDetailDocumentsContainer = (props: ClaimDetailDocumentsPageParams & BaseProps) => {
  const stores = useStores();
  const { getContent } = useContent();

  const handleOnChange: Callbacks["onChange"] = (saving, dto) => {
    stores.messages.clearMessages();
    const successMessage = getContent(x => x.documentMessages.uploadedDocuments({ count: dto.files.length }));

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
      getContent(x => x.documentMessages.deletedDocument({ deletedFileName: document.fileName })),
    );
  };

  return (
    <ClaimDetailDocumentsComponent
      project={stores.projects.getById(props.projectId)}
      costCategories={stores.costCategories.getAllFiltered(props.partnerId)}
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
        dto => (dto.description = DocumentDescription.Evidence),
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
  getParams: route => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    costCategoryId: route.params.costCategoryId,
    periodId: parseInt(route.params.periodId, 10),
  }),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ params, stores }) => {
    const costCatName = stores.costCategories.get(params.costCategoryId).then(x => x.name).data;
    return {
      htmlTitle: costCatName ? `Add documents for ${costCatName}` : "Add documents",
      displayTitle: costCatName ? `${costCatName} documents` : "Claim documents",
    };
  },
});
