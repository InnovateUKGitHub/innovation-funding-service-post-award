import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { EditorStatus, IEditorStore, StoresConsumer } from "@ui/redux";
import { Pending } from "@shared/pending";
import * as ACC from "@ui/components";
import { PartnerDto, ProjectDto } from "@framework/dtos";
import { CostCategoryVirementDtoValidator, FinancialVirementDtoValidator } from "@ui/validators";
import { createDto } from "@framework/util/dtoHelpers";
import { roundCurrency } from "@framework/util";

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
  onChange: (saving: boolean, dto: FinancialVirementDto) => void;
}

class Component extends ContainerBase<VirementCostsParams, Props, {}> {
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
    const partnerVirements = editor.data.partners.find(x => x.partnerId === this.props.partnerId)!;
    const partnerValidation = editor.validator.partners.results.find(x => x.model.partnerId === this.props.partnerId);

    const costCategoriesWithVirement = costCategories
      .map(x => ({
        costCategory: x,
        virement: partnerVirements.virements.find(y => y.costCategoryId === x.id) || createDto<CostCategoryVirementDto>({
          costCategoryId: x.id,
          costCategoryName: x.name,
        })
      }))
      ;

    const validation = costCategories
      .map(x => (partnerValidation && partnerValidation.virements.results.find(y => y.model.costCategoryId === x.id)) || null)
      ;

    const VirementForm = ACC.TypedForm<FinancialVirementDto>();
    const VirementTable = ACC.TypedTable<typeof costCategoriesWithVirement[0]>();
    const SummaryTable = ACC.TypedTable<FinancialVirementDto>();

    return (
      <ACC.Page
        backLink={this.getBackLink()}
        pageTitle={<ACC.Projects.Title project={project} />}
        error={editor.error}
        validator={partnerValidation}
      >
        <ACC.Section title={partner.name}>
          <VirementForm.Form editor={editor} onChange={(dto) => this.props.onChange(false, dto)} onSubmit={() => this.props.onChange(true, editor.data)}>
            <VirementForm.Fieldset>
              <VirementTable.Table qa="partnerVirements" data={costCategoriesWithVirement} validationResult={validation}>
                <VirementTable.String qa="costCategory" headerContent={x => x.financialVirementEdit.labels.costCategoryName()} value={x => x.costCategory.name} footer={<ACC.Content value={x => x.financialVirementEdit.labels.partnerTotals()} />} />
                <VirementTable.Currency qa="originalEligibleCosts" headerContent={x => x.financialVirementEdit.labels.costCategoryOriginalEligibleCosts()} value={x => x.virement.originalEligibleCosts} footer={<ACC.Renderers.Currency value={partnerVirements.originalEligibleCosts} />} />
                <VirementTable.Currency qa="originalCostsClaimed" headerContent={x => x.financialVirementEdit.labels.costCategoryCostsClaimed()} value={x => x.virement.costsClaimedToDate} footer={<ACC.Renderers.Currency value={partnerVirements.costsClaimedToDate} />} />
                <VirementTable.Custom qa="newEligibleCosts" headerContent={x => x.financialVirementEdit.labels.costCategoryNewEligibleCosts()} value={(x, i) => this.renderInput(partner, x.costCategory, x.virement, editor.status === EditorStatus.Saving, validation[i.row])} footer={<ACC.Renderers.Currency value={partnerVirements.newEligibleCosts} />} classSuffix={"numeric"} />
                <VirementTable.Currency qa="difference" headerContent={x => x.financialVirementEdit.labels.costCategoryDifferenceCosts()} value={x => x.virement.newEligibleCosts - x.virement.originalEligibleCosts} />
              </VirementTable.Table>
            </VirementForm.Fieldset>
            <VirementForm.Fieldset headingContent={x => x.financialVirementEdit.summaryTitle()}>
              <SummaryTable.Table qa="summary-table" data={[editor.data]}>
                <SummaryTable.Currency qa="originalEligibleCosts" headerContent={x => x.financialVirementEdit.labels.projectOriginalEligibleCosts()} value={x => x.originalEligibleCosts} />
                <SummaryTable.Currency qa="newEligibleCosts" headerContent={x => x.financialVirementEdit.labels.projectNewEligibleCosts()} value={x => x.newEligibleCosts} />
                <SummaryTable.Currency qa="differenceEligibleCosts" headerContent={x => x.financialVirementEdit.labels.projectDifferenceCosts()} value={x => x.newEligibleCosts - x.originalEligibleCosts} />
                <SummaryTable.Currency qa="originalGrant" headerContent={x => x.financialVirementEdit.labels.projectOriginalGrant()} value={x => x.originalGrant} />
                <SummaryTable.Currency qa="newGrant" headerContent={x => x.financialVirementEdit.labels.projectNewGrant()} value={x => x.newGrant} />
                <SummaryTable.Currency qa="differenceGrant" headerContent={x => x.financialVirementEdit.labels.projectDifferenceGrant()} value={x => x.newGrant - x.originalGrant} />
              </SummaryTable.Table>
            </VirementForm.Fieldset>
            <VirementForm.Fieldset>
              <VirementForm.Submit><ACC.Content value={x => x.financialVirementEdit.saveButton()} /></VirementForm.Submit>
            </VirementForm.Fieldset>
          </VirementForm.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderInput(partner: PartnerDto, costCategory: CostCategoryDto, virement: CostCategoryVirementDto, disabled: boolean, validation: CostCategoryVirementDtoValidator | null) {
    return (
      <React.Fragment>
        <ACC.ValidationError overrideMessage={`Invalid cost for ${costCategory.name}`} error={validation && validation.newEligibleCosts} />
        {costCategory.isCalculated ? <ACC.Renderers.Currency value={virement.newEligibleCosts} /> : null}
        {!costCategory.isCalculated ?
          <ACC.Inputs.NumberInput
            name={virement.costCategoryId}
            value={virement.newEligibleCosts}
            onChange={(val) => this.updateValue(partner, costCategory, val)}
            width={4}
            ariaLabel={virement.costCategoryName}
            disabled={disabled}
          />
          : null}
      </React.Fragment>
    );
  }

  private updateValue(partner: PartnerDto, costCategory: CostCategoryDto, value: number | null) {

    const dto = this.props.editor.data!.data;
    const partnerLevel = dto.partners.find(x => x.partnerId === partner.id)!;

    const partnerVirement = partnerLevel.virements
      .find(x => x.costCategoryId === costCategory.id)!;

    partnerVirement.newEligibleCosts = value!;

    if (costCategory.hasRelated && partner.overheadRate) {
      const calculatedCostCategoryIds = this.props.costCategories.then(x => x.filter(y => y.isCalculated).map(y => y.id)).data || [];
      const related = partnerLevel.virements.find(v => calculatedCostCategoryIds.indexOf(v.costCategoryId) !== -1);
      if (related) {
        related.newEligibleCosts = roundCurrency((partnerVirement.newEligibleCosts || 0) * (partner.overheadRate / 100));
      }
    }

    partnerLevel.newEligibleCosts = partnerLevel.virements.reduce((total, x) => total + x.newEligibleCosts, 0);

    dto.newEligibleCosts = dto.partners.filter(x => !!x.newEligibleCosts).reduce((total, x) => total + x.newEligibleCosts, 0);

    this.props.onChange(false, dto);
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

const Container = (props: VirementCostsParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <Component
          project={stores.projects.getById(props.projectId)}
          partner={stores.partners.getById(props.partnerId)}
          costCategories={stores.costCategories.getAllForPartner(props.partnerId)}
          editor={stores.financialVirements.getFiniancialVirementEditor(props.projectId, props.pcrId, props.itemId)}
          onChange={(saving, dto) => stores.financialVirements.updateFiniancialVirementEditor(saving, props.projectId, props.pcrId, props.itemId, dto,false, () =>
            stores.navigation.navigateTo(props.routes.pcrPrepareItem.getLink({ projectId: props.projectId, pcrId: props.pcrId, itemId: props.itemId }), true))}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const FinancialVirementEditRoute = defineRoute({
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
