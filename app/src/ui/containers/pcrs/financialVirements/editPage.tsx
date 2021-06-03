import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { EditorStatus, IEditorStore, useStores } from "@ui/redux";
import { Pending } from "@shared/pending";
import * as ACC from "@ui/components";
import { CostCategoryVirementDto, FinancialVirementDto, PartnerDto, ProjectDto } from "@framework/dtos";
import { CostCategoryVirementDtoValidator, FinancialVirementDtoValidator } from "@ui/validators";
import { createDto } from "@framework/util/dtoHelpers";
import { roundCurrency } from "@framework/util";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { projectCompetition, useContent } from "@ui/hooks";
import { getAuthRoles } from "@framework/types";

export function useEditPageContent() {
  const { getContent } = useContent();

  return {
    summaryTitle: getContent(x => x.financialVirementEdit.summaryTitle),
    saveButton: getContent(x => x.financialVirementEdit.saveButton),

    introMessage: getContent(x => x.financialVirementEdit.editPageMessage.intro),
    virementsMessage: getContent(x => x.financialVirementEdit.editPageMessage.virements),
    requestsMessage: getContent(x => x.financialVirementEdit.editPageMessage.requests),

    costCategoryName: getContent(x => x.financialVirementEdit.labels.costCategoryName),
    costCategoryOriginalEligibleCosts: getContent(
      x => x.financialVirementEdit.labels.costCategoryOriginalEligibleCosts,
    ),
    costCategoryCostsClaimed: getContent(x => x.financialVirementEdit.labels.costCategoryCostsClaimed),
    costCategoryNewEligibleCosts: getContent(x => x.financialVirementEdit.labels.costCategoryNewEligibleCosts),
    costCategoryDifferenceCosts: getContent(x => x.financialVirementEdit.labels.costCategoryDifferenceCosts),
    partnerTotals: getContent(x => x.financialVirementEdit.labels.partnerTotals),
    projectOriginalEligibleCosts: getContent(x => x.financialVirementEdit.labels.projectOriginalEligibleCosts),
    projectNewEligibleCosts: getContent(x => x.financialVirementEdit.labels.projectNewEligibleCosts),
    projectDifferenceCosts: getContent(x => x.financialVirementEdit.labels.projectDifferenceCosts),
    projectOriginalRemainingGrant: getContent(x => x.financialVirementEdit.labels.projectOriginalRemainingGrant),
    projectNewRemainingGrant: getContent(x => x.financialVirementEdit.labels.projectNewRemainingGrant),
    projectDifferenceGrant: getContent(x => x.financialVirementEdit.labels.projectDifferenceGrant),
    backToSummary: getContent(x => x.financialVirementEdit.labels.backToSummary),
  };
}

export interface VirementCostsParams {
  projectId: string;
  partnerId: string;
  pcrId: string;
  itemId: string;
}

interface Props {
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  costCategories: Pending<CostCategoryDto[]>;
  editor: Pending<IEditorStore<FinancialVirementDto, FinancialVirementDtoValidator>>;
  content: Record<string, string>;
  onChange: (saving: boolean, dto: FinancialVirementDto) => void;
}

class EditPageComponent extends ContainerBase<VirementCostsParams, Props, {}> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      costCategories: this.props.costCategories,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={data => this.renderPage(data.project, data.partner, data.costCategories, data.editor)} />;
  }

  private renderPage(project: ProjectDto, partner: PartnerDto, costCategories: CostCategoryDto[], editor: IEditorStore<FinancialVirementDto, FinancialVirementDtoValidator>) {
    const currentPartnerVirement = editor.data.partners.find(x => x.partnerId === this.props.partnerId)!;
    const partnerVirementsValidator = editor.validator.partners.results.find(x => x.model.partnerId === this.props.partnerId);

    const costCategoriesWithVirement = costCategories
      .map(x => ({
        costCategory: x,
        virement: currentPartnerVirement.virements.find(y => y.costCategoryId === x.id) || createDto<CostCategoryVirementDto>({
          costCategoryId: x.id,
          costCategoryName: x.name,
        })
      }))
      ;

    const validation = costCategories
      .map(x => (partnerVirementsValidator?.virements.results.find(y => y.model.costCategoryId === x.id)) || null)
      ;

    const VirementForm = ACC.TypedForm<FinancialVirementDto>();
    const VirementTable = ACC.TypedTable<typeof costCategoriesWithVirement[0]>();
    const SummaryTable = ACC.TypedTable<FinancialVirementDto>();

    const { isPm } = getAuthRoles(project.roles);
    const { isKTP } = projectCompetition(project.competitionType);
    const  displayIntroMessage: boolean = isKTP && isPm;

    return (
      <ACC.Page
        backLink={this.getBackLink()}
        pageTitle={<ACC.Projects.Title {...project} />}
        error={editor.error}
        validator={partnerVirementsValidator}
      >
        {displayIntroMessage && (
          <>
            <ACC.Renderers.SimpleString>{this.props.content.introMessage}</ACC.Renderers.SimpleString>
            <ACC.Renderers.SimpleString>{this.props.content.virementsMessage}</ACC.Renderers.SimpleString>
            <ACC.Renderers.SimpleString>{this.props.content.requestsMessage}</ACC.Renderers.SimpleString>
          </>
        )}

        <ACC.Section title={partner.name}>
          <VirementForm.Form
            editor={editor}
            onChange={dto => this.props.onChange(false, dto)}
            onSubmit={() => this.props.onChange(true, editor.data)}
            qa="virementForm"
          >
            <VirementForm.Fieldset>
              <VirementTable.Table
                qa="partnerVirements"
                data={costCategoriesWithVirement}
                validationResult={validation}
              >
                <VirementTable.String
                  qa="costCategory"
                  header={this.props.content.costCategoryName}
                  value={x => x.costCategory.name}
                  footer={this.props.content.partnerTotals}
                />
                <VirementTable.Currency
                  qa="originalEligibleCosts"
                  header={this.props.content.costCategoryOriginalEligibleCosts}
                  value={x => x.virement.originalEligibleCosts}
                  footer={<ACC.Renderers.Currency value={currentPartnerVirement.originalEligibleCosts} />}
                />
                <VirementTable.Currency
                  qa="originalCostsClaimed"
                  header={this.props.content.costCategoryCostsClaimed}
                  value={x => x.virement.costsClaimedToDate}
                  footer={<ACC.Renderers.Currency value={currentPartnerVirement.costsClaimedToDate} />}
                />
                <VirementTable.Custom
                  qa="newEligibleCosts"
                  header={this.props.content.costCategoryNewEligibleCosts}
                  value={(x, i) =>
                    this.renderInput(
                      partner,
                      x.costCategory,
                      x.virement,
                      editor.status === EditorStatus.Saving,
                      validation[i.row],
                    )
                  }
                  footer={<ACC.Renderers.Currency value={currentPartnerVirement.newEligibleCosts} />}
                  classSuffix={"numeric"}
                />
                <VirementTable.Currency
                  qa="difference"
                  header={this.props.content.costCategoryDifferenceCosts}
                  value={x => roundCurrency(x.virement.newEligibleCosts - x.virement.originalEligibleCosts)}
                />
              </VirementTable.Table>
            </VirementForm.Fieldset>
            <VirementForm.Fieldset heading={this.props.content.summaryTitle}>
              <SummaryTable.Table qa="summary-table" data={[editor.data]}>
                <SummaryTable.Currency
                  qa="originalEligibleCosts"
                  header={this.props.content.projectOriginalEligibleCosts}
                  value={x => x.originalEligibleCosts}
                />
                <SummaryTable.Currency
                  qa="newEligibleCosts"
                  header={this.props.content.projectNewEligibleCosts}
                  value={x => x.newEligibleCosts}
                />
                <SummaryTable.Currency
                  qa="differenceEligibleCosts"
                  header={this.props.content.projectDifferenceCosts}
                  value={x => roundCurrency(x.newEligibleCosts - x.originalEligibleCosts)}
                />
                <SummaryTable.Currency
                  qa="originalRemainingGrant"
                  header={this.props.content.projectOriginalRemainingGrant}
                  value={x => x.originalRemainingGrant}
                />
                <SummaryTable.Currency
                  qa="newRemainingGrant"
                  header={this.props.content.projectNewRemainingGrant}
                  value={x => x.newRemainingGrant}
                />
                <SummaryTable.Currency
                  qa="differenceRemainingGrant"
                  header={this.props.content.projectDifferenceGrant}
                  value={x => roundCurrency(x.newRemainingGrant - x.originalRemainingGrant)}
                />
              </SummaryTable.Table>
            </VirementForm.Fieldset>
            <VirementForm.Fieldset>
              <VirementForm.Submit>{this.props.content.saveButton}</VirementForm.Submit>
            </VirementForm.Fieldset>
          </VirementForm.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderInput(partner: PartnerDto, costCategory: CostCategoryDto, virement: CostCategoryVirementDto, disabled: boolean, validation: CostCategoryVirementDtoValidator | null) {
    return (
      <>
        <ACC.ValidationError overrideMessage={`Invalid cost for ${costCategory.name}`} error={validation && validation.newPartnerEligibleCosts} />
        {costCategory.isCalculated ? <ACC.Renderers.Currency value={virement.newEligibleCosts} /> : null}
        {!costCategory.isCalculated ?
          <ACC.Inputs.NumberInput
            name={virement.costCategoryId}
            value={virement.newEligibleCosts}
            onChange={(val) => this.updateValue(partner, costCategory, val)}
            width="full"
            ariaLabel={virement.costCategoryName}
            disabled={disabled}
          />
          : null}
      </>
    );
  }

  private updateValue({overheadRate, id}: PartnerDto, costCategory: CostCategoryDto, value: number | null) {
    const projectCosts = this.props.editor.data!.data;
    const currentPartner = projectCosts.partners.find((x) => x.partnerId === id)!;
    const costCategoryVirements = currentPartner.virements.find((x) => x.costCategoryId === costCategory.id)!;
    costCategoryVirements.newEligibleCosts = value!;

    if (overheadRate) {
      const calculatedCostCategoryIds =
        this.props.costCategories.then((x) => x.filter((y) => y.isCalculated).map((y) => y.id)).data || [];
      const related = currentPartner.virements.find((v) => calculatedCostCategoryIds.indexOf(v.costCategoryId) !== -1);
      if (related) {
        // prevent newEligibleCosts from being calculated by SF
        related.newEligibleCosts = roundCurrency(
          (costCategoryVirements.newEligibleCosts || 0) * (overheadRate / 100),
        );
      }
    }

    currentPartner.newEligibleCosts = currentPartner.virements.reduce((total, x) => total + x.newEligibleCosts, 0);
    const newRemainingCosts = currentPartner.newEligibleCosts - currentPartner.costsClaimedToDate;
    const newFundingPercentage = currentPartner.newFundingLevel / 100;
    currentPartner.newRemainingGrant = roundCurrency(newRemainingCosts * newFundingPercentage);

    projectCosts.newEligibleCosts = projectCosts.partners
      .filter((x) => !!x.newEligibleCosts)
      .reduce((total, x) => total + x.newEligibleCosts, 0);
    projectCosts.newRemainingGrant = roundCurrency(projectCosts.partners.reduce((total, p) => total + p.newRemainingGrant, 0));
    this.props.onChange(false, projectCosts);
  }

  private getBackLink() {
    const params = {
      projectId: this.props.projectId,
      pcrId: this.props.pcrId,
      itemId: this.props.itemId
    };

    return <ACC.BackLink route={this.props.routes.pcrPrepareItem.getLink(params)} preserveData><ACC.Content value={x => x.financialVirementEdit.labels.backToSummary}/></ACC.BackLink>;
  }
}

const Container = (props: VirementCostsParams & BaseProps) => {
  const { projects, partners, costCategories, financialVirements, navigation } = useStores();
  const editPageContent = useEditPageContent();

  return (
    <EditPageComponent
      content={editPageContent}
      project={projects.getById(props.projectId)}
      partner={partners.getById(props.partnerId)}
      costCategories={costCategories.getAllForPartner(props.partnerId)}
      editor={financialVirements.getFinancialVirementEditor(props.projectId, props.pcrId, props.itemId, props.partnerId)}
      onChange={(saving, dto) =>
        financialVirements.updateFinancialVirementEditor(
          saving,
          props.projectId,
          props.pcrId,
          props.itemId,
          dto,
          false,
          () =>
            navigation.navigateTo(
              props.routes.pcrPrepareItem.getLink({
                projectId: props.projectId,
                pcrId: props.pcrId,
                itemId: props.itemId,
              }),
              true,
            ),
          props.partnerId
        )
      }
      {...props}
    />
  );
};

export const FinancialVirementEditRoute = defineRoute({
  // pm reallocates costs for participant at cost category level
  routeName: "financial-virement-edit",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/financial/:partnerId",
  container: Container,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId,
    partnerId: route.params.partnerId,
  }),
  getTitle: ({ content }) => content.financialVirementEdit.title()
});
