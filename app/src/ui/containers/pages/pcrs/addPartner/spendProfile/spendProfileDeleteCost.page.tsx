import { useNavigate } from "react-router-dom";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { Pending } from "@shared/pending";
import { PCRDto, PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import {
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileCostDto,
  PCRSpendProfileLabourCostDto,
  PCRSpendProfileMaterialsCostDto,
  PCRSpendProfileOtherCostsDto,
  PCRSpendProfileSubcontractingCostDto,
  PCRSpendProfileTravelAndSubsCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { PcrAddSpendProfileCostParams } from "./spendProfilePrepareCost.page";
import { CostCategoryGroupType } from "@framework/constants/enums";
import { PCRItemType, PCRItemStatus, PCRStepType } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { ProjectDto } from "@framework/dtos/projectDto";
import { CostCategoryList } from "@framework/types/CostCategory";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { PageLoader } from "@ui/components/bjss/loading";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { DeleteCapitalUsageCostFormComponent } from "./deleteCapitalUsageCostFormComponent";
import { DeleteLabourCostFormComponent } from "./deleteLabourCostFormComponent";
import { DeleteMaterialsCostFormComponent } from "./deleteMaterialCostFormComponent";
import { DeleteOtherCostFormComponent } from "./deleteOtherCostFormComponent";
import { DeleteSubcontractingCostFormComponent } from "./deleteSubcontractingCostFormComponent";
import { DeleteTravelAndSubsCostFormComponent } from "./deleteTravelAndSubsCostFormComponent";

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
  onDelete: (dto: PCRDto, projectId: ProjectId) => void;
}

export interface SpendProfileDeleteFormProps<T extends PCRSpendProfileCostDto> {
  data: T;
  costCategory: CostCategoryDto;
}

const DeleteForm = createTypedForm<PCRSpendProfileCostDto>();

class Component extends ContainerBase<PcrAddSpendProfileCostParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      costCategory: this.props.costCategory,
      editor: this.props.editor,
      cost: this.props.cost,
    });

    return (
      <PageLoader pending={combined} render={x => this.renderContents(x.project, x.editor, x.costCategory, x.cost)} />
    );
  }

  private renderContents(
    project: ProjectDto,
    editor: IEditorStore<PCRDto, PCRDtoValidator>,
    costCategory: CostCategoryDto,
    cost: PCRSpendProfileCostDto,
  ) {
    return (
      <Page
        backLink={
          <BackLink
            route={this.props.routes.pcrSpendProfileCostsSummary.getLink({
              itemId: this.props.itemId,
              pcrId: this.props.pcrId,
              projectId: this.props.projectId,
              costCategoryId: this.props.costCategoryId,
            })}
          >
            <Content value={x => x.pages.pcrSpendProfileDeleteCost.backLink({ costCategoryName: costCategory.name })} />
          </BackLink>
        }
        pageTitle={<Title {...project} />}
        project={project}
        error={editor.error}
      >
        <Messages messages={this.props.messages} />
        <Section>
          <DeleteForm.Form data={cost} qa="pcrDelete">
            <DeleteForm.Hidden name="id" value={dto => (dto ? dto.id : "")} />
            {cost && this.renderComponent(costCategory, cost)}
            <DeleteForm.Button
              name="delete"
              styling="Warning"
              onClick={() => this.props.onDelete(editor.data, this.props.projectId)}
            >
              <Content value={x => x.pages.pcrSpendProfileDeleteCost.buttonDelete} />
            </DeleteForm.Button>
          </DeleteForm.Form>
        </Section>
      </Page>
    );
  }

  private renderComponent(costCategory: CostCategoryDto, cost: PCRSpendProfileCostDto) {
    const costCategoryType = new CostCategoryList().fromId(costCategory.type);
    switch (costCategoryType.group) {
      case CostCategoryGroupType.Labour:
        return (
          <DeleteLabourCostFormComponent data={cost as PCRSpendProfileLabourCostDto} costCategory={costCategory} />
        );
      case CostCategoryGroupType.Materials:
        return (
          <DeleteMaterialsCostFormComponent
            data={cost as PCRSpendProfileMaterialsCostDto}
            costCategory={costCategory}
          />
        );
      case CostCategoryGroupType.Capital_Usage:
        return (
          <DeleteCapitalUsageCostFormComponent
            data={cost as PCRSpendProfileCapitalUsageCostDto}
            costCategory={costCategory}
          />
        );
      case CostCategoryGroupType.Subcontracting:
        return (
          <DeleteSubcontractingCostFormComponent
            data={cost as PCRSpendProfileSubcontractingCostDto}
            costCategory={costCategory}
          />
        );
      case CostCategoryGroupType.Travel_And_Subsistence:
        return (
          <DeleteTravelAndSubsCostFormComponent
            data={cost as PCRSpendProfileTravelAndSubsCostDto}
            costCategory={costCategory}
          />
        );
      case CostCategoryGroupType.Other_Costs:
        return <DeleteOtherCostFormComponent data={cost as PCRSpendProfileOtherCostsDto} costCategory={costCategory} />;
      default:
        return null;
    }
  }
}

const SpendProfileDeleteCostContainer = (props: PcrDeleteSpendProfileCostParams & BaseProps) => {
  const navigate = useNavigate();
  const stores = useStores();

  const costCategoryPending = stores.costCategories.get(props.costCategoryId);
  const dtoPending = stores.projectChangeRequests.getById(props.projectId, props.pcrId);

  return (
    <Component
      {...props}
      project={stores.projects.getById(props.projectId)}
      costCategory={costCategoryPending}
      editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId)}
      cost={dtoPending.then(dto => {
        const addPartnerItem = dto.items.find(
          x => x.id === props.itemId && x.type === PCRItemType.PartnerAddition,
        ) as PCRItemForPartnerAdditionDto;
        return addPartnerItem.spendProfile.costs.find(x => x.id === props.costId) as PCRSpendProfileCostDto;
      })}
      onDelete={(dto, projectId) => {
        const item = dto.items.find(
          x => x.id === props.itemId && x.type === PCRItemType.PartnerAddition,
        ) as PCRItemForPartnerAdditionDto;
        const costIndex = item.spendProfile.costs.findIndex(x => x.id === props.costId);
        if (costIndex > -1) {
          item.spendProfile.costs.splice(costIndex, 1);
        }
        // If submitting from a step set the status to incomplete
        item.status = PCRItemStatus.Incomplete;
        stores.messages.clearMessages();
        stores.projectChangeRequests.updatePcrEditor({
          saving: true,
          projectId,
          pcrStepType: PCRStepType.spendProfileStep,
          pcrStepId: props.itemId,
          dto,
          message: "You have deleted a cost",
          onComplete: () =>
            navigate(
              props.routes.pcrSpendProfileCostsSummary.getLink({
                projectId: props.projectId,
                pcrId: props.pcrId,
                itemId: props.itemId,
                costCategoryId: props.costCategoryId,
              }).path,
            ),
        });
      }}
    />
  );
};

export const PCRSpendProfileDeleteCostRoute = defineRoute<PcrDeleteSpendProfileCostParams>({
  routeName: "pcrPrepareSpendProfileDeleteCost",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/spendProfile/:costCategoryId/cost/:costId/delete",
  container: SpendProfileDeleteCostContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
    costCategoryId: route.params.costCategoryId as CostCategoryId,
    costId: route.params.costId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrSpendProfileDeleteCost.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});
