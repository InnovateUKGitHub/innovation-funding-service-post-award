import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { usePcrItemWorkflowQuery } from "./pcrItemWorkflow.logic";
import { ProjectRole } from "@framework/constants/project";
import { PCRItemWorkflow } from "./pcrItemWorkflow";
import { useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { pcrItemWorkflowQuery } from "./PcrItemWorkflow.query";

export interface ProjectChangeRequestPrepareItemParams {
  projectId: ProjectId;
  pcrId: PcrId;
  itemId: PcrItemId;
  step?: number;
}

export interface ProjectChangeRequestPrepareItemSearchParams {
  search?: string | number; // Our app is too clever - If you search for a number, it transforms the input to a number!
  companiesHouseResult?: SerialisedProjectChangeRequestAddPartnerCompaniesHouseResult;
}

export type Mode = "prepare" | "review" | "details";

export const PCRItemContainer = (
  props: ProjectChangeRequestPrepareItemParams &
    ProjectChangeRequestPrepareItemSearchParams &
    BaseProps & { mode: Mode },
) => {
  const [refreshedQueryOptions, refresh] = useRefreshQuery(pcrItemWorkflowQuery, {
    projectId: props.projectId,
    pcrId: props.pcrId,
    pcrItemId: props.itemId,
  });

  const data = usePcrItemWorkflowQuery(props.projectId, props.pcrId, props.itemId, refreshedQueryOptions);

  return (
    <PCRItemWorkflow
      project={data.project}
      pcrItem={data.pcrItem}
      fragmentRef={data.fragmentRef}
      pcrType={data.pcrItem.type}
      refreshItemWorkflowQuery={refresh}
      {...props}
    />
  );
};

export const PCRViewItemRoute = defineRoute<ProjectChangeRequestPrepareItemParams>({
  allowRouteInActiveAccess: true,
  routeName: "pcrViewItem",
  routePath: "/projects/:projectId/pcrs/:pcrId/details/item/:itemId",
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    itemId: route.params.itemId as PcrItemId,
    pcrId: route.params.pcrId as PcrId,
  }),
  container: function PCRViewItemContainer(props) {
    return <PCRItemContainer {...props} mode="details" />;
  },
  accessControl: (auth, { projectId }) =>
    auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
});

export const PCRReviewItemRoute = defineRoute<ProjectChangeRequestPrepareItemParams>({
  routeName: "pcrReviewItem",
  routePath: "/projects/:projectId/pcrs/:pcrId/review/item/:itemId",
  routePathWithQuery: "/projects/:projectId/pcrs/:pcrId/review/item/:itemId?:step",
  container: function PCRReviewItemContainer(props) {
    return <PCRItemContainer {...props} mode="review" />;
  },
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    itemId: route.params.itemId as PcrItemId,
    pcrId: route.params.pcrId as PcrId,
    step: parseInt(route.params.step, 10),
  }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer),
});

export const PCRPrepareItemRoute = defineRoute<ProjectChangeRequestPrepareItemParams>({
  routeName: "pcrPrepareItem",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId",
  routePathWithQuery: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId?:step",
  container: function PCRPrepareItemContainer(props) {
    return <PCRItemContainer {...props} mode="prepare" />;
  },
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
    step: parseInt(route.params.step, 10),
  }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});
