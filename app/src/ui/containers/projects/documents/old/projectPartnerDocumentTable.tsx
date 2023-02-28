import { PartnerDocumentEdit } from "@ui/components";
import { ContainerProps } from "@ui/containers/containerBase";
import { Callbacks, ProjectDocumentPageParams, ProjectPartnerDocumentTableData } from "./projectDocuments.page";

export const ProjectPartnerDocumentTable = ({
  project,
  partnerDocuments,
  onDelete,
  editor,
}: ContainerProps<ProjectDocumentPageParams, ProjectPartnerDocumentTableData, Callbacks>) => {
  return (
    <PartnerDocumentEdit
      hideHeader
      hideSubtitle
      qa="partner-documents"
      onRemove={document => onDelete(editor.data, document)}
      documents={partnerDocuments}
      project={project}
    />
  );
};
