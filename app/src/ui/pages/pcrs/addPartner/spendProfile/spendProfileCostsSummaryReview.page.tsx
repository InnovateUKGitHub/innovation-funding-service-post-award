import { CostCategoryGroupType } from "@framework/constants/enums";
import { PCRStepType } from "@framework/constants/pcrConstants";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { FullPCRItemDto } from "@framework/dtos/pcrDtos";
import {
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileCostDto,
  PCRSpendProfileLabourCostDto,
  PCRSpendProfileMaterialsCostDto,
  PCRSpendProfileOtherCostsDto,
  PCRSpendProfileSubcontractingCostDto,
  PCRSpendProfileTravelAndSubsCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { CostCategoryList } from "@framework/types/CostCategory";
import { Content } from "@ui/components/molecules/Content/content";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { BackLink } from "@ui/components/atoms/Links/links";
import { Currency } from "@ui/components/atoms/Currency/currency";
import { Messages } from "@ui/components/molecules/Messages/messages";
import { createTypedTable } from "@ui/components/molecules/Table/Table";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { AddPartnerStepNames } from "@ui/pages/pcrs/addPartner/addPartnerWorkflow";
import { PcrWorkflow } from "@ui/pages/pcrs/pcrWorkflow";
import classNames from "classnames";
import { PcrSpendProfileCostSummaryParams } from "./spendProfileCostsSummary.page";
import { useSpendProfileCostsQuery } from "./spendProfileCosts.logic";

const PCRSpendProfileCostTable = createTypedTable<Pick<PCRSpendProfileCostDto, "description" | "value">>();
const PCRSpendProfileLabourCostTable =
  createTypedTable<
    Pick<
      PCRSpendProfileLabourCostDto,
      "description" | "grossCostOfRole" | "ratePerDay" | "daysSpentOnProject" | "value"
    >
  >();
const PCRSpendProfileMaterialsCostTable =
  createTypedTable<Pick<PCRSpendProfileMaterialsCostDto, "description" | "quantity" | "costPerItem" | "value">>();
const PCRSpendProfileSubcontractingCostTable =
  createTypedTable<
    Pick<
      PCRSpendProfileSubcontractingCostDto,
      "description" | "subcontractorCountry" | "subcontractorRoleAndDescription" | "value"
    >
  >();
const PCRSpendProfileCapitalUsageCostTable =
  createTypedTable<
    Pick<
      PCRSpendProfileCapitalUsageCostDto,
      "description" | "typeLabel" | "depreciationPeriod" | "netPresentValue" | "residualValue" | "utilisation" | "value"
    >
  >();
const PCRSpendProfileTravelAndSubsCostTable =
  createTypedTable<
    Pick<PCRSpendProfileTravelAndSubsCostDto, "description" | "numberOfTimes" | "costOfEach" | "value">
  >();
const PCRSpendProfileOtherCosts = createTypedTable<Pick<PCRSpendProfileOtherCostsDto, "description" | "value">>();

const SpendProfileCostsSummaryReviewComponent = (props: PcrSpendProfileCostSummaryParams & BaseProps) => {
  const { itemId, projectId, costCategoryId } = props;

  const { pcrItem, spendProfile, costCategory, fragmentRef } = useSpendProfileCostsQuery(
    projectId,
    itemId,
    costCategoryId,
    undefined,
    undefined,
  );

  const addPartnerItem = pcrItem;
  if (!addPartnerItem) {
    throw new Error("cannot find a matching add partner item");
  }
  const addPartnerWorkflow = getWorkflow(addPartnerItem);
  const spendProfileStep = addPartnerWorkflow && addPartnerWorkflow.getCurrentStepInfo();
  const stepRoute = props.routes.pcrReviewItem.getLink({
    itemId: props.itemId,
    pcrId: props.pcrId,
    projectId: props.projectId,
    step: (spendProfileStep && spendProfileStep.stepNumber) || undefined,
  });
  const costs = spendProfile.costs.filter(x => x.costCategoryId === props.costCategoryId);
  return (
    <Page
      backLink={
        <BackLink route={stepRoute}>
          <Content value={x => x.pages.pcrSpendProfileCostsSummary.backLink} />
        </BackLink>
      }
      fragmentRef={fragmentRef}
    >
      <Messages messages={props.messages} />
      <Section
        title={x => x.pages.pcrSpendProfileCostsSummary.sectionTitleCosts({ costCategoryName: costCategory.name })}
      >
        <ViewTable costs={costs} costCategory={costCategory} />
      </Section>
    </Page>
  );
};

const ViewTable = ({
  costs,
  costCategory,
}: {
  costs: PCRSpendProfileCostDto[];
  costCategory: Pick<CostCategoryDto, "name" | "type">;
}) => {
  const costCategoryType = new CostCategoryList().fromId(costCategory.type);
  switch (costCategoryType.group) {
    case CostCategoryGroupType.Labour:
      return <LabourCostSummary costs={costs as PCRSpendProfileLabourCostDto[]} costCategory={costCategory} />;
    case CostCategoryGroupType.Materials:
      return <MaterialsCostSummary costs={costs as PCRSpendProfileMaterialsCostDto[]} costCategory={costCategory} />;
    case CostCategoryGroupType.Capital_Usage:
      return (
        <CapitalUsageCostSummary costs={costs as PCRSpendProfileCapitalUsageCostDto[]} costCategory={costCategory} />
      );
    case CostCategoryGroupType.Subcontracting:
      return (
        <SubcontractingCostSummary
          costs={costs as PCRSpendProfileSubcontractingCostDto[]}
          costCategory={costCategory}
        />
      );
    case CostCategoryGroupType.Travel_And_Subsistence:
      return (
        <TravelAndSubsistenceCostSummary
          costs={costs as PCRSpendProfileTravelAndSubsCostDto[]}
          costCategory={costCategory}
        />
      );
    case CostCategoryGroupType.Other_Costs:
      return <OtherCostsSummary costs={costs as PCRSpendProfileOtherCostsDto[]} costCategory={costCategory} />;
    default:
      return (
        <PCRSpendProfileCostTable.Table qa="default-costs" data={costs} footers={getFooters(costs, costCategory, 2)}>
          <PCRSpendProfileCostTable.String
            header={x => x.pcrSpendProfileLabels.description}
            value={x => x.description}
            qa={"description"}
          />
          <PCRSpendProfileCostTable.Currency
            header={x => x.pcrSpendProfileLabels.cost}
            value={x => x.value}
            qa={"cost"}
          />
        </PCRSpendProfileCostTable.Table>
      );
  }
};

const LabourCostSummary = ({
  costs,
  costCategory,
}: {
  costs: Pick<
    PCRSpendProfileLabourCostDto,
    "description" | "grossCostOfRole" | "ratePerDay" | "daysSpentOnProject" | "value"
  >[];
  costCategory: Pick<CostCategoryDto, "name">;
}) => {
  return (
    <PCRSpendProfileLabourCostTable.Table qa="labour-costs" data={costs} footers={getFooters(costs, costCategory, 5)}>
      <PCRSpendProfileLabourCostTable.String
        header={x => x.pcrSpendProfileLabels.labour.role}
        value={x => x.description}
        qa={"description"}
      />
      <PCRSpendProfileLabourCostTable.Currency
        header={x => x.pcrSpendProfileLabels.labour.grossCost}
        value={x => x.grossCostOfRole}
        qa={"grossEmployeeCost"}
      />
      <PCRSpendProfileLabourCostTable.Currency
        header={x => x.pcrSpendProfileLabels.labour.rate}
        value={x => x.ratePerDay}
        qa={"ratePerDay"}
      />
      <PCRSpendProfileLabourCostTable.Number
        header={x => x.pcrSpendProfileLabels.labour.daysSpentOnProject}
        value={x => x.daysSpentOnProject}
        qa={"daysSpentOnProject"}
      />
      <PCRSpendProfileLabourCostTable.Currency
        header={x => x.pcrSpendProfileLabels.labour.totalCost}
        value={x => x.value}
        qa={"totalCost"}
      />
    </PCRSpendProfileLabourCostTable.Table>
  );
};

const MaterialsCostSummary = ({
  costs,
  costCategory,
}: {
  costs: Pick<PCRSpendProfileMaterialsCostDto, "description" | "quantity" | "costPerItem" | "value">[];
  costCategory: Pick<CostCategoryDto, "name">;
}) => {
  return (
    <PCRSpendProfileMaterialsCostTable.Table
      qa="materials-costs"
      data={costs}
      footers={getFooters(costs, costCategory, 4)}
    >
      <PCRSpendProfileMaterialsCostTable.String
        header={x => x.pcrSpendProfileLabels.materials.item}
        value={x => x.description}
        qa={"description"}
      />
      <PCRSpendProfileMaterialsCostTable.Number
        header={x => x.pcrSpendProfileLabels.materials.quantity}
        value={x => x.quantity}
        qa={"quantity"}
      />
      <PCRSpendProfileMaterialsCostTable.Currency
        header={x => x.pcrSpendProfileLabels.materials.costPerItem}
        value={x => x.costPerItem}
        qa={"costPerItem"}
      />
      <PCRSpendProfileMaterialsCostTable.Currency
        header={x => x.pcrSpendProfileLabels.materials.totalCost}
        value={x => x.value}
        qa={"totalCost"}
      />
    </PCRSpendProfileMaterialsCostTable.Table>
  );
};

const CapitalUsageCostSummary = ({
  costs,
  costCategory,
}: {
  costs: Pick<
    PCRSpendProfileCapitalUsageCostDto,
    "description" | "typeLabel" | "depreciationPeriod" | "netPresentValue" | "residualValue" | "utilisation" | "value"
  >[];
  costCategory: Pick<CostCategoryDto, "name">;
}) => {
  return (
    <PCRSpendProfileCapitalUsageCostTable.Table
      qa="capital-usage-costs"
      data={costs}
      footers={getFooters(costs, costCategory, 7)}
    >
      <PCRSpendProfileCapitalUsageCostTable.String
        header={x => x.pcrSpendProfileLabels.capitalUsage.description}
        value={x => x.description}
        qa={"description"}
      />
      <PCRSpendProfileCapitalUsageCostTable.String
        header={x => x.pcrSpendProfileLabels.capitalUsage.type}
        value={x => x.typeLabel}
        qa={"type"}
      />
      <PCRSpendProfileCapitalUsageCostTable.Number
        header={x => x.pcrSpendProfileLabels.capitalUsage.depreciationPeriod}
        value={x => x.depreciationPeriod}
        qa={"depreciationPeriod"}
      />
      <PCRSpendProfileCapitalUsageCostTable.Currency
        header={x => x.pcrSpendProfileLabels.capitalUsage.netPresentValue}
        value={x => x.netPresentValue}
        qa={"netPresentValue"}
      />
      <PCRSpendProfileCapitalUsageCostTable.Currency
        header={x => x.pcrSpendProfileLabels.capitalUsage.residualValue}
        value={x => x.residualValue}
        qa={"residualValue"}
      />
      <PCRSpendProfileCapitalUsageCostTable.Percentage
        header={x => x.pcrSpendProfileLabels.capitalUsage.utilisation}
        value={x => x.utilisation}
        qa={"utilisation"}
      />
      <PCRSpendProfileCapitalUsageCostTable.Currency
        header={x => x.pcrSpendProfileLabels.capitalUsage.netCost}
        value={x => x.value}
        qa={"totalCost"}
      />
    </PCRSpendProfileCapitalUsageCostTable.Table>
  );
};

const SubcontractingCostSummary = ({
  costs,
  costCategory,
}: {
  costs: Pick<
    PCRSpendProfileSubcontractingCostDto,
    "description" | "subcontractorCountry" | "subcontractorRoleAndDescription" | "value"
  >[];
  costCategory: Pick<CostCategoryDto, "name">;
}) => {
  return (
    <PCRSpendProfileSubcontractingCostTable.Table
      qa="subcontracting-costs"
      data={costs}
      footers={getFooters(costs, costCategory, 4)}
    >
      <PCRSpendProfileSubcontractingCostTable.String
        header={x => x.pcrSpendProfileLabels.subcontracting.subcontractorName}
        value={x => x.description}
        qa={"description"}
      />
      <PCRSpendProfileSubcontractingCostTable.String
        header={x => x.pcrSpendProfileLabels.subcontracting.subcontractorCountry}
        value={x => x.subcontractorCountry}
        qa={"subcontractorCountry"}
      />
      <PCRSpendProfileSubcontractingCostTable.String
        header={x => x.pcrSpendProfileLabels.subcontracting.subcontractorRoleAndDescription}
        value={x => x.subcontractorRoleAndDescription}
        qa={"subcontractorRoleAndDescription"}
      />
      <PCRSpendProfileSubcontractingCostTable.Currency
        header={x => x.pcrSpendProfileLabels.subcontracting.cost}
        value={x => x.value}
        qa={"totalCost"}
      />
    </PCRSpendProfileSubcontractingCostTable.Table>
  );
};

const TravelAndSubsistenceCostSummary = ({
  costs,
  costCategory,
}: {
  costs: Pick<PCRSpendProfileTravelAndSubsCostDto, "description" | "numberOfTimes" | "costOfEach" | "value">[];
  costCategory: Pick<CostCategoryDto, "name">;
}) => {
  return (
    <PCRSpendProfileTravelAndSubsCostTable.Table
      qa="travel-and-subs-costs"
      data={costs}
      footers={getFooters(costs, costCategory, 4)}
    >
      <PCRSpendProfileTravelAndSubsCostTable.String
        header={x => x.pcrSpendProfileLabels.travelAndSubs.description}
        value={x => x.description}
        qa={"description"}
      />
      <PCRSpendProfileTravelAndSubsCostTable.Number
        header={x => x.pcrSpendProfileLabels.travelAndSubs.numberOfTimes}
        value={x => x.numberOfTimes}
        qa={"numberOfTimes"}
      />
      <PCRSpendProfileTravelAndSubsCostTable.Currency
        header={x => x.pcrSpendProfileLabels.travelAndSubs.costOfEach}
        value={x => x.costOfEach}
        qa={"costOfEach"}
      />
      <PCRSpendProfileTravelAndSubsCostTable.Currency
        header={x => x.pcrSpendProfileLabels.travelAndSubs.totalCost}
        value={x => x.value}
        qa={"totalCost"}
      />
    </PCRSpendProfileTravelAndSubsCostTable.Table>
  );
};

const OtherCostsSummary = ({
  costs,
  costCategory,
}: {
  costs: Pick<PCRSpendProfileOtherCostsDto, "description" | "value">[];
  costCategory: Pick<CostCategoryDto, "name">;
}) => {
  return (
    <PCRSpendProfileOtherCosts.Table qa="other-costs" data={costs} footers={getFooters(costs, costCategory, 2)}>
      <PCRSpendProfileOtherCosts.String
        header={x => x.pcrSpendProfileLabels.otherCosts.description}
        value={x => x.description}
        qa={"description"}
      />
      <PCRSpendProfileOtherCosts.Currency
        header={x => x.pcrSpendProfileLabels.otherCosts.totalCost}
        value={x => x.value}
        qa={"totalCost"}
      />
    </PCRSpendProfileOtherCosts.Table>
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

const getFooters = (
  costs: Pick<PCRSpendProfileCostDto, "value">[],
  costCategory: Pick<CostCategoryDto, "name">,
  numberOfColumns: number,
) => {
  const total = costs.reduce((acc, cost) => acc + (cost.value || 0), 0);
  return [
    <tr key="1" className="govuk-table__row" data-qa="total-costs">
      <th
        colSpan={numberOfColumns - 1}
        className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
      >
        <Content value={x => x.pcrSpendProfileLabels.totalCosts({ costCategoryName: costCategory.name })} />
      </th>
      <td className={classNames("govuk-table__cell", "govuk-table__cell--numeric")}>
        <Currency value={total} />
      </td>
    </tr>,
  ];
};

export const PCRSpendProfileReviewCostsSummaryRoute = defineRoute<PcrSpendProfileCostSummaryParams>({
  routeName: "pcrSpendProfileReviewCostsSummary",
  routePath: "/projects/:projectId/pcrs/:pcrId/review/item/:itemId/spendProfile/:costCategoryId",
  container: SpendProfileCostsSummaryReviewComponent,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
    costCategoryId: route.params.costCategoryId as CostCategoryId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrSpendProfileCostsSummary.title),
  accessControl: (auth, { projectId }) =>
    auth.forProject(projectId).hasAnyRoles(ProjectRolePermissionBits.MonitoringOfficer),
});
