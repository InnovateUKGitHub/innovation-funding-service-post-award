import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import {
  PCRItemForPartnerAdditionDto,
  PCRItemStatus,
  PCRItemType,
  ProjectDto,
  ProjectRole
} from "@framework/types";
import * as ACC from "@ui/components";
import { Pending } from "@shared/pending";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators";
import {
  PCRSpendProfileCostDto,
  PCRSpendProfileLabourCostDto
} from "@framework/dtos/pcrSpendProfileDto";
import { CostCategoryType } from "@framework/entities";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { PcrAddSpendProfileCostParams } from "./spendProfilePrepareCost";
import { DeleteLabourCostFormComponent } from "./deleteLabourCostFormComponent";

export interface PcrDeleteSpendProfileCostParams extends PcrAddSpendProfileCostParams {
  costId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  costCategory: Pending<CostCategoryDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
  cost: Pending<PCRSpendProfileCostDto>;
 }

interface Callbacks {
  onDelete: (dto: PCRDto, projectId: string) => void;
}

class Component extends ContainerBase<PcrAddSpendProfileCostParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      costCategory: this.props.costCategory,
      editor: this.props.editor,
      cost: this.props.cost,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.editor, x.costCategory, x.cost)} />;
  }

  private renderContents(project: ProjectDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, costCategory: CostCategoryDto, cost: PCRSpendProfileCostDto) {
    const DeleteForm = ACC.TypedForm<PCRSpendProfileCostDto>();
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.pcrSpendProfileCostsSummary.getLink({itemId: this.props.itemId, pcrId: this.props.pcrId, projectId: this.props.projectId, costCategoryId: this.props.costCategoryId})}>{`Back to ${costCategory.name.toLowerCase()} costs`}</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        error={editor.error}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />
        <ACC.Section>
          <DeleteForm.Form data={cost} qa="pcrDelete">
            <DeleteForm.Hidden
              name="id"
              value={dto => dto ? dto.id : ""}
            />
            {cost && this.renderComponent(costCategory, cost)}
            <DeleteForm.Button name="delete" styling="Warning" onClick={() => this.props.onDelete(editor.data, this.props.projectId)}>Delete cost</DeleteForm.Button>
          </DeleteForm.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderComponent(costCategory: CostCategoryDto, cost: PCRSpendProfileCostDto) {
    // tslint:disable-next-line:no-small-switch
    switch(costCategory.type) {
      case CostCategoryType.Labour: return this.renderDeleteLabourComponent(cost as PCRSpendProfileLabourCostDto);
      default: return null;
    }
  }

  private renderDeleteLabourComponent(cost: PCRSpendProfileLabourCostDto) {
    return (
      <DeleteLabourCostFormComponent data={cost} />
    );
  }
}

const Container = (props: PcrDeleteSpendProfileCostParams & BaseProps) => (
  <StoresConsumer>
    {stores => {
      const costCategoryPending = stores.costCategories.get(props.costCategoryId);
      const dtoPending = stores.projectChangeRequests.getById(props.projectId, props.pcrId);
      return (
        <Component
          project={stores.projects.getById(props.projectId)}
          costCategory={costCategoryPending}
          editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId)}
          cost={dtoPending.then(dto => {
            const addPartnerItem = dto.items.find(x => x.id === props.itemId && x.type === PCRItemType.PartnerAddition) as PCRItemForPartnerAdditionDto;
            return addPartnerItem.spendProfile.costs.find(x => x.id === props.costId) as PCRSpendProfileCostDto;
          })}
          onDelete={(dto, projectId) => {
            const item = dto.items.find(x => x.id === props.itemId && x.type === PCRItemType.PartnerAddition) as PCRItemForPartnerAdditionDto;
            const costIndex = item.spendProfile.costs.findIndex(x => x.id === props.costId);
            if (costIndex > -1) {
              item.spendProfile.costs.splice(costIndex, 1);
            }
            // If submitting from a step set the status to incomplete
            item.status = PCRItemStatus.Incomplete;
            stores.messages.clearMessages();
            stores.projectChangeRequests.updatePcrEditor(true, projectId, dto, "You have deleted a cost", () =>
              stores.navigation.navigateTo(props.routes.pcrSpendProfileCostsSummary.getLink({
                projectId: props.projectId,
                pcrId: props.pcrId,
                itemId: props.itemId,
                costCategoryId: props.costCategoryId
              }))
            );
          }}
          {...props}
        />
      );
    }}
  </StoresConsumer>
);

export const PCRSpendProfileDeleteCostRoute = defineRoute<PcrDeleteSpendProfileCostParams>({
  routeName: "pcrPrepareSpendProfileDeleteCost",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/spendProfile/:costCategoryId/cost/:costId/delete",
  container: (props) => <Container {...props} />,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId,
    costCategoryId: route.params.costCategoryId,
    costId: route.params.costId
  }),
  getTitle: ({ params, stores }) => ({displayTitle: "Add partner", htmlTitle: "Add partner"}),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
