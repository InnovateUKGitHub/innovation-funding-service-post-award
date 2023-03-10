import { useNavigate, NavigateFunction } from "react-router-dom";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import {
  CostCategoryItem,
  CostCategoryList,
  CostCategoryType,
  ILinkInfo,
  PCRItemForPartnerAdditionDto,
  PCRItemStatus,
  PCRItemType,
  ProjectDto,
  ProjectRole,
  CostCategoryGroupType,
} from "@framework/types";
import * as ACC from "@ui/components";
import { Pending } from "@shared/pending";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { IEditorStore, IStores, useStores } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators";
import {
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileCostDto,
  PCRSpendProfileLabourCostDto,
  PCRSpendProfileMaterialsCostDto,
  PCRSpendProfileOtherCostsDto,
  PCRSpendProfileOverheadsCostDto,
  PCRSpendProfileSubcontractingCostDto,
  PCRSpendProfileTravelAndSubsCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import {
  PCRBaseCostDtoValidator,
  PCRCapitalUsageCostDtoValidator,
  PCRLabourCostDtoValidator,
  PCRMaterialsCostDtoValidator,
  PCROtherCostsDtoValidator,
  PCROverheadsCostDtoValidator,
  PCRSpendProfileCostDtoValidator,
  PCRSubcontractingCostDtoValidator,
  PCRTravelAndSubsCostDtoValidator,
} from "@ui/validators/pcrSpendProfileDtoValidator";
import { PcrWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { AddPartnerStepNames } from "@ui/containers/pcrs/addPartner/addPartnerWorkflow";
import {
  CapitalUsageFormComponent,
  LabourFormComponent,
  MaterialsFormComponent,
  OtherCostsFormComponent,
  OverheadsFormComponent,
  SubcontractingFormComponent,
  TravelAndSubsFormComponent,
} from "@ui/containers/pcrs/addPartner/spendProfile";
import { IRoutes } from "@ui/routing";

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
  onChange: (dto: PCRDto) => void;
  onSave: (dto: PCRDto, redirectLink?: ILinkInfo) => void;
  data: T;
  costCategory: CostCategoryDto;
  routes: IRoutes;
  params: PcrAddSpendProfileCostParams;
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

    return (
      <ACC.PageLoader
        pending={combined}
        render={x =>
          this.renderContents(x.project, x.editor, x.costCategory, x.validator, x.cost, this.props.routes, {
            projectId: this.props.projectId,
            pcrId: this.props.pcrId,
            itemId: this.props.itemId,
            costCategoryId: this.props.costCategoryId,
          })
        }
      />
    );
  }

  private renderContents(
    project: ProjectDto,
    editor: IEditorStore<PCRDto, PCRDtoValidator>,
    costCategory: CostCategoryDto,
    validator: PCRSpendProfileCostDtoValidator | undefined,
    cost: PCRSpendProfileCostDto,
    routes: IRoutes,
    params: PcrAddSpendProfileCostParams,
  ) {
    const costCategoryType = new CostCategoryList(project.competitionType).fromId(costCategory.type);
    return (
      <ACC.Page
        backLink={
          <ACC.BackLink route={this.getBackLink(cost, editor.data)}>
            <ACC.Content
              value={x => x.pages.pcrSpendProfilePrepareCost.backLink({ costCategoryName: costCategory.name })}
            />
          </ACC.BackLink>
        }
        pageTitle={<ACC.Projects.Title {...project} />}
        project={project}
        validator={validator}
        error={editor.error}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />
        <ACC.Section
          title={x => x.pages.pcrSpendProfilePrepareCost.sectionTitleCost({ costCategoryName: costCategory.name })}
        >
          {this.renderGuidance(costCategoryType)}
          {this.renderForm(costCategory, costCategoryType, editor, validator, cost, routes, params)}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderGuidance(costCategory: CostCategoryItem) {
    if (costCategory.id === CostCategoryType.Overheads) {
      return (
        <ACC.Info
          summary={
            <ACC.Content
              value={x => x.pages.pcrSpendProfilePrepareCost.guidanceTitle({ costCategoryName: costCategory.name })}
            />
          }
        >
          <ACC.Content markdown value={costCategory.guidanceMessageKey} />
        </ACC.Info>
      );
    }
    return null;
  }

  private getBackLink(cost: PCRSpendProfileCostDto, pcrDto: PCRDto) {
    // If on the overheads costs page then jump straight back to the add partner spend profile step
    if (cost?.costCategory === CostCategoryType.Overheads) {
      const pcrItem = pcrDto.items.find(x => x.type === PCRItemType.PartnerAddition) as PCRItemForPartnerAdditionDto;
      return this.props.routes.pcrPrepareItem.getLink({
        itemId: pcrItem.id,
        pcrId: pcrDto.id,
        projectId: pcrDto.projectId,
        step: this.getSpendProfileStep(pcrItem) || undefined,
      });
    }

    // For all other cost categories go to the summary page
    return this.props.routes.pcrSpendProfileCostsSummary.getLink({
      itemId: this.props.itemId,
      pcrId: this.props.pcrId,
      projectId: this.props.projectId,
      costCategoryId: this.props.costCategoryId,
    });
  }

  private getSpendProfileStep(addPartnerItem: PCRItemForPartnerAdditionDto) {
    const workflow = PcrWorkflow.getWorkflow(addPartnerItem, undefined);
    if (!workflow) return null;
    const stepName: AddPartnerStepNames = "spendProfileStep";
    return workflow.findStepNumberByName(stepName);
  }

  private onSave(dto: PCRDto, cost: PCRSpendProfileCostDto, redirectLink?: ILinkInfo) {
    const item = dto.items.find(x => x.id === this.props.itemId);
    if (!item) throw new Error(`Cannot find item matching ${this.props.itemId}`);
    // If submitting from a step set the status to incomplete
    item.status = PCRItemStatus.Incomplete;
    return !redirectLink ? this.props.onSave(dto, this.getBackLink(cost, dto)) : this.props.onSave(dto, redirectLink);
  }

  private renderForm(
    costCategory: CostCategoryDto,
    costCategoryType: CostCategoryItem,
    editor: IEditorStore<PCRDto, PCRDtoValidator>,
    validator: PCRSpendProfileCostDtoValidator | undefined,
    cost: PCRSpendProfileCostDto,
    routes: IRoutes,
    params: PcrAddSpendProfileCostParams,
  ) {
    const props = {
      editor,
      onSave: (x: PCRDto, redirectLink?: ILinkInfo) => this.onSave(x, cost, redirectLink || undefined),
      onChange: (x: PCRDto) => this.props.onChange(x),
      costCategory,
      routes,
      params,
    };

    switch (costCategoryType.group) {
      case CostCategoryGroupType.Labour:
        return (
          <LabourFormComponent
            {...props}
            data={cost as PCRSpendProfileLabourCostDto}
            validator={validator as PCRLabourCostDtoValidator}
          />
        );
      case CostCategoryGroupType.Overheads:
        return (
          <OverheadsFormComponent
            {...props}
            data={cost as PCRSpendProfileOverheadsCostDto}
            validator={validator as PCROverheadsCostDtoValidator}
          />
        );
      case CostCategoryGroupType.Materials:
        return (
          <MaterialsFormComponent
            {...props}
            data={cost as PCRSpendProfileMaterialsCostDto}
            validator={validator as PCRMaterialsCostDtoValidator}
          />
        );
      case CostCategoryGroupType.Subcontracting:
        return (
          <SubcontractingFormComponent
            {...props}
            data={cost as PCRSpendProfileSubcontractingCostDto}
            validator={validator as PCRSubcontractingCostDtoValidator}
          />
        );
      case CostCategoryGroupType.Capital_Usage:
        return (
          <CapitalUsageFormComponent
            {...props}
            data={cost as PCRSpendProfileCapitalUsageCostDto}
            validator={validator as PCRCapitalUsageCostDtoValidator}
          />
        );
      case CostCategoryGroupType.Travel_And_Subsistence:
        return (
          <TravelAndSubsFormComponent
            {...props}
            data={cost as PCRSpendProfileTravelAndSubsCostDto}
            validator={validator as PCRTravelAndSubsCostDtoValidator}
          />
        );
      case CostCategoryGroupType.Other_Costs:
        return (
          <OtherCostsFormComponent
            {...props}
            data={cost as PCRSpendProfileOtherCostsDto}
            validator={validator as PCROtherCostsDtoValidator}
          />
        );
      default:
        return null;
    }
  }
}

const onSave = (stores: IStores, dto: PCRDto, projectId: string, link: ILinkInfo, navigate: NavigateFunction) => {
  stores.messages.clearMessages();
  stores.projectChangeRequests.updatePcrEditor(true, projectId, dto, undefined, () => navigate(link.path));
};

const ContainerAdd = (props: PcrAddSpendProfileCostParams & BaseProps) => {
  const navigate = useNavigate();
  const stores = useStores();

  const costCategoryPending = stores.costCategories.get(props.costCategoryId);
  const editorPending = costCategoryPending.chain(costCategory =>
    stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId, dto => {
      const addPartner = dto.items.find(x => x.type === PCRItemType.PartnerAddition) as PCRItemForPartnerAdditionDto;
      const costs = addPartner.spendProfile.costs;
      const cost = stores.projectChangeRequests.getInitialSpendProfileCost(costCategory);
      costs.push(cost);
    }),
  );

  return (
    <Component
      {...props}
      project={stores.projects.getById(props.projectId)}
      costCategory={costCategoryPending}
      editor={editorPending}
      cost={editorPending.then(editor => {
        const addPartnerItem = editor.data.items.find(
          x => x.id === props.itemId && x.type === PCRItemType.PartnerAddition,
        ) as PCRItemForPartnerAdditionDto;
        const costs = addPartnerItem.spendProfile.costs.filter(x => x.costCategoryId === props.costCategoryId);
        return costs.find(x => !x.id) as PCRSpendProfileCostDto;
      })}
      validator={stores.projectChangeRequests.getNewSpendProfileCostValidator(
        editorPending,
        props.itemId,
        costCategoryPending,
      )}
      onSave={(dto, link) => onSave(stores, dto, props.projectId, link, navigate)}
      onChange={dto => {
        stores.messages.clearMessages();
        stores.projectChangeRequests.updatePcrEditor(false, props.projectId, dto);
      }}
    />
  );
};

const ContainerEdit = (props: PcrEditSpendProfileCostParams & BaseProps) => {
  const navigate = useNavigate();
  const stores = useStores();

  const costCategoryPending = stores.costCategories.get(props.costCategoryId);
  const editorPending = stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId);

  return (
    <Component
      {...props}
      project={stores.projects.getById(props.projectId)}
      costCategory={costCategoryPending}
      editor={editorPending}
      cost={editorPending.then(editor => {
        const addPartnerItem = editor.data.items.find(
          x => x.id === props.itemId && x.type === PCRItemType.PartnerAddition,
        ) as PCRItemForPartnerAdditionDto;
        return addPartnerItem.spendProfile.costs.find(x => x.id === props.costId) as PCRSpendProfileCostDto;
      })}
      validator={stores.projectChangeRequests.getSpendProfileCostValidator(editorPending, props.itemId, props.costId)}
      onSave={(dto, link) => onSave(stores, dto, props.projectId, link, navigate)}
      onChange={dto => {
        stores.messages.clearMessages();
        stores.projectChangeRequests.updatePcrEditor(false, props.projectId, dto);
      }}
    />
  );
};

export const PCRSpendProfileAddCostRoute = defineRoute<PcrAddSpendProfileCostParams>({
  routeName: "pcrPrepareSpendProfileAddCost",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/spendProfile/:costCategoryId/cost",
  container: ContainerAdd,
  getParams: route => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId,
    costCategoryId: route.params.costCategoryId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrSpendProfilePrepareCost.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});

export const PCRSpendProfileEditCostRoute = defineRoute<PcrEditSpendProfileCostParams>({
  routeName: "pcrPrepareSpendProfileEditCost",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/spendProfile/:costCategoryId/cost/:costId",
  container: ContainerEdit,
  getParams: route => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId,
    costCategoryId: route.params.costCategoryId,
    costId: route.params.costId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrSpendProfilePrepareCost.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});
