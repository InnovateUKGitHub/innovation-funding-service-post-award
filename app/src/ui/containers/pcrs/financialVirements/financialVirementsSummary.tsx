import React from "react";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { Pending } from "@shared/pending";
import * as ACC from "@ui/components";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { MultiplePartnerFinancialVirementDtoValidator, PCRDtoValidator } from "@ui/validators";
import { PartnerDto, PCRDto, PCRItemDto, PCRItemForMultiplePartnerFinancialVirementDto } from "@framework/dtos";
import { PCRItemType } from "@framework/types";

interface Props extends PcrSummaryProps<PCRItemForMultiplePartnerFinancialVirementDto, MultiplePartnerFinancialVirementDtoValidator, ""> {
  virement: Pending<FinancialVirementDto>;
  partners: Pending<PartnerDto[]>;
}

interface PropsWithForm {
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
  form: ACC.FormBuilder<PCRItemDto>;
}

class Component extends React.Component<Props> {
  render() {

    const combined = Pending.combine({
      virement: this.props.virement,
      partners: this.props.partners
    });

    return <ACC.Loader pending={combined} render={data => this.renderPartners(data.virement, data.partners)} />;
  }

  private renderPartners(virement: FinancialVirementDto, partners: PartnerDto[]): React.ReactNode {
    const paired = partners.map(partner => ({
      partner,
      partnerVirement: virement.partners.find(x => x.partnerId === partner.id)!
    }));

    if (this.props.mode === "prepare") {
      return (
        <React.Fragment>
          {this.renderPrepareTable(paired, virement)}
          <ACC.Section qa="edit-partner-level">
            <ACC.Renderers.SimpleString>If the new remaining project grant is higher as a result of the reallocation of costs, you can change the funding level of partners to lower the new project grant.</ACC.Renderers.SimpleString>
            <ACC.Link styling={"SecondaryButton"} route={this.props.routes.pcrFinancialVirementEditPartnerLevel.getLink({ itemId: this.props.pcrItem.id, pcrId: this.props.pcr.id, projectId: this.props.projectId })}>Change remaining grant</ACC.Link>
          </ACC.Section>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {this.renderReviewTable(paired, virement)}
        <ACC.Section>
          <ACC.SummaryList qa="pcr_financial-virement">
            <ACC.SummaryListItem qa="grantValueYearEnd" label={<React.Fragment>Grant value moving over<br/>the financial year end</React.Fragment>} content={<ACC.Renderers.Currency value={this.props.pcrItem.grantMovingOverFinancialYear} />}/>
          </ACC.SummaryList>
        </ACC.Section>
      </React.Fragment>
    );
  }

  private renderPrepareTable(data: { partner: PartnerDto, partnerVirement: PartnerVirementsDto }[], dto: FinancialVirementDto) {
    const Table = ACC.TypedTable<typeof data[0]>();
    return (
      <Table.Table qa="partners" data={data}>
        <Table.Custom qa="partner" headerContent={x => x.financialVirementSummary.labels.partnerName()} value={x => this.getPartnerLink(x.partnerVirement, x.partner)} footer={<ACC.Content value={x => x.financialVirementDetails.labels.projectTotals()} />} isDivider="normal" />
        <Table.Currency qa="originalEligibleCosts" headerContent={x => x.financialVirementSummary.labels.partnerOriginalEligibleCosts()} value={x => x.partnerVirement.originalEligibleCosts} footer={<ACC.Renderers.Currency value={dto.originalEligibleCosts} />} />
        <Table.Currency qa="originalRemaining" headerContent={x => x.financialVirementSummary.labels.partnerOriginalRemainingCosts()} value={x => x.partnerVirement.originalRemainingCosts} footer={<ACC.Renderers.Currency value={dto.originalRemainingCosts} />} />
        <Table.Currency qa="originalRemainingGrant" headerContent={x => x.financialVirementSummary.labels.partnerOriginalRemainingGrant()} value={x => x.partnerVirement.originalRemainingGrant} footer={<ACC.Renderers.Currency value={dto.originalRemainingGrant} />} isDivider="normal" />
        <Table.Currency qa="newEligibleCosts" headerContent={x => x.financialVirementSummary.labels.partnerNewEligibleCosts()} value={x => x.partnerVirement.newEligibleCosts} footer={<ACC.Renderers.Currency value={dto.newEligibleCosts} />} />
        <Table.Currency qa="newRemainingCosts" headerContent={x => x.financialVirementSummary.labels.partnerNewRemainingCosts()} value={x => x.partnerVirement.newRemainingCosts} footer={<ACC.Renderers.Currency value={dto.newRemainingCosts} />} />
        <Table.Currency qa="newRemainingGrant" headerContent={x => x.financialVirementSummary.labels.partnerNewRemainingGrant()} value={x => x.partnerVirement.newRemainingGrant} footer={<ACC.Renderers.Currency value={dto.newRemainingGrant} />} />
      </Table.Table>
    );
  }

  private renderReviewTable(data: { partner: PartnerDto, partnerVirement: PartnerVirementsDto }[], dto: FinancialVirementDto) {
    const Table = ACC.TypedTable<typeof data[0]>();
    return (
      <Table.Table qa="partners" data={data} headerRowClass="govuk-body-s" bodyRowClass={x => "govuk-body-s"} footerRowClass="govuk-body-s">
        <Table.Custom qa="partner" headerContent={x => x.financialVirementSummary.labels.partnerName()} value={x => this.getPartnerLink(x.partnerVirement, x.partner)} footer={<ACC.Content value={x => x.financialVirementDetails.labels.projectTotals()} />} isDivider="normal" />
        <Table.Currency qa="originalEligibleCosts" headerContent={x => x.financialVirementSummary.labels.partnerOriginalEligibleCosts()} value={x => x.partnerVirement.originalEligibleCosts} footer={<ACC.Renderers.Currency value={dto.originalEligibleCosts} />} />
        <Table.Currency qa="newEligibleCosts" headerContent={x => x.financialVirementSummary.labels.partnerNewEligibleCosts()} value={x => x.partnerVirement.newEligibleCosts} footer={<ACC.Renderers.Currency value={dto.newEligibleCosts} />} />
        <Table.Currency qa="differenceEligibleCosts" headerContent={x => x.financialVirementSummary.labels.partnerDifferenceCosts()} value={x => x.partnerVirement.newEligibleCosts - x.partnerVirement.originalEligibleCosts} footer={<ACC.Renderers.Currency value={dto.newEligibleCosts - dto.originalEligibleCosts} />} isDivider="normal" />
        <Table.Percentage qa="originalFundingLevel" headerContent={x => x.financialVirementSummary.labels.originalFundingLevel()} value={x => x.partnerVirement.originalFundingLevel} footer={<ACC.Renderers.Percentage value={dto.originalFundingLevel} />} />
        <Table.Percentage qa="newFundingLevel" headerContent={x => x.financialVirementSummary.labels.newFundingLevel()} value={x => x.partnerVirement.newFundingLevel} footer={<ACC.Renderers.Percentage value={dto.newFundingLevel} />} isDivider="normal" />
        <Table.Currency qa="originalRemainingGrant" headerContent={x => x.financialVirementSummary.labels.partnerOriginalRemainingGrant()} value={x => x.partnerVirement.originalRemainingGrant} footer={<ACC.Renderers.Currency value={dto.originalRemainingGrant} />} />
        <Table.Currency qa="newRemainingGrant" headerContent={x => x.financialVirementSummary.labels.partnerNewRemainingGrant()} value={x => x.partnerVirement.newRemainingGrant} footer={<ACC.Renderers.Currency value={dto.newRemainingGrant} />} />
        <Table.Currency qa="differenceRemainingGrant" headerContent={x => x.financialVirementSummary.labels.partnerDifferenceGrant()} value={x => x.partnerVirement.newRemainingGrant - x.partnerVirement.originalRemainingGrant} footer={<ACC.Renderers.Currency value={dto.newRemainingGrant - dto.originalRemainingGrant} />} />
      </Table.Table>
    );
  }

  private getPartnerLink(partnerVirement: PartnerVirementsDto, partner: PartnerDto) {
    const params = {
      projectId: this.props.projectId,
      partnerId: partnerVirement.partnerId,
      pcrId: this.props.pcr.id,
      itemId: this.props.pcrItem.id,
    };

    const route = this.props.mode === "prepare" ?
      this.props.routes.pcrFinancialVirementEditCostCategoryLevel.getLink({ ...params }) :
      this.props.routes.pcrFinancialVirementDetails.getLink({ ...params, mode: this.props.mode })
      ;

    return (
      <ACC.Link preserveData={true} route={route}>
        <ACC.PartnerName partner={partner} showIsLead={true} />
      </ACC.Link>
    );
  }
}

export class GrantMovingOverFinancialYearForm extends React.Component<PropsWithForm> {
  public render() {
    const Form = this.props.form;
    const itemPcr = this.props.editor.data.items.find(x => x.type === PCRItemType.MultiplePartnerFinancialVirement)! as PCRItemForMultiplePartnerFinancialVirementDto;
    const itemValidator = this.props.editor.validator.items.results.find(x => x.model.type === PCRItemType.MultiplePartnerFinancialVirement) as MultiplePartnerFinancialVirementDtoValidator;

    return (
      <Form.Fieldset qa="fieldset-grantMovingOverFinancialYear" heading={"Grant value moving over the financial year end"}>
        <ACC.TextHint text={"The financial year ends on 31 March."} />
        <Form.Numeric
          name="grantMovingOverFinancialYear"
          width={5}
          value={() => itemPcr.grantMovingOverFinancialYear}
          update={(m, val) => itemPcr.grantMovingOverFinancialYear = val!}
          validation={itemValidator.grantMovingOverFinancialYear}
        />
      </Form.Fieldset>
    );
  }
}

export const FinancialVirementSummary = (props: PcrSummaryProps<PCRItemForMultiplePartnerFinancialVirementDto, MultiplePartnerFinancialVirementDtoValidator, "">) => (
  <StoresConsumer>
    {
      stores => (
        <Component
          virement={stores.financialVirements.get(props.projectId, props.pcr.id, props.pcrItem.id)}
          partners={stores.partners.getPartnersForProject(props.projectId)}
          {...props}
        />
      )
    }
  </StoresConsumer>
);
