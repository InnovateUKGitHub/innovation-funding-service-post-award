import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { IStores, useStores } from "@ui/redux/storesProvider";
import { useNavigate } from "react-router-dom";
import { usePcrItemWorkflowQuery } from "./pcrItemWorkflow.logic";
import { PcrWorkflow, WorkflowPcrType } from "./pcrWorkflow";
import { PCRStepType } from "@framework/constants/pcrConstants";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Pending } from "@shared/pending";
import { PageLoader } from "@ui/components/bjss/loading";
import { ProjectRole } from "@framework/constants/project";
import { PCRItemWorkflowMigratedForGql } from "./pcrItemWorkflowMigrated";
import { PCRItemWorkflow } from "./pcrItemWorkflow";
import { useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { pcrItemWorkflowQuery } from "./PcrItemWorkflow.query";

export interface ProjectChangeRequestPrepareItemParams {
  projectId: ProjectId;
  pcrId: PcrId;
  itemId: PcrItemId;
  step?: number;
}

export type Mode = "prepare" | "review" | "view";

export const PCRItemContainer = (props: ProjectChangeRequestPrepareItemParams & BaseProps & { mode: Mode }) => {
  const stores = useStores();
  const navigate = useNavigate();

  const [refreshedQueryOptions, refresh] = useRefreshQuery(pcrItemWorkflowQuery, {
    projectId: props.projectId,
    pcrId: props.pcrId,
    pcrItemId: props.itemId,
  });

  const data = usePcrItemWorkflowQuery(props.projectId, props.pcrId, props.itemId, refreshedQueryOptions);

  const workflow = PcrWorkflow.getWorkflow(data.pcrItem as WorkflowPcrType, props.step);

  if (workflow?.isMigratedToGql) {
    return (
      <PCRItemWorkflowMigratedForGql
        project={data.project}
        pcrItem={data.pcrItem}
        fragmentRef={data.fragmentRef}
        refreshItemWorkflowQuery={refresh}
        {...props}
      />
    );
  }

  const combined = Pending.combine({
    project: stores.projects.getById(props.projectId),
    partners: stores.partners.getPartnersForProject(props.projectId),
    virement: stores.financialVirements.get(props.projectId, props.pcrId, props.itemId),
    pcr: stores.projectChangeRequests.getById(props.projectId, props.pcrId),
    pcrItem: stores.projectChangeRequests.getItemById(props.projectId, props.pcrId, props.itemId),
    pcrItemType: stores.projectChangeRequests.getPcrTypeForItem(props.projectId, props.pcrId, props.itemId),
    editor: stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId),
    documentsEditor: stores.projectChangeRequestDocuments.getPcrOrPcrItemDocumentsEditor(props.projectId, props.itemId),
    editableItemTypes: stores.projectChangeRequests.getEditableItemTypes(props.projectId, props.pcrId),
  });

  const onSave = ({
    dto,
    pcrStepType = PCRStepType.none,
    link,
  }: {
    dto: PCRDto;
    pcrStepType?: PCRStepType;
    link: ILinkInfo;
  }) => {
    stores.messages.clearMessages();
    stores.projectChangeRequests.updatePcrEditor({
      saving: true,
      projectId: props.projectId,
      pcrStepType,
      pcrStepId: props.itemId,
      dto,
      onComplete: () => {
        navigate(link.path);
      },
    });
  };

  const onChange = ({ dto, pcrStepType = PCRStepType.none }: { dto: PCRDto; pcrStepType?: PCRStepType }) => {
    stores.messages.clearMessages();
    stores.projectChangeRequests.updatePcrEditor({
      saving: false,
      projectId: props.projectId,
      pcrStepType,
      pcrStepId: props.itemId,
      dto,
    });
  };

  return (
    <PageLoader
      pending={combined}
      render={x => <PCRItemWorkflow onChange={onChange} onSave={onSave} {...props} {...x} />}
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
