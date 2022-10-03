import { DocumentEdit } from "@ui/components";
import { ContainerProps } from "@ui/containers/containerBase";
import { Callbacks, ProjectDocumentPageParams, ProjectDocumentTableData } from "./projectDocuments.page";

export const ProjectDocumentTable = ({
  projectDocuments,
  onDelete,
  editor,
}: ContainerProps<ProjectDocumentPageParams, ProjectDocumentTableData, Callbacks>) => {
  return (
    <DocumentEdit
      hideHeader
      hideSubtitle
      qa="project-documents"
      onRemove={document => onDelete(editor.data, document)}
      documents={projectDocuments}
    />
  );
};
