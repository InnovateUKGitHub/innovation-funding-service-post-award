import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { EditorStatus, IEditorStore, StoresConsumer } from "@ui/redux";
import { Pending } from "@shared/pending";
import * as ACC from "@ui/components";
import { PartnerDto, ProjectDto } from "@framework/dtos";
import { FinancialVirementDtoValidator } from "@ui/validators";
import { PCRPrepareItemRoute } from "../pcrItemWorkflow";
import { createDto } from "@framework/util/dtoHelpers";

interface Params {
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

class Component extends ContainerBase<Params, Props, {}> {
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

    const costCategoriesWithVirement = costCategories
      .filter(x => x.competitionType === partner.competitionType && x.organisationType === partner.organisationType)
      .map(x => ({
        costCategory: x,
        virement: partnerVirements.virements.find(y => y.costCategoryId === x.id) || createDto<CostCategoryVirementDto>({
          costCategoryId: x.id,
          costCategoryName: x.name,
          newCostsNotYetClaimed: 0,
          newEligibleCosts: 0,
          newRemaining: 0,
          originalCostsClaimed: 0,
          originalCostsNotYetClaimed: 0,
          originalEligibleCosts: 0,
          originalRemaining: 0
        })
      }))
      ;

    const VirementForm = ACC.TypedForm<FinancialVirementDto>();
    const VirementTable = ACC.TypedTable<typeof costCategoriesWithVirement[0]>();

    return (
      <ACC.Page
        backLink={this.getBackLink()}
        pageTitle={<ACC.Projects.Title project={project} />}
        error={editor.error}
        validator={editor.validator}
      >
        <VirementForm.Form editor={editor} onChange={(dto) => this.props.onChange(false, dto)} onSubmit={() => this.props.onChange(true, editor.data)}>
          <VirementForm.Fieldset>
            <VirementTable.Table qa="partnerVirements" data={costCategoriesWithVirement}>
              <VirementTable.String header="Cost category" qa="costCategory" value={x => x.costCategory.name} footer="Total" />
              <VirementTable.Currency header="Current eligible costs" qa="originalEligibleCosts" value={x => x.virement.originalEligibleCosts} footer={<ACC.Renderers.Currency value={partnerVirements.originalEligibleCosts} />} />
              <VirementTable.Currency header="Eligible costs claimed" qa="originalCostsClaimed" value={x => x.virement.originalCostsClaimed} footer={<ACC.Renderers.Currency value={partnerVirements.originalCostsClaimed} />} />
              <VirementTable.Custom header="New eligible costs" qa="new" value={x => this.renderInput(partner, x.costCategory, x.virement, editor.status === EditorStatus.Saving)} footer={<ACC.Renderers.Currency value={partnerVirements.newEligibleCosts} />} classSuffix={"numeric"} />
              <VirementTable.Currency header="Costs reallocated" qa="difference" value={x => x.virement.newEligibleCosts - x.virement.originalEligibleCosts} footer={<ACC.Renderers.Currency value={partnerVirements.newEligibleCosts - partnerVirements.originalEligibleCosts} />} />
            </VirementTable.Table>
          </VirementForm.Fieldset>
          <VirementForm.Fieldset>
            <VirementForm.Submit>Save and return</VirementForm.Submit>
          </VirementForm.Fieldset>
        </VirementForm.Form>
      </ACC.Page>
    );
  }

  private renderInput(partner: PartnerDto, costCategory: CostCategoryDto, virement: CostCategoryVirementDto, disabled: boolean) {
    if (costCategory.isCalculated) {
      return <ACC.Renderers.Currency value={virement.newEligibleCosts} />;
    }
    return <ACC.Inputs.NumberInput name={virement.costCategoryId} value={virement.newEligibleCosts} onChange={(val) => this.updateValue(partner, costCategory, val)} width={4} ariaLabel={virement.costCategoryName} disabled={disabled} />;
  }

  private updateValue(partner: PartnerDto, costCategory: CostCategoryDto, value: number | null) {

    const dto = this.props.editor.data!.data;
    const partnerLevel = dto.partners.find(x => x.partnerId === partner.id)!;

    const partnerVirement = partnerLevel.virements
      .find(x => x.costCategoryId === costCategory.id)!;

    partnerVirement.newEligibleCosts = value!;

    if (costCategory.hasRelated && partner.overheadRate) {
      const calculatedCostCategories = this.props.costCategories.then(x => x.filter(y => y.isCalculated).map(y => y.id)).data || [];
      const related = partnerLevel.virements.find(v => calculatedCostCategories.indexOf(v.costCategoryId) !== -1);
      if (related) {
        related.newEligibleCosts = partnerVirement.newEligibleCosts * (partner.overheadRate / 100);
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

    return <ACC.BackLink route={this.props.routes.pcrPrepareItem.getLink(params)} replace={true}>Back to summary</ACC.BackLink>;
  }
}

const Container = (props: Params & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <Component
          project={stores.projects.getById(props.projectId)}
          partner={stores.partners.getById(props.partnerId)}
          costCategories={stores.costCategories.getAll()}
          editor={stores.financialVirements.getFiniancialVirementEditor(props.projectId, props.pcrId, props.itemId)}
          onChange={(saving, dto) => stores.financialVirements.updateFiniancialVirementEditor(saving, props.projectId, props.pcrId, props.itemId, dto, () => stores.navigation.navigateTo(PCRPrepareItemRoute.getLink({ projectId: props.projectId, pcrId: props.pcrId, itemId: props.itemId }), true))}
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
  getTitle: () => ({
    htmlTitle: "Financial Virement Edit Partner Details",
    displayTitle: "Financial Virement Edit Partner Details"
  }),
});
