import { PCRDto, PCRItemType, ProjectChangeRequestStatusChangeDto, ProjectDto, ProjectRole } from "@framework/types";
import { Pending } from "@shared/pending";
import { PageLoader } from "@ui/components";
import { IEditorStore, useStores } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators";
import { useNavigate } from "react-router-dom";
import { BaseProps, defineRoute } from "../../containerBase";
import { PCROverviewComponent } from "./ProjectChangeRequestOverview";

export interface ProjectChangeRequestPrepareParams {
  projectId: ProjectId;
  pcrId: PcrId;
}

export interface ProjectChangeRequestPrepareProps {
  project: ProjectDto;
  pcr: PCRDto;
  statusChanges: ProjectChangeRequestStatusChangeDto[];
  editableItemTypes: PCRItemType[];
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
  onChange: (save: boolean, dto: PCRDto) => void;
  mode: "prepare";
}

const PCRPrepareContainer = (props: ProjectChangeRequestPrepareParams & BaseProps) => {
  const navigate = useNavigate();
  const stores = useStores();

  return (
    <PageLoader
      pending={Pending.combine({
        project: stores.projects.getById(props.projectId),
        pcr: stores.projectChangeRequests.getById(props.projectId, props.pcrId),
        statusChanges: stores.projectChangeRequests.getStatusChanges(props.projectId, props.pcrId),
        editor: stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId),
        editableItemTypes: stores.projectChangeRequests.getEditableItemTypes(props.projectId, props.pcrId),
      })}
      render={({ project, pcr, statusChanges, editor, editableItemTypes }) => (
        <PCROverviewComponent
          {...props}
          project={project}
          pcr={pcr}
          statusChanges={statusChanges}
          editableItemTypes={editableItemTypes}
          mode="prepare"
          editor={editor}
          onChange={(saving: boolean, dto: PCRDto) =>
            stores.projectChangeRequests.updatePcrEditor(saving, props.projectId, dto, undefined, () =>
              navigate(props.routes.pcrsDashboard.getLink({ projectId: props.projectId }).path),
            )
          }
        />
      )}
    />
  );
};

export const ProjectChangeRequestPrepareRoute = defineRoute<ProjectChangeRequestPrepareParams>({
  routeName: "pcrPrepare",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare",
  container: PCRPrepareContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
  }),
  getTitle: () => ({
    htmlTitle: "Request",
    displayTitle: "Request",
  }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});
