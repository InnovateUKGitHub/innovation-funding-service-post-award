import { DocumentDescription } from "@framework/constants/documentDescription";
import {
  DocumentSummaryDto,
  PartnerDocumentSummaryDto,
  PartnerDocumentSummaryDtoGql,
} from "@framework/dtos/documentDto";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { PartnerDtoGql } from "@framework/dtos/partnerDto";
import { ProjectDtoGql } from "@framework/dtos/projectDto";
import { getAuthRoles } from "@framework/types/authorisation";
import { useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { Pending } from "@shared/pending";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentGuidance } from "@ui/components/atomicDesign/organisms/documents/DocumentGuidance/DocumentGuidance";
import {
  DocumentEdit,
  PartnerDocumentEdit,
} from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { createTypedForm, DropdownOption } from "@ui/components/bjss/form/form";
import { DropdownListOption } from "@ui/components/bjss/inputs/dropdownList";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { PageLoader } from "@ui/components/bjss/loading";
import { ProjectBackLink } from "@ui/components/atomicDesign/organisms/projects/ProjectBackLink/projectBackLink";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { H2, H3 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { EnumDocuments } from "@ui/containers/pages/claims/components/EnumDocuments";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { getCurrentPartnerName } from "@ui/helpers/getCurrentPartnerName";
import { noop } from "@ui/helpers/noop";
import { useContent } from "@ui/hooks/content.hook";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { useProjectDocumentsQuery } from "./projectDocuments.logic";
import { projectDocumentsQuery } from "./ProjectDocuments.query";

export interface ProjectDocumentPageParams {
  projectId: ProjectId;
}

type ProjectDocumentsPageProps = {
  editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
  onChange: (save: boolean, dto: MultipleDocumentUploadDto) => void;
  onDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto | PartnerDocumentSummaryDto) => void;
  project: Pick<ProjectDtoGql, "id" | "projectNumber" | "title" | "status" | "roles">;
  partners: Pick<PartnerDtoGql, "id" | "name" | "roles">[];
  projectDocuments: Pick<
    DocumentSummaryDto,
    "id" | "fileName" | "fileSize" | "link" | "description" | "dateCreated" | "uploadedBy" | "isOwner"
  >[];
  partnerDocuments: Pick<
    PartnerDocumentSummaryDto,
    | "id"
    | "fileName"
    | "fileSize"
    | "description"
    | "dateCreated"
    | "uploadedBy"
    | "link"
    | "isOwner"
    | "partnerId"
    | "partnerName"
  >[];
};

const allowedProjectDocuments: DocumentDescription[] = [
  DocumentDescription.ReviewMeeting,
  DocumentDescription.Plans,
  DocumentDescription.CollaborationAgreement,
  DocumentDescription.RiskRegister,
  DocumentDescription.AnnexThree,
  DocumentDescription.Presentation,
  DocumentDescription.Email,
  DocumentDescription.MeetingAgenda,
];

const UploadForm = createTypedForm<MultipleDocumentUploadDto>();

const ProjectDocumentsPage = ({
  onChange,
  onDelete,
  editor,
  project,
  partners,
  projectDocuments,
  partnerDocuments,
  ...props
}: ProjectDocumentPageParams & BaseProps & ProjectDocumentsPageProps) => {
  const { getContent } = useContent();

  const { isMo: isProjectMo } = getAuthRoles(project.roles);
  const partnerName = getCurrentPartnerName(partners);

  const validUploadPartners = partners.filter(partner => {
    const roles = getAuthRoles(partner.roles);
    return isProjectMo || roles.isPm || roles.isMo || roles.isFc;
  });

  const partnerOptions: DropdownListOption[] = partners.map(partner => ({
    id: partner.id,
    value: partner.id,
    displayName: getContent(x => x.documentLabels.participantOption({ partnerName: partner.name })),
    qa: `document-partner-${partner.id}`,
  }));

  const filterDropdownList = (selectedDocument: MultipleDocumentUploadDto, documents: DropdownOption[]) => {
    if (!documents.length || !selectedDocument.description) return undefined;
    const targetId = selectedDocument.description.toString();
    return documents.find(x => x.id === targetId);
  };

  const filterVisibilityList = (selectedOption: MultipleDocumentUploadDto, visibilityOptions: DropdownOption[]) => {
    const res = visibilityOptions.find(x => x.value === selectedOption.partnerId);

    return res;
  };

  return (
    <Page
      pageTitle={<Title projectNumber={project.projectNumber} title={project.title} />}
      backLink={<ProjectBackLink routes={props.routes} projectId={project.id} />}
      validator={editor.validator}
      error={editor.error}
      projectStatus={project.status}
    >
      <Messages messages={props.messages} />

      <Section>
        {isProjectMo ? (
          <Content markdown value={x => x.documentMessages.monitoringOfficerDocumentsIntroMessage} />
        ) : (
          <Content markdown value={x => x.documentMessages.otherRoleDocumentsIntroMessage({ partnerName })} />
        )}
      </Section>

      <Section>
        <EnumDocuments documentsToCheck={allowedProjectDocuments}>
          {docs => (
            <UploadForm.Form
              enctype="multipart"
              editor={editor}
              onChange={dto => {
                return onChange(false, dto);
              }}
              onSubmit={() => onChange(true, editor.data)}
              qa="projectDocumentUpload"
            >
              <UploadForm.Fieldset>
                <DocumentGuidance />

                <UploadForm.MultipleFileUpload
                  label={x => x.documentLabels.uploadInputLabel}
                  name="attachment"
                  labelHidden
                  value={data => data.files}
                  update={(dto, files) => {
                    dto.files = files || [];
                  }}
                  validation={editor?.validator?.files}
                />

                {/* If a user is the project MO, show them a list of partners to choose from. */}
                {/* If a user is not the project MO, but they have more than one partner to select (?!?), show them all the partners. */}
                {(isProjectMo || validUploadPartners.length > 1) && (
                  <UploadForm.DropdownList
                    label={x => x.documentLabels.participantLabel}
                    hasEmptyOption={isProjectMo} // Only the project MO can select the "Innovate UK/MO only" option
                    placeholder={getContent(x => x.documentLabels.participantPlaceholder)}
                    name="partnerId"
                    validation={editor.validator.partnerId}
                    options={partnerOptions}
                    value={selectedOption => filterVisibilityList(selectedOption, partnerOptions)}
                    update={(dto, option) => {
                      if (typeof option?.value === "string") {
                        dto.partnerId = option.value as PartnerId;
                      } else {
                        dto.partnerId = undefined;
                      }
                    }}
                  />
                )}

                {/* If a user is not the project MO, and they only have one partner option, hard code it to the form. */}
                {!isProjectMo && validUploadPartners.length === 1 && (
                  <UploadForm.Hidden name="partnerId" value={dto => (dto.partnerId = validUploadPartners[0].id)} />
                )}

                <UploadForm.DropdownList
                  label={x => x.documentLabels.descriptionLabel}
                  hasEmptyOption
                  placeholder={getContent(x => x.documentLabels.descriptionPlaceholder)}
                  name="description"
                  validation={editor?.validator?.description}
                  options={docs}
                  value={selectedOption => filterDropdownList(selectedOption, docs)}
                  update={(dto, value) => {
                    dto.description = value ? parseInt(value.id, 10) : undefined;
                  }}
                />
              </UploadForm.Fieldset>

              <UploadForm.Submit styling="Secondary">
                <Content value={x => x.documentMessages.uploadDocuments} />
              </UploadForm.Submit>
            </UploadForm.Form>
          )}
        </EnumDocuments>
      </Section>
      <Section>
        <H2>
          <Content value={x => x.documentLabels.documentDisplayTitle} />
        </H2>

        <SimpleString>
          <Content value={x => x.documentLabels.documentDisplaySubTitle} />
        </SimpleString>

        {isProjectMo && (
          <>
            <H3>
              <Content value={x => x.pages.projectDocuments.projectLevelSubtitle} />
            </H3>

            <DocumentEdit
              hideHeader
              hideSubtitle
              qa="project-documents"
              onRemove={document => onDelete(editor?.data, document)}
              documents={projectDocuments}
            />
          </>
        )}

        <H3>
          {isProjectMo ? (
            <Content value={x => x.pages.projectDocuments.partnerLevelSubtitle} />
          ) : (
            <Content
              value={x =>
                x.pages.projectDocuments.partnerSelfLevelSubtitle({
                  partnerName: getCurrentPartnerName(partners),
                })
              }
            />
          )}
        </H3>

        <PartnerDocumentEdit
          hideHeader
          hideSubtitle
          qa="partner-documents"
          onRemove={document => onDelete(editor?.data, document)}
          documents={partnerDocuments}
          project={project}
        />
      </Section>
    </Page>
  );
};

const ProjectDocumentsPageContainer = (props: ProjectDocumentPageParams & BaseProps) => {
  const stores = useStores();
  const { getContent } = useContent();

  const pending = Pending.combine({
    editor: stores.projectDocuments.getProjectDocumentEditor(props.projectId),
  });

  const [refreshedQueryOptions, refresh] = useRefreshQuery(projectDocumentsQuery, { projectId: props.projectId });

  const onChange = (saving: boolean, dto: MultipleDocumentUploadDto) => {
    stores.messages.clearMessages();
    const successMessage = getContent(x => x.documentMessages.uploadedDocuments({ count: dto.files.length }));
    stores.projectDocuments.updateProjectDocumentsEditor(
      saving,
      props.projectId,
      dto,
      successMessage,
      saving ? refresh : noop,
    );
  };

  const onDelete = (dto: MultipleDocumentUploadDto, doc: DocumentSummaryDto | PartnerDocumentSummaryDtoGql) => {
    stores.messages.clearMessages();
    const successMessage = getContent(x => x.documentMessages.deletedDocument({ deletedFileName: doc.fileName }));
    if ("partnerId" in doc) {
      stores.projectDocuments.deleteProjectPartnerDocumentsEditor(
        props.projectId,
        doc.linkedEntityId,
        dto,
        doc,
        successMessage,
        refresh,
      );
    } else {
      stores.projectDocuments.deleteProjectDocument(props.projectId, dto, doc, successMessage, refresh);
    }
  };

  const { project, partners, partnerDocuments, projectDocuments } = useProjectDocumentsQuery(
    props.projectId,
    refreshedQueryOptions,
  );

  return (
    <PageLoader
      pending={pending}
      render={x => (
        <ProjectDocumentsPage
          onChange={onChange}
          onDelete={onDelete}
          project={project}
          partners={partners}
          partnerDocuments={partnerDocuments}
          projectDocuments={projectDocuments}
          {...Object.assign({}, props, x)}
        />
      )}
    />
  );
};

export const ProjectDocumentsRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "projectDocuments",
  routePath: "/projects/:projectId/documents",
  container: ProjectDocumentsPageContainer,
  getParams: route => ({ projectId: route.params.projectId as ProjectId }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.projectDocuments.title),
});