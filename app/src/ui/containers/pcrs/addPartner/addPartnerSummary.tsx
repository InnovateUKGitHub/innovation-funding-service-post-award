import React from "react";
import * as ACC from "../../../components";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { addPartnerStepNames } from "@ui/containers/pcrs/addPartner/addPartnerWorkflow";

export class AddPartnerSummary extends React.Component<PcrSummaryProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator, addPartnerStepNames>> {
  render() {
    const { pcrItem, validator } = this.props;
    return (
      <ACC.Section qa="add-partner-summary">
        <ACC.SummaryList qa="add-partner-summary-list">
          <ACC.SummaryListItem label="Project role" content={pcrItem.projectRoleLabel} validation={validator.projectRole} qa="projectRole" />
          <ACC.SummaryListItem label="PartnerType" content={pcrItem.partnerTypeLabel} validation={validator.partnerType} qa="partnerType" />
        </ACC.SummaryList>
      </ACC.Section>
    );
  }
}
