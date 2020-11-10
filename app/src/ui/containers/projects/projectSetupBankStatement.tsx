import React from "react";
import * as ACC from "@ui/components";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { BankDetailsTaskStatus, DocumentDescription, PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { Pending } from "@shared/pending";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";

export interface ProjectSetupBankStatementParams {
  projectId: string;
  partnerId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  editor: Pending<IEditorStore<PartnerDto, PartnerDtoValidator>>;
  documents: Pending<DocumentSummaryDto[]>;
  documentsEditor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>>;
  onFileChange: (isSaving: boolean, dto: MultipleDocumentUploadDto) => void;
  onFileDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto) => void;
}

interface Callbacks {
  onChange: (submit: boolean, dto: PartnerDto) => void;
}

class ProjectSetupBankStatementComponent extends ContainerBase<ProjectSetupBankStatementParams, Data, Callbacks> {

  public render() {
    const combined = Pending.combine({ project: this.props.project, editor: this.props.editor, documents: this.props.documents, documentsEditor: this.props.documentsEditor });
    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.documents, x.editor, x.documentsEditor)} />;
  }
  public renderContents(project: ProjectDto, documents: DocumentSummaryDto[], editor: IEditorStore<PartnerDto, PartnerDtoValidator>, documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>) {

    const Form = ACC.TypedForm<PartnerDto>();
    return (
      <ACC.Page
        backLink={
          <ACC.BackLink route={this.props.routes.projectSetup.getLink({ projectId: this.props.projectId, partnerId: this.props.partnerId })}>
            <ACC.Content value={(x) => x.projectSetupBankStatement.backLink} />
          </ACC.BackLink>
        }
        error={editor.error}
        validator={[editor.validator, documentsEditor.validator]}
        pageTitle={<ACC.Projects.Title {...project} />}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />
        {this.renderGuidance()}
        {this.renderDocumentsForm(documentsEditor)}
        {this.renderFiles(documentsEditor, documents)}
        <ACC.Section qa="submit-bank-statement" >
          <Form.Form
            editor={editor}
            onChange={() => this.props.onChange(false, editor.data)}
            onSubmit={() => this.props.onChange(true, editor.data)}
            qa="submit-bank-statement-form"
          >
            <Form.Fieldset>
              <Form.Submit><ACC.Content value={x => x.projectSetupBankStatement.submitButton}/></Form.Submit>
              <ACC.Link styling="SecondaryButton" route={this.props.routes.projectSetup.getLink({projectId: this.props.projectId, partnerId: this.props.partnerId})}>
                <ACC.Content value={x => x.projectSetupBankStatement.returnButton}/>
              </ACC.Link>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderFiles(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, documents: DocumentSummaryDto[]) {
    if (documents.length) {
      return (
        <ACC.Section
          titleContent={x => x.projectSetupBankStatement.documentLabels.filesUploadedTitle}
          subtitleContent={x => x.projectSetupBankStatement.documentLabels.filesUploadedSubtitle}
        >
          <ACC.DocumentTableWithDelete onRemove={(document) => this.props.onFileDelete(documentsEditor.data, document)} documents={documents} qa="partner-document"/>
        </ACC.Section>
      );
    }
    return (
      <ACC.Section titleContent={x => x.projectSetupBankStatement.documentLabels.filesUploadedTitle}>
        <ACC.ValidationMessage message={x => x.projectSetupBankStatement.documentMessages.noDocumentsUploaded} messageType="info" />
      </ACC.Section>
    );
  }

  private renderDocumentsForm(documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>): React.ReactNode {
    const UploadForm = ACC.TypedForm<MultipleDocumentUploadDto>();
    return (
      <ACC.Section>
        <UploadForm.Form
          enctype="multipart"
          editor={documentsEditor}
          onSubmit={() => this.props.onFileChange(true, documentsEditor.data)}
          onChange={(dto) => this.props.onFileChange(false, dto)}
          qa="partnerDocumentUpload"
        >
          <UploadForm.Fieldset qa="documentGuidance">
            <UploadForm.Hidden name="description" value={x => DocumentDescription.BankStatement} />
            <ACC.DocumentGuidance />
            <UploadForm.MulipleFileUpload
              labelContent={x => x.projectSetupBankStatement.documentLabels.uploadInputLabel}
              name="attachment"
              labelHidden={true}
              value={data => data.files}
              update={(dto, files) => {
                dto.files = files || [];
                dto.description = DocumentDescription.BankStatement;
              }}
              validation={documentsEditor.validator.files}
            />
          </UploadForm.Fieldset>
          <UploadForm.Fieldset>
            <UploadForm.Button name="uploadFile" styling="Secondary" onClick={() => this.props.onFileChange(true, documentsEditor.data)}>
              <ACC.Content value={x => x.projectSetupBankStatement.documentLabels.uploadButtonLabel} />
            </UploadForm.Button>
          </UploadForm.Fieldset>
        </UploadForm.Form>
      </ACC.Section>
    );
  }

  private renderGuidance() {
    return (
      <ACC.Section qa={"guidance"}>
        <ACC.Content value={x => x.projectSetupBankStatement.guidanceMessage}/>
      </ACC.Section>
    );
  }
}

const ProjectSetupBankStatementContainer = (props: ProjectSetupBankStatementParams & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <ProjectSetupBankStatementComponent
        project={stores.projects.getById(props.projectId)}
        editor={stores.partners.getPartnerEditor(props.projectId, props.partnerId, dto => {
          dto.bankDetailsTaskStatus = BankDetailsTaskStatus.Complete;
        })}
        documents={stores.partnerDocuments.getPartnerDocuments(props.projectId, props.partnerId)}
        documentsEditor={stores.partnerDocuments.getPartnerDocumentEditor(props.partnerId)}
        onChange={(submit, dto) => {
          stores.partners.updatePartner(submit, props.partnerId, dto, {
              onComplete: (resp) => {
                stores.navigation.navigateTo(props.routes.projectSetup.getLink({ projectId: props.projectId, partnerId: props.partnerId }));
              }});
        }}
        onFileChange={(isSaving, dto) => {
          stores.messages.clearMessages();
          // show message if remaining on page
          const successMessage = dto.files.length === 1 ? `Your document has been uploaded.` : `${dto.files.length} documents have been uploaded.`;
          stores.partnerDocuments.updatePartnerDocumentsEditor(isSaving, props.projectId, props.partnerId, dto, successMessage);
        }}
        onFileDelete={(dto, document) => {
          stores.messages.clearMessages();
          stores.partnerDocuments.deletePartnerDocumentsEditor(props.projectId, props.partnerId, dto, document, "Your document has been removed.");
        }}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const ProjectSetupBankStatementRoute = defineRoute({
  routeName: "projectSetupBankStatement",
  routePath: "/projects/:projectId/setup/:partnerId/bank-statement",
  container: ProjectSetupBankStatementContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
  }),
  getTitle: ({ content }) => content.projectSetupBankStatement.title(),
  accessControl: (auth, { projectId, partnerId }) => auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
