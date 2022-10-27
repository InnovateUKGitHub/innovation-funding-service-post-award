import {
  AllPartnerDocumentSummaryDto,
  DocumentSummaryDto,
  MultipleDocumentUploadDto,
  PartnerDocumentSummaryDto,
  PartnerDto,
  ProjectDto,
} from "@framework/dtos";
import { Pending } from "@shared/pending";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks";
import { IEditorStore, useStores } from "@ui/redux";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";
import { ProjectDocumentsPageLoader } from "./projectDocumentsPageLoader";

export interface ProjectDocumentPageParams {
  projectId: string;
}
export interface ProjectDocumentData {
  project: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
  editor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>>;
}
export interface ProjectDocumentPageData {
  project: ProjectDto;
  partners: PartnerDto[];
  editor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
}
export interface ProjectDocumentTableLoaderData extends ProjectDocumentPageData {
  projectDocuments: Pending<DocumentSummaryDto[]>;
}
export interface ProjectDocumentTableData extends ProjectDocumentPageData {
  projectDocuments: DocumentSummaryDto[];
}

export interface ProjectPartnerDocumentTableLoaderData extends ProjectDocumentPageData {
  partnerDocuments: Pending<AllPartnerDocumentSummaryDto>;
  project: ProjectDto;
}
export interface ProjectPartnerDocumentTableData extends ProjectDocumentPageData {
  partnerDocuments: AllPartnerDocumentSummaryDto;
  project: ProjectDto;
}
export interface Callbacks {
  onChange: (save: boolean, dto: MultipleDocumentUploadDto) => void;
  onDelete: (dto: MultipleDocumentUploadDto, document: DocumentSummaryDto | PartnerDocumentSummaryDto) => void;
}

const ProjectDocumentsContainer = (props: ProjectDocumentPageParams & BaseProps) => {
  const stores = useStores();
  const { getContent } = useContent();

  return (
    <ProjectDocumentsPageLoader
      {...props}
      project={stores.projects.getById(props.projectId)}
      partners={stores.partners.getPartnersForProject(props.projectId)}
      editor={stores.projectDocuments.getProjectDocumentEditor(props.projectId)}
      onChange={(saving, dto) => {
        stores.messages.clearMessages();
        const successMessage = getContent(x => x.documentMessages.uploadedDocuments({ count: dto.files.length }));

        stores.projectDocuments.updateProjectDocumentsEditor(saving, props.projectId, dto, successMessage);
      }}
      onDelete={(dto, doc) => {
        stores.messages.clearMessages();
        const successMessage = getContent(x => x.documentMessages.deletedDocument({ deletedFileName: doc.fileName }));
        if ("partnerId" in doc) {
          stores.projectDocuments.deleteProjectPartnerDocumentsEditor(
            props.projectId,
            doc.partnerId,
            dto,
            doc,
            successMessage,
          );
        } else {
          stores.projectDocuments.deleteProjectDocument(props.projectId, dto, doc, successMessage);
        }
      }}
    />
  );
};

export const ProjectDocumentsRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "projectDocuments",
  routePath: "/projects/:projectId/documents",
  container: ProjectDocumentsContainer,
  getParams: route => ({ projectId: route.params.projectId }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.projectDocuments.title),
});
