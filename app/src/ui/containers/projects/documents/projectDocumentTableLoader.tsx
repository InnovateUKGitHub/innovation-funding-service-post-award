import { Content, H3, Loader } from "@ui/components";
import { ContainerProps } from "@ui/containers/containerBase";
import { Callbacks, ProjectDocumentPageParams, ProjectDocumentTableLoaderData } from "./projectDocuments.page";
import { ProjectDocumentTable } from "./projectDocumentTable";

export const ProjectDocumentTableLoader = (
  props: ContainerProps<ProjectDocumentPageParams, ProjectDocumentTableLoaderData, Callbacks>,
) => {
  return (
    <>
      <H3>
        <Content value={x => x.projectDocuments.projectLevelSubtitle} />
      </H3>
      <Loader
        pending={props.projectDocuments}
        render={x => (
          <ProjectDocumentTable
            {...Object.assign({}, props, {
              projectDocuments: x,
            })}
          />
        )}
      />
    </>
  );
};
