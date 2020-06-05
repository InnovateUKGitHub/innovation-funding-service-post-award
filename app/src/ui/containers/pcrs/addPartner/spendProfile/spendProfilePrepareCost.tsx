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
import { IEditorStore, IStores, StoresConsumer } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators";
import {
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileCostDto,
  PCRSpendProfileLabourCostDto,
  PCRSpendProfileMaterialsCostDto,
  PCRSpendProfileOtherCostsDto,
  PCRSpendProfileSubcontractingCostDto,
  PCRSpendProfileTravelAndSubsCostDto
} from "@framework/dtos/pcrSpendProfileDto";
import { CostCategoryType } from "@framework/entities";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import {
  PCRBaseCostDtoValidator,
  PCRCapitalUsageCostDtoValidator,
  PCRLabourCostDtoValidator,
  PCRMaterialsCostDtoValidator,
  PCROtherCostsDtoValidator,
  PCRSpendProfileCostDtoValidator,
  PCRSubcontractingCostDtoValidator,
  PCRTravelAndSubsCostDtoValidator
} from "@ui/validators/pcrSpendProfileDtoValidator";
import { LabourFormComponent } from "@ui/containers/pcrs/addPartner/spendProfile/labourFormComponent";
import { MaterialsFormComponent } from "@ui/containers/pcrs/addPartner/spendProfile/materialsFormComponent";
import { CapitalUsageFormComponent } from "./capitalUsageFormComponent";
import { SubcontractingFormComponent } from "@ui/containers/pcrs/addPartner/spendProfile/subcontractingFormComponent";
import { TravelAndSubsFormComponent } from "./travelAndSubsFormComponent";
import { OtherCostsFormComponent } from "./otherCostsFormComponent";

export interface PcrAddSpendProfileCostParams {
  projectId: string;
  pcrId: string;
  itemId: string;
  costCategoryId: string;
}

export interface PcrEditSpendProfileCostParams extends PcrAddSpendProfileCostParams {
  costId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  costCategory: Pending<CostCategoryDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
  validator: Pending<PCRSpendProfileCostDtoValidator | undefined>;
  cost: Pending<PCRSpendProfileCostDto>;
}

interface Callbacks {
  onChange: (dto: PCRDto) => void;
  onSave: (dto: PCRDto, link: ILinkInfo) => void;
}

export interface SpendProfileCostFormProps<T extends PCRSpendProfileCostDto, V extends PCRBaseCostDtoValidator<T>> {
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
  validator: V;
  isClient: boolean;
  onChange: (dto: PCRDto) => void;
  onSave: (dto: PCRDto) => void;
  data: T;
  costCategory: CostCategoryDto;
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

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.editor, x.costCategory, x.validator, x.cost)}/>;
  }

  private renderContents(project: ProjectDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, costCategory: CostCategoryDto, validator: PCRSpendProfileCostDtoValidator | undefined, cost: PCRSpendProfileCostDto) {
    return (
      <ACC.Page
        backLink={(
          <ACC.BackLink
            route={this.props.routes.pcrSpendProfileCostsSummary.getLink({
              itemId: this.props.itemId,
              pcrId: this.props.pcrId,
              projectId: this.props.projectId,
              costCategoryId: this.props.costCategoryId
            })}
          >
            <ACC.Content value={x => x.pcrSpendProfilePrepareCostContent.backLink(costCategory.name)}/>
          </ACC.BackLink>
        )}
        pageTitle={<ACC.Projects.Title project={project}/>}
        project={project}
        validator={validator}
        error={editor.error}
      >
        <ACC.Renderers.Messages messages={this.props.messages}/>
        <ACC.Section titleContent={x => x.pcrSpendProfilePrepareCostContent.costSectionTitle(costCategory.name)}>
          {this.renderForm(costCategory, editor, validator, cost)}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private onSave(dto: PCRDto) {
    const item = dto.items.find(x => x.id === this.props.itemId)!;
    // If submitting from a step set the status to incomplete
    item.status = PCRItemStatus.Incomplete;
    return this.props.onSave(dto, this.props.routes.pcrSpendProfileCostsSummary.getLink({
      projectId: this.props.projectId,
      pcrId: this.props.pcrId,
      itemId: this.props.itemId,
      costCategoryId: this.props.costCategoryId
    }));
  }

  private renderForm(costCategory: CostCategoryDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, validator: PCRSpendProfileCostDtoValidator | undefined, cost: PCRSpendProfileCostDto) {
    const props = {
      editor,
      isClient: this.props.isClient,
      onSave: (x: PCRDto) => this.onSave(x),
      onChange: (x: PCRDto) => this.props.onChange(x),
      costCategory,
    };
    switch (costCategory.type) {
      case CostCategoryType.Labour: return <LabourFormComponent {...props} data={cost as PCRSpendProfileLabourCostDto} validator={validator as PCRLabourCostDtoValidator}/>;
      case CostCategoryType.Materials: return <MaterialsFormComponent {...props} data={cost as PCRSpendProfileMaterialsCostDto} validator={validator as PCRMaterialsCostDtoValidator}/>;
      case CostCategoryType.Subcontracting: return <SubcontractingFormComponent {...props} data={cost as PCRSpendProfileSubcontractingCostDto} validator={validator as PCRSubcontractingCostDtoValidator}/>;
      case CostCategoryType.Capital_Usage: return <CapitalUsageFormComponent {...props} data={cost as PCRSpendProfileCapitalUsageCostDto} validator={validator as PCRCapitalUsageCostDtoValidator}/>;
      case CostCategoryType.Travel_And_Subsistence: return <TravelAndSubsFormComponent {...props} data={cost as PCRSpendProfileTravelAndSubsCostDto} validator={validator as PCRTravelAndSubsCostDtoValidator}/>;
      case CostCategoryType.Other_Costs: return <OtherCostsFormComponent {...props} data={cost as PCRSpendProfileOtherCostsDto} validator={validator as PCROtherCostsDtoValidator}/>;
      default: return null;
    }
  }
}

const onSave = (stores: IStores, dto: PCRDto, projectId: string, link: ILinkInfo) => {
  stores.messages.clearMessages();
  stores.projectChangeRequests.updatePcrEditor(true, projectId, dto, undefined, () =>
    stores.navigation.navigateTo(link));
};

const ContainerAdd = (props: PcrAddSpendProfileCostParams & BaseProps) => (
  <StoresConsumer>
    {stores => {
      const costCategoryPending = stores.costCategories.get(props.costCategoryId);
      const editorPending = costCategoryPending.chain(costCategory => stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId, (dto) => {
        const addPartner = dto.items.find(x => x.type === PCRItemType.PartnerAddition) as PCRItemForPartnerAdditionDto;
        const costs = addPartner.spendProfile.costs;
        const cost = stores.projectChangeRequests.getInitialSpendProfileCost(costCategory);
        costs.push(cost);
      }));
      return (
        <Component
          project={stores.projects.getById(props.projectId)}
          costCategory={costCategoryPending}
          editor={editorPending}
          cost={editorPending.then(editor => {
            const addPartnerItem = editor.data.items.find(x => x.id === props.itemId && x.type === PCRItemType.PartnerAddition) as PCRItemForPartnerAdditionDto;
            const costs = addPartnerItem.spendProfile.costs.filter(x => x.costCategoryId === props.costCategoryId);
            return costs.find(x => !x.id)!;
          })}
          validator={stores.projectChangeRequests.getNewSpendProfileCostValidator(editorPending, props.itemId, costCategoryPending)}
          onSave={(dto, link) => onSave(stores, dto, props.projectId, link)}
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

const ContainerEdit = (props: PcrEditSpendProfileCostParams & BaseProps) => (
  <StoresConsumer>
    {stores => {
      const costCategoryPending = stores.costCategories.get(props.costCategoryId);
      const editorPending = stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId);
      return (
        <Component
          project={stores.projects.getById(props.projectId)}
          costCategory={costCategoryPending}
          editor={editorPending}
          cost={editorPending.then(editor => {
            const addPartnerItem = editor.data.items.find(x => x.id === props.itemId && x.type === PCRItemType.PartnerAddition) as PCRItemForPartnerAdditionDto;
            return addPartnerItem.spendProfile.costs.find(x => x.id === props.costId)!;
          })}
          validator={stores.projectChangeRequests.getSpendProfileCostValidator(editorPending, props.itemId, props.costId)}
          onSave={(dto, link) => onSave(stores, dto, props.projectId, link)}
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
  container: (props) => <ContainerAdd {...props} />,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId,
    costCategoryId: route.params.costCategoryId,
  }),
  getTitle: ({ params, stores, content }) => content.pcrSpendProfilePrepareCostContent.title(),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});

export const PCRSpendProfileEditCostRoute = defineRoute<PcrEditSpendProfileCostParams>({
  routeName: "pcrPrepareSpendProfileEditCost",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/spendProfile/:costCategoryId/cost/:costId",
  container: (props) => <ContainerEdit {...props} />,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId,
    costCategoryId: route.params.costCategoryId,
    costId: route.params.costId
  }),
  getTitle: ({ params, stores, content }) => content.pcrSpendProfilePrepareCostContent.title(),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
