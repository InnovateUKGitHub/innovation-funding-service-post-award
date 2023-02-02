import { useNavigate } from "react-router-dom";
import * as ACC from "@ui/components";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { BankDetailsTaskStatus, DocumentDescription, PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { Pending } from "@shared/pending";
import { IEditorStore, useStores } from "@ui/redux";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { useContent } from "@ui/hooks";

export interface ProjectSetupBankStatementParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

interface Data {
  project: Pending<ProjectDto>;
  editor: Pending<IEditorStore<PartnerDto, PartnerDtoValidator>>;
  documents: Pending<DocumentSummaryDto[]>;
  documentsEditor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>>;
  onFileChange: (isSaving: boolean, dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

interface Callbacks {
  onChange: (submit: boolean, dto: PartnerDto) => void;
}

const UploadForm = ACC.createTypedForm<MultipleDocumentUploadDto>();
const BankStatementForm = ACC.createTypedForm<PartnerDto>();
class ProjectSetupBankStatementComponent extends ContainerBase<ProjectSetupBankStatementParams, Data, Callbacks> {
  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      editor: this.props.editor,
      documents: this.props.documents,
      documentsEditor: this.props.documentsEditor,
    });

    return (
      <ACC.PageLoader
        pending={combined}
        render={x => this.renderContents(x.project, x.documents, x.editor, x.documentsEditor)}
      />
    );
  }

  public renderContents(
    project: ProjectDto,
    documents: DocumentSummaryDto[],
    editor: IEditorStore<PartnerDto, PartnerDtoValidator>,
    documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>,
  ) {
    const projectSetupParams = { projectId: this.props.projectId, partnerId: this.props.partnerId };
    const projectSetupRoute = this.props.routes.projectSetup.getLink(projectSetupParams);

    const backLinkElement = (
      <ACC.BackLink route={projectSetupRoute}>
        <ACC.Content value={x => x.pages.projectSetupBankStatement.backLink} />
      </ACC.BackLink>
    );
    return (
      <ACC.Page
        backLink={backLinkElement}
        error={editor.error}
        validator={[editor.validator, documentsEditor.validator]}
        pageTitle={<ACC.Projects.Title {...project} />}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />

        <ACC.Section qa="guidance">
          <ACC.Content markdown value={x => x.pages.projectSetupBankStatement.guidanceMessage} />
        </ACC.Section>

        <ACC.Section>
          <UploadForm.Form
            enctype="multipart"
            editor={documentsEditor}
            onSubmit={() => this.props.onFileChange(true, documentsEditor.data)}
            onChange={dto => this.props.onFileChange(false, dto)}
            qa="partnerDocumentUpload"
          >
            <UploadForm.Fieldset qa="documentGuidance">
              <UploadForm.Hidden name="description" value={() => DocumentDescription.BankStatement} />

              <ACC.DocumentGuidance />

              <UploadForm.MultipleFileUpload
                label={x => x.documentLabels.uploadInputLabel}
                name="attachment"
                labelHidden
                value={data => data.files}
                update={(dto, files) => {
                  dto.files = files || [];
                  dto.description = DocumentDescription.BankStatement;
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

        <ACC.Section>
          <ACC.DocumentEdit
            qa="setup-bank-statement-documents"
            onRemove={document => this.props.onFileDelete(documentsEditor.data, document)}
            documents={documents}
          />
        </ACC.Section>

        <ACC.Section qa="submit-bank-statement">
          <BankStatementForm.Form
            editor={editor}
            onChange={() => this.props.onChange(false, editor.data)}
            onSubmit={() => this.props.onChange(true, editor.data)}
            qa="submit-bank-statement-form"
          >
            <BankStatementForm.Fieldset>
              <BankStatementForm.Submit>
                <ACC.Content value={x => x.pages.projectSetupBankStatement.buttonSubmit} />
              </BankStatementForm.Submit>

              <ACC.Link
                styling="SecondaryButton"
                route={this.props.routes.projectSetup.getLink({
                  projectId: this.props.projectId,
                  partnerId: this.props.partnerId,
                })}
              >
                <ACC.Content value={x => x.pages.projectSetupBankStatement.buttonReturn} />
              </ACC.Link>
            </BankStatementForm.Fieldset>
          </BankStatementForm.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const ProjectSetupBankStatementContainer = (props: ProjectSetupBankStatementParams & BaseProps) => {
  const stores = useStores();
  const { getContent } = useContent();
  const navigate = useNavigate();

  return (
    <ProjectSetupBankStatementComponent
      {...props}
      project={stores.projects.getById(props.projectId)}
      documents={stores.partnerDocuments.getPartnerDocuments(props.projectId, props.partnerId)}
      documentsEditor={stores.partnerDocuments.getPartnerDocumentEditor(props.partnerId)}
      onFileChange={(isSaving, dto) => {
        stores.messages.clearMessages();
        // show message if remaining on page
        const successMessage = getContent(x => x.documentMessages.uploadedDocuments({ count: dto.files.length }));
        stores.partnerDocuments.updatePartnerDocumentsEditor(
          isSaving,
          props.projectId,
          props.partnerId,
          dto,
          successMessage,
        );
      }}
      onFileDelete={(dto, document) => {
        stores.messages.clearMessages();
        stores.partnerDocuments.deletePartnerDocumentsEditor(
          props.projectId,
          props.partnerId,
          dto,
          document,
          getContent(x => x.pages.projectSetupBankStatement.documentRemovedMessage),
        );
      }}
      editor={stores.partners.getPartnerEditor(props.projectId, props.partnerId, dto => {
        dto.bankDetailsTaskStatus = BankDetailsTaskStatus.Complete;
      })}
      onChange={(submit, dto) => {
        stores.partners.updatePartner(submit, props.partnerId, dto, {
          onComplete: () => {
            navigate(
              props.routes.projectSetup.getLink({ projectId: props.projectId, partnerId: props.partnerId }).path,
            );
          },
        });
      }}
    />
  );
};

export const ProjectSetupBankStatementRoute = defineRoute<ProjectSetupBankStatementParams>({
  routeName: "projectSetupBankStatement",
  routePath: "/projects/:projectId/setup/:partnerId/bank-statement",
  container: ProjectSetupBankStatementContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
  }),
  getTitle: x => x.content.getTitleCopy(x => x.pages.projectSetupBankStatement.title),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
