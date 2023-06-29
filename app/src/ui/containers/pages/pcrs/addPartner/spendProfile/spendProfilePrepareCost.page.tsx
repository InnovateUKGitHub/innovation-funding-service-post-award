import { CostCategoryGroupType, CostCategoryType } from "@framework/constants/enums";
import { PCRItemStatus, PCRItemType, PCRStepId } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { PCRDto, PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
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
import { ProjectDto } from "@framework/dtos/projectDto";
import { CostCategoryItem, CostCategoryList } from "@framework/types/CostCategory";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Pending } from "@shared/pending";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Info } from "@ui/components/atomicDesign/atoms/Details/Details";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { PageLoader } from "@ui/components/bjss/loading";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { AddPartnerStepNames } from "@ui/containers/pages/pcrs/addPartner/addPartnerWorkflow";
import { PcrWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { IStores, useStores } from "@ui/redux/storesProvider";
import { IRoutes } from "@ui/routing/routeConfig";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
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
} from "@ui/validation/validators/pcrSpendProfileDtoValidator";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { CapitalUsageFormComponent } from "./capitalUsageFormComponent";
import { LabourFormComponent } from "./labourFormComponent";
import { MaterialsFormComponent } from "./materialsFormComponent";
import { OtherCostsFormComponent } from "./otherCostsFormComponent";
import { OverheadsFormComponent } from "./overheadsFormComponent";
import { SubcontractingFormComponent } from "./subcontractingFormComponent";
import { TravelAndSubsFormComponent } from "./travelAndSubsFormComponent";

export interface PcrAddSpendProfileCostParams {
  projectId: ProjectId;
  pcrId: PcrId;
  itemId: PcrItemId;
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
      <PageLoader
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
      <Page
        backLink={
          <BackLink route={this.getBackLink(cost, editor.data)}>
            <Content
              value={x => x.pages.pcrSpendProfilePrepareCost.backLink({ costCategoryName: costCategory.name })}
            />
          </BackLink>
        }
        pageTitle={<Title {...project} />}
        project={project}
        validator={validator}
        error={editor.error}
      >
        <Messages messages={this.props.messages} />
        <Section
          title={x => x.pages.pcrSpendProfilePrepareCost.sectionTitleCost({ costCategoryName: costCategory.name })}
        >
          {this.renderGuidance(costCategoryType)}
          {this.renderForm(costCategory, costCategoryType, editor, validator, cost, routes, params)}
        </Section>
      </Page>
    );
  }

  private renderGuidance(costCategory: CostCategoryItem) {
    if (costCategory.id === CostCategoryType.Overheads) {
      return (
        <Info
          summary={
            <Content
              value={x => x.pages.pcrSpendProfilePrepareCost.guidanceTitle({ costCategoryName: costCategory.name })}
            />
          }
        >
          <Content markdown value={costCategory.guidanceMessageKey} />
        </Info>
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
    const stepName: AddPartnerStepNames = PCRStepId.spendProfileStep;
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

const onSave = (stores: IStores, dto: PCRDto, projectId: ProjectId, link: ILinkInfo, navigate: NavigateFunction) => {
  stores.messages.clearMessages();
  stores.projectChangeRequests.updatePcrEditor({
    saving: true,
    projectId,
    pcrStepId: PCRStepId.spendProfileStep,
    dto,
    message: undefined,
    onComplete: () => navigate(link.path),
  });
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
        stores.projectChangeRequests.updatePcrEditor({
          saving: false,
          projectId: props.projectId,
          pcrStepId: PCRStepId.spendProfileStep,
          dto,
        });
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
        stores.projectChangeRequests.updatePcrEditor({
          saving: false,
          projectId: props.projectId,
          pcrStepId: PCRStepId.spendProfileStep,
          dto,
        });
      }}
    />
  );
};

export const PCRSpendProfileAddCostRoute = defineRoute<PcrAddSpendProfileCostParams>({
  routeName: "pcrPrepareSpendProfileAddCost",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/spendProfile/:costCategoryId/cost",
  container: ContainerAdd,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
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
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
    costCategoryId: route.params.costCategoryId,
    costId: route.params.costId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrSpendProfilePrepareCost.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});
