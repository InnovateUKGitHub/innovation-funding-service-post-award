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
      <React.Fragment>
        <ACC.Section title="Organisation" qa="add-partner-summary-organisation">
          <ACC.SummaryList qa="add-partner-summary-list-organisation">
            <ACC.SummaryListItem label="Role in project" content={pcrItem.projectRoleLabel} validation={validator.projectRole} qa="projectRole" />
            <ACC.SummaryListItem label="Type" content={pcrItem.partnerTypeLabel} validation={validator.partnerType} qa="partnerType" />
            {pcrItem.partnerType === PCRPartnerType.Research && <ACC.SummaryListItem label="Name" content={pcrItem.organisationName} validation={validator.organisationName} qa="organisationName" action={this.props.getEditLink("academicOrganisationStep", validator.organisationName)}/>}
            {<ACC.SummaryListItem label="Project city" content={pcrItem.projectCity} validation={validator.projectCity} qa="projectCity" action={this.props.getEditLink("projectLocationStep", validator.projectCity)}/>}
            {<ACC.SummaryListItem label="Project postcode" content={pcrItem.projectPostcode} validation={validator.projectPostcode} qa="projectPostcode" action={this.props.getEditLink("projectLocationStep", validator.projectPostcode)}/>}
          </ACC.SummaryList>
        </ACC.Section>
        <ACC.Section title="Contacts" qa="add-partner-summary-contacts">
          <ACC.Section title={pcrItem.contact1ProjectRoleLabel}>
            <ACC.SummaryList qa="add-partner-summary-list-contacts-finance-contact">
              {<ACC.SummaryListItem label="First name" content={pcrItem.contact1Forename} validation={validator.contact1Forename} qa="contact1Forename" action={this.props.getEditLink("financeContactStep", validator.contact1Forename)}/>}
              {<ACC.SummaryListItem label="Last name" content={pcrItem.contact1Surname} validation={validator.contact1Surname} qa="contact1Surname" action={this.props.getEditLink("financeContactStep", validator.contact1Surname)}/>}
              {<ACC.SummaryListItem label="Phone number" content={pcrItem.contact1Phone} validation={validator.contact1Phone} qa="contact1Phone" action={this.props.getEditLink("financeContactStep", validator.contact1Phone)}/>}
              {<ACC.SummaryListItem label="Email" content={pcrItem.contact1Email} validation={validator.contact1Email} qa="contact1Email" action={this.props.getEditLink("financeContactStep", validator.contact1Email)}/>}
            </ACC.SummaryList>
          </ACC.Section>
        </ACC.Section>
      </React.Fragment>
    );
  }
}
