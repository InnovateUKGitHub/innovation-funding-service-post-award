import React from "react";
import { BaseProps, ContainerBase } from "../containerBase";
import { ProjectDto } from "@framework/types";
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

    return <ACC.Loader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.pcrItem, x.editableItemTypes)} />;
  }

  private renderContents(project: ProjectDto, pcr: PCRDto, pcrItem: PCRItemDto, editableItemTypes: PCRItemType[]) {
    return (
      <React.Fragment>
        {this.renderItem(project, pcr)}
        <NavigationArrowsForPCRs pcr={pcr} currentItem={pcrItem} isReviewing={this.props.isReviewing} editableItemTypes={editableItemTypes} routes={this.props.routes} />
      </React.Fragment>
    );
  }

  renderItem(project: ProjectDto, pcr: PCRDto) {
    const item = pcr.items.find(x => x.id === this.props.itemId);
    if (item) {
      switch (item.type) {
        case PCRItemType.TimeExtension:
          return <Items.TimeExtensionView project={project} projectChangeRequest={pcr} projectChangeRequestItem={item} />;
        case PCRItemType.ScopeChange:
          return <Items.ScopeChangeView projectChangeRequest={pcr} projectChangeRequestItem={item} />;
        case PCRItemType.ProjectSuspension:
          return <Items.ProjectSuspensionView project={project} projectChangeRequest={pcr} projectChangeRequestItem={item} />;
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

export const PCRViewItemContainer = (props: Params & BaseProps & { isReviewing: boolean }) => (
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
