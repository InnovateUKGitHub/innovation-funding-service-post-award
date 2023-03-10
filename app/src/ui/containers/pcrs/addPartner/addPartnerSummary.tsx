import React from "react";
import { useStores } from "@ui/redux";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { AddPartnerStepNames } from "@ui/containers/pcrs/addPartner/addPartnerWorkflow";
import { DocumentDescription, PCROrganisationType, PCRProjectRole, CostCategoryType } from "@framework/constants";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { sumBy } from "@framework/util";
import * as ACC from "../../../components";

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
        <ACC.Section title={x => x.pcrAddPartnerLabels.agreementSectionTitle} qa="add-partner-summary-agreement">
          <ACC.SummaryList qa="add-partner-summary-list-agreement">
            <ACC.SummaryListItem
              label={x => x.pcrAddPartnerLabels.agreementToPcrHeading}
              content={this.renderDocuments(documents, DocumentDescription.AgreementToPCR)}
              qa="agreementToPcrDocument"
              action={this.props.getEditLink("agreementToPcrStep", null)}
            />
          </ACC.SummaryList>
        </ACC.Section>
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
      <ACC.Section title={x => x.pcrAddPartnerLabels.organisationSectionTitle} qa="add-partner-summary-organisation">
        <ACC.SummaryList qa="add-partner-summary-list-organisation">
          <ACC.SummaryListItem
            label={x => x.pcrAddPartnerLabels.roleHeading}
            content={pcrItem.projectRoleLabel}
            validation={validator.projectRole}
            qa="projectRole"
          />
          <ACC.SummaryListItem
            label={x => x.pcrAddPartnerLabels.commercialWorkSummaryHeading}
            content={
              <ACC.Content
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
          <ACC.SummaryListItem
            label={x => x.pcrAddPartnerLabels.organisationHeading}
            content={pcrItem.partnerTypeLabel}
            validation={validator.partnerType}
            qa="partnerType"
          />
          <ACC.SummaryListItem
            label={x => x.pcrAddPartnerLabels.aidEligibilityDeclaration}
            content={this.renderDocuments(documents, DocumentDescription.DeMinimisDeclarationForm)}
            qa="supportingDocumentsAidEligibility"
            action={this.props.getEditLink("aidEligibilityStep", null)}
          />
          {!isIndustrial && (
            <ACC.SummaryListItem
              label={x => x.pcrAddPartnerLabels.organisationNameHeading}
              content={pcrItem.organisationName}
              validation={validator.organisationName}
              qa="organisationName"
              action={this.props.getEditLink("academicOrganisationStep", validator.organisationName)}
            />
          )}
          {isIndustrial && (
            <ACC.SummaryListItem
              label={x => x.pcrAddPartnerLabels.organisationNameHeading}
              content={pcrItem.organisationName}
              validation={validator.companyHouseOrganisationName}
              qa="organisationName"
              action={this.props.getEditLink("companiesHouseStep", validator.companyHouseOrganisationName)}
            />
          )}
          {isIndustrial && (
            <ACC.SummaryListItem
              label={x => x.pcrAddPartnerLabels.registrationNumberHeading}
              content={pcrItem.registrationNumber}
              validation={validator.registrationNumber}
              qa="registrationNumber"
              action={this.props.getEditLink("companiesHouseStep", validator.registrationNumber)}
            />
          )}
          {isIndustrial && (
            <ACC.SummaryListItem
              label={x => x.pcrAddPartnerLabels.registeredAddressHeading}
              content={pcrItem.registeredAddress}
              validation={validator.registeredAddress}
              qa="registeredAddress"
              action={this.props.getEditLink("companiesHouseStep", validator.registeredAddress)}
            />
          )}
          <ACC.SummaryListItem
            label={x => x.pcrAddPartnerLabels.organisationSizeHeading}
            content={pcrItem.participantSizeLabel}
            validation={validator.participantSize}
            qa="participantSize"
            action={isIndustrial ? this.props.getEditLink("organisationDetailsStep", validator.participantSize) : null}
          />
          {isIndustrial && (
            <ACC.SummaryListItem
              label={x => x.pcrAddPartnerLabels.employeeCountHeading}
              content={pcrItem.numberOfEmployees}
              validation={validator.numberOfEmployees}
              qa="numberOfEmployees"
              action={this.props.getEditLink("organisationDetailsStep", validator.numberOfEmployees)}
            />
          )}
          {isIndustrial && (
            <ACC.SummaryListItem
              label={x => x.pcrAddPartnerLabels.financialYearEndHeading}
              content={<ACC.Renderers.MonthYear value={pcrItem.financialYearEndDate} />}
              validation={validator.financialYearEndDate}
              qa="financialYearEndDate"
              action={this.props.getEditLink("financeDetailsStep", validator.financialYearEndDate)}
            />
          )}
          {isIndustrial && (
            <ACC.SummaryListItem
              label={x => x.pcrAddPartnerLabels.turnoverSummaryHeading}
              content={<ACC.Renderers.Currency value={pcrItem.financialYearEndTurnover} />}
              validation={validator.financialYearEndTurnover}
              qa="financialYearEndTurnover"
              action={this.props.getEditLink("financeDetailsStep", validator.financialYearEndTurnover)}
            />
          )}
          <ACC.SummaryListItem
            label={x => x.pcrAddPartnerLabels.projectLocationHeading}
            content={pcrItem.projectLocationLabel}
            validation={validator.projectLocation}
            qa="projectLocation"
            action={this.props.getEditLink("projectLocationStep", validator.projectLocation)}
          />
          <ACC.SummaryListItem
            label={x => x.pcrAddPartnerLabels.townOrCityHeading}
            content={pcrItem.projectCity}
            validation={validator.projectCity}
            qa="projectCity"
            action={this.props.getEditLink("projectLocationStep", validator.projectCity)}
          />
          <ACC.SummaryListItem
            label={x => x.pcrAddPartnerLabels.postcodeHeading}
            content={pcrItem.projectPostcode}
            validation={validator.projectPostcode}
            qa="projectPostcode"
            action={this.props.getEditLink("projectLocationStep", validator.projectPostcode)}
          />
        </ACC.SummaryList>
      </ACC.Section>
    );
  }

  private renderProjectContacts(pcrItem: PCRItemForPartnerAdditionDto, validator: PCRPartnerAdditionItemDtoValidator) {
    return (
      <ACC.Section title={x => x.pcrAddPartnerLabels.contactsSectionTitle} qa="add-partner-summary-contacts">
        <ACC.Section title={x => x.pcrAddPartnerLabels.financeContactHeading}>
          <ACC.SummaryList qa="add-partner-summary-list-contacts-finance-contact">
            <ACC.SummaryListItem
              label={x => x.pcrAddPartnerLabels.contactFirstNameHeading}
              content={pcrItem.contact1Forename}
              validation={validator.contact1Forename}
              qa="contact1Forename"
              action={this.props.getEditLink("financeContactStep", validator.contact1Forename)}
            />
            <ACC.SummaryListItem
              label={x => x.pcrAddPartnerLabels.contactLastNameHeading}
              content={pcrItem.contact1Surname}
              validation={validator.contact1Surname}
              qa="contact1Surname"
              action={this.props.getEditLink("financeContactStep", validator.contact1Surname)}
            />
            <ACC.SummaryListItem
              label={x => x.pcrAddPartnerLabels.contactPhoneNumberHeading}
              content={pcrItem.contact1Phone}
              validation={validator.contact1Phone}
              qa="contact1Phone"
              action={this.props.getEditLink("financeContactStep", validator.contact1Phone)}
            />
            <ACC.SummaryListItem
              label={x => x.pcrAddPartnerLabels.contactEmailHeading}
              content={pcrItem.contact1Email}
              validation={validator.contact1Email}
              qa="contact1Email"
              action={this.props.getEditLink("financeContactStep", validator.contact1Email)}
            />
          </ACC.SummaryList>
        </ACC.Section>
        {pcrItem.projectRole === PCRProjectRole.ProjectLead && (
          <ACC.Section title={x => x.pcrAddPartnerLabels.projectLeadContactHeading}>
            <ACC.SummaryList qa="add-partner-summary-list-contacts-project-manager">
              <ACC.SummaryListItem
                label={x => x.pcrAddPartnerLabels.contactFirstNameHeading}
                content={pcrItem.contact2Forename}
                validation={validator.contact2Forename}
                qa="contact2Forename"
                action={this.props.getEditLink("projectManagerDetailsStep", validator.contact2Forename)}
              />
              <ACC.SummaryListItem
                label={x => x.pcrAddPartnerLabels.contactLastNameHeading}
                content={pcrItem.contact2Surname}
                validation={validator.contact2Surname}
                qa="contact2Surname"
                action={this.props.getEditLink("projectManagerDetailsStep", validator.contact2Surname)}
              />
              <ACC.SummaryListItem
                label={x => x.pcrAddPartnerLabels.contactPhoneNumberHeading}
                content={pcrItem.contact2Phone}
                validation={validator.contact2Phone}
                qa="contact2Phone"
                action={this.props.getEditLink("projectManagerDetailsStep", validator.contact2Phone)}
              />
              <ACC.SummaryListItem
                label={x => x.pcrAddPartnerLabels.contactEmailHeading}
                content={pcrItem.contact2Email}
                validation={validator.contact2Email}
                qa="contact2Email"
                action={this.props.getEditLink("projectManagerDetailsStep", validator.contact2Email)}
              />
            </ACC.SummaryList>
          </ACC.Section>
        )}
      </ACC.Section>
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
      <ACC.Section title={x => x.pcrAddPartnerLabels.fundingSectionTitle} qa="add-partner-summary-funding">
        <ACC.SummaryList qa="add-partner-summary-list-funding">
          {!isIndustrial && (
            <ACC.SummaryListItem
              label={x => x.pcrAddPartnerLabels.jesHeading}
              content={this.renderDocuments(documents, DocumentDescription.JeSForm)}
              qa="supportingDocumentsJes"
              action={this.props.getEditLink("jeSStep", null)}
            />
          )}
          {!isIndustrial && (
            <ACC.SummaryListItem
              label={x => x.pcrAddPartnerLabels.tsbReferenceHeading}
              content={pcrItem.tsbReference}
              validation={validator.tsbReference}
              qa="tsbReference"
              action={this.props.getEditLink("academicCostsStep", validator.tsbReference)}
            />
          )}
          {isIndustrial && (
            <ACC.SummaryListItem
              label={x => x.pcrAddPartnerLabels.projectCostsHeading}
              content={<ACC.Renderers.Currency value={totalProjectCosts} />}
              qa="projectCosts"
              action={
                this.props.mode === "prepare"
                  ? this.props.getEditLink("spendProfileStep", null)
                  : this.props.getViewLink("spendProfileStep")
              }
            />
          )}
          {!isIndustrial && (
            <ACC.SummaryListItem
              label={x => x.pcrAddPartnerLabels.projectCostsHeading}
              content={<ACC.Renderers.Currency value={totalProjectCosts} />}
              qa="projectCosts"
              action={
                this.props.mode === "prepare"
                  ? this.props.getEditLink("academicCostsStep", null)
                  : this.props.getViewLink("academicCostsStep")
              }
            />
          )}
          <ACC.SummaryListItem
            label={x => x.pcrAddPartnerLabels.otherFundingSourcesHeading}
            content={
              <ACC.Content
                value={x =>
                  pcrItem.hasOtherFunding ? x.pcrAddPartnerLabels.otherFundsYes : x.pcrAddPartnerLabels.otherFundsNo
                }
              />
            }
            validation={validator.hasOtherFunding}
            qa="hasOtherFunding"
            action={this.props.getEditLink("otherFundingStep", validator.hasOtherFunding)}
          />
          {pcrItem.hasOtherFunding && (
            <ACC.SummaryListItem
              label={x => x.pcrAddPartnerLabels.amountOfOtherFundingHeading}
              content={<ACC.Renderers.Currency value={totalOtherFunding} />}
              qa="amountOfOtherFunding"
              action={this.props.getEditLink("otherFundingSourcesStep", null)}
            />
          )}
          <ACC.SummaryListItem
            label={x => x.pcrAddPartnerLabels.fundingLevelHeading}
            content={<ACC.Renderers.Percentage value={pcrItem.awardRate} />}
            validation={validator.awardRate}
            qa="fundingLevel"
            action={this.props.getEditLink("awardRateStep", validator.awardRate)}
          />
          <ACC.SummaryListItem
            label={x => x.pcrAddPartnerLabels.fundingSoughtHeading}
            content={<ACC.Renderers.Currency value={fundingSought} />}
            qa="fundingSought"
          />
          <ACC.SummaryListItem
            label={x => x.pcrAddPartnerLabels.partnerContributionsHeading}
            content={<ACC.Renderers.Currency value={partnerContribution} />}
            qa="partnerContribution"
          />
        </ACC.SummaryList>
      </ACC.Section>
    );
  }

  private renderDocuments(documents: DocumentSummaryDto[], description: DocumentDescription) {
    const docs = documents.filter(x => x.description === description);
    return docs.length > 0 ? (
      <ACC.DocumentList documents={docs} qa="documents" />
    ) : (
      <ACC.Content value={x => x.documentMessages.documentsNotApplicable} />
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
    <ACC.Loader
      pending={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.projectId, props.pcrItem.id)}
      render={documents => <SummaryComponent {...props} documents={documents} />}
    />
  );
};
