import { DocumentDescription } from "@framework/constants";
import { MultipleDocumentUploadDto } from "@framework/dtos";
import { getAuthRoles } from "@framework/types";
import {
  Content,
  DocumentGuidance,
  DropdownOption,
  H2,
  Page,
  Projects,
  Renderers,
  Section,
  createTypedForm,
} from "@ui/components";
import { DropdownListOption } from "@ui/components/inputs";
import { SimpleString } from "@ui/components/renderers";
import { EnumDocuments } from "@ui/containers/claims/components";
import { ContainerProps } from "@ui/containers/containerBase";
import { getCurrentPartnerName } from "@ui/helpers/getCurrentPartnerName";
import { useContent } from "@ui/hooks";
import { useStores } from "@ui/redux";
import { Callbacks, ProjectDocumentPageData, ProjectDocumentPageParams } from "./projectDocuments.page";
import { ProjectDocumentTableLoader } from "./projectDocumentTableLoader";
import { ProjectPartnerDocumentTableLoader } from "./projectPartnerDocumentTableLoader";

const UploadForm = createTypedForm<MultipleDocumentUploadDto>();

export const ProjectDocumentPage = (
  props: ContainerProps<ProjectDocumentPageParams, ProjectDocumentPageData, Callbacks>,
) => {
  const { project, partners, editor, routes, messages, onChange } = props;
  const { getContent } = useContent();

  const stores = useStores();

  const filterDropdownList = (selectedDocument: MultipleDocumentUploadDto, documents: DropdownOption[]) => {
    if (!documents.length || !selectedDocument.description) return undefined;
    const targetId = selectedDocument.description.toString();
    return documents.find(x => x.id === targetId);
  };

  const filterVisibilityList = (selectedOption: MultipleDocumentUploadDto, visibilityOptions: DropdownOption[]) =>
    visibilityOptions.find(x => x.value === selectedOption.partnerId);

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

  const { isMo: isProjectMo } = getAuthRoles(project.roles);
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

  const partnerName = getCurrentPartnerName(partners);

  return (
    <Page
      pageTitle={<Projects.Title {...project} />}
      backLink={<Projects.ProjectBackLink routes={props.routes} projectId={project.id} />}
      validator={editor.validator}
      error={editor.error}
      project={project}
    >
      <Renderers.Messages messages={messages} />

      <Section>
        {isProjectMo ? (
          <Content markdown value={x => x.documentMessages.monitoringOfficerDocumentsIntroMessage} />
        ) : (
          <Content markdown value={x => x.documentMessages.otherRoleDocumentsIntroMessage({ partnerName })} />
        )}
      </Section>

      <Section title={x => x.documentMessages.uploadTitle}>
        <EnumDocuments documentsToCheck={allowedProjectDocuments}>
          {docs => (
            <UploadForm.Form
              enctype="multipart"
              editor={editor}
              onChange={dto => onChange(false, dto)}
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
                  update={(dto, files) => (dto.files = files || [])}
                  validation={editor.validator.files}
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
                        dto.partnerId = option.value;
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
                  validation={editor.validator.description}
                  options={docs}
                  value={selectedOption => filterDropdownList(selectedOption, docs)}
                  update={(dto, value) => (dto.description = value ? parseInt(value.id, 10) : undefined)}
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
          <ProjectDocumentTableLoader
            {...props}
            projectDocuments={stores.projectDocuments.getProjectDocuments(props.projectId)}
          />
        )}

        <ProjectPartnerDocumentTableLoader
          {...props}
          partnerDocuments={stores.partnerDocuments.getAllPartnerDocuments(props.projectId)}
        />
      </Section>
    </Page>
  );
};
