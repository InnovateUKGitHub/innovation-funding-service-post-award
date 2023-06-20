import { DocumentDescription } from "@framework/constants/documentDescription";
import { CostCategoryType } from "@framework/constants/enums";
import { PCROrganisationType, PCRProjectRole, PCRStepId } from "@framework/constants/pcrConstants";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { sumBy } from "@framework/util/numberHelper";
import { Content } from "@ui/components/content";
import { DocumentList } from "@ui/components/documents/DocumentList";
import { Section } from "@ui/components/layout/section";
import { Loader } from "@ui/components/loading";
import { Currency } from "@ui/components/renderers/currency";
import { MonthYear } from "@ui/components/renderers/date";
import { Percentage } from "@ui/components/renderers/percentage";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";
import { AddPartnerStepNames } from "@ui/containers/pcrs/addPartner/addPartnerWorkflow";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { useStores } from "@ui/redux/storesProvider";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators/pcrDtoValidator";
import React from "react";

interface InnerProps {
  documents: DocumentSummaryDto[];
}

class SummaryComponent extends React.Component<
  PcrSummaryProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator, AddPartnerStepNames> & InnerProps
> {
  render() {
    const { pcrItem, validator, documents } = this.props;
    // Used to determine items displayed for industrial org vs academic org
    const isIndustrial = pcrItem.organisationType === PCROrganisationType.Industrial;
    return (
      <>
        {this.renderOrganisationSection(pcrItem, validator, documents, isIndustrial)}
        {this.renderProjectContacts(pcrItem, validator)}
        {this.renderFundingSection(pcrItem, validator, documents, isIndustrial)}
        <Section title={x => x.pcrAddPartnerLabels.agreementSectionTitle} qa="add-partner-summary-agreement">
          <SummaryList qa="add-partner-summary-list-agreement">
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.agreementToPcrHeading}
              content={this.renderDocuments(documents, DocumentDescription.AgreementToPCR)}
              qa="agreementToPcrDocument"
              action={this.props.getEditLink(PCRStepId.agreementToPcrStep, null)}
            />
          </SummaryList>
        </Section>
      </>
    );
  }

  private renderOrganisationSection(
    pcrItem: PCRItemForPartnerAdditionDto,
    validator: PCRPartnerAdditionItemDtoValidator,
    documents: DocumentSummaryDto[],
    isIndustrial: boolean,
  ) {
    return (
      <Section title={x => x.pcrAddPartnerLabels.organisationSectionTitle} qa="add-partner-summary-organisation">
        <SummaryList qa="add-partner-summary-list-organisation">
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.roleHeading}
            content={pcrItem.projectRoleLabel}
            validation={validator.projectRole}
            qa="projectRole"
          />
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.commercialWorkSummaryHeading}
            content={
              <Content
                value={x =>
                  pcrItem.isCommercialWork
                    ? x.pcrAddPartnerLabels.commercialWorkYes
                    : x.pcrAddPartnerLabels.commercialWorkNo
                }
              />
            }
            validation={validator.isCommercialWork}
            qa="isCommercialWork"
          />
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.organisationHeading}
            content={pcrItem.partnerTypeLabel}
            validation={validator.partnerType}
            qa="partnerType"
          />
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.aidEligibilityDeclaration}
            content={this.renderDocuments(documents, DocumentDescription.DeMinimisDeclarationForm)}
            qa="supportingDocumentsAidEligibility"
            action={this.props.getEditLink(PCRStepId.aidEligibilityStep, null)}
          />
          {!isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.organisationNameHeading}
              content={pcrItem.organisationName}
              validation={validator.organisationName}
              qa="organisationName"
              action={this.props.getEditLink(PCRStepId.academicOrganisationStep, validator.organisationName)}
            />
          )}
          {isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.organisationNameHeading}
              content={pcrItem.organisationName}
              validation={validator.companyHouseOrganisationName}
              qa="organisationName"
              action={this.props.getEditLink(PCRStepId.companiesHouseStep, validator.companyHouseOrganisationName)}
            />
          )}
          {isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.registrationNumberHeading}
              content={pcrItem.registrationNumber}
              validation={validator.registrationNumber}
              qa="registrationNumber"
              action={this.props.getEditLink(PCRStepId.companiesHouseStep, validator.registrationNumber)}
            />
          )}
          {isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.registeredAddressHeading}
              content={pcrItem.registeredAddress}
              validation={validator.registeredAddress}
              qa="registeredAddress"
              action={this.props.getEditLink(PCRStepId.companiesHouseStep, validator.registeredAddress)}
            />
          )}
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.organisationSizeHeading}
            content={pcrItem.participantSizeLabel}
            validation={validator.participantSize}
            qa="participantSize"
            action={
              isIndustrial ? this.props.getEditLink(PCRStepId.organisationDetailsStep, validator.participantSize) : null
            }
          />
          {isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.employeeCountHeading}
              content={pcrItem.numberOfEmployees}
              validation={validator.numberOfEmployees}
              qa="numberOfEmployees"
              action={this.props.getEditLink(PCRStepId.organisationDetailsStep, validator.numberOfEmployees)}
            />
          )}
          {isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.financialYearEndHeading}
              content={<MonthYear value={pcrItem.financialYearEndDate} />}
              validation={validator.financialYearEndDate}
              qa="financialYearEndDate"
              action={this.props.getEditLink(PCRStepId.financeDetailsStep, validator.financialYearEndDate)}
            />
          )}
          {isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.turnoverSummaryHeading}
              content={<Currency value={pcrItem.financialYearEndTurnover} />}
              validation={validator.financialYearEndTurnover}
              qa="financialYearEndTurnover"
              action={this.props.getEditLink(PCRStepId.financeDetailsStep, validator.financialYearEndTurnover)}
            />
          )}
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.projectLocationHeading}
            content={pcrItem.projectLocationLabel}
            validation={validator.projectLocation}
            qa="projectLocation"
            action={this.props.getEditLink(PCRStepId.projectLocationStep, validator.projectLocation)}
          />
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.townOrCityHeading}
            content={pcrItem.projectCity}
            validation={validator.projectCity}
            qa="projectCity"
            action={this.props.getEditLink(PCRStepId.projectLocationStep, validator.projectCity)}
          />
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.postcodeHeading}
            content={pcrItem.projectPostcode}
            validation={validator.projectPostcode}
            qa="projectPostcode"
            action={this.props.getEditLink(PCRStepId.projectLocationStep, validator.projectPostcode)}
          />
        </SummaryList>
      </Section>
    );
  }

  private renderProjectContacts(pcrItem: PCRItemForPartnerAdditionDto, validator: PCRPartnerAdditionItemDtoValidator) {
    return (
      <Section title={x => x.pcrAddPartnerLabels.contactsSectionTitle} qa="add-partner-summary-contacts">
        <Section title={x => x.pcrAddPartnerLabels.financeContactHeading}>
          <SummaryList qa="add-partner-summary-list-contacts-finance-contact">
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.contactFirstNameHeading}
              content={pcrItem.contact1Forename}
              validation={validator.contact1Forename}
              qa="contact1Forename"
              action={this.props.getEditLink(PCRStepId.financeContactStep, validator.contact1Forename)}
            />
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.contactLastNameHeading}
              content={pcrItem.contact1Surname}
              validation={validator.contact1Surname}
              qa="contact1Surname"
              action={this.props.getEditLink(PCRStepId.financeContactStep, validator.contact1Surname)}
            />
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.contactPhoneNumberHeading}
              content={pcrItem.contact1Phone}
              validation={validator.contact1Phone}
              qa="contact1Phone"
              action={this.props.getEditLink(PCRStepId.financeContactStep, validator.contact1Phone)}
            />
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.contactEmailHeading}
              content={pcrItem.contact1Email}
              validation={validator.contact1Email}
              qa="contact1Email"
              action={this.props.getEditLink(PCRStepId.financeContactStep, validator.contact1Email)}
            />
          </SummaryList>
        </Section>
        {pcrItem.projectRole === PCRProjectRole.ProjectLead && (
          <Section title={x => x.pcrAddPartnerLabels.projectLeadContactHeading}>
            <SummaryList qa="add-partner-summary-list-contacts-project-manager">
              <SummaryListItem
                label={x => x.pcrAddPartnerLabels.contactFirstNameHeading}
                content={pcrItem.contact2Forename}
                validation={validator.contact2Forename}
                qa="contact2Forename"
                action={this.props.getEditLink(PCRStepId.projectManagerDetailsStep, validator.contact2Forename)}
              />
              <SummaryListItem
                label={x => x.pcrAddPartnerLabels.contactLastNameHeading}
                content={pcrItem.contact2Surname}
                validation={validator.contact2Surname}
                qa="contact2Surname"
                action={this.props.getEditLink(PCRStepId.projectManagerDetailsStep, validator.contact2Surname)}
              />
              <SummaryListItem
                label={x => x.pcrAddPartnerLabels.contactPhoneNumberHeading}
                content={pcrItem.contact2Phone}
                validation={validator.contact2Phone}
                qa="contact2Phone"
                action={this.props.getEditLink(PCRStepId.projectManagerDetailsStep, validator.contact2Phone)}
              />
              <SummaryListItem
                label={x => x.pcrAddPartnerLabels.contactEmailHeading}
                content={pcrItem.contact2Email}
                validation={validator.contact2Email}
                qa="contact2Email"
                action={this.props.getEditLink(PCRStepId.projectManagerDetailsStep, validator.contact2Email)}
              />
            </SummaryList>
          </Section>
        )}
      </Section>
    );
  }

  private renderFundingSection(
    pcrItem: PCRItemForPartnerAdditionDto,
    validator: PCRPartnerAdditionItemDtoValidator,
    documents: DocumentSummaryDto[],
    isIndustrial: boolean,
  ) {
    const totalProjectCosts = pcrItem.spendProfile.costs.reduce((t, v) => t + (v.value || 0), 0);
    const totalOtherFunding = this.calculateTotalOtherFunding(pcrItem?.spendProfile?.funds ?? []);

    const nonFundedCosts = totalProjectCosts - (totalOtherFunding || 0);
    const fundingSought = (nonFundedCosts * (pcrItem.awardRate || 0)) / 100 || 0;
    const partnerContribution = nonFundedCosts - fundingSought;

    return (
      <Section title={x => x.pcrAddPartnerLabels.fundingSectionTitle} qa="add-partner-summary-funding">
        <SummaryList qa="add-partner-summary-list-funding">
          {!isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.jesHeading}
              content={this.renderDocuments(documents, DocumentDescription.JeSForm)}
              qa="supportingDocumentsJes"
              action={this.props.getEditLink(PCRStepId.jeSStep, null)}
            />
          )}
          {!isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.tsbReferenceHeading}
              content={pcrItem.tsbReference}
              validation={validator.tsbReference}
              qa="tsbReference"
              action={this.props.getEditLink(PCRStepId.academicCostsStep, validator.tsbReference)}
            />
          )}
          {isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.projectCostsHeading}
              content={<Currency value={totalProjectCosts} />}
              qa="projectCosts"
              action={
                this.props.mode === "prepare"
                  ? this.props.getEditLink(PCRStepId.spendProfileStep, null)
                  : this.props.getViewLink(PCRStepId.spendProfileStep)
              }
            />
          )}
          {!isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.projectCostsHeading}
              content={<Currency value={totalProjectCosts} />}
              qa="projectCosts"
              action={
                this.props.mode === "prepare"
                  ? this.props.getEditLink(PCRStepId.academicCostsStep, null)
                  : this.props.getViewLink(PCRStepId.academicCostsStep)
              }
            />
          )}
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.otherFundingSourcesHeading}
            content={
              <Content
                value={x =>
                  pcrItem.hasOtherFunding ? x.pcrAddPartnerLabels.otherFundsYes : x.pcrAddPartnerLabels.otherFundsNo
                }
              />
            }
            validation={validator.hasOtherFunding}
            qa="hasOtherFunding"
            action={this.props.getEditLink(PCRStepId.otherFundingStep, validator.hasOtherFunding)}
          />
          {pcrItem.hasOtherFunding && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.amountOfOtherFundingHeading}
              content={<Currency value={totalOtherFunding} />}
              qa="amountOfOtherFunding"
              action={this.props.getEditLink(PCRStepId.otherFundingSourcesStep, null)}
            />
          )}
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.fundingLevelHeading}
            content={<Percentage value={pcrItem.awardRate} />}
            validation={validator.awardRate}
            qa="fundingLevel"
            action={this.props.getEditLink(PCRStepId.awardRateStep, validator.awardRate)}
          />
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.fundingSoughtHeading}
            content={<Currency value={fundingSought} />}
            qa="fundingSought"
          />
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.partnerContributionsHeading}
            content={<Currency value={partnerContribution} />}
            qa="partnerContribution"
          />
        </SummaryList>
      </Section>
    );
  }

  private renderDocuments(documents: DocumentSummaryDto[], description: DocumentDescription) {
    const docs = documents.filter(x => x.description === description);
    return docs.length > 0 ? (
      <DocumentList documents={docs} qa="documents" />
    ) : (
      <Content value={x => x.documentMessages.documentsNotApplicable} />
    );
  }

  /**
   * Calculates total other funding from spend profile funds to avoid over-complicated caching issues
   */
  private calculateTotalOtherFunding(funds: PCRItemForPartnerAdditionDto["spendProfile"]["funds"]) {
    return sumBy(
      funds.filter(
        x =>
          x.costCategory === CostCategoryType.Other_Public_Sector_Funding ||
          x.costCategory === CostCategoryType.Other_Funding,
      ),
      fund => fund.value || 0,
    );
  }
}

export const AddPartnerSummary = (
  props: PcrSummaryProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator, AddPartnerStepNames>,
) => {
  const stores = useStores();

  return (
    <Loader
      pending={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.projectId, props.pcrItem.id)}
      render={documents => <SummaryComponent {...props} documents={documents} />}
    />
  );
};
