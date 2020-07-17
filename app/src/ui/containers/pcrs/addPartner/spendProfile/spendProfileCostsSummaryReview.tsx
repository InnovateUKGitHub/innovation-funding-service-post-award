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
import { PCRSpendProfileCostDto, PCRSpendProfileLabourCostDto } from "@framework/dtos/pcrSpendProfileDto";
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

  private renderFooterRow(row: { key: string, title: React.ReactNode, value: React.ReactNode, qa: string, isBold?: boolean }) {
    return (
      <tr key={row.key} className="govuk-table__row" data-qa={row.qa}>
        <th className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">{row.title}</th>
        <td className={classNames("govuk-table__cell", "govuk-table__cell--numeric", { "govuk-!-font-weight-bold": row.isBold })}>
          {row.value}
        </td>
        <td className={classNames("govuk-table__cell")}/>
      </tr>
    );
  }

  private renderViewTable(costs: PCRSpendProfileCostDto[], costCategory: CostCategoryDto) {
    const Table = ACC.TypedTable<PCRSpendProfileCostDto>();
    const total = costs.reduce((acc, cost) => acc + (cost.value || 0), 0);
    const footers = [
      this.renderFooterRow({
        key: "1",
        title: <ACC.Content value={x => x.pcrSpendProfileCostsSummaryContent.labels().totalCosts(costCategory.name)}/>,
        qa: "total-costs",
        isBold: false,
        value: <ACC.Renderers.Currency value={total}/>
      })];
    // tslint:disable-next-line: no-small-switch
    switch (costCategory.type) {
      case CostCategoryType.Labour:
        return this.renderLabourCostSummary(costs as PCRSpendProfileLabourCostDto[], total);
      default:
        return (
          <Table.Table qa="default-costs" data={costs} footers={footers}>
            <Table.String headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().description()} value={x => x.description} qa={"description"}/>
            <Table.Currency headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().cost()} value={x => x.value} qa={"cost"}/>
          </Table.Table>
        );
    }
  }

  private renderLabourCostSummary(costs: PCRSpendProfileLabourCostDto[], total: number) {
    const Table = ACC.TypedTable<PCRSpendProfileLabourCostDto>();
    return (
      <Table.Table qa="labour-costs" data={costs}>
        <Table.String headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().description()} value={x => x.description} qa={"description"} footer={<ACC.Content value={x => x.pcrSpendProfileCostsSummaryContent.labels().labour.totalCost()}/>}/>
        <Table.Currency headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().labour.grossCost()} value={x => x.grossCostOfRole} qa={"grossEmployeeCost"}/>
        <Table.Currency headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().labour.rate()} value={x => x.ratePerDay} qa={"ratePerDay"}/>
        <Table.Number headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().labour.daysOnProject()} value={x => x.daysSpentOnProject} qa={"daysSpentOnProject"}/>
        <Table.Currency headerContent={x => x.pcrSpendProfileCostsSummaryContent.labels().cost()} value={x => x.value} qa={"cost"} footer={<ACC.Renderers.Currency value={total}/>}/>
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
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer)
});
