import * as ACC from "@ui/components";
import { Pending } from "@shared/pending";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { EditorStatus, IEditorStore, useStores } from "@ui/redux";
import { FinancialVirementDtoValidator, PartnerVirementsDtoValidator } from "@ui/validators";
import { FinancialVirementDto, PartnerDto, PartnerVirementsDto, ProjectDto } from "@framework/dtos";
import { useContent } from "@ui/hooks";

export function useEditPartnerLevelContent() {
  const { getContent } = useContent();

  return {
    saveButton: getContent(x => x.financialVirementEditPartnerLevel.saveButton),

    remainingGrantInfoIntro: getContent(x => x.financialVirementEditPartnerLevel.remainingGrantInfo.intro),
    remainingGrantInfoCheckRules: getContent(x => x.financialVirementEditPartnerLevel.remainingGrantInfo.checkRules),
    remainingGrantInfoRemainingGrant: getContent(x => x.financialVirementEditPartnerLevel.remainingGrantInfo.remainingGrant),
    remainingGrantInfoFundingLevel: getContent(x => x.financialVirementEditPartnerLevel.remainingGrantInfo.fundingLevel),

    partnerName: getContent(x => x.financialVirementEditPartnerLevel.labels.partnerName),
    partnerOriginalRemainingCosts: getContent(x => x.financialVirementEditPartnerLevel.labels.partnerOriginalRemainingCosts),
    partnerOriginalRemainingGrant: getContent(x => x.financialVirementEditPartnerLevel.labels.partnerOriginalRemainingGrant),
    originalFundingLevel: getContent(x => x.financialVirementEditPartnerLevel.labels.originalFundingLevel),
    partnerNewRemainingCosts: getContent(x => x.financialVirementEditPartnerLevel.labels.partnerNewRemainingCosts),
    partnerNewRemainingGrant: getContent(x => x.financialVirementEditPartnerLevel.labels.partnerNewRemainingGrant),
    newFundingLevel: getContent(x => x.financialVirementEditPartnerLevel.labels.newFundingLevel),
    projectTotals: getContent(x => x.financialVirementEditPartnerLevel.labels.projectTotals),
    backToSummary: getContent(x => x.financialVirementEditPartnerLevel.labels.backToSummary),
  };
}

export interface FinancialVirementParams {
  projectId: string;
  pcrId: string;
  itemId: string;
}

interface Props {
  project: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
  editor: Pending<IEditorStore<FinancialVirementDto, FinancialVirementDtoValidator>>;
  content: Record<string, string>;
  onChange: (saving: boolean, dto: FinancialVirementDto) => void;
}

class EditPartnerLevelComponent extends ContainerBase<FinancialVirementParams, Props, {}> {
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
        pageTitle={<ACC.Projects.Title {...project} />}
        error={editor.error}
        validator={editor.validator}
      >
        <ACC.Section>
          <ACC.Renderers.SimpleString>{this.props.content.remainingGrantInfoIntro}</ACC.Renderers.SimpleString>
          <ACC.Renderers.SimpleString>{this.props.content.remainingGrantInfoCheckRules}</ACC.Renderers.SimpleString>
          <ACC.Renderers.SimpleString>{this.props.content.remainingGrantInfoRemainingGrant}</ACC.Renderers.SimpleString>
          <ACC.Renderers.SimpleString>{this.props.content.remainingGrantInfoFundingLevel}</ACC.Renderers.SimpleString>
          <VirementForm.Form editor={editor} onChange={(dto) => this.props.onChange(false, dto)} onSubmit={() => this.props.onChange(true, editor.data)} qa="partner_level_form">
            <VirementForm.Fieldset>
              <VirementTable.Table qa="partnerVirements" data={data} validationResult={validation}>
                <VirementTable.String qa="partner" header={this.props.content.partnerName} value={x => x.partner.name} footer={this.props.content.projectTotals} isDivider="normal" />
                <VirementTable.Currency qa="remainingCosts" header={this.props.content.partnerOriginalRemainingCosts} value={x => x.virement.originalRemainingCosts} footer={<ACC.Renderers.Currency value={editor.data.originalRemainingCosts} />} />
                <VirementTable.Currency qa="remainingGrant" header={this.props.content.partnerOriginalRemainingGrant} value={x => x.virement.originalRemainingGrant} footer={<ACC.Renderers.Currency value={editor.data.originalRemainingGrant} />} />
                <VirementTable.Percentage qa="fundingLevel" header={this.props.content.originalFundingLevel} value={(x, i) => x.virement.originalFundingLevel} footer={<ACC.Renderers.Percentage value={editor.data.originalFundingLevel} />} isDivider="normal" />
                <VirementTable.Currency qa="newCosts" header={this.props.content.partnerNewRemainingCosts} value={x => x.virement.newRemainingCosts} footer={<ACC.Renderers.Currency value={editor.data.newRemainingCosts} />} />
                <VirementTable.Custom qa="newGrant" header={this.props.content.partnerNewRemainingGrant} value={x => this.renderInput(x.partner, x.virement, editor.status === EditorStatus.Saving, x.validator)} footer={this.renderFooter(editor)} classSuffix="numeric" />
                <VirementTable.Percentage qa="newLevel" header={this.props.content.newFundingLevel} value={(x, i) => x.virement.newFundingLevel} footer={<ACC.Renderers.Percentage value={editor.data.newFundingLevel} />} />
              </VirementTable.Table>
            </VirementForm.Fieldset>
            <VirementForm.Fieldset>
              <VirementForm.Submit>{this.props.content.saveButton}</VirementForm.Submit>
            </VirementForm.Fieldset>
          </VirementForm.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderInput(partner: PartnerDto, virement: PartnerVirementsDto, disabled: boolean, validation: PartnerVirementsDtoValidator | undefined) {
    return (
      <>
        <ACC.ValidationError overrideMessage={`Invalid grant for ${partner.name}`} error={validation && validation.newRemainingGrant} />
        <ACC.Inputs.NumberInput name={virement.partnerId} value={virement.newRemainingGrant} onChange={(val) => this.updateValue(partner, val)} width={4} ariaLabel={partner.name} disabled={disabled} />
      </>
    );
  }

  private renderFooter(editor: IEditorStore<FinancialVirementDto, FinancialVirementDtoValidator>) {
    return (
      <>
        <ACC.ValidationError error={editor.validator.newRemainingGrant} />
        <ACC.Renderers.Currency value={editor.data.newRemainingGrant} />
      </>
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

    return <ACC.BackLink route={this.props.routes.pcrPrepareItem.getLink(params)} preserveData={true}>{this.props.content.backToSummary}</ACC.BackLink>;
  }
}

const Container = (props: FinancialVirementParams & BaseProps) => {
  const { projects, partners, financialVirements, navigation } = useStores();
  const editPartnerLevelContent = useEditPartnerLevelContent();

  return (
    <EditPartnerLevelComponent
      content={editPartnerLevelContent}
      project={projects.getById(props.projectId)}
      partners={partners.getPartnersForProject(props.projectId)}
      editor={financialVirements.getFiniancialVirementEditor(props.projectId, props.pcrId, props.itemId)}
      onChange={(saving, dto) =>
        financialVirements.updateFiniancialVirementEditor(
          saving,
          props.projectId,
          props.pcrId,
          props.itemId,
          dto,
          true,
          () =>
            navigation.navigateTo(
              props.routes.pcrPrepareItem.getLink({
                projectId: props.projectId,
                pcrId: props.pcrId,
                itemId: props.itemId,
              }),
              true,
            ),
        )
      }
      {...props}
    />
  );
};

export const FinancialVirementEditPartnerLevelRoute = defineRoute({
  routeName: "financial-virement-edit-partner-level",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/partner",
  container: Container,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId,
  }),
  getTitle: ({ content }) => content.financialVirementEditPartnerLevel.title()
});
