import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { IStores } from "@ui/redux/storesProvider";
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
  search?: string;
  companiesHouseResult?: SerialisedProjectChangeRequestAddPartnerCompaniesHouseResult;
}

export type Mode = "prepare" | "review" | "view";

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

const getTitle = (defaultTitle: string, params: ProjectChangeRequestPrepareItemParams, stores: IStores) => {
  const typeName = stores.projectChangeRequests
    .getItemById(params.projectId, params.pcrId, params.itemId)
    .then(x => x.typeName).data;

  return {
    htmlTitle: typeName ? `${typeName}` : defaultTitle,
    displayTitle: typeName ? `${typeName}` : defaultTitle,
  };
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
    return <PCRItemContainer {...props} mode="view" />;
  },
  getTitle: ({ params, stores }) => getTitle("View project change request item", params, stores),
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
  getTitle: ({ params, stores }) => getTitle("Review project change request item", params, stores),
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
  getTitle: ({ params, stores, content }) =>
    getTitle(
      content.getCopyString(x => x.pages.pcrPrepareItem.title),
      params,
      stores,
    ),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});
