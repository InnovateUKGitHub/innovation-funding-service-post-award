import React from "react";
import * as ACC from "../../../components";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { addPartnerStepNames } from "@ui/containers/pcrs/addPartner/addPartnerWorkflow";
import { PCRPartnerType, PCRProjectRole } from "@framework/constants";

export class AddPartnerSummary extends React.Component<PcrSummaryProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator, addPartnerStepNames>> {
  render() {
    const { pcrItem, validator } = this.props;
    return (
      <React.Fragment>
        <ACC.Section title="Organisation" qa="add-partner-summary-organisation">
          <ACC.SummaryList qa="add-partner-summary-list-organisation">
            <ACC.SummaryListItem label="Project role" content={pcrItem.projectRoleLabel} validation={validator.projectRole} qa="projectRole" />
            <ACC.SummaryListItem label="Type" content={pcrItem.partnerTypeLabel} validation={validator.partnerType} qa="partnerType" />
            { pcrItem.partnerType === PCRPartnerType.Research && <ACC.SummaryListItem label="Name" content={pcrItem.organisationName} validation={validator.organisationName} qa="organisationName" action={this.props.getEditLink("academicOrganisationStep", validator.organisationName)}/> }
            { pcrItem.partnerType !== PCRPartnerType.Research && <ACC.SummaryListItem label="Name" content={pcrItem.organisationName} validation={validator.companyHouseOrganisationName} qa="organisationName" action={this.props.getEditLink("companiesHouseStep", validator.companyHouseOrganisationName)}/> }
            { pcrItem.partnerType !== PCRPartnerType.Research && <ACC.SummaryListItem label="Registration number" content={pcrItem.registrationNumber} validation={validator.registrationNumber} qa="registrationNumber" action={this.props.getEditLink("companiesHouseStep", validator.registrationNumber)}/> }
            { pcrItem.partnerType !== PCRPartnerType.Research && <ACC.SummaryListItem label="Registered address" content={pcrItem.registeredAddress} validation={validator.registeredAddress} qa="registeredAddress" action={this.props.getEditLink("companiesHouseStep", validator.registeredAddress)}/> }
            <ACC.SummaryListItem label="Size" content={pcrItem.participantSizeLabel} validation={validator.participantSize} qa="participantSize" action={this.props.getEditLink("organisationDetailsStep", validator.participantSize)}/>
            <ACC.SummaryListItem label="Number of employees" content={pcrItem.numberOfEmployees} validation={validator.numberOfEmployees} qa="numberOfEmployees" action={this.props.getEditLink("organisationDetailsStep", validator.numberOfEmployees)}/>
            <ACC.SummaryListItem
              label="End of financial year"
              content={<ACC.Renderers.MonthYear value={pcrItem.financialYearEndDate}/>}
              validation={validator.financialYearEndDate}
              qa="financialYearEndDate"
              action={this.props.getEditLink("financeDetailsStep", validator.financialYearEndDate)}
            />
            <ACC.SummaryListItem
              label="Turnover"
              content={<ACC.Renderers.Currency value={pcrItem.financialYearEndTurnover}/>}
              validation={validator.financialYearEndTurnover}
              qa="financialYearEndTurnover"
              action={this.props.getEditLink("financeDetailsStep", validator.financialYearEndTurnover)}
            />
            <ACC.SummaryListItem label="Town or city" content={pcrItem.projectCity} validation={validator.projectCity} qa="projectCity" action={this.props.getEditLink("projectLocationStep", validator.projectCity)}/>
            <ACC.SummaryListItem label="Postcode, postal code or zipcode" content={pcrItem.projectPostcode} validation={validator.projectPostcode} qa="projectPostcode" action={this.props.getEditLink("projectLocationStep", validator.projectPostcode)}/>
          </ACC.SummaryList>
        </ACC.Section>
        <ACC.Section title="Contacts" qa="add-partner-summary-contacts">
          <ACC.Section title={pcrItem.contact1ProjectRoleLabel}>
            <ACC.SummaryList qa="add-partner-summary-list-contacts-finance-contact">
              <ACC.SummaryListItem label="First name" content={pcrItem.contact1Forename} validation={validator.contact1Forename} qa="contact1Forename" action={this.props.getEditLink("financeContactStep", validator.contact1Forename)}/>
              <ACC.SummaryListItem label="Last name" content={pcrItem.contact1Surname} validation={validator.contact1Surname} qa="contact1Surname" action={this.props.getEditLink("financeContactStep", validator.contact1Surname)}/>
              <ACC.SummaryListItem label="Phone number" content={pcrItem.contact1Phone} validation={validator.contact1Phone} qa="contact1Phone" action={this.props.getEditLink("financeContactStep", validator.contact1Phone)}/>
              <ACC.SummaryListItem label="Email" content={pcrItem.contact1Email} validation={validator.contact1Email} qa="contact1Email" action={this.props.getEditLink("financeContactStep", validator.contact1Email)}/>
            </ACC.SummaryList>
          </ACC.Section>
          { pcrItem.projectRole === PCRProjectRole.ProjectLead && <ACC.Section title={pcrItem.contact2ProjectRoleLabel}>
            <ACC.SummaryList qa="add-partner-summary-list-contacts-project-manager">
              <ACC.SummaryListItem label="First name" content={pcrItem.contact2Forename} validation={validator.contact2Forename} qa="contact2Forename" action={this.props.getEditLink("projectManagerDetailsStep", validator.contact2Forename)}/>
              <ACC.SummaryListItem label="Last name" content={pcrItem.contact2Surname} validation={validator.contact2Surname} qa="contact2Surname" action={this.props.getEditLink("projectManagerDetailsStep", validator.contact2Surname)}/>
              <ACC.SummaryListItem label="Phone number" content={pcrItem.contact2Phone} validation={validator.contact2Phone} qa="contact2Phone" action={this.props.getEditLink("projectManagerDetailsStep", validator.contact2Phone)}/>
              <ACC.SummaryListItem label="Email" content={pcrItem.contact2Email} validation={validator.contact2Email} qa="contact2Email" action={this.props.getEditLink("projectManagerDetailsStep", validator.contact2Email)}/>
            </ACC.SummaryList>
          </ACC.Section> }
        </ACC.Section>
      </React.Fragment>
    );
  }
}
