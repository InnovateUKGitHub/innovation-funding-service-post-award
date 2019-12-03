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
        <Table.Custom qa="partner" header="Partner" value={x => x.isLead ? `${x.partnerName} (Lead)` : x.partnerName} footer="Totals" />
        <Table.Currency qa="original" header="Original" value={x => x.originalTotal} footer={<ACC.Renderers.Currency value={data.originalTotal} />} />
        <Table.Currency qa="new" header="New" value={x => x.currentTotal} footer={<ACC.Renderers.Currency value={data.currentTotal} />} />
      </Table.Table>
    );
  }

  private renderTotals(data: FinancialVirementDto): JSX.Element {
    throw new Error("Method not implemented.");
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
