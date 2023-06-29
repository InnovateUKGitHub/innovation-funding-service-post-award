import { CostCategoryGroupType } from "@framework/constants/enums";
import { PCRItemType, PCRStepId } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
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
import { ProjectDto } from "@framework/dtos/projectDto";
import { CostCategoryList } from "@framework/types/CostCategory";
import { Pending } from "@shared/pending";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { PageLoader } from "@ui/components/bjss/loading";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { createTypedTable } from "@ui/components/atomicDesign/molecules/Table/Table";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { AddPartnerStepNames } from "@ui/containers/pages/pcrs/addPartner/addPartnerWorkflow";
import { PcrWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { useStores } from "@ui/redux/storesProvider";
import classNames from "classnames";
import { PcrSpendProfileCostSummaryParams } from "./spendProfileCostsSummary.page";

interface Data {
  project: Pending<ProjectDto>;
  costCategory: Pending<CostCategoryDto>;
  pcr: Pending<PCRDto>;
}

const PCRSpendProfileCostTable = createTypedTable<PCRSpendProfileCostDto>();
const PCRSpendProfileLabourCostTable = createTypedTable<PCRSpendProfileLabourCostDto>();
const PCRSpendProfileMaterialsCostTable = createTypedTable<PCRSpendProfileMaterialsCostDto>();
const PCRSpendProfileSubcontractingCostTable = createTypedTable<PCRSpendProfileSubcontractingCostDto>();
const PCRSpendProfileCapitalUsageCostTable = createTypedTable<PCRSpendProfileCapitalUsageCostDto>();
const PCRSpendProfileTravelAndSubsCostTable = createTypedTable<PCRSpendProfileTravelAndSubsCostDto>();
const PCRSpendProfileOtherCosts = createTypedTable<PCRSpendProfileOtherCostsDto>();

class SpendProfileCostsSummaryReviewComponent extends ContainerBase<PcrSpendProfileCostSummaryParams, Data> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      pcr: this.props.pcr,
      costCategory: this.props.costCategory,
    });

    return <PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.costCategory)} />;
  }

  private renderContents(project: ProjectDto, pcr: PCRDto, costCategory: CostCategoryDto) {
    const addPartnerItem = pcr.items.find(
      x => x.id === this.props.itemId && x.type === PCRItemType.PartnerAddition,
    ) as PCRItemForPartnerAdditionDto;
    const addPartnerWorkflow = this.getWorkflow(addPartnerItem);
    const spendProfileStep = addPartnerWorkflow && addPartnerWorkflow.getCurrentStepInfo();
    const stepRoute = this.props.routes.pcrReviewItem.getLink({
      itemId: this.props.itemId,
      pcrId: this.props.pcrId,
      projectId: this.props.projectId,
      step: (spendProfileStep && spendProfileStep.stepNumber) || undefined,
    });
    const costs = addPartnerItem.spendProfile.costs.filter(x => x.costCategoryId === this.props.costCategoryId);
    return (
      <Page
        backLink={
          <BackLink route={stepRoute}>
            <Content value={x => x.pages.pcrSpendProfileCostsSummary.backLink} />
          </BackLink>
        }
        pageTitle={<Title {...project} />}
        project={project}
      >
        <Messages messages={this.props.messages} />
        <Section
          title={x => x.pages.pcrSpendProfileCostsSummary.sectionTitleCosts({ costCategoryName: costCategory.name })}
        >
          {this.renderViewTable(costs, costCategory)}
        </Section>
      </Page>
    );
  }

  private renderFooterRow(row: {
    key: string;
    title: React.ReactNode;
    value: React.ReactNode;
    numberOfColumns: number;
    qa: string;
    isBold?: boolean;
  }) {
    return (
      <tr key={row.key} className="govuk-table__row" data-qa={row.qa}>
        <th
          colSpan={row.numberOfColumns - 1}
          className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"
        >
          {row.title}
        </th>
        <td
          className={classNames("govuk-table__cell", "govuk-table__cell--numeric", {
            "govuk-!-font-weight-bold": row.isBold,
          })}
        >
          {row.value}
        </td>
      </tr>
    );
  }

  private getFooters(costs: PCRSpendProfileCostDto[], costCategory: CostCategoryDto, numberOfColumns: number) {
    const total = costs.reduce((acc, cost) => acc + (cost.value || 0), 0);
    return [
      this.renderFooterRow({
        key: "1",
        title: <Content value={x => x.pcrSpendProfileLabels.totalCosts({ costCategoryName: costCategory.name })} />,
        qa: "total-costs",
        isBold: false,
        numberOfColumns,
        value: <Currency value={total} />,
      }),
    ];
  }

  private renderViewTable(costs: PCRSpendProfileCostDto[], costCategory: CostCategoryDto) {
    const costCategoryType = new CostCategoryList().fromId(costCategory.type);
    switch (costCategoryType.group) {
      case CostCategoryGroupType.Labour:
        return this.renderLabourCostSummary(costs as PCRSpendProfileLabourCostDto[], costCategory);
      case CostCategoryGroupType.Materials:
        return this.renderMaterialsCostSummary(costs as PCRSpendProfileMaterialsCostDto[], costCategory);
      case CostCategoryGroupType.Capital_Usage:
        return this.renderCapitalUsageCostSummary(costs as PCRSpendProfileCapitalUsageCostDto[], costCategory);
      case CostCategoryGroupType.Subcontracting:
        return this.renderSubcontractingCostSummary(costs as PCRSpendProfileSubcontractingCostDto[], costCategory);
      case CostCategoryGroupType.Travel_And_Subsistence:
        return this.renderTravelAndSubsistenceCostSummary(costs as PCRSpendProfileTravelAndSubsCostDto[], costCategory);
      case CostCategoryGroupType.Other_Costs:
        return this.renderOtherCostsCostSummary(costs as PCRSpendProfileOtherCostsDto[], costCategory);
      default:
        return (
          <PCRSpendProfileCostTable.Table
            qa="default-costs"
            data={costs}
            footers={this.getFooters(costs, costCategory, 2)}
          >
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
  }

  private renderLabourCostSummary(costs: PCRSpendProfileLabourCostDto[], costCategory: CostCategoryDto) {
    return (
      <PCRSpendProfileLabourCostTable.Table
        qa="labour-costs"
        data={costs}
        footers={this.getFooters(costs, costCategory, 5)}
      >
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
  }

  private renderMaterialsCostSummary(costs: PCRSpendProfileMaterialsCostDto[], costCategory: CostCategoryDto) {
    return (
      <PCRSpendProfileMaterialsCostTable.Table
        qa="materials-costs"
        data={costs}
        footers={this.getFooters(costs, costCategory, 4)}
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
  }

  private renderSubcontractingCostSummary(
    costs: PCRSpendProfileSubcontractingCostDto[],
    costCategory: CostCategoryDto,
  ) {
    return (
      <PCRSpendProfileSubcontractingCostTable.Table
        qa="subcontracting-costs"
        data={costs}
        footers={this.getFooters(costs, costCategory, 4)}
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
  }

  private renderCapitalUsageCostSummary(costs: PCRSpendProfileCapitalUsageCostDto[], costCategory: CostCategoryDto) {
    return (
      <PCRSpendProfileCapitalUsageCostTable.Table
        qa="capital-usage-costs"
        data={costs}
        footers={this.getFooters(costs, costCategory, 7)}
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
  }

  private renderTravelAndSubsistenceCostSummary(
    costs: PCRSpendProfileTravelAndSubsCostDto[],
    costCategory: CostCategoryDto,
  ) {
    return (
      <PCRSpendProfileTravelAndSubsCostTable.Table
        qa="travel-and-subs-costs"
        data={costs}
        footers={this.getFooters(costs, costCategory, 4)}
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
  }

  private renderOtherCostsCostSummary(costs: PCRSpendProfileOtherCostsDto[], costCategory: CostCategoryDto) {
    return (
      <PCRSpendProfileOtherCosts.Table qa="other-costs" data={costs} footers={this.getFooters(costs, costCategory, 2)}>
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
  }

  private getWorkflow(addPartnerItem: PCRItemForPartnerAdditionDto) {
    // You need to have a workflow to find a step number by name
    // so getting a workflow with undefined step first
    // allowing me to find the step name and get the workflow with the correct step
    const summaryWorkflow = PcrWorkflow.getWorkflow(addPartnerItem, undefined);
    if (!summaryWorkflow) return null;
    const stepName: AddPartnerStepNames = PCRStepId.spendProfileStep;
    const spendProfileStep = summaryWorkflow.findStepNumberByName(stepName);
    return PcrWorkflow.getWorkflow(addPartnerItem, spendProfileStep);
  }
}

const SpendProfileCostsSummaryReviewContainer = (props: PcrSpendProfileCostSummaryParams & BaseProps) => {
  const stores = useStores();

  return (
    <SpendProfileCostsSummaryReviewComponent
      {...props}
      project={stores.projects.getById(props.projectId)}
      costCategory={stores.costCategories.get(props.costCategoryId)}
      pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
    />
  );
};

export const PCRSpendProfileReviewCostsSummaryRoute = defineRoute<PcrSpendProfileCostSummaryParams>({
  routeName: "pcrSpendProfileReviewCostsSummary",
  routePath: "/projects/:projectId/pcrs/:pcrId/review/item/:itemId/spendProfile/:costCategoryId",
  container: SpendProfileCostsSummaryReviewContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
    costCategoryId: route.params.costCategoryId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrSpendProfileCostsSummary.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer),
});
