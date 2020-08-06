import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import {
  PCRItemForPartnerAdditionDto,
  PCRItemType,
  ProjectDto,
  ProjectRole
} from "@framework/types";
import * as ACC from "@ui/components";
import { Pending } from "@shared/pending";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { StoresConsumer } from "@ui/redux";
import { PcrWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { addPartnerStepNames } from "@ui/containers/pcrs/addPartner/addPartnerWorkflow";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import classNames from "classnames";
import {
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileCostDto,
  PCRSpendProfileLabourCostDto,
  PCRSpendProfileMaterialsCostDto, PCRSpendProfileOtherCostsDto,
  PCRSpendProfileSubcontractingCostDto, PCRSpendProfileTravelAndSubsCostDto
} from "@framework/dtos/pcrSpendProfileDto";
import { CostCategoryType } from "@framework/entities";
import { PcrSpendProfileCostSummaryParams } from "@ui/containers";

interface Data {
  project: Pending<ProjectDto>;
  costCategory: Pending<CostCategoryDto>;
  pcr: Pending<PCRDto>;
}

class Component extends ContainerBase<PcrSpendProfileCostSummaryParams, Data> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      pcr: this.props.pcr,
      costCategory: this.props.costCategory,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.costCategory)}/>;
  }

  private renderContents(project: ProjectDto, pcr: PCRDto, costCategory: CostCategoryDto) {
    const addPartnerItem = pcr.items.find(x => x.id === this.props.itemId && x.type === PCRItemType.PartnerAddition) as PCRItemForPartnerAdditionDto;
    const addPartnerWorkflow = this.getWorkflow(addPartnerItem);
    const spendProfileStep = addPartnerWorkflow && addPartnerWorkflow.getCurrentStepInfo();
    const stepRoute = this.props.routes.pcrReviewItem.getLink({
      itemId: this.props.itemId,
      pcrId: this.props.pcrId,
      projectId: this.props.projectId,
      step: spendProfileStep && spendProfileStep.stepNumber || undefined
    });
    const costs = addPartnerItem.spendProfile.costs.filter(x => x.costCategoryId === this.props.costCategoryId);
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={stepRoute}><ACC.Content value={x => x.pcrSpendProfileCostsSummaryContent.backLink()}/></ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project}/>}
        project={project}
      >
        <ACC.Renderers.Messages messages={this.props.messages}/>
        <ACC.Section titleContent={x => x.pcrSpendProfileCostsSummaryContent.costsSectionTitle(costCategory.name)}>
          {this.renderViewTable(costs, costCategory)}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderFooterRow(row: { key: string, title: React.ReactNode, value: React.ReactNode, numberOfColumns: number, qa: string, isBold?: boolean }) {
    return (
      <tr key={row.key} className="govuk-table__row" data-qa={row.qa}>
        <th colSpan={row.numberOfColumns-1} className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">{row.title}</th>
        <td className={classNames("govuk-table__cell", "govuk-table__cell--numeric", { "govuk-!-font-weight-bold": row.isBold })}>
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
        title: <ACC.Content value={x => x.pcrSpendProfileCostsSummaryContent.labels().totalCosts(costCategory.name)}/>,
        qa: "total-costs",
        isBold: false,
        numberOfColumns,
        value: <ACC.Renderers.Currency value={total}/>
      })];
  }

  private renderViewTable(costs: PCRSpendProfileCostDto[], costCategory: CostCategoryDto) {
    const Table = ACC.TypedTable<PCRSpendProfileCostDto>();
    switch (costCategory.type) {
      case CostCategoryType.Labour:
        return this.renderLabourCostSummary(costs as PCRSpendProfileLabourCostDto[], costCategory);
      case CostCategoryType.Materials:
        return this.renderMaterialsCostSummary(costs as PCRSpendProfileMaterialsCostDto[], costCategory);
      case CostCategoryType.Capital_Usage:
        return this.renderCapitalUsageCostSummary(costs as PCRSpendProfileCapitalUsageCostDto[], costCategory);
      case CostCategoryType.Subcontracting:
        return this.renderSubcontractingCostSummary(costs as PCRSpendProfileSubcontractingCostDto[], costCategory);
      case CostCategoryType.Travel_And_Subsistence:
        return this.renderTravelAndSubsistenceCostSummary(costs as PCRSpendProfileTravelAndSubsCostDto[], costCategory);
      case CostCategoryType.Other_Costs:
        return this.renderOtherCostsCostSummary(costs as PCRSpendProfileOtherCostsDto[], costCategory);
      default:
        return (
          <Table.Table qa="default-costs" data={costs} footers={this.getFooters(costs, costCategory, 2)}>
            <Table.String headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().description()} value={x => x.description} qa={"description"}/>
            <Table.Currency headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().cost()} value={x => x.value} qa={"cost"}/>
          </Table.Table>
        );
    }
  }

  private renderLabourCostSummary(costs: PCRSpendProfileLabourCostDto[], costCategory: CostCategoryDto) {
    const Table = ACC.TypedTable<PCRSpendProfileLabourCostDto>();
    return (
      <Table.Table qa="labour-costs" data={costs} footers={this.getFooters(costs, costCategory, 5)}>
        <Table.String headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().labour.role()} value={x => x.description} qa={"description"}/>
        <Table.Currency headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().labour.grossCost()} value={x => x.grossCostOfRole} qa={"grossEmployeeCost"}/>
        <Table.Currency headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().labour.rate()} value={x => x.ratePerDay} qa={"ratePerDay"}/>
        <Table.Number headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().labour.daysOnProject()} value={x => x.daysSpentOnProject} qa={"daysSpentOnProject"}/>
        <Table.Currency headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().labour.totalCost()} value={x => x.value} qa={"totalCost"}/>
      </Table.Table>
    );
  }

  private renderMaterialsCostSummary(costs: PCRSpendProfileMaterialsCostDto[], costCategory: CostCategoryDto) {
    const Table = ACC.TypedTable<PCRSpendProfileMaterialsCostDto>();
    return (
      <Table.Table qa="materials-costs" data={costs} footers={this.getFooters(costs, costCategory, 4)}>
        <Table.String headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().materials.item()} value={x => x.description} qa={"description"}/>
        <Table.Number headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().materials.quantity()} value={x => x.quantity} qa={"quantity"}/>
        <Table.Currency headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().materials.costPerItem()} value={x => x.costPerItem} qa={"costPerItem"}/>
        <Table.Currency headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().materials.totalCost()} value={x => x.value} qa={"totalCost"}/>
      </Table.Table>
    );
  }

  private renderSubcontractingCostSummary(costs: PCRSpendProfileSubcontractingCostDto[], costCategory: CostCategoryDto) {
    const Table = ACC.TypedTable<PCRSpendProfileSubcontractingCostDto>();
    return (
      <Table.Table qa="subcontracting-costs" data={costs} footers={this.getFooters(costs, costCategory, 4)}>
        <Table.String headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().subcontracting.subcontractorName()} value={x => x.description} qa={"description"}/>
        <Table.String headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().subcontracting.subcontractorCountry()} value={x => x.subcontractorCountry} qa={"subcontractorCountry"}/>
        <Table.String headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().subcontracting.subcontractorRoleAndDescription()} value={x => x.subcontractorRoleAndDescription} qa={"subcontractorRoleAndDescription"}/>
        <Table.Currency headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().subcontracting.cost()} value={x => x.value} qa={"totalCost"}/>
      </Table.Table>
    );
  }

  private renderCapitalUsageCostSummary(costs: PCRSpendProfileCapitalUsageCostDto[], costCategory: CostCategoryDto) {
    const Table = ACC.TypedTable<PCRSpendProfileCapitalUsageCostDto>();
    return (
      <Table.Table qa="capital-usage-costs" data={costs} footers={this.getFooters(costs, costCategory, 7)}>
        <Table.String headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().capitalUsage.description()} value={x => x.description} qa={"description"}/>
        <Table.String headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().capitalUsage.type()} value={x => x.typeLabel} qa={"type"}/>
        <Table.Number headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().capitalUsage.depreciationPeriod()} value={x => x.depreciationPeriod} qa={"depreciationPeriod"}/>
        <Table.Currency headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().capitalUsage.netPresentValue()} value={x => x.netPresentValue} qa={"netPresentValue"}/>
        <Table.Currency headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().capitalUsage.residualValue()} value={x => x.residualValue} qa={"residualValue"}/>
        <Table.Percentage headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().capitalUsage.utilisation()} value={x => x.utilisation} qa={"utilisation"}/>
        <Table.Currency headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().capitalUsage.netCost()} value={x => x.value} qa={"totalCost"}/>
      </Table.Table>
    );
  }

  private renderTravelAndSubsistenceCostSummary(costs: PCRSpendProfileTravelAndSubsCostDto[], costCategory: CostCategoryDto) {
    const Table = ACC.TypedTable<PCRSpendProfileTravelAndSubsCostDto>();
    return (
      <Table.Table qa="travel-and-subs-costs" data={costs} footers={this.getFooters(costs, costCategory, 4)}>
        <Table.String headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().travelAndSubs.description()} value={x => x.description} qa={"description"}/>
        <Table.Number headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().travelAndSubs.numberOfTimes()} value={x => x.numberOfTimes} qa={"numberOfTimes"}/>
        <Table.Currency headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().travelAndSubs.costOfEach()} value={x => x.costOfEach} qa={"costOfEach"}/>
        <Table.Currency headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().travelAndSubs.totalCost()} value={x => x.value} qa={"totalCost"}/>
      </Table.Table>
    );
  }

  private renderOtherCostsCostSummary(costs: PCRSpendProfileOtherCostsDto[], costCategory: CostCategoryDto) {
    const Table = ACC.TypedTable<PCRSpendProfileOtherCostsDto>();
    return (
      <Table.Table qa="other-costs" data={costs} footers={this.getFooters(costs, costCategory, 2)}>
        <Table.String headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().otherCosts.description()} value={x => x.description} qa={"description"}/>
        <Table.Currency headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().otherCosts.totalCost()} value={x => x.value} qa={"totalCost"}/>
      </Table.Table>
    );
  }

  private getWorkflow(addPartnerItem: PCRItemForPartnerAdditionDto) {
    // You need to have a workflow to find a step number by name
    // so getting a workflow with undefined step first
    // allowing me to find the step name and get the workflow with the correct step
    const summaryWorkflow = PcrWorkflow.getWorkflow(addPartnerItem, undefined, this.props.config.features);
    if (!summaryWorkflow) return null;
    const stepName: addPartnerStepNames = "spendProfileStep";
    const spendProfileStep = summaryWorkflow.findStepNumberByName(stepName);
    return PcrWorkflow.getWorkflow(addPartnerItem, spendProfileStep, this.props.config.features);
  }
}

const Container = (props: PcrSpendProfileCostSummaryParams & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <Component
        project={stores.projects.getById(props.projectId)}
        costCategory={stores.costCategories.get(props.costCategoryId)}
        pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const PCRSpendProfileReviewCostsSummaryRoute = defineRoute<PcrSpendProfileCostSummaryParams>({
  routeName: "pcrSpendProfileReviewCostsSummary",
  routePath: "/projects/:projectId/pcrs/:pcrId/review/item/:itemId/spendProfile/:costCategoryId",
  container: (props) => <Container {...props} />,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId,
    costCategoryId: route.params.costCategoryId,
  }),
  getTitle: ({ content }) => (content.pcrSpendProfileCostsSummaryContent.title()),
  accessControl: (auth, { projectId }, config) => auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer)
});
