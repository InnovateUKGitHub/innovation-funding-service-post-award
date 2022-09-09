import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { PCRDto } from "@framework/dtos/pcrDtos";
import {
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileCostDto,
  PCRSpendProfileLabourCostDto,
  PCRSpendProfileMaterialsCostDto,
  PCRSpendProfileOtherCostsDto,
  PCRSpendProfileSubcontractingCostDto,
  PCRSpendProfileTravelAndSubsCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import {
  CostCategoryList,
  CostCategoryGroupType,
  PCRItemForPartnerAdditionDto,
  PCRItemType,
  ProjectDto,
  ProjectRole,
} from "@framework/types";
import { Pending } from "@shared/pending";
import * as ACC from "@ui/components";
import { PcrSpendProfileCostSummaryParams } from "@ui/containers";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { AddPartnerStepNames } from "@ui/containers/pcrs/addPartner/addPartnerWorkflow";
import { PcrWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { useStores } from "@ui/redux";
import classNames from "classnames";

interface Data {
  project: Pending<ProjectDto>;
  costCategory: Pending<CostCategoryDto>;
  pcr: Pending<PCRDto>;
}

class SpendProfileCostsSummaryReviewComponent extends ContainerBase<PcrSpendProfileCostSummaryParams, Data> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      pcr: this.props.pcr,
      costCategory: this.props.costCategory,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.costCategory)} />;
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
      <ACC.Page
        backLink={
          <ACC.BackLink route={stepRoute}>
            <ACC.Content value={x => x.pcrSpendProfileCostsSummaryContent.backLink} />
          </ACC.BackLink>
        }
        pageTitle={<ACC.Projects.Title {...project} />}
        project={project}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />
        <ACC.Section title={x => x.pcrSpendProfileCostsSummaryContent.costsSectionTitle(costCategory.name)}>
          {this.renderViewTable(costs, costCategory)}
        </ACC.Section>
      </ACC.Page>
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
        title: <ACC.Content value={x => x.pcrSpendProfileCostsSummaryContent.labels.totalCosts(costCategory.name)} />,
        qa: "total-costs",
        isBold: false,
        numberOfColumns,
        value: <ACC.Renderers.Currency value={total} />,
      }),
    ];
  }

  private renderViewTable(costs: PCRSpendProfileCostDto[], costCategory: CostCategoryDto) {
    const Table = ACC.TypedTable<PCRSpendProfileCostDto>();
    const costCategoryType = CostCategoryList.fromId(costCategory.type);
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
          <Table.Table qa="default-costs" data={costs} footers={this.getFooters(costs, costCategory, 2)}>
            <Table.String
              header={x => x.pcrSpendProfileCostsSummaryContent.labels.description}
              value={x => x.description}
              qa={"description"}
            />
            <Table.Currency
              header={x => x.pcrSpendProfileCostsSummaryContent.labels.cost}
              value={x => x.value}
              qa={"cost"}
            />
          </Table.Table>
        );
    }
  }

  private renderLabourCostSummary(costs: PCRSpendProfileLabourCostDto[], costCategory: CostCategoryDto) {
    const Table = ACC.TypedTable<PCRSpendProfileLabourCostDto>();
    return (
      <Table.Table qa="labour-costs" data={costs} footers={this.getFooters(costs, costCategory, 5)}>
        <Table.String
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.labour.role}
          value={x => x.description}
          qa={"description"}
        />
        <Table.Currency
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.labour.grossCost}
          value={x => x.grossCostOfRole}
          qa={"grossEmployeeCost"}
        />
        <Table.Currency
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.labour.rate}
          value={x => x.ratePerDay}
          qa={"ratePerDay"}
        />
        <Table.Number
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.labour.daysOnProject}
          value={x => x.daysSpentOnProject}
          qa={"daysSpentOnProject"}
        />
        <Table.Currency
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.labour.totalCost}
          value={x => x.value}
          qa={"totalCost"}
        />
      </Table.Table>
    );
  }

  private renderMaterialsCostSummary(costs: PCRSpendProfileMaterialsCostDto[], costCategory: CostCategoryDto) {
    const Table = ACC.TypedTable<PCRSpendProfileMaterialsCostDto>();
    return (
      <Table.Table qa="materials-costs" data={costs} footers={this.getFooters(costs, costCategory, 4)}>
        <Table.String
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.materials.item}
          value={x => x.description}
          qa={"description"}
        />
        <Table.Number
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.materials.quantity}
          value={x => x.quantity}
          qa={"quantity"}
        />
        <Table.Currency
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.materials.costPerItem}
          value={x => x.costPerItem}
          qa={"costPerItem"}
        />
        <Table.Currency
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.materials.totalCost}
          value={x => x.value}
          qa={"totalCost"}
        />
      </Table.Table>
    );
  }

  private renderSubcontractingCostSummary(
    costs: PCRSpendProfileSubcontractingCostDto[],
    costCategory: CostCategoryDto,
  ) {
    const Table = ACC.TypedTable<PCRSpendProfileSubcontractingCostDto>();
    return (
      <Table.Table qa="subcontracting-costs" data={costs} footers={this.getFooters(costs, costCategory, 4)}>
        <Table.String
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.subcontracting.subcontractorName}
          value={x => x.description}
          qa={"description"}
        />
        <Table.String
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.subcontracting.subcontractorCountry}
          value={x => x.subcontractorCountry}
          qa={"subcontractorCountry"}
        />
        <Table.String
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.subcontracting.subcontractorRoleAndDescription}
          value={x => x.subcontractorRoleAndDescription}
          qa={"subcontractorRoleAndDescription"}
        />
        <Table.Currency
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.subcontracting.cost}
          value={x => x.value}
          qa={"totalCost"}
        />
      </Table.Table>
    );
  }

  private renderCapitalUsageCostSummary(costs: PCRSpendProfileCapitalUsageCostDto[], costCategory: CostCategoryDto) {
    const Table = ACC.TypedTable<PCRSpendProfileCapitalUsageCostDto>();
    return (
      <Table.Table qa="capital-usage-costs" data={costs} footers={this.getFooters(costs, costCategory, 7)}>
        <Table.String
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.capitalUsage.description}
          value={x => x.description}
          qa={"description"}
        />
        <Table.String
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.capitalUsage.type}
          value={x => x.typeLabel}
          qa={"type"}
        />
        <Table.Number
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.capitalUsage.depreciationPeriod}
          value={x => x.depreciationPeriod}
          qa={"depreciationPeriod"}
        />
        <Table.Currency
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.capitalUsage.netPresentValue}
          value={x => x.netPresentValue}
          qa={"netPresentValue"}
        />
        <Table.Currency
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.capitalUsage.residualValue}
          value={x => x.residualValue}
          qa={"residualValue"}
        />
        <Table.Percentage
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.capitalUsage.utilisation}
          value={x => x.utilisation}
          qa={"utilisation"}
        />
        <Table.Currency
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.capitalUsage.netCost}
          value={x => x.value}
          qa={"totalCost"}
        />
      </Table.Table>
    );
  }

  private renderTravelAndSubsistenceCostSummary(
    costs: PCRSpendProfileTravelAndSubsCostDto[],
    costCategory: CostCategoryDto,
  ) {
    const Table = ACC.TypedTable<PCRSpendProfileTravelAndSubsCostDto>();
    return (
      <Table.Table qa="travel-and-subs-costs" data={costs} footers={this.getFooters(costs, costCategory, 4)}>
        <Table.String
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.travelAndSubs.description}
          value={x => x.description}
          qa={"description"}
        />
        <Table.Number
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.travelAndSubs.numberOfTimes}
          value={x => x.numberOfTimes}
          qa={"numberOfTimes"}
        />
        <Table.Currency
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.travelAndSubs.costOfEach}
          value={x => x.costOfEach}
          qa={"costOfEach"}
        />
        <Table.Currency
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.travelAndSubs.totalCost}
          value={x => x.value}
          qa={"totalCost"}
        />
      </Table.Table>
    );
  }

  private renderOtherCostsCostSummary(costs: PCRSpendProfileOtherCostsDto[], costCategory: CostCategoryDto) {
    const Table = ACC.TypedTable<PCRSpendProfileOtherCostsDto>();
    return (
      <Table.Table qa="other-costs" data={costs} footers={this.getFooters(costs, costCategory, 2)}>
        <Table.String
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.otherCosts.description}
          value={x => x.description}
          qa={"description"}
        />
        <Table.Currency
          header={x => x.pcrSpendProfileCostsSummaryContent.labels.otherCosts.totalCost}
          value={x => x.value}
          qa={"totalCost"}
        />
      </Table.Table>
    );
  }

  private getWorkflow(addPartnerItem: PCRItemForPartnerAdditionDto) {
    // You need to have a workflow to find a step number by name
    // so getting a workflow with undefined step first
    // allowing me to find the step name and get the workflow with the correct step
    const summaryWorkflow = PcrWorkflow.getWorkflow(addPartnerItem, undefined);
    if (!summaryWorkflow) return null;
    const stepName: AddPartnerStepNames = "spendProfileStep";
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
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId,
    costCategoryId: route.params.costCategoryId,
  }),
  getTitle: ({ content }) => content.pcrSpendProfileCostsSummaryContent.title(),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer),
});
