import { DocumentDescription } from "@framework/constants/documentDescription";
import { CostCategoryType } from "@framework/constants/enums";
import { PCRItemStatus, PCROrganisationType, PCRProjectRole, PCRStepType } from "@framework/constants/pcrConstants";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { sumBy } from "@framework/util/numberHelper";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentList } from "@ui/components/atomicDesign/organisms/documents/DocumentList/DocumentList";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { MonthYear } from "@ui/components/atomicDesign/atoms/Date";
import { Percentage } from "@ui/components/atomicDesign/atoms/Percentage/percentage";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { usePcrWorkflowContext } from "../pcrItemWorkflowMigrated";
import { useAddPartnerWorkflowQuery } from "./addPartner.logic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { AddPartnerSchema, addPartnerErrorMap, getAddPartnerSummarySchema } from "./addPartnerSummary.zod";
import { PcrPage } from "../pcrPage";
import { EditLink, ViewLink } from "../pcrItemSummaryLinks";
import { PcrItemSummaryForm } from "../pcrItemSummaryForm";
import { SpendProfile } from "@gql/dtoMapper/mapPcrSpendProfile";
import { useMemo } from "react";

export const AddPartnerSummary = () => {
  const { projectId, itemId, fetchKey, mode, displayCompleteForm } = usePcrWorkflowContext();

  const { pcrItem, documents, pcrSpendProfile, costCategories } = useAddPartnerWorkflowQuery(
    projectId,
    itemId,
    fetchKey,
  );

  const { handleSubmit, register, formState, watch } = useForm<AddPartnerSchema>({
    defaultValues: {
      // summary page should take default value from saved state. it will be overridden when the checkbox is clicked
      // @ts-expect-error it's so annoying but boolean type is freaking out over the literal false and true in the discriminated union
      markedAsComplete: pcrItem.status === PCRItemStatus.Complete,
      button_submit: "submit",
      ...pcrItem,
    },
    resolver: zodResolver(
      getAddPartnerSummarySchema({ projectRole: pcrItem.projectRole, organisationType: pcrItem.organisationType }),
      {
        errorMap: addPartnerErrorMap,
      },
    ),
  });

  const validationErrors = useRhfErrors(formState.errors);

  // Used to determine items displayed for industrial org vs academic org
  const isIndustrial = pcrItem.organisationType === PCROrganisationType.Industrial;

  const data = useMemo(() => {
    const spendProfile = new SpendProfile(itemId).getSpendProfile(pcrSpendProfile, costCategories);
    const totalProjectCosts = spendProfile.costs.reduce((t, v) => t + (v.value || 0), 0);
    const totalOtherFunding = calculateTotalOtherFunding(spendProfile?.funds ?? []);
    const nonFundedCosts = totalProjectCosts - (totalOtherFunding || 0);
    const fundingSought = (nonFundedCosts * (pcrItem.awardRate || 0)) / 100 || 0;
    const partnerContribution = nonFundedCosts - fundingSought;

    return { totalProjectCosts, totalOtherFunding, fundingSought, partnerContribution };
  }, []);

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section title={x => x.pcrAddPartnerLabels.organisationSectionTitle} qa="add-partner-summary-organisation">
        <SummaryList qa="add-partner-summary-list-organisation">
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.roleHeading}
            content={pcrItem.projectRoleLabel}
            hasError={!!validationErrors?.projectRole}
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
            hasError={!!validationErrors?.isCommercialWork}
            qa="isCommercialWork"
          />
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.organisationHeading}
            content={pcrItem.partnerTypeLabel}
            hasError={!!validationErrors?.partnerType}
            qa="partnerType"
          />
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.aidEligibilityDeclaration}
            content={
              <DocumentsComponent documents={documents} description={DocumentDescription.DeMinimisDeclarationForm} />
            }
            qa="supportingDocumentsAidEligibility"
            action={<EditLink stepName={PCRStepType.aidEligibilityStep} />}
          />
          {!isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.organisationNameHeading}
              content={pcrItem.organisationName}
              hasError={!!validationErrors?.organisationName}
              qa="organisationName"
              action={<EditLink stepName={PCRStepType.academicOrganisationStep} />}
            />
          )}

          {isIndustrial && (
            <>
              <SummaryListItem
                // TODO: double check validation here
                label={x => x.pcrAddPartnerLabels.organisationNameHeading}
                content={pcrItem.organisationName}
                // validation={validator.companyHouseOrganisationName}
                hasError={!!validationErrors?.organisationName}
                qa="organisationName"
                action={<EditLink stepName={PCRStepType.companiesHouseStep} />}
              />
              <SummaryListItem
                label={x => x.pcrAddPartnerLabels.registrationNumberHeading}
                content={pcrItem.registrationNumber}
                // validation={validator.registrationNumber}
                hasError={!!validationErrors?.registrationNumber}
                qa="registrationNumber"
                action={<EditLink stepName={PCRStepType.companiesHouseStep} />}
              />

              <SummaryListItem
                label={x => x.pcrAddPartnerLabels.registeredAddressHeading}
                content={pcrItem.registeredAddress}
                // validation={validator.registeredAddress}
                hasError={!!validationErrors?.registeredAddress}
                qa="registeredAddress"
                action={<EditLink stepName={PCRStepType.companiesHouseStep} />}
              />
            </>
          )}
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.organisationSizeHeading}
            content={pcrItem.participantSizeLabel}
            hasError={!!validationErrors?.participantSize}
            qa="participantSize"
            action={isIndustrial ? <EditLink stepName={PCRStepType.organisationDetailsStep} /> : null}
          />
          {isIndustrial && (
            <>
              <SummaryListItem
                label={x => x.pcrAddPartnerLabels.employeeCountHeading}
                content={pcrItem.numberOfEmployees}
                hasError={!!validationErrors?.numberOfEmployees}
                qa="numberOfEmployees"
                action={<EditLink stepName={PCRStepType.organisationDetailsStep} />}
              />
              <SummaryListItem
                id="financialYearEndDate"
                label={x => x.pcrAddPartnerLabels.financialYearEndHeading}
                content={<MonthYear value={pcrItem.financialYearEndDate} />}
                hasError={!!validationErrors?.financialYearEndDate}
                qa="financialYearEndDate"
                action={<EditLink stepName={PCRStepType.financeDetailsStep} />}
              />

              <SummaryListItem
                label={x => x.pcrAddPartnerLabels.turnoverSummaryHeading}
                content={<Currency value={pcrItem.financialYearEndTurnover} />}
                hasError={!!validationErrors?.financialYearEndTurnover}
                qa="financialYearEndTurnover"
                action={<EditLink stepName={PCRStepType.financeDetailsStep} />}
              />
            </>
          )}

          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.projectLocationHeading}
            content={pcrItem.projectLocationLabel}
            hasError={!!validationErrors?.projectLocation}
            qa="projectLocation"
            action={<EditLink stepName={PCRStepType.projectLocationStep} />}
          />
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.townOrCityHeading}
            content={pcrItem.projectCity}
            hasError={!!validationErrors?.projectCity}
            qa="projectCity"
            action={<EditLink stepName={PCRStepType.projectLocationStep} />}
          />
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.postcodeHeading}
            content={pcrItem.projectPostcode}
            hasError={!!validationErrors?.projectPostcode}
            qa="projectPostcode"
            action={<EditLink stepName={PCRStepType.projectLocationStep} />}
          />
        </SummaryList>
      </Section>

      <Section title={x => x.pcrAddPartnerLabels.contactsSectionTitle} qa="add-partner-summary-contacts">
        <Section title={x => x.pcrAddPartnerLabels.financeContactHeading}>
          <SummaryList qa="add-partner-summary-list-contacts-finance-contact">
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.contactFirstNameHeading}
              content={pcrItem.contact1Forename}
              hasError={!!validationErrors?.contact1Forename}
              qa="contact1Forename"
              action={<EditLink stepName={PCRStepType.financeContactStep} />}
            />
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.contactLastNameHeading}
              content={pcrItem.contact1Surname}
              hasError={!!validationErrors?.contact1Surname}
              qa="contact1Surname"
              action={<EditLink stepName={PCRStepType.financeContactStep} />}
            />
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.contactPhoneNumberHeading}
              content={pcrItem.contact1Phone}
              hasError={!!validationErrors?.contact1Phone}
              qa="contact1Phone"
              action={<EditLink stepName={PCRStepType.financeContactStep} />}
            />
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.contactEmailHeading}
              content={pcrItem.contact1Email}
              hasError={!!validationErrors?.contact1Email}
              qa="contact1Email"
              action={<EditLink stepName={PCRStepType.financeContactStep} />}
            />
          </SummaryList>
        </Section>
        {pcrItem.projectRole === PCRProjectRole.ProjectLead && (
          <Section title={x => x.pcrAddPartnerLabels.projectLeadContactHeading}>
            <SummaryList qa="add-partner-summary-list-contacts-project-manager">
              <SummaryListItem
                label={x => x.pcrAddPartnerLabels.contactFirstNameHeading}
                content={pcrItem.contact2Forename}
                hasError={!!validationErrors?.contact2Forename}
                qa="contact2Forename"
                action={<EditLink stepName={PCRStepType.projectManagerDetailsStep} />}
              />
              <SummaryListItem
                label={x => x.pcrAddPartnerLabels.contactLastNameHeading}
                content={pcrItem.contact2Surname}
                hasError={!!validationErrors?.contact2Surname}
                qa="contact2Surname"
                action={<EditLink stepName={PCRStepType.projectManagerDetailsStep} />}
              />
              <SummaryListItem
                label={x => x.pcrAddPartnerLabels.contactPhoneNumberHeading}
                content={pcrItem.contact2Phone}
                hasError={!!validationErrors?.contact2Phone}
                qa="contact2Phone"
                action={<EditLink stepName={PCRStepType.projectManagerDetailsStep} />}
              />
              <SummaryListItem
                label={x => x.pcrAddPartnerLabels.contactEmailHeading}
                content={pcrItem.contact2Email}
                hasError={!!validationErrors?.contact2Email}
                qa="contact2Email"
                action={<EditLink stepName={PCRStepType.projectManagerDetailsStep} />}
              />
            </SummaryList>
          </Section>
        )}
      </Section>

      <Section title={x => x.pcrAddPartnerLabels.fundingSectionTitle} qa="add-partner-summary-funding">
        <SummaryList qa="add-partner-summary-list-funding">
          {!isIndustrial && (
            <>
              <SummaryListItem
                label={x => x.pcrAddPartnerLabels.jesHeading}
                content={<DocumentsComponent documents={documents} description={DocumentDescription.JeSForm} />}
                qa="supportingDocumentsJes"
                action={<EditLink stepName={PCRStepType.jeSStep} />}
              />

              <SummaryListItem
                label={x => x.pcrAddPartnerLabels.tsbReferenceHeading}
                content={pcrItem.tsbReference}
                hasError={!!validationErrors?.tsbReference}
                qa="tsbReference"
                action={<EditLink stepName={PCRStepType.academicCostsStep} />}
              />
            </>
          )}
          {isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.projectCostsHeading}
              content={<Currency value={data.totalProjectCosts} />}
              hasError={!!validationErrors?.totalProjectCosts}
              qa="projectCosts"
              action={
                mode === "prepare" ? (
                  <EditLink stepName={PCRStepType.spendProfileStep} />
                ) : (
                  <ViewLink stepName={PCRStepType.spendProfileStep} />
                )
              }
            />
          )}
          {!isIndustrial && (
            <SummaryListItem
              label={x => x.pcrAddPartnerLabels.projectCostsHeading}
              content={<Currency value={data.totalProjectCosts} />}
              qa="projectCosts"
              hasError={!!validationErrors?.totalProjectCosts}
              action={
                mode === "prepare" ? (
                  <EditLink stepName={PCRStepType.academicCostsStep} />
                ) : (
                  <ViewLink stepName={PCRStepType.academicCostsStep} />
                )
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
            hasError={!!validationErrors?.hasOtherFunding}
            qa="hasOtherFunding"
            action={<EditLink stepName={PCRStepType.otherFundingStep} />}
          />
          {pcrItem.hasOtherFunding && (
            <SummaryListItem
              hasError={!!validationErrors?.totalOtherFunding}
              label={x => x.pcrAddPartnerLabels.amountOfOtherFundingHeading}
              content={<Currency value={data.totalOtherFunding} />}
              qa="amountOfOtherFunding"
              action={<EditLink stepName={PCRStepType.otherFundingSourcesStep} />}
            />
          )}
          <SummaryListItem
            id="awardRate"
            label={x => x.pcrAddPartnerLabels.fundingLevelHeading}
            content={<Percentage value={pcrItem.awardRate} />}
            hasError={!!validationErrors?.awardRate}
            qa="fundingLevel"
            action={<EditLink stepName={PCRStepType.awardRateStep} />}
          />
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.fundingSoughtHeading}
            content={<Currency value={data.fundingSought} />}
            hasError={!!validationErrors?.fundingSought}
            qa="fundingSought"
          />
          <SummaryListItem
            label={x => x.pcrAddPartnerLabels.partnerContributionsHeading}
            content={<Currency value={data.partnerContribution} />}
            hasError={!!validationErrors?.partnerContribution}
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
            action={<EditLink stepName={PCRStepType.agreementToPcrStep} />}
          />
        </SummaryList>
      </Section>

      {displayCompleteForm && (
        <PcrItemSummaryForm<AddPartnerSchema>
          register={register}
          watch={watch}
          handleSubmit={handleSubmit}
          pcrItem={pcrItem}
        />
      )}
    </PcrPage>
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
