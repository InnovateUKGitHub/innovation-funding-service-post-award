import { DocumentDescription } from "@framework/constants/documentDescription";
import { CostCategoryType } from "@framework/constants/enums";
import { PCROrganisationType, PCRProjectRole, PCRStepType } from "@framework/constants/pcrConstants";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { sumBy } from "@framework/util/numberHelper";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentList } from "@ui/components/atomicDesign/organisms/documents/DocumentList/DocumentList";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { Loader } from "@ui/components/bjss/loading";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { MonthYear } from "@ui/components/atomicDesign/atoms/Date";
import { Percentage } from "@ui/components/atomicDesign/atoms/Percentage/percentage";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { AddPartnerStepNames } from "@ui/containers/pages/pcrs/addPartner/addPartnerWorkflow";
import { PcrSummaryProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { useStores } from "@ui/redux/storesProvider";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";

interface InnerProps {
  documents: DocumentSummaryDto[];
}

const SummaryComponent = (
  props: PcrSummaryProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator, AddPartnerStepNames> &
    InnerProps,
) => {
  const { pcrItem, validator, documents } = props;
  // Used to determine items displayed for industrial org vs academic org
  const isIndustrial = pcrItem.organisationType === PCROrganisationType.Industrial;

  // Funding section values
  const totalProjectCosts = pcrItem.spendProfile.costs.reduce((t, v) => t + (v.value || 0), 0);
  const totalOtherFunding = calculateTotalOtherFunding(pcrItem?.spendProfile?.funds ?? []);

  const nonFundedCosts = totalProjectCosts - (totalOtherFunding || 0);
  const fundingSought = (nonFundedCosts * (pcrItem.awardRate || 0)) / 100 || 0;
  const partnerContribution = nonFundedCosts - fundingSought;

  return (
    <>
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
            content={
              <DocumentsComponent documents={documents} description={DocumentDescription.DeMinimisDeclarationForm} />
            }
            qa="supportingDocumentsAidEligibility"
            action={props.getEditLink(PCRStepType.aidEligibilityStep, null)}
          />
          {!isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.organisationNameHeading}
              content={pcrItem.organisationName}
              validation={validator.organisationName}
              qa="organisationName"
              action={props.getEditLink(PCRStepType.academicOrganisationStep, validator.organisationName)}
            />
          )}
          {isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.organisationNameHeading}
              content={pcrItem.organisationName}
              validation={validator.companyHouseOrganisationName}
              qa="organisationName"
              action={props.getEditLink(PCRStepType.companiesHouseStep, validator.companyHouseOrganisationName)}
            />
          )}
          {isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.registrationNumberHeading}
              content={pcrItem.registrationNumber}
              validation={validator.registrationNumber}
              qa="registrationNumber"
              action={props.getEditLink(PCRStepType.companiesHouseStep, validator.registrationNumber)}
            />
          )}
          {isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.registeredAddressHeading}
              content={pcrItem.registeredAddress}
              validation={validator.registeredAddress}
              qa="registeredAddress"
              action={props.getEditLink(PCRStepType.companiesHouseStep, validator.registeredAddress)}
            />
          )}
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.organisationSizeHeading}
            content={pcrItem.participantSizeLabel}
            validation={validator.participantSize}
            qa="participantSize"
            action={
              isIndustrial ? props.getEditLink(PCRStepType.organisationDetailsStep, validator.participantSize) : null
            }
          />
          {isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.employeeCountHeading}
              content={pcrItem.numberOfEmployees}
              validation={validator.numberOfEmployees}
              qa="numberOfEmployees"
              action={props.getEditLink(PCRStepType.organisationDetailsStep, validator.numberOfEmployees)}
            />
          )}
          {isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.financialYearEndHeading}
              content={<MonthYear value={pcrItem.financialYearEndDate} />}
              validation={validator.financialYearEndDate}
              qa="financialYearEndDate"
              action={props.getEditLink(PCRStepType.financeDetailsStep, validator.financialYearEndDate)}
            />
          )}
          {isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.turnoverSummaryHeading}
              content={<Currency value={pcrItem.financialYearEndTurnover} />}
              validation={validator.financialYearEndTurnover}
              qa="financialYearEndTurnover"
              action={props.getEditLink(PCRStepType.financeDetailsStep, validator.financialYearEndTurnover)}
            />
          )}
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.projectLocationHeading}
            content={pcrItem.projectLocationLabel}
            validation={validator.projectLocation}
            qa="projectLocation"
            action={props.getEditLink(PCRStepType.projectLocationStep, validator.projectLocation)}
          />
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.townOrCityHeading}
            content={pcrItem.projectCity}
            validation={validator.projectCity}
            qa="projectCity"
            action={props.getEditLink(PCRStepType.projectLocationStep, validator.projectCity)}
          />
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.postcodeHeading}
            content={pcrItem.projectPostcode}
            validation={validator.projectPostcode}
            qa="projectPostcode"
            action={props.getEditLink(PCRStepType.projectLocationStep, validator.projectPostcode)}
          />
        </SummaryList>
      </Section>

      <Section title={x => x.pcrAddPartnerLabels.contactsSectionTitle} qa="add-partner-summary-contacts">
        <Section title={x => x.pcrAddPartnerLabels.financeContactHeading}>
          <SummaryList qa="add-partner-summary-list-contacts-finance-contact">
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.contactFirstNameHeading}
              content={pcrItem.contact1Forename}
              validation={validator.contact1Forename}
              qa="contact1Forename"
              action={props.getEditLink(PCRStepType.financeContactStep, validator.contact1Forename)}
            />
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.contactLastNameHeading}
              content={pcrItem.contact1Surname}
              validation={validator.contact1Surname}
              qa="contact1Surname"
              action={props.getEditLink(PCRStepType.financeContactStep, validator.contact1Surname)}
            />
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.contactPhoneNumberHeading}
              content={pcrItem.contact1Phone}
              validation={validator.contact1Phone}
              qa="contact1Phone"
              action={props.getEditLink(PCRStepType.financeContactStep, validator.contact1Phone)}
            />
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.contactEmailHeading}
              content={pcrItem.contact1Email}
              validation={validator.contact1Email}
              qa="contact1Email"
              action={props.getEditLink(PCRStepType.financeContactStep, validator.contact1Email)}
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
                action={props.getEditLink(PCRStepType.projectManagerDetailsStep, validator.contact2Forename)}
              />
              <SummaryListItem
                label={x => x.pcrAddPartnerLabels.contactLastNameHeading}
                content={pcrItem.contact2Surname}
                validation={validator.contact2Surname}
                qa="contact2Surname"
                action={props.getEditLink(PCRStepType.projectManagerDetailsStep, validator.contact2Surname)}
              />
              <SummaryListItem
                label={x => x.pcrAddPartnerLabels.contactPhoneNumberHeading}
                content={pcrItem.contact2Phone}
                validation={validator.contact2Phone}
                qa="contact2Phone"
                action={props.getEditLink(PCRStepType.projectManagerDetailsStep, validator.contact2Phone)}
              />
              <SummaryListItem
                label={x => x.pcrAddPartnerLabels.contactEmailHeading}
                content={pcrItem.contact2Email}
                validation={validator.contact2Email}
                qa="contact2Email"
                action={props.getEditLink(PCRStepType.projectManagerDetailsStep, validator.contact2Email)}
              />
            </SummaryList>
          </Section>
        )}
      </Section>

      <Section title={x => x.pcrAddPartnerLabels.fundingSectionTitle} qa="add-partner-summary-funding">
        <SummaryList qa="add-partner-summary-list-funding">
          {!isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.jesHeading}
              content={<DocumentsComponent documents={documents} description={DocumentDescription.JeSForm} />}
              qa="supportingDocumentsJes"
              action={props.getEditLink(PCRStepType.jeSStep, null)}
            />
          )}
          {!isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.tsbReferenceHeading}
              content={pcrItem.tsbReference}
              validation={validator.tsbReference}
              qa="tsbReference"
              action={props.getEditLink(PCRStepType.academicCostsStep, validator.tsbReference)}
            />
          )}
          {isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.projectCostsHeading}
              content={<Currency value={totalProjectCosts} />}
              qa="projectCosts"
              action={
                props.mode === "prepare"
                  ? props.getEditLink(PCRStepType.spendProfileStep, null)
                  : props.getViewLink(PCRStepType.spendProfileStep)
              }
            />
          )}
          {!isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.projectCostsHeading}
              content={<Currency value={totalProjectCosts} />}
              qa="projectCosts"
              action={
                props.mode === "prepare"
                  ? props.getEditLink(PCRStepType.academicCostsStep, null)
                  : props.getViewLink(PCRStepType.academicCostsStep)
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
            action={props.getEditLink(PCRStepType.otherFundingStep, validator.hasOtherFunding)}
          />
          {pcrItem.hasOtherFunding && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.amountOfOtherFundingHeading}
              content={<Currency value={totalOtherFunding} />}
              qa="amountOfOtherFunding"
              action={props.getEditLink(PCRStepType.otherFundingSourcesStep, null)}
            />
          )}
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.fundingLevelHeading}
            content={<Percentage value={pcrItem.awardRate} />}
            validation={validator.awardRate}
            qa="fundingLevel"
            action={props.getEditLink(PCRStepType.awardRateStep, validator.awardRate)}
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

      <Section title={x => x.pcrAddPartnerLabels.agreementSectionTitle} qa="add-partner-summary-agreement">
        <SummaryList qa="add-partner-summary-list-agreement">
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.agreementToPcrHeading}
            content={<DocumentsComponent documents={documents} description={DocumentDescription.AgreementToPCR} />}
            qa="agreementToPcrDocument"
            action={props.getEditLink(PCRStepType.agreementToPcrStep, null)}
          />
        </SummaryList>
      </Section>
    </>
  );
};

const DocumentsComponent = ({
  documents,
  description,
}: {
  documents: DocumentSummaryDto[];
  description: DocumentDescription;
}) => {
  const docs = documents.filter(x => x.description === description);
  return docs.length > 0 ? (
    <DocumentList documents={docs} qa="documents" />
  ) : (
    <Content value={x => x.documentMessages.documentsNotApplicable} />
  );
};

/**
 * Calculates total other funding from spend profile funds to avoid over-complicated caching issues
 */
const calculateTotalOtherFunding = (funds: PCRItemForPartnerAdditionDto["spendProfile"]["funds"]) => {
  return sumBy(
    funds.filter(
      x =>
        x.costCategory === CostCategoryType.Other_Public_Sector_Funding ||
        x.costCategory === CostCategoryType.Other_Funding,
    ),
    fund => fund.value || 0,
  );
};

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
