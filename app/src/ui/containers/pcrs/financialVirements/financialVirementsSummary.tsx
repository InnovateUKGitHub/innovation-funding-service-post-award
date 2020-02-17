import React from "react";
import { StoresConsumer } from "@ui/redux";
import { Pending } from "@shared/pending";
import * as ACC from "@ui/components";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRStandardItemDtoValidator } from "@ui/validators";
import { PartnerDto, PCRStandardItemDto } from "@framework/dtos";

interface Props extends PcrSummaryProps<PCRStandardItemDto, PCRStandardItemDtoValidator, ""> {
  virement: Pending<FinancialVirementDto>;
  partners: Pending<PartnerDto[]>;
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
      return this.renderPrepareTable(paired, virement);
    }

    return this.renderReviewTable(paired, virement);
  }

  private renderPrepareTable(data: { partner: PartnerDto, partnerVirement: PartnerVirementsDto }[], dto: FinancialVirementDto) {
    const Table = ACC.TypedTable<typeof data[0]>();
    return (
      <Table.Table qa="partners" data={data}>
        <Table.Custom qa="partner" header="Partner" value={x => this.getPartnerLink(x.partnerVirement, x.partner)} footer="Totals" isDivider="normal" />
        <Table.Currency qa="totalCosts" header="Total eligible costs" value={x => x.partnerVirement.originalEligibleCosts} footer={<ACC.Renderers.Currency value={dto.originalEligibleCosts} />} />
        <Table.Currency qa="totalNotClaimed" header="Eligible costs not yet claimed" value={x => x.partnerVirement.originalCostsNotYetClaimed} footer={<ACC.Renderers.Currency value={dto.originalCostsNotYetClaimed} />} />
        <Table.Currency qa="remainingGrant" header="Remaining grant" value={x => x.partnerVirement.originalRemaining} footer={<ACC.Renderers.Currency value={dto.originalRemaining} />} isDivider="normal" />
        <Table.Currency qa="newEligibleCosts" header="New total eligible costs" value={x => x.partnerVirement.newEligibleCosts} footer={<ACC.Renderers.Currency value={dto.newEligibleCosts} />} />
        <Table.Currency qa="newNotClaimed" header="New eligible costs not yet claimed" value={x => x.partnerVirement.newCostsNotYetClaimed} footer={<ACC.Renderers.Currency value={dto.newCostsNotYetClaimed} />} />
        <Table.Currency qa="newRemainingGrant" header="New remaining grant" value={x => x.partnerVirement.newRemaining} footer={<ACC.Renderers.Currency value={dto.newRemaining} />} />
      </Table.Table>
    );
  }

  private renderReviewTable(data: { partner: PartnerDto, partnerVirement: PartnerVirementsDto }[], dto: FinancialVirementDto) {
    const Table = ACC.TypedTable<typeof data[0]>();
    return (
      <Table.Table qa="partners" data={data}>
        <Table.Custom qa="partner" header="Partner" value={x => this.getPartnerLink(x.partnerVirement, x.partner)} footer="Totals" isDivider="normal" />
        <Table.Currency qa="originalEligibleCosts" header="Total eligible costs" value={x => x.partnerVirement.originalEligibleCosts} footer={<ACC.Renderers.Currency value={dto.originalEligibleCosts} />} />
        <Table.Currency qa="newEligibleCosts" header="New total eligible costs" value={x => x.partnerVirement.newEligibleCosts} footer={<ACC.Renderers.Currency value={dto.newEligibleCosts} />} />
        <Table.Currency qa="differenceEligibleCosts" header="Difference" value={x => x.partnerVirement.differenceEligibleCosts} footer={<ACC.Renderers.Currency value={dto.differenceEligibleCosts} />} isDivider="normal" />
        <Table.Percentage qa="originalFundingLevel" header="Funding level" value={x => x.partnerVirement.originalFundingLevel} footer={<ACC.Renderers.Percentage value={dto.originalFundingLevel} />} />
        <Table.Percentage qa="newFundingLevel" header="New funding level" value={x => x.partnerVirement.newFundingLevel} footer={<ACC.Renderers.Percentage value={dto.newFundingLevel} />} isDivider="normal" />
        <Table.Currency qa="remainingGrant" header="Remaining grant" value={x => x.partnerVirement.originalRemaining} footer={<ACC.Renderers.Currency value={dto.originalRemaining} />} />
        <Table.Currency qa="newRemainingGrant" header="New remaining grant" value={x => x.partnerVirement.newRemaining} footer={<ACC.Renderers.Currency value={dto.newRemaining} />} />
        <Table.Currency qa="differenceRemaining" header="Difference" value={x => x.partnerVirement.differenceRemaining} footer={<ACC.Renderers.Currency value={dto.differenceRemaining} />} />
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
      this.props.routes.pcrFinancialVirementEdit.getLink({ ...params }) :
      this.props.routes.pcrFinancialVirementDetails.getLink({ ...params, mode: this.props.mode })
      ;

    return (
      <ACC.Link replace={true} route={route}>
        <ACC.PartnerName partner={partner} showIsLead={true} />
      </ACC.Link>
    );
  }
}

export const FinancialVirementSummary = (props: PcrSummaryProps<PCRStandardItemDto, PCRStandardItemDtoValidator, "">) => (
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
