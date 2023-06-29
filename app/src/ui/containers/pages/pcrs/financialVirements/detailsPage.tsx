import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { Pending } from "@shared/pending";
import { createDto } from "@framework/util/dtoHelpers";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { getAuthRoles } from "@framework/types/authorisation";
import { PartnerVirementsDto, CostCategoryVirementDto } from "@framework/dtos/financialVirementDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { ProjectDto } from "@framework/dtos/projectDto";
import { roundCurrency } from "@framework/util/numberHelper";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { PageLoader } from "@ui/components/bjss/loading";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { createTypedTable } from "@ui/components/atomicDesign/molecules/Table/Table";
import { useStores } from "@ui/redux/storesProvider";
import { Info } from "@ui/components/atomicDesign/atoms/Details/Details";

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

const VirementTable = createTypedTable<TableData>();

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
      <PageLoader
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
      <Page backLink={this.getBackLink()} pageTitle={<Title {...project} />}>
        <Section title={partner.name}>
          {this.renderReasoning(project, pcr)}
          <VirementTable.Table qa="partnerVirements" data={data}>
            <VirementTable.String
              qa="costCategory"
              header={x => x.financialVirementLabels.costCategoryName}
              value={x => x.costCategory.name}
              footer={<Content value={x => x.financialVirementLabels.partnerTotals} />}
            />
            <VirementTable.Currency
              qa="originalEligibleCosts"
              header={x => x.financialVirementLabels.costCategoryOriginalEligibleCosts}
              value={x => x.virement.originalEligibleCosts}
              footer={<Currency value={financialVirements.originalEligibleCosts} />}
            />
            <VirementTable.Currency
              qa="newEligibleCosts"
              header={x => x.financialVirementLabels.costCategoryNewEligibleCosts}
              value={x => x.virement.newEligibleCosts}
              footer={<Currency value={financialVirements.newEligibleCosts} />}
            />
            <VirementTable.Currency
              qa="difference"
              header={x => x.financialVirementLabels.costCategoryDifferenceCosts}
              value={x => roundCurrency(x.virement.newEligibleCosts - x.virement.originalEligibleCosts)}
              footer={
                <Currency
                  value={roundCurrency(financialVirements.newEligibleCosts - financialVirements.originalEligibleCosts)}
                />
              }
            />
          </VirementTable.Table>
        </Section>
      </Page>
    );
  }

  private renderReasoning(project: ProjectDto, pcr: PCRDto) {
    const { isMo } = getAuthRoles(project.roles);
    const inValidReason = !isMo || !pcr.reasoningComments;

    if (inValidReason) return null;

    return (
      <Info summary="Reasoning for the request" qa="reasoning_for_the_request">
        <SimpleString multiline>{pcr.reasoningComments}</SimpleString>
      </Info>
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
        <BackLink route={this.props.routes.pcrReviewItem.getLink(params)}>
          <Content value={x => x.financialVirementLabels.backToSummary} />
        </BackLink>
      );
    }
    return (
      <BackLink route={this.props.routes.pcrViewItem.getLink(params)}>
        <Content value={x => x.financialVirementLabels.backToSummary} />
      </BackLink>
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
