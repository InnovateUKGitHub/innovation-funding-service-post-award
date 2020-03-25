import React from "react";
import * as ACC from "../../../components";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { addPartnerStepNames } from "@ui/containers/pcrs/addPartner/addPartnerWorkflow";
import { PCRPartnerType } from "@framework/constants";

export class AddPartnerSummary extends React.Component<PcrSummaryProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator, addPartnerStepNames>> {
  render() {
    const { pcrItem, validator } = this.props;
    return (
      <ACC.Section qa="add-partner-summary">
        <ACC.SummaryList qa="add-partner-summary-list">
          <ACC.SummaryListItem label="Role in project" content={pcrItem.projectRoleLabel} validation={validator.projectRole} qa="projectRole" />
          <ACC.SummaryListItem label="Type" content={pcrItem.partnerTypeLabel} validation={validator.partnerType} qa="partnerType" />
          {pcrItem.partnerType === PCRPartnerType.Research && <ACC.SummaryListItem label="Name" content={pcrItem.organisationName} validation={validator.organisationName} qa="organisationName" action={this.props.getEditLink("academicOrganisationStep", validator.organisationName)}/>}
          {<ACC.SummaryListItem label="Project city" content={pcrItem.projectCity} validation={validator.projectCity} qa="projectCity" action={this.props.getEditLink("projectLocationStep", validator.projectCity)}/>}
          {<ACC.SummaryListItem label="Project postcode" content={pcrItem.projectPostcode} validation={validator.projectPostcode} qa="projectPostcode" action={this.props.getEditLink("projectLocationStep", validator.projectPostcode)}/>}
        </ACC.SummaryList>
      </ACC.Section>
    );
  }
}
