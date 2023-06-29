import { useOnUpdate } from "@framework/api-helpers/onUpdate";
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
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileDeleteOutputs,
  FileUploadOutputs,
  getDocumentFormValidation,
} from "@server/htmlFormHandler/handlers/projects/[projectId]/documents/projectLevelDocumentShare.zod";
import { Pending } from "@shared/pending";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentGuidance } from "@ui/components/atomicDesign/organisms/documents/DocumentGuidance/DocumentGuidance";
import {
  DocumentEdit,
  PartnerDocumentEdit,
} from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { DropdownListOption } from "@ui/components/bjss/inputs/dropdownList";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { PageLoader } from "@ui/components/bjss/loading";
import { ProjectBackLink } from "@ui/components/atomicDesign/organisms/projects/ProjectBackLink/projectBackLink";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { H2, H3 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { getCurrentPartnerName } from "@ui/helpers/getCurrentPartnerName";
import { useContent } from "@ui/hooks/content.hook";
import { messageSuccess, removeMessages } from "@ui/redux/actions/common/messageActions";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { useProjectDocumentsQuery } from "./projectDocuments.logic";
import { projectDocumentsQuery } from "./ProjectDocuments.query";
import { clientsideApiClient } from "@ui/apiClient";
import { Button } from "@ui/components/atomicDesign/atoms/Button/Button";
import { ClientFileWrapper } from "@client/clientFileWrapper";
import { makeZodI18nMap } from "@shared/zodi18n";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { FileInput } from "@ui/components/atomicDesign/atoms/form/FileInput/FileInput";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { Select } from "@ui/components/atomicDesign/atoms/form/Select/Select";
import { ValidationError } from "class-validator";
import { useForm } from "react-hook-form";
import { useStore } from "react-redux";
import { Form } from "react-router-dom";
import { useEnumDocuments } from "../../claims/components/allowed-documents.hook";

export interface ProjectDocumentPageParams {
  projectId: ProjectId;
}

type ProjectDocumentsPageProps = {
  editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
  refresh: () => void;
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

const ProjectDocumentsPage = ({
  refresh,
  editor,
  project,
  partners,
  projectDocuments,
  partnerDocuments,
  ...props
}: ProjectDocumentPageParams & BaseProps & ProjectDocumentsPageProps) => {
  const { getContent } = useContent();
  const stores = useStores();

  const { onUpdate: onUploadUpdate } = useOnUpload({
    refresh() {
      refresh();
      reset();
    },
  });
  const { onUpdate: onDeleteUpdate } = useOnDelete({ refresh });

  const { register, handleSubmit, formState, reset } = useForm<FileUploadOutputs>({
    resolver: zodResolver(getDocumentFormValidation("projectLevelUpload"), {
      errorMap: makeZodI18nMap({ keyPrefix: ["documents"] }),
    }),
  });

  const onChange = (dto: FileUploadOutputs) => {
    onUploadUpdate(
      {
        form: "projectLevelUpload",
        description: dto.description,
        files: dto.files as ClientFileWrapper[],
        projectId: project.id,
      },
      dto,
    );
  };

  const onDelete = (dto: MultipleDocumentUploadDto, doc: DocumentSummaryDto | PartnerDocumentSummaryDtoGql) => {
    stores.messages.clearMessages();
    if ("partnerId" in doc) {
      onDeleteUpdate(
        { form: "partnerLevelDelete", documentId: doc.id, projectId: project.id, partnerId: doc.partnerId },
        doc,
      );
    } else {
      onDeleteUpdate({ form: "projectLevelDelete", documentId: doc.id, projectId: project.id }, doc);
    }
  };

  const { isMo: isProjectMo } = getAuthRoles(project.roles);
  const partnerName = getCurrentPartnerName(partners);
  const documentDropdownOptions = useEnumDocuments(DocumentDescription, allowedProjectDocuments);
  const partnerOptions: DropdownListOption[] = [
    {
      id: "none",
      value: "",
      displayName: getContent(x => x.documentLabels.participantPlaceholder),
      qa: `document-partner-null`,
    },
    ...partners.map(partner => ({
      id: partner.id,
      value: partner.id,
      displayName: getContent(x => x.documentLabels.participantOption({ partnerName: partner.name })),
      qa: `document-partner-${partner.id}`,
    })),
  ];

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
        <DocumentGuidance />
        <Form onSubmit={handleSubmit(onChange)}>
          <Fieldset>
            <input type="hidden" value="projectLevelUpload" {...register("form")} />
            <input type="hidden" value={project.id} {...register("projectId")} />

            <FormGroup hasError={!!formState.errors["files"]}>
              <ValidationError error={formState.errors["files"]} />
              <FileInput id="files" hasError={!!formState.errors["files"]} multiple {...register("files")} />
            </FormGroup>

            <FormGroup hasError={!!formState.errors["description"]}>
              <Label htmlFor="description">Description</Label>
              <ValidationError error={formState.errors["description"]} />
              <Select id="description" {...register("description")}>
                {documentDropdownOptions.map(x => (
                  <option value={x.id} key={x.id}>
                    {x.value}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup hasError={!!formState.errors["partnerId"]}>
              <Label htmlFor="partnerId">Access control</Label>
              <ValidationError error={formState.errors["partnerId"]} />
              <Select id="partnerId" {...register("partnerId")}>
                {partnerOptions.map(x => (
                  <option value={x.value} key={x.id}>
                    {x.displayName}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </Fieldset>
          <Fieldset>
            <Button name="button_default" styling="Secondary" type="submit">
              {getContent(x => x.documentLabels.uploadInputLabel)}
            </Button>
          </Fieldset>
        </Form>

        {/* <EnumDocuments documentsToCheck={allowedProjectDocuments}>
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
        </EnumDocuments> */}
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

const useOnUpload = <Inputs extends FileUploadOutputs>({ refresh }: { refresh: () => void }) => {
  const store = useStore();
  const { getContent } = useContent();

  return useOnUpdate<Inputs, unknown, MultipleDocumentUploadDto>({
    req(data) {
      const { projectId, partnerId, description, files } = data;

      if (partnerId) {
        return clientsideApiClient.documents.uploadPartnerDocument({
          projectId,
          partnerId,
          documents: {
            files,
            description,
          },
        });
      } else {
        return clientsideApiClient.documents.uploadProjectDocument({
          projectId,
          documents: {
            files,
            description,
          },
        });
      }
    },
    onSuccess(data, res, ctx) {
      const successMessage = getContent(x => x.documentMessages.uploadedDocuments({ count: ctx?.files.length }));
      store.dispatch(removeMessages());
      store.dispatch(messageSuccess(successMessage));
      scrollToTheTopSmoothly();
      refresh();
    },
  });
};

const useOnDelete = <Inputs extends FileDeleteOutputs>({ refresh }: { refresh: () => void }) => {
  const store = useStore();
  const { getContent } = useContent();

  return useOnUpdate<Inputs, unknown, DocumentSummaryDto>({
    req(props) {
      const { documentId, projectId, form } = props;
      if (form === "projectLevelDelete") {
        return clientsideApiClient.documents.deleteProjectDocument({ documentId, projectId });
      } else if (form === "partnerLevelDelete") {
        const { partnerId } = props;
        return clientsideApiClient.documents.deletePartnerDocument({ documentId, partnerId, projectId });
      } else if (form === "claimLevelDelete") {
        const { partnerId, periodId } = props;
        return clientsideApiClient.documents.deleteClaimDocument({
          documentId,
          claimKey: { projectId, partnerId, periodId },
        });
      } else if (form === "claimDetailLevelDelete") {
        const { partnerId, periodId, costCategoryId } = props;
        return clientsideApiClient.documents.deleteClaimDetailDocument({
          documentId,
          claimDetailKey: { costCategoryId, partnerId, periodId, projectId },
        });
      } else {
        return Promise.reject();
      }
    },
    onSuccess(input, _, ctx) {
      const successMessage = getContent(x => x.documentMessages.deletedDocument({ deletedFileName: ctx?.fileName }));
      store.dispatch(removeMessages());
      store.dispatch(messageSuccess(successMessage));
      scrollToTheTopSmoothly();
      refresh();
    },
  });
};

const ProjectDocumentsPageContainer = (props: ProjectDocumentPageParams & BaseProps) => {
  const stores = useStores();

  const pending = Pending.combine({
    editor: stores.projectDocuments.getProjectDocumentEditor(props.projectId),
  });

  const [refreshedQueryOptions, refresh] = useRefreshQuery(projectDocumentsQuery, { projectId: props.projectId });

  const { project, partners, partnerDocuments, projectDocuments } = useProjectDocumentsQuery(
    props.projectId,
    refreshedQueryOptions,
  );

  return (
    <PageLoader
      pending={pending}
      render={x => (
        <ProjectDocumentsPage
          refresh={refresh}
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
