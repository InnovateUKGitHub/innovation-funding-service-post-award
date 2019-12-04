import React from "react";
import { StoresConsumer } from "@ui/redux";
import { financialVirementWorkflow } from "./workflow";
import { SummaryProps } from "../workflow";
import { Pending } from "@shared/pending";
import * as ACC from "@ui/components";

interface Props extends SummaryProps<typeof financialVirementWorkflow> {
  virements: Pending<FinancialVirementDto>;
}

class Component extends React.Component<Props> {
  render() {
    return <ACC.Loader pending={this.props.virements} render={data => this.renderPartners(data)} />;
  }

  private renderPartners(data: FinancialVirementDto): React.ReactNode {
    const Table = ACC.TypedTable<PartnerVirementsDto>();
    return (
      <Table.Table qa="partners" data={data.partners}>
        <Table.Custom qa="partner" header="Partner" value={x => this.getPartnerLink(x)} footer="Totals" />
        <Table.Currency qa="original" header="Original" value={x => x.originalTotal} footer={<ACC.Renderers.Currency value={data.originalTotal} />} />
        <Table.Currency qa="new" header="New" value={x => x.currentTotal} footer={<ACC.Renderers.Currency value={data.currentTotal} />} />
      </Table.Table>
    );
  }

  private getPartnerLink(partnerVirement: PartnerVirementsDto) {
    const route = this.props.routes.pcrFinancialVirementDetails.getLink({
      projectId: this.props.projectId,
      partnerId: partnerVirement.partnerId,
      pcrId: this.props.pcr.id,
      itemId: this.props.pcrItem.id,
      mode: this.props.mode
    });
    const name =  partnerVirement.isLead ? `${partnerVirement.partnerName} (Lead)` : partnerVirement.partnerName;
    return <ACC.Link replace={true} route={route}>{name}</ACC.Link>;
  }
}

export const FinancialVirementSummary = (props: SummaryProps<typeof financialVirementWorkflow>) => (
  <StoresConsumer>
    {
      stores => (
        <Component virements={stores.financialVirements.get(props.projectId, props.pcr.id, props.pcrItem.id)} {...props} />
      )
    }
  </StoresConsumer>
);
