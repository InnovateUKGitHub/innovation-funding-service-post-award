import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { StoresConsumer } from "@ui/redux";
import { Pending } from "@shared/pending";
import * as ACC from "@ui/components";
import { ProjectDto } from "@framework/dtos";

interface Params {
  projectId: string;
  partnerId: string;
  pcrId: string;
  itemId: string;
  mode: "review" | "view";
}

interface Props {
  project: Pending<ProjectDto>;
  financialVirements: Pending<PartnerVirementsDto>;
}

class Component extends ContainerBase<Params, Props, {}> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      financialVirements: this.props.financialVirements
    });

    return <ACC.PageLoader pending={combined} render={data => this.renderPage(data.project, data.financialVirements)} />;
  }

  private renderPage(project: ProjectDto, financialVirements: PartnerVirementsDto) {
    const VirementTable = ACC.TypedTable<CostCategoryVirementDto>();
    return (
      <ACC.Page
        backLink={this.getBackLink()}
        pageTitle={<ACC.Projects.Title project={project} />}
      >
        <VirementTable.Table qa="partnerVirements" data={financialVirements.virements}>
          <VirementTable.String header="Cost category" qa="costCategory" value={x =>  x.costCategoryName} footer="Total" />
          <VirementTable.Currency header="Original" qa="original" value={x => x.originalEligibleCosts} footer={<ACC.Renderers.Currency value={financialVirements.originalEligibleCosts}/> }/>
          <VirementTable.Currency header="New" qa="new" value={x => x.newEligibleCosts} footer={<ACC.Renderers.Currency value={financialVirements.newEligibleCosts}/> }/>
        </VirementTable.Table>
      </ACC.Page>
    );
  }

  private getBackLink() {
    const params = {
      projectId: this.props.projectId,
      pcrId: this.props.pcrId,
      itemId: this.props.itemId
    };

    return <ACC.BackLink route={this.props.routes.pcrPrepareItem.getLink(params)} replace={true}>Back to summary</ACC.BackLink>;
  }
}

const Container = (props: Params & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <Component
          project={stores.projects.getById(props.projectId)}
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
  getTitle: () => ({
    htmlTitle: "Financial Virement Partner Details",
    displayTitle: "Financial Virement Partner Details"
  }),
});
