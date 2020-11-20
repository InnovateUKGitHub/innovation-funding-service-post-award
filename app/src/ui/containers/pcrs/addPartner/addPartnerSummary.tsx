import React from "react";
import * as ACC from "../../../components";
import { StoresConsumer } from "@ui/redux";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { addPartnerStepNames } from "@ui/containers/pcrs/addPartner/addPartnerWorkflow";
import { DocumentDescription, PCROrganisationType, PCRProjectRole } from "@framework/constants";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";

interface InnerProps {
  documents: DocumentSummaryDto[];
}

class Component extends React.Component<PcrSummaryProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator, addPartnerStepNames> & InnerProps> {
  render() {
    const { pcrItem, validator, documents } = this.props;
    // Used to determine items displayed for industrial org vs academic org
    const isIndustrial = pcrItem.organisationType === PCROrganisationType.Industrial;
    return (
      <React.Fragment>
        { this.renderOrganisationSection(pcrItem, validator, documents, isIndustrial) }
        { this.renderProjectContacts(pcrItem, validator) }
        { this.renderFundingSection(pcrItem, validator, documents, isIndustrial) }
        <ACC.Section titleContent={x => x.pcrAddPartnerSummary.labels.agreementSectionTitle} qa="add-partner-summary-agreement">
          <ACC.SummaryList qa="add-partner-summary-list-agreement">
            <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.agreementToPcrHeading} content={this.renderDocuments(documents, DocumentDescription.AgreementToPCR)} qa="agreementToPcrDocument" action={this.props.getEditLink("agreementToPcrStep", null)} />
          </ACC.SummaryList>
        </ACC.Section>
      </React.Fragment>
    );
  }

  private renderOrganisationSection(pcrItem: PCRItemForPartnerAdditionDto, validator: PCRPartnerAdditionItemDtoValidator, documents: DocumentSummaryDto[], isIndustrial: boolean) {
    return (
        <ACC.Section titleContent={x => x.pcrAddPartnerSummary.labels.organisationSectionTitle} qa="add-partner-summary-organisation">
          <ACC.SummaryList qa="add-partner-summary-list-organisation">
            <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.roleHeading} content={pcrItem.projectRoleLabel} validation={validator.projectRole} qa="projectRole" />
            <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.commercialWorkSummaryHeading} content={<ACC.Content value={x => pcrItem.isCommercialWork ? x.pcrAddPartnerSummary.labels.commercialWorkYes : x.pcrAddPartnerSummary.labels.commercialWorkNo}/>} validation={validator.isCommercialWork} qa="isCommercialWork" />
            <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.organisationHeading} content={pcrItem.partnerTypeLabel} validation={validator.partnerType} qa="partnerType" />
            <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.aidEligibilityDeclaration} content={this.renderDocuments(documents, DocumentDescription.DeMinimisDeclarationForm)} qa="supportingDocumentsAidEligibility" action={this.props.getEditLink("aidEligibilityStep", null)} />
            { !isIndustrial && <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.organisationNameHeading} content={pcrItem.organisationName} validation={validator.organisationName} qa="organisationName" action={this.props.getEditLink("academicOrganisationStep", validator.organisationName)}/> }
            { isIndustrial && <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.organisationNameHeading} content={pcrItem.organisationName} validation={validator.companyHouseOrganisationName} qa="organisationName" action={this.props.getEditLink("companiesHouseStep", validator.companyHouseOrganisationName)}/> }
            { isIndustrial && <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.registrationNumberHeading} content={pcrItem.registrationNumber} validation={validator.registrationNumber} qa="registrationNumber" action={this.props.getEditLink("companiesHouseStep", validator.registrationNumber)}/> }
            { isIndustrial && <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.registeredAddressHeading} content={pcrItem.registeredAddress} validation={validator.registeredAddress} qa="registeredAddress" action={this.props.getEditLink("companiesHouseStep", validator.registeredAddress)}/> }
            <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.organisationSizeHeading} content={pcrItem.participantSizeLabel} validation={validator.participantSize} qa="participantSize" action={isIndustrial ? this.props.getEditLink("organisationDetailsStep", validator.participantSize) : null }/>
            { isIndustrial && <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.employeeCountHeading} content={pcrItem.numberOfEmployees} validation={validator.numberOfEmployees} qa="numberOfEmployees" action={this.props.getEditLink("organisationDetailsStep", validator.numberOfEmployees)}/> }
            { isIndustrial && <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.financialYearEndHeading} content={<ACC.Renderers.MonthYear value={pcrItem.financialYearEndDate}/>} validation={validator.financialYearEndDate} qa="financialYearEndDate" action={this.props.getEditLink("financeDetailsStep", validator.financialYearEndDate)}/> }
            { isIndustrial && <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.turnoverHeading} content={<ACC.Renderers.Currency value={pcrItem.financialYearEndTurnover}/>} validation={validator.financialYearEndTurnover} qa="financialYearEndTurnover" action={this.props.getEditLink("financeDetailsStep", validator.financialYearEndTurnover)}/> }
            <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.projectLocationHeading} content={pcrItem.projectLocationLabel} validation={validator.projectLocation} qa="projectLocation" action={this.props.getEditLink("projectLocationStep", validator.projectLocation)}/>
            <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.townOrCityHeading} content={pcrItem.projectCity} validation={validator.projectCity} qa="projectCity" action={this.props.getEditLink("projectLocationStep", validator.projectCity)}/>
            <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.postcodeHeading} content={pcrItem.projectPostcode} validation={validator.projectPostcode} qa="projectPostcode" action={this.props.getEditLink("projectLocationStep", validator.projectPostcode)}/>
          </ACC.SummaryList>
        </ACC.Section>
    );
  }

  private renderProjectContacts(pcrItem: PCRItemForPartnerAdditionDto, validator: PCRPartnerAdditionItemDtoValidator) {
    return (
      <ACC.Section titleContent={x => x.pcrAddPartnerSummary.labels.contactsSectiontitle} qa="add-partner-summary-contacts">
        <ACC.Section titleContent={x => x.pcrAddPartnerSummary.labels.financeContactHeading}>
          <ACC.SummaryList qa="add-partner-summary-list-contacts-finance-contact">
            <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.contactFirstNameHeading} content={pcrItem.contact1Forename} validation={validator.contact1Forename} qa="contact1Forename" action={this.props.getEditLink("financeContactStep", validator.contact1Forename)}/>
            <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.contactLastNameHeading} content={pcrItem.contact1Surname} validation={validator.contact1Surname} qa="contact1Surname" action={this.props.getEditLink("financeContactStep", validator.contact1Surname)}/>
            <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.contactPhoneNumberHeading} content={pcrItem.contact1Phone} validation={validator.contact1Phone} qa="contact1Phone" action={this.props.getEditLink("financeContactStep", validator.contact1Phone)}/>
            <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.contactEmailHeading} content={pcrItem.contact1Email} validation={validator.contact1Email} qa="contact1Email" action={this.props.getEditLink("financeContactStep", validator.contact1Email)}/>
          </ACC.SummaryList>
        </ACC.Section>
        { pcrItem.projectRole === PCRProjectRole.ProjectLead && <ACC.Section titleContent={x => x.pcrAddPartnerSummary.labels.projectLeadContactHeading}>
          <ACC.SummaryList qa="add-partner-summary-list-contacts-project-manager">
            <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.contactFirstNameHeading} content={pcrItem.contact2Forename} validation={validator.contact2Forename} qa="contact2Forename" action={this.props.getEditLink("projectManagerDetailsStep", validator.contact2Forename)}/>
            <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.contactLastNameHeading} content={pcrItem.contact2Surname} validation={validator.contact2Surname} qa="contact2Surname" action={this.props.getEditLink("projectManagerDetailsStep", validator.contact2Surname)}/>
            <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.contactPhoneNumberHeading} content={pcrItem.contact2Phone} validation={validator.contact2Phone} qa="contact2Phone" action={this.props.getEditLink("projectManagerDetailsStep", validator.contact2Phone)}/>
            <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.contactEmailHeading} content={pcrItem.contact2Email} validation={validator.contact2Email} qa="contact2Email" action={this.props.getEditLink("projectManagerDetailsStep", validator.contact2Email)}/>
          </ACC.SummaryList>
        </ACC.Section> }
      </ACC.Section>
    );
  }

  private renderFundingSection(pcrItem: PCRItemForPartnerAdditionDto, validator: PCRPartnerAdditionItemDtoValidator, documents: DocumentSummaryDto[], isIndustrial: boolean) {
    const totalProjectCosts = pcrItem.spendProfile.costs.reduce((t, v) => t + (v.value || 0), 0);
    const nonFundedCosts = totalProjectCosts - (pcrItem.totalOtherFunding || 0);
    const fundingSought = nonFundedCosts * (pcrItem.awardRate || 0) / 100;
    const partnerContribution = nonFundedCosts - fundingSought;

    return (
      <ACC.Section titleContent={x => x.pcrAddPartnerSummary.labels.fundingSectionTitle} qa="add-partner-summary-funding">
        <ACC.SummaryList qa="add-partner-summary-list-funding">
          { !isIndustrial && <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.jesFormHeading} content={this.renderDocuments(documents, DocumentDescription.JeSForm)} qa="supportingDocumentsJes" action={this.props.getEditLink("jeSStep", null)} /> }
          { !isIndustrial && <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.tsbReferenceHeading} content={pcrItem.tsbReference} validation={validator.tsbReference} qa="tsbReference" action={this.props.getEditLink("academicCostsStep", validator.tsbReference)} /> }
          { isIndustrial && <ACC.SummaryListItem
            labelContent={x => x.pcrAddPartnerSummary.labels.projectCostsHeading}
            content={<ACC.Renderers.Currency value={totalProjectCosts}/>}
            qa="projectCosts"
            action={
              this.props.mode === "prepare"
                ? this.props.getEditLink("spendProfileStep", null)
                : this.props.getViewLink("spendProfileStep")}
          /> }
          { !isIndustrial && <ACC.SummaryListItem
            labelContent={x => x.pcrAddPartnerSummary.labels.projectCostsHeading}
            content={<ACC.Renderers.Currency value={totalProjectCosts}/>}
            qa="projectCosts"
            action={
              this.props.mode === "prepare"
                ? this.props.getEditLink("academicCostsStep", null)
                : this.props.getViewLink("academicCostsStep")}
          /> }
          <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.otherFundingSourcesHeading} content={<ACC.Content value={x => pcrItem.hasOtherFunding ? x.pcrAddPartnerSummary.labels.otherFundsYes : x.pcrAddPartnerSummary.labels.otherFundsNo}/>} validation={validator.hasOtherFunding} qa="hasOtherFunding" action={this.props.getEditLink("otherFundingStep", validator.hasOtherFunding)} />
          { pcrItem.hasOtherFunding && <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.amountOfOtherFundingHeading} content={<ACC.Renderers.Currency value={pcrItem.totalOtherFunding}/>} qa="amountOfOtherFunding" action={this.props.getEditLink("otherFundingSourcesStep", null)} /> }
          <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.fundingLevelHeading} content={<ACC.Renderers.Percentage value={pcrItem.awardRate}/>} validation={validator.awardRate} qa="fundingLevel"  action={this.props.getEditLink("awardRateStep", validator.awardRate)} />
          <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.fundingSoughtHeading} content={<ACC.Renderers.Currency value={fundingSought}/>} qa="fundingSought" />
          <ACC.SummaryListItem labelContent={x => x.pcrAddPartnerSummary.labels.partnerContributionsHeading} content={<ACC.Renderers.Currency value={partnerContribution}/>} qa="partnerContribution" />
        </ACC.SummaryList>
      </ACC.Section>
    );
  }

  private renderDocuments(documents: DocumentSummaryDto[], description: DocumentDescription) {
    const docs = documents.filter(x => x.description === description);
    return docs.length > 0
      ? <ACC.DocumentList documents={docs} qa="documents" />
      : <ACC.Content value={x => x.pcrAddPartnerSummary.documentMessages.documentsNotApplicable()}/>;
  }
}

export const AddPartnerSummary = (props: PcrSummaryProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator, addPartnerStepNames>) => (
  <StoresConsumer>
    {
      stores => {
        return (<ACC.Loader
          pending={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.projectId, props.pcrItem.id)}
          render={documents => <Component documents={documents} {...props} />}
        />);
      }
    }
  </StoresConsumer>
);
