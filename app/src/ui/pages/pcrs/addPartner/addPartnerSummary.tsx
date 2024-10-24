import { DocumentDescription } from "@framework/constants/documentDescription";
import { CostCategoryType } from "@framework/constants/enums";
import { PCRItemStatus, PCROrganisationType, PCRProjectRole, PCRStepType } from "@framework/constants/pcrConstants";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { sumBy } from "@framework/util/numberHelper";
import { Content } from "@ui/components/molecules/Content/content";
import { DocumentList } from "@ui/components/organisms/documents/DocumentList/DocumentList";
import { Section } from "@ui/components/molecules/Section/section";
import { Currency } from "@ui/components/atoms/Currency/currency";
import { MonthYear } from "@ui/components/atoms/Date";
import { Percentage } from "@ui/components/atoms/Percentage/percentage";
import { SummaryList, SummaryListItem } from "@ui/components/molecules/SummaryList/summaryList";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { useAddPartnerWorkflowQuery } from "./addPartner.logic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddPartnerSchema, addPartnerErrorMap, getAddPartnerSummarySchema } from "./addPartnerSummary.zod";
import { PcrPage } from "../pcrPage";
import { EditLink, ViewLink } from "../pcrItemSummaryLinks";
import { PcrItemSummaryForm } from "../pcrItemSummaryForm";
import { SpendProfile } from "@gql/dtoMapper/mapPcrSpendProfile";
import { useMemo } from "react";
import { useContent } from "@ui/hooks/content.hook";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { FormTypes } from "@ui/zod/FormTypes";

export const AddPartnerSummary = () => {
  const { projectId, itemId, fetchKey, mode, displayCompleteForm } = usePcrWorkflowContext();

  const { pcrItem, documents, pcrSpendProfile, costCategories } = useAddPartnerWorkflowQuery(
    projectId,
    itemId,
    fetchKey,
  );

  const { handleSubmit, register, formState, watch, setError } = useForm<AddPartnerSchema>({
    // summary page should take default value from saved state. it will be overridden when the checkbox is clicked
    defaultValues: {
      markedAsComplete: pcrItem.status === PCRItemStatus.Complete,
      form: FormTypes.PcrAddPartnerSummary,
      ...pcrItem,
      organisationName: pcrItem.organisationName ?? undefined,
      registrationNumber: pcrItem.registrationNumber ?? undefined,
      registeredAddress: pcrItem.registeredAddress ?? undefined,
      contact1Email: pcrItem.contact1Email ?? undefined,
      contact1Forename: pcrItem.contact1Forename ?? undefined,
      contact1Surname: pcrItem.contact1Surname ?? undefined,
      contact1Phone: pcrItem.contact1Phone ?? undefined,
      contact2Email: pcrItem.contact2Email ?? undefined,
      contact2Forename: pcrItem.contact2Forename ?? undefined,
      contact2Surname: pcrItem.contact2Surname ?? undefined,
      contact2Phone: pcrItem.contact2Phone ?? undefined,
      projectCity: pcrItem.projectCity ?? undefined,
      projectPostcode: pcrItem.projectPostcode ?? undefined,
      tsbReference: pcrItem.tsbReference ?? undefined,
    },
    resolver: zodResolver(
      getAddPartnerSummarySchema({ projectRole: pcrItem.projectRole, organisationType: pcrItem.organisationType }),
      {
        errorMap: addPartnerErrorMap,
      },
    ),
  });

  const { getContent } = useContent();

  const projectRoleLabel =
    pcrItem.projectRoleLabel === "Lead"
      ? getContent(x => x.pages.pcrAddPartnerRoleAndOrganisation.lead)
      : pcrItem.projectRoleLabel;

  const validationErrors = useZodErrors(setError, formState.errors);

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
            content={projectRoleLabel}
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
              id="organisationName"
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
                id="organisationName"
                label={x => x.pcrAddPartnerLabels.organisationNameHeading}
                content={pcrItem.organisationName}
                hasError={!!validationErrors?.organisationName}
                qa="organisationName"
                action={<EditLink stepName={PCRStepType.companiesHouseStep} />}
              />
              <SummaryListItem
                id="registrationNumber"
                label={x => x.pcrAddPartnerLabels.registrationNumberHeading}
                content={pcrItem.registrationNumber}
                hasError={!!validationErrors?.registrationNumber}
                qa="registrationNumber"
                action={<EditLink stepName={PCRStepType.companiesHouseStep} />}
              />

              <SummaryListItem
                id="registeredAddress"
                label={x => x.pcrAddPartnerLabels.registeredAddressHeading}
                content={pcrItem.registeredAddress}
                hasError={!!validationErrors?.registeredAddress}
                qa="registeredAddress"
                action={<EditLink stepName={PCRStepType.companiesHouseStep} />}
              />
            </>
          )}
          <SummaryListItem
            id="participantSize"
            label={x => x.pcrAddPartnerLabels.organisationSizeHeading}
            content={pcrItem.participantSizeLabel}
            hasError={!!validationErrors?.participantSize}
            qa="participantSize"
            action={isIndustrial ? <EditLink stepName={PCRStepType.organisationDetailsStep} /> : null}
          />
          {isIndustrial && (
            <>
              <SummaryListItem
                id="numberOfEmployees"
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
                id="financialYearEndTurnover"
                label={x => x.pcrAddPartnerLabels.turnoverSummaryHeading}
                content={<Currency noDefault value={pcrItem.financialYearEndTurnover} />}
                hasError={!!validationErrors?.financialYearEndTurnover}
                qa="financialYearEndTurnover"
                action={<EditLink stepName={PCRStepType.financeDetailsStep} />}
              />
            </>
          )}

          <SummaryListItem
            id="projectLocation"
            label={x => x.pcrAddPartnerLabels.projectLocationHeading}
            content={pcrItem.projectLocationLabel}
            hasError={!!validationErrors?.projectLocation}
            qa="projectLocation"
            action={<EditLink stepName={PCRStepType.projectLocationStep} />}
          />
          <SummaryListItem
            id="projectCity"
            label={x => x.pcrAddPartnerLabels.townOrCityHeading}
            content={pcrItem.projectCity}
            hasError={!!validationErrors?.projectCity}
            qa="projectCity"
            action={<EditLink stepName={PCRStepType.projectLocationStep} />}
          />
          <SummaryListItem
            id="projectPostcode"
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
              id="contact1Forename"
              label={x => x.pcrAddPartnerLabels.contactFirstNameHeading}
              content={pcrItem.contact1Forename}
              hasError={!!validationErrors?.contact1Forename}
              qa="contact1Forename"
              action={<EditLink stepName={PCRStepType.financeContactStep} />}
            />
            <SummaryListItem
              id="contact1Surname"
              label={x => x.pcrAddPartnerLabels.contactLastNameHeading}
              content={pcrItem.contact1Surname}
              hasError={!!validationErrors?.contact1Surname}
              qa="contact1Surname"
              action={<EditLink stepName={PCRStepType.financeContactStep} />}
            />
            <SummaryListItem
              id="contact1Phone"
              label={x => x.pcrAddPartnerLabels.contactPhoneNumberHeading}
              content={pcrItem.contact1Phone}
              hasError={!!validationErrors?.contact1Phone}
              qa="contact1Phone"
              action={<EditLink stepName={PCRStepType.financeContactStep} />}
            />
            <SummaryListItem
              id="contact1Email"
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
                id="contact2Forename"
                label={x => x.pcrAddPartnerLabels.contactFirstNameHeading}
                content={pcrItem.contact2Forename}
                hasError={!!validationErrors?.contact2Forename}
                qa="contact2Forename"
                action={<EditLink stepName={PCRStepType.projectManagerDetailsStep} />}
              />
              <SummaryListItem
                id="contact2Surname"
                label={x => x.pcrAddPartnerLabels.contactLastNameHeading}
                content={pcrItem.contact2Surname}
                hasError={!!validationErrors?.contact2Surname}
                qa="contact2Surname"
                action={<EditLink stepName={PCRStepType.projectManagerDetailsStep} />}
              />
              <SummaryListItem
                id="contact2Phone"
                label={x => x.pcrAddPartnerLabels.contactPhoneNumberHeading}
                content={pcrItem.contact2Phone}
                hasError={!!validationErrors?.contact2Phone}
                qa="contact2Phone"
                action={<EditLink stepName={PCRStepType.projectManagerDetailsStep} />}
              />
              <SummaryListItem
                id="contact2Email"
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
                id="tsbReference"
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
              id="projectCosts"
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
              id="projectCosts"
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
            id="hasOtherFunding"
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
              id="totalOtherFunding"
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
            id="fundingSought"
            label={x => x.pcrAddPartnerLabels.fundingSoughtHeading}
            content={<Currency value={data.fundingSought} />}
            hasError={!!validationErrors?.fundingSought}
            qa="fundingSought"
          />
          <SummaryListItem
            id="partnerContribution"
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
        >
          <input type="hidden" name="projectRole" value={pcrItem.projectRole} />
          <input type="hidden" name="organisationType" value={pcrItem.organisationType} />
          <input type="hidden" name="form" value={FormTypes.PcrAddPartnerSummary} />
        </PcrItemSummaryForm>
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
