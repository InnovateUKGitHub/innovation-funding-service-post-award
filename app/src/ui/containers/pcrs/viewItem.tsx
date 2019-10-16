import React from "react";

import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import { Pending } from "@shared/pending";
import { PCRDto, PCRItemDto } from "@framework/dtos/pcrDtos";
import { StoresConsumer } from "@ui/redux";
import { NavigationArrowsForPCRs } from "./navigationArrows";
import * as Items from "./items";
import { PCRItemType } from "@framework/constants";

interface Params {
  projectId: string;
  pcrId: string;
  itemId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  pcrItem: Pending<PCRItemDto>;
  isReviewing: boolean;
  editableItemTypes: Pending<PCRItemType[]>;
}

interface Callbacks {
}

class PCRViewItemComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.pcr, pcrItem: this.props.pcrItem, editableItemTypes: this.props.editableItemTypes });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.pcrItem, x.editableItemTypes)} />;
  }

  private renderContents(project: ProjectDto, pcr: PCRDto, pcrItem: PCRItemDto, editableItemTypes: PCRItemType[]) {
    const backLink = this.props.isReviewing ?
      <ACC.BackLink route={this.props.routes.pcrReview.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to review project change request</ACC.BackLink> :
      <ACC.BackLink route={this.props.routes.pcrDetails.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to project change request details</ACC.BackLink>
      ;

    return (
      <ACC.Page
        backLink={backLink}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
      >
        <ACC.Section title="Details">
          {this.renderItem(project, pcr)}
        </ACC.Section>
        <NavigationArrowsForPCRs pcr={pcr} currentItem={pcrItem} isReviewing={this.props.isReviewing} editableItemTypes={editableItemTypes} routes={this.props.routes} />
      </ACC.Page>
    );
  }

  renderItem(project: ProjectDto, pcr: PCRDto) {
    const item = pcr.items.find(x => x.id === this.props.itemId);
    if (item) {
      switch (item.type) {
        case PCRItemType.TimeExtension:
          return <Items.TimeExtensionView project={project} projectChangeRequest={pcr} projectChangeRequestItem={item} />;
        case PCRItemType.ScopeChange:
          return <Items.ScopeChangeView project={project} projectChangeRequest={pcr} projectChangeRequestItem={item} />;
        case PCRItemType.ProjectSuspension:
            return <Items.ProjectSuspensionView project={project} projectChangeRequest={pcr} projectChangeRequestItem={item} />;
        case PCRItemType.AccountNameChange:
          return <Items.NameChangeView projectChangeRequest={pcr} projectChangeRequestItem={item} />;
        case PCRItemType.MultiplePartnerFinancialVirement:
        case PCRItemType.PartnerAddition:
        case PCRItemType.PartnerWithdrawal:
        case PCRItemType.SinglePartnerFinancialVirement:
          return <Items.StandardItemView projectChangeRequest={pcr} projectChangeRequestItem={item} />;
      }
    }
    return <ACC.ValidationMessage messageType="error" message="Type not handled" />;
  }
}

const PCRViewItemContainer = (props: Params & BaseProps & { isReviewing: boolean }) => (
  <StoresConsumer>
    {
      stores => (
        <PCRViewItemComponent
          project={stores.projects.getById(props.projectId)}
          pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
          pcrItem={stores.projectChangeRequests.getItemById(props.projectId, props.pcrId, props.itemId)}
          editableItemTypes={stores.projectChangeRequests.getEditableItemTypes(props.projectId, props.pcrId)}
          isReviewing={false}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const PCRViewItemRoute = defineRoute<Params>({
  routeName: "pcrViewItem",
  routePath: "/projects/:projectId/pcrs/:pcrId/details/item/:itemId",
  container: (params) => <PCRViewItemContainer isReviewing={false} {...params} />,
  getParams: route => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId
  }),
  getTitle: (store, params, stores) => {
    const typeName = stores.projectChangeRequests.getItemById(params.projectId, params.pcrId, params.itemId).then(x => x.typeName).data;
    return {
      htmlTitle: typeName ? `View ${typeName}` : "View project change request item",
      displayTitle: typeName ? `View ${typeName}` : "View project change request item",
    };
  },
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});

export const PCRReviewItemRoute = defineRoute<Params>({
  routeName: "pcrReviewItem",
  routePath: "/projects/:projectId/pcrs/:pcrId/review/item/:itemId",
  container: (params) => <PCRViewItemContainer isReviewing={true} {...params} />,
  getParams: route => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId
  }),
  getTitle: (store, params, stores) => {
    const typeName = stores.projectChangeRequests.getItemById(params.projectId, params.pcrId, params.itemId).then(x => x.typeName).data;
    return {
      htmlTitle: typeName ? `Review ${typeName}` : "Review project change request item",
      displayTitle: typeName ? `Review ${typeName}` : "Review project change request item",
    };
  },
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer)
});
