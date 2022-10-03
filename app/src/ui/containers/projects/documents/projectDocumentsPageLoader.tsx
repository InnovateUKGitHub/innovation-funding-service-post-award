import { Pending } from "@shared/pending";
import { PageLoader } from "@ui/components";
import { ContainerProps } from "@ui/containers/containerBase";
import { ProjectDocumentPage } from "./projectDocuments";
import { Callbacks, ProjectDocumentData, ProjectDocumentPageParams } from "./projectDocuments.page";

export const ProjectDocumentsPageLoader = (
  props: ContainerProps<ProjectDocumentPageParams, ProjectDocumentData, Callbacks>,
) => {
  const combined = Pending.combine({
    project: props.project,
    partners: props.partners,
    editor: props.editor,
  });

  return <PageLoader pending={combined} render={x => <ProjectDocumentPage {...Object.assign({}, props, x)} />} />;
};
