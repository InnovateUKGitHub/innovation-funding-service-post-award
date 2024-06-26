import { CostCategoryGroupType } from "@framework/constants/enums";
import { PCRItemType, PCRStepType } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { FullPCRItemDto } from "@framework/dtos/pcrDtos";
import { CostCategoryList } from "@framework/types/CostCategory";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { AddPartnerStepNames } from "@ui/containers/pages/pcrs/addPartner/addPartnerWorkflow";
import { PcrWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { CapitalUsageFormComponent } from "./capitalUsageFormComponent";
import { LabourFormComponent } from "./labourFormComponent";
import { MaterialsFormComponent } from "./materialsFormComponent";
import { OtherCostsFormComponent } from "./otherCostsFormComponent";
import { OverheadsFormComponent } from "./overheadsFormComponent";
import { SubcontractingFormComponent } from "./subcontractingFormComponent";
import { TravelAndSubsFormComponent } from "./travelAndSubsFormComponent";
import { useContext, useState } from "react";
import { SpendProfileContext, useSpendProfileCostsQuery } from "./spendProfileCosts.logic";
import { useOnSavePcrItem } from "../../pcrItemWorkflow.logic";

export interface PcrAddSpendProfileCostParams {
  projectId: ProjectId;
  pcrId: PcrId;
  itemId: PcrItemId;
  costCategoryId: CostCategoryId;
  costId?: CostId;
}

export interface PcrEditSpendProfileCostParams extends PcrAddSpendProfileCostParams {
  costId: CostId;
}

const SpendProfileEditComponent = (props: PcrAddSpendProfileCostParams & BaseProps) => {
  const { itemId, pcrId, projectId, costCategoryId, costId, routes, messages } = props;

  const [fetchKey, setFetchKey] = useState(0);

  const { project, costCategory, spendProfile, pcrItem, cost, documents, fragmentRef } = useSpendProfileCostsQuery(
    projectId,
    itemId,
    costCategoryId,
    costId,
    fetchKey,
  );

  const costCategoryType = new CostCategoryList(project.competitionType).fromId(costCategory.type);

  const { onUpdate, isFetching, apiError } = useOnSavePcrItem(
    projectId,
    pcrId,
    itemId,
    setFetchKey,
    undefined,
    undefined,
    PCRItemType.PartnerAddition,
  );

  const addPartnerWorkflow = getWorkflow(pcrItem);
  const spendProfileStep = addPartnerWorkflow && addPartnerWorkflow.getCurrentStepInfo();
  const stepRoute = routes.pcrPrepareItem.getLink({
    itemId,
    pcrId,
    projectId,
    step: (spendProfileStep && spendProfileStep.stepNumber) || undefined,
  });

  return (
    <SpendProfileContext.Provider
      value={{
        isFetching,
        onUpdate,
        documents,
        cost,
        costCategory,
        costCategoryType,
        spendProfile,
        pcrItem,
        pcrId,
        projectId,
        costId: costId ?? "",
        itemId,
        costCategoryId,
        project,
        routes,
        messages,
        apiError,
        stepRoute,
        addNewItem: !costId,
        fragmentRef,
      }}
    >
      <SpendProfilePrepareFormSection />
    </SpendProfileContext.Provider>
  );
};

const getWorkflow = (
  addPartnerItem: Pick<
    FullPCRItemDto,
    "projectRole" | "partnerType" | "isCommercialWork" | "typeOfAid" | "organisationType" | "hasOtherFunding" | "type"
  >,
) => {
  // You need to have a workflow to find a step number by name
  // so getting a workflow with undefined step first
  // allowing me to find the step name and get the workflow with the correct step
  const summaryWorkflow = PcrWorkflow.getWorkflow(addPartnerItem, undefined);
  if (!summaryWorkflow) return null;
  const stepName: AddPartnerStepNames = PCRStepType.spendProfileStep;
  const spendProfileStep = summaryWorkflow.findStepNumberByName(stepName);
  return PcrWorkflow.getWorkflow(addPartnerItem, spendProfileStep);
};

const SpendProfilePrepareFormSection = () => {
  const { costCategoryType } = useContext(SpendProfileContext);
  switch (costCategoryType.group) {
    case CostCategoryGroupType.Labour:
      return <LabourFormComponent />;
    case CostCategoryGroupType.Overheads:
      return <OverheadsFormComponent />;
    case CostCategoryGroupType.Materials:
      return <MaterialsFormComponent />;
    case CostCategoryGroupType.Subcontracting:
      return <SubcontractingFormComponent />;
    case CostCategoryGroupType.Capital_Usage:
      return <CapitalUsageFormComponent />;
    case CostCategoryGroupType.Travel_And_Subsistence:
      return <TravelAndSubsFormComponent />;
    case CostCategoryGroupType.Other_Costs:
    default:
      return <OtherCostsFormComponent />;
  }
};

export const PCRSpendProfileAddCostRoute = defineRoute<PcrAddSpendProfileCostParams>({
  routeName: "pcrPrepareSpendProfileAddCost",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/spendProfile/:costCategoryId/cost",
  container: SpendProfileEditComponent,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
    costCategoryId: route.params.costCategoryId as CostCategoryId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrSpendProfilePrepareCost.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});

export const PCRSpendProfileEditCostRoute = defineRoute<PcrEditSpendProfileCostParams>({
  routeName: "pcrPrepareSpendProfileEditCost",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/spendProfile/:costCategoryId/cost/:costId",
  container: SpendProfileEditComponent,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
    costCategoryId: route.params.costCategoryId as CostCategoryId,
    costId: route.params.costId as CostId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrSpendProfilePrepareCost.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});
