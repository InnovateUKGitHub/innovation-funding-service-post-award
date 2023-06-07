import { PCRDto, PCRItemType, ProjectChangeRequestStatusChangeDto, ProjectDto, ProjectRole } from "@framework/types";
import { Pending } from "@shared/pending";
import { PageLoader } from "@ui/components";
import { useStores } from "@ui/redux";
import { BaseProps, defineRoute } from "../../containerBase";
import { PCROverviewComponent } from "./ProjectChangeRequestOverview";

export interface ProjectChangeRequestDetailsParams {
  projectId: ProjectId;
  pcrId: PcrId;
}

export interface ProjectChangeRequestDetailsProps {
  project: ProjectDto;
  pcr: PCRDto;
  statusChanges: ProjectChangeRequestStatusChangeDto[];
  editableItemTypes: PCRItemType[];
  editor: undefined;
  onChange: undefined;
  mode: "details";
}

const PCRDetailsContainer = (props: ProjectChangeRequestDetailsParams & BaseProps) => {
  const stores = useStores();

  return (
    <PageLoader
      pending={Pending.combine({
        project: stores.projects.getById(props.projectId),
        pcr: stores.projectChangeRequests.getById(props.projectId, props.pcrId),
        statusChanges: stores.projectChangeRequests.getStatusChanges(props.projectId, props.pcrId),
        editableItemTypes: stores.projectChangeRequests.getEditableItemTypes(props.projectId, props.pcrId),
      })}
      render={({ project, pcr, statusChanges, editableItemTypes }) => (
        <PCROverviewComponent
          {...props}
          project={project}
          pcr={pcr}
          editor={undefined}
          onChange={undefined}
          statusChanges={statusChanges}
          editableItemTypes={editableItemTypes}
          mode="details"
        />
      )}
    />
  );
};

export const PCRDetailsRoute = defineRoute<ProjectChangeRequestDetailsParams>({
  allowRouteInActiveAccess: true,
  routeName: "pcrDetails",
  routePath: "/projects/:projectId/pcrs/:pcrId/details",
  container: PCRDetailsContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
  }),
  getTitle: () => ({
    htmlTitle: "Request",
    displayTitle: "Request",
  }),
  accessControl: (auth, { projectId }) =>
    auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
});
