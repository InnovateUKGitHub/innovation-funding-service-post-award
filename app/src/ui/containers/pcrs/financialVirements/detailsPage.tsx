import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { useStores } from "@ui/redux";
import { Pending } from "@shared/pending";
import * as ACC from "@ui/components";
import { CostCategoryVirementDto, PartnerDto, PartnerVirementsDto, PCRDto, ProjectDto } from "@framework/dtos";
import { createDto } from "@framework/util/dtoHelpers";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { roundCurrency } from "@framework/util";
import { getAuthRoles } from "@framework/types";

type Mode = "review" | "view";

interface Params {
  projectId: ProjectId;
  partnerId: PartnerId;
  pcrId: PcrId;
  itemId: PcrItemId;
  mode: Mode;
}

interface Props {
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  pcr: Pending<PCRDto>;
  costCategories: Pending<CostCategoryDto[]>;
  financialVirements: Pending<PartnerVirementsDto>;
}

interface TableData {
  costCategory: CostCategoryDto;
  virement: CostCategoryVirementDto;
}

const VirementTable = ACC.createTypedTable<TableData>();

class Component extends ContainerBase<Params, Props> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      pcr: this.props.pcr,
      costCategories: this.props.costCategories,
      financialVirements: this.props.financialVirements,
    });

    return (
      <ACC.PageLoader
        pending={combined}
        render={data =>
          this.renderPage(data.project, data.partner, data.costCategories, data.financialVirements, data.pcr)
        }
      />
    );
  }

  private renderPage(
    project: ProjectDto,
    partner: PartnerDto,
    costCategories: CostCategoryDto[],
    financialVirements: PartnerVirementsDto,
    pcr: PCRDto,
  ) {
    const data: TableData[] = costCategories.map(costCategory => ({
      costCategory,
      virement:
        financialVirements.virements.find(x => x.costCategoryId === costCategory.id) ||
        createDto<CostCategoryVirementDto>({}),
    }));
    return (
      <ACC.Page backLink={this.getBackLink()} pageTitle={<ACC.Projects.Title {...project} />}>
        <ACC.Section title={partner.name}>
          {this.renderReasoning(project, pcr)}
          <VirementTable.Table qa="partnerVirements" data={data}>
            <VirementTable.String
              qa="costCategory"
              header={x => x.financialVirementLabels.costCategoryName}
              value={x => x.costCategory.name}
              footer={<ACC.Content value={x => x.financialVirementLabels.partnerTotals} />}
            />
            <VirementTable.Currency
              qa="originalEligibleCosts"
              header={x => x.financialVirementLabels.costCategoryOriginalEligibleCosts}
              value={x => x.virement.originalEligibleCosts}
              footer={<ACC.Renderers.Currency value={financialVirements.originalEligibleCosts} />}
            />
            <VirementTable.Currency
              qa="newEligibleCosts"
              header={x => x.financialVirementLabels.costCategoryNewEligibleCosts}
              value={x => x.virement.newEligibleCosts}
              footer={<ACC.Renderers.Currency value={financialVirements.newEligibleCosts} />}
            />
            <VirementTable.Currency
              qa="difference"
              header={x => x.financialVirementLabels.costCategoryDifferenceCosts}
              value={x => roundCurrency(x.virement.newEligibleCosts - x.virement.originalEligibleCosts)}
              footer={
                <ACC.Renderers.Currency
                  value={roundCurrency(financialVirements.newEligibleCosts - financialVirements.originalEligibleCosts)}
                />
              }
            />
          </VirementTable.Table>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderReasoning(project: ProjectDto, pcr: PCRDto) {
    const { isMo } = getAuthRoles(project.roles);
    const inValidReason = !isMo || !pcr.reasoningComments;

    if (inValidReason) return null;

    return (
      <ACC.Info summary="Reasoning for the request" qa="reasoning_for_the_request">
        <ACC.Renderers.SimpleString multiline>{pcr.reasoningComments}</ACC.Renderers.SimpleString>
      </ACC.Info>
    );
  }

  private getBackLink() {
    const params = {
      projectId: this.props.projectId,
      pcrId: this.props.pcrId,
      itemId: this.props.itemId,
    };

    if (this.props.mode === "review") {
      return (
        <ACC.BackLink route={this.props.routes.pcrReviewItem.getLink(params)}>
          <ACC.Content value={x => x.financialVirementLabels.backToSummary} />
        </ACC.BackLink>
      );
    }
    return (
      <ACC.BackLink route={this.props.routes.pcrViewItem.getLink(params)}>
        <ACC.Content value={x => x.financialVirementLabels.backToSummary} />
      </ACC.BackLink>
    );
  }
}

const Container = (props: Params & BaseProps) => {
  const stores = useStores();

  return (
    <Component
      {...props}
      project={stores.projects.getById(props.projectId)}
      partner={stores.partners.getById(props.partnerId)}
      pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
      costCategories={stores.costCategories.getAllForPartner(props.partnerId)}
      financialVirements={stores.financialVirements.getPartnerVirements(
        props.projectId,
        props.partnerId,
        props.pcrId,
        props.itemId,
      )}
    />
  );
};

export const FinancialVirementDetailsRoute = defineRoute({
  routeName: "financial-virement-details",
  routePath: "/projects/:projectId/pcrs/:pcrId/:mode/item/:itemId/financial/:partnerId",
  container: Container,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
    partnerId: route.params.partnerId as PartnerId,
    mode: route.params.mode as Mode,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.financialVirementDetails.title),
});
