import React from "react";
import { StoresConsumer } from "@ui/redux";
import { Pending } from "@shared/pending";
import * as ACC from "@ui/components";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRStandardItemDtoValidator } from "@ui/validators";
import { PCRStandardItemDto } from "@framework/dtos";

interface Props extends PcrSummaryProps<PCRStandardItemDto, PCRStandardItemDtoValidator, ""> {
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
        <Table.Currency qa="new" header="New" value={x => x.newTotal} footer={<ACC.Renderers.Currency value={data.newTotal} />} />
      </Table.Table>
    );
  }

  private getPartnerLink(partnerVirement: PartnerVirementsDto) {
    const params = {
      projectId: this.props.projectId,
      partnerId: partnerVirement.partnerId,
      pcrId: this.props.pcr.id,
      itemId: this.props.pcrItem.id,
    };

    const route = this.props.mode === "prepare" ?
      this.props.routes.pcrFinancialVirementEdit.getLink({...params}) :
      this.props.routes.pcrFinancialVirementDetails.getLink({...params, mode: this.props.mode})
      ;

    return (
      <ACC.Link replace={true} route={route}>
        <ACC.PartnerName partner={{ name: partnerVirement.partnerName, isLead: partnerVirement.isLead, isWithdrawn: partnerVirement.isWithdrawn }} showIsLead={true}/>
      </ACC.Link>
    );
  }
}

export const FinancialVirementSummary = (props: PcrSummaryProps<PCRStandardItemDto, PCRStandardItemDtoValidator, "">) => (
  <StoresConsumer>
    {
      stores => (
        <Component virements={stores.financialVirements.get(props.projectId, props.pcr.id, props.pcrItem.id)} {...props} />
      )
    }
  </StoresConsumer>
);
