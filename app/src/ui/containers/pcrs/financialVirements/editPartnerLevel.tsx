import React from "react";
import * as ACC from "@ui/components";
import { Pending } from "@shared/pending";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { EditorStatus, IEditorStore, StoresConsumer } from "@ui/redux";
import { FinancialVirementDtoValidator, PartnerVirementsDtoValidator } from "@ui/validators";
import { PartnerDto, ProjectDto } from "@framework/dtos";

export interface FinancialVirementParams {
  projectId: string;
  pcrId: string;
  itemId: string;
}

interface Props {
  project: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
  editor: Pending<IEditorStore<FinancialVirementDto, FinancialVirementDtoValidator>>;
  onChange: (saving: boolean, dto: FinancialVirementDto) => void;
}

class Component extends ContainerBase<FinancialVirementParams, Props, {}> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      partners: this.props.partners,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={data => this.renderPage(data.project, data.partners, data.editor)} />;
  }

  private renderPage(project: ProjectDto, partners: PartnerDto[], editor: IEditorStore<FinancialVirementDto, FinancialVirementDtoValidator>) {
    const data = partners.map(partner => ({ partner, virement: editor.data.partners.find(x => x.partnerId === partner.id)!, validator: editor.validator.partners.results.find(x => x.model.partnerId === partner.id) })).filter(x => !!x.virement);
    const validation = data.map(x => x.validator);

    const VirementForm = ACC.TypedForm<FinancialVirementDto>();
    const VirementTable = ACC.TypedTable<typeof data[0]>();

    return (
      <ACC.Page
        backLink={this.getBackLink()}
        pageTitle={<ACC.Projects.Title project={project} />}
        error={editor.error}
        validator={editor.validator}
      >
        <ACC.Section>
          <VirementForm.Form editor={editor} onChange={(dto) => this.props.onChange(false, dto)} onSubmit={() => this.props.onChange(true, editor.data)}>
            <VirementForm.Fieldset>
              <VirementTable.Table qa="partnerVirements" data={data} validationResult={validation}>
                <VirementTable.String qa="partner" headerContent={x => x.financialVirementEdit.labels.costCategoryName()} value={x => x.partner.name} footer={<ACC.Content value={x => x.financialVirementEdit.labels.totals()} />} isDivider="normal" />
                <VirementTable.Currency qa="remainingCosts" headerContent={x => x.financialVirementEdit.labels.partnerOriginalRemainingCosts()} value={x => x.virement.originalRemainingCosts} footer={<ACC.Renderers.Currency value={editor.data.originalEligibleCosts} />} />
                <VirementTable.Currency qa="remainingGrant" headerContent={x => x.financialVirementEdit.labels.partnerOriginalRemainingGrant()} value={x => x.virement.originalRemainingGrant} footer={<ACC.Renderers.Currency value={editor.data.originalRemainingGrant} />} />
                <VirementTable.Percentage qa="fundingLevel" headerContent={x => x.financialVirementEdit.labels.originalFundingLevel()} value={(x, i) => x.virement.originalFundingLevel} footer={<ACC.Renderers.Percentage value={editor.data.originalFundingLevel} />} isDivider="normal" />
                <VirementTable.Currency qa="newCosts" headerContent={x => x.financialVirementEdit.labels.partnerNewRemainingCosts()} value={x => x.virement.newRemainingCosts} footer={<ACC.Renderers.Currency value={editor.data.newEligibleCosts} />} />
                <VirementTable.Custom qa="newGrant" headerContent={x => x.financialVirementEdit.labels.partnerNewRemainingGrant()} value={x => this.renderInput(x.partner, x.virement, editor.status === EditorStatus.Saving, x.validator)} footer={this.renderFooter(editor)} classSuffix="numeric" />
                <VirementTable.Percentage qa="newLevel" headerContent={x => x.financialVirementEdit.labels.newFundingLevel()} value={(x, i) => x.virement.newFundingLevel} footer={<ACC.Renderers.Percentage value={editor.data.newFundingLevel} />} />
              </VirementTable.Table>
            </VirementForm.Fieldset>
            <VirementForm.Fieldset>
              <VirementForm.Submit><ACC.Content value={x => x.financialVirementEdit.saveButton()} /></VirementForm.Submit>
            </VirementForm.Fieldset>
          </VirementForm.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderInput(partner: PartnerDto, virement: PartnerVirementsDto, disabled: boolean, validation: PartnerVirementsDtoValidator | undefined) {
    return (
      <React.Fragment>
        <ACC.ValidationError overrideMessage={`Invalid grant for ${partner.name}`} error={validation && validation.newRemainingGrant} />
        <ACC.Inputs.NumberInput name={virement.partnerId} value={virement.newRemainingGrant} onChange={(val) => this.updateValue(partner, val)} width={4} ariaLabel={partner.name} disabled={disabled} />
      </React.Fragment>
    );
  }

  private renderFooter(editor: IEditorStore<FinancialVirementDto, FinancialVirementDtoValidator>) {
    return (
      <React.Fragment>
        <ACC.ValidationError error={editor.validator.newRemainingGrant} />
        <ACC.Renderers.Currency value={editor.data.newRemainingGrant} />
      </React.Fragment>
    );
  }

  private updateValue(partner: PartnerDto, val: number | null): void {
    const dto = this.props.editor.data!.data;

    const item = dto.partners.find(x => x.partnerId === partner.id);
    if (!item) {
      return;
    }
    item.newRemainingGrant = val!;
    item.newFundingLevel = 100 * (val || 0) / item.newRemainingCosts;

    dto.newRemainingGrant = dto.partners.reduce((total, current) => total + (current.newRemainingGrant || 0), 0);
    dto.newFundingLevel = 100 * dto.newRemainingGrant / dto.newRemainingCosts;

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

const Container = (props: FinancialVirementParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <Component
          project={stores.projects.getById(props.projectId)}
          partners={stores.partners.getPartnersForProject(props.projectId)}
          editor={stores.financialVirements.getFiniancialVirementEditor(props.projectId, props.pcrId, props.itemId)}
          onChange={(saving, dto) => stores.financialVirements.updateFiniancialVirementEditor(saving, props.projectId, props.pcrId, props.itemId, dto, true, () =>
            stores.navigation.navigateTo(props.routes.pcrPrepareItem.getLink({ projectId: props.projectId, pcrId: props.pcrId, itemId: props.itemId }), true))}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const FinancialVirementEditPartnerLevelRoute = defineRoute({
  routeName: "financial-virement-edit-partner-level",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/partner",
  container: Container,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId,
  }),
  getTitle: ({ content }) => content.financialVirementEdit.title()
});
