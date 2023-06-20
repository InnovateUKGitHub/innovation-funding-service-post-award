import { PCRItemType } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { PCRDto, ProjectChangeRequestStatusChangeDto } from "@framework/dtos/pcrDtos";
import { ProjectDto } from "@framework/dtos/projectDto";
import { Pending } from "@shared/pending";
import { PageLoader } from "@ui/components/loading";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
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
            stores.projectChangeRequests.updatePcrEditor({
              saving,
              projectId: props.projectId,
              dto,
              message: undefined,
              onComplete: () => navigate(props.routes.pcrsDashboard.getLink({ projectId: props.projectId }).path),
            })
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
