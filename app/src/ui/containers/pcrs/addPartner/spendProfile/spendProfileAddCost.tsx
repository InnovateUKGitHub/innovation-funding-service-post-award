import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import {
  ILinkInfo,
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
import { PCRLabourCostDtoValidator, PCRSpendProfileCostDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";
import { LabourFormComponent } from "@ui/containers/pcrs/addPartner/spendProfile/labourFormComponent";

export interface PcrAddSpendProfileCostParams {
  projectId: string;
  pcrId: string;
  itemId: string;
  costCategoryId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  costCategory: Pending<CostCategoryDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
  validator: Pending<PCRSpendProfileCostDtoValidator>;
  cost: Pending<PCRSpendProfileCostDto>;
 }

interface Callbacks {
  onChange: (dto: PCRDto) => void;
  onSave: (dto: PCRDto, link: ILinkInfo) => void;
}

class Component extends ContainerBase<PcrAddSpendProfileCostParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      costCategory: this.props.costCategory,
      editor: this.props.editor,
      validator: this.props.validator,
      cost: this.props.cost,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.editor, x.costCategory, x.validator, x.cost)} />;
  }

  private renderContents(project: ProjectDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, costCategory: CostCategoryDto, validator: PCRSpendProfileCostDtoValidator, cost: PCRSpendProfileCostDto) {
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.pcrPrepareSpendProfileCosts.getLink({itemId: this.props.itemId, pcrId: this.props.pcrId, projectId: this.props.projectId, costCategoryId: this.props.costCategoryId})}>Back to costs</ACC.BackLink>} // TODO customise for cost category
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        validator={validator}
        error={editor.error}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />
        {this.renderForm(costCategory, editor, validator, cost)}
      </ACC.Page>
    );
  }

  private onSave(dto: PCRDto) {
    const item = dto.items.find(x => x.id === this.props.itemId)!;
    // If submitting from a step set the status to incomplete
    item.status = PCRItemStatus.Incomplete;
    return this.props.onSave(dto, this.props.routes.pcrPrepareSpendProfileCosts.getLink({
      projectId: this.props.projectId,
      pcrId: this.props.pcrId,
      itemId: this.props.itemId,
      costCategoryId: this.props.costCategoryId
    }));
  }

  private renderForm(costCategory: CostCategoryDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, validator: PCRSpendProfileCostDtoValidator, cost: PCRSpendProfileCostDto) {
    // tslint:disable-next-line:no-small-switch
    switch(costCategory.type) {
      case CostCategoryType.Labour: return this.renderLabourForm(editor, validator, cost as PCRSpendProfileLabourCostDto);
      default: return null;
    }
  }

  private renderLabourForm(editor: IEditorStore<PCRDto, PCRDtoValidator>, validator: PCRLabourCostDtoValidator, cost: PCRSpendProfileLabourCostDto) {
    return (
      <LabourFormComponent
        editor={editor}
        validator={validator}
        isClient={this.props.isClient}
        onSave={x => this.onSave(x)}
        onChange={x => this.props.onChange(x)}
        data={cost}
      />
    );
  }
}

const Container = (props: PcrAddSpendProfileCostParams & BaseProps) => (
  <StoresConsumer>
    {stores => {
      const costCategoryPending = stores.costCategories.get(props.costCategoryId);
      const editorPending = stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId, (dto) => {
        if (!costCategoryPending.data) return;
        const addPartner = dto.items.find(x => x.type === PCRItemType.PartnerAddition) as PCRItemForPartnerAdditionDto;
        const costs = addPartner.spendProfile.costs;
        costs.push(stores.projectChangeRequests.getInitialSpendProfileCost(costCategoryPending.data));
      });
      return (
        <Component
          project={stores.projects.getById(props.projectId)}
          costCategory={costCategoryPending}
          editor={editorPending}
          cost={editorPending.then(editor => {
            const addPartnerItem = editor.data.items.find(x => x.id === props.itemId && x.type === PCRItemType.PartnerAddition) as PCRItemForPartnerAdditionDto;
            const costs = addPartnerItem.spendProfile.costs.filter(x => x.costCategory === CostCategoryType.Labour) as PCRSpendProfileLabourCostDto[];
            return costs.find(x => x.id === null)!;
          })}
          validator={stores.projectChangeRequests.getNewSpendProfileCostValidator(editorPending, props.itemId, costCategoryPending)}
          onSave={(dto, link) => {
            stores.messages.clearMessages();
            stores.projectChangeRequests.updatePcrEditor(true, props.projectId, dto, undefined, () =>
              stores.navigation.navigateTo(link));
          }}
          onChange={(dto) => {
            stores.messages.clearMessages();
            stores.projectChangeRequests.updatePcrEditor(false, props.projectId, dto);
          }}
          {...props}
        />
      );
    }}
  </StoresConsumer>
);

export const PCRSpendProfileAddCostRoute = defineRoute<PcrAddSpendProfileCostParams>({
  routeName: "pcrPrepareSpendProfileAddCost",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/spendProfile/:costCategoryId/cost",
  container: (props) => <Container {...props} />,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId,
    costCategoryId: route.params.costCategoryId,
  }),
  getTitle: ({ params, stores }) => ({displayTitle: "Add partner", htmlTitle: "Add partner"}),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
