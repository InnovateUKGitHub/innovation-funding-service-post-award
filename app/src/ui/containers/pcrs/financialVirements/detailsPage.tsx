import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { StoresConsumer } from "@ui/redux";
import { Pending } from "@shared/pending";
import * as ACC from "@ui/components";
import { PartnerDto, PCRDto, ProjectDto, ProjectRole } from "@framework/dtos";
import { createDto } from "@framework/util/dtoHelpers";

interface Params {
  projectId: string;
  partnerId: string;
  pcrId: string;
  itemId: string;
  mode: "review" | "view";
}

interface Props {
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  pcr: Pending<PCRDto>;
  costCategories: Pending<CostCategoryDto[]>;
  financialVirements: Pending<PartnerVirementsDto>;
}

class Component extends ContainerBase<Params, Props, {}> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      pcr: this.props.pcr,
      costCategories: this.props.costCategories,
      financialVirements: this.props.financialVirements
    });

    return <ACC.PageLoader pending={combined} render={data => this.renderPage(data.project, data.partner, data.costCategories, data.financialVirements, data.pcr)} />;
  }

  private renderPage(project: ProjectDto, partner: PartnerDto, costCategories: CostCategoryDto[], financialVirements: PartnerVirementsDto, pcr: PCRDto) {
    const data = costCategories
      .map(costCategory => ({
        costCategory,
        virement: financialVirements.virements.find(x => x.costCategoryId === costCategory.id) || createDto<CostCategoryVirementDto>({})
      }))
      ;

    const VirementTable = ACC.TypedTable<typeof data[0]>();
    return (
      <ACC.Page
        backLink={this.getBackLink()}
        pageTitle={<ACC.Projects.Title project={project} />}
      >
        {this.renderReasoning(project, pcr)}
        <VirementTable.Table qa="partnerVirements" data={data}>
          <VirementTable.String qa="costCategory" headerContent={x => x.financialVirementDetails.labels.costCategoryName()} value={x =>  x.costCategory.name} footer={<ACC.Content value={x => x.financialVirementDetails.labels.totals()}/>} />
          <VirementTable.Currency qa="originalEligibleCosts" headerContent={x => x.financialVirementDetails.labels.costCategoryOriginalEligibleCosts()} value={x => x.virement.originalEligibleCosts} footer={<ACC.Renderers.Currency value={financialVirements.originalEligibleCosts}/> }/>
          <VirementTable.Currency qa="newEligibleCosts" headerContent={x => x.financialVirementDetails.labels.costCategoryNewEligibleCosts()} value={x => x.virement.newEligibleCosts} footer={<ACC.Renderers.Currency value={financialVirements.newEligibleCosts}/> }/>
          <VirementTable.Currency qa="difference" headerContent={x => x.financialVirementDetails.labels.costCategoryDifferenceCosts()} value={x => x.virement.newEligibleCosts - x.virement.originalEligibleCosts} footer={<ACC.Renderers.Currency value={financialVirements.newEligibleCosts - financialVirements.originalEligibleCosts}/> }/>
        </VirementTable.Table>
      </ACC.Page>
    );
  }

  private renderReasoning(project: ProjectDto, pcr: PCRDto) {
    if (!(project.roles & ProjectRole.MonitoringOfficer) || !pcr.reasoningComments) {
      return null;
    }
    return (
      <ACC.Info summary="Reasoning for the request">
        <ACC.Renderers.SimpleString multiline={true}>{pcr.reasoningComments}</ACC.Renderers.SimpleString>
      </ACC.Info>
    );
  }

  private getBackLink() {
    const params = {
      projectId: this.props.projectId,
      pcrId: this.props.pcrId,
      itemId: this.props.itemId
    };

    return <ACC.BackLink route={this.props.routes.pcrPrepareItem.getLink(params)} preserveData={true}>Back to summary</ACC.BackLink>;
  }
}

const Container = (props: Params & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <Component
          project={stores.projects.getById(props.projectId)}
          partner={stores.partners.getById(props.partnerId)}
          pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
          costCategories={stores.costCategories.getAllForPartner(props.partnerId)}
          financialVirements={stores.financialVirements.getPartnerVirements(props.projectId, props.partnerId, props.pcrId, props.itemId)}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const FinancialVirementDetailsRoute = defineRoute({
  routeName: "financial-virement-details",
  routePath: "/projects/:projectId/pcrs/:pcrId/:mode<view|review>/item/:itemId/financial/:partnerId",
  container: Container,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId,
    partnerId: route.params.partnerId,
    mode: route.params.mode
  }),
  getTitle: ({content}) => content.financialVirementDetails.title()
});
