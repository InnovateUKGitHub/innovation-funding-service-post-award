import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { getAuthRoles } from "@framework/types/authorisation";
import { roundCurrency } from "@framework/util/numberHelper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/components/atomicDesign/atoms/Button/Button";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { TBody, TD, TFoot, TH, THead, TR, Table } from "@ui/components/atomicDesign/atoms/table/tableComponents";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { AwardRateOverrideLabel } from "@ui/components/atomicDesign/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage";
import { AwardRateOverridesMessage } from "@ui/components/atomicDesign/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage.standalone";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/redux/routesProvider";
import { FormTypes } from "@ui/zod/FormTypes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  usePartnerLevelFinancialVirementEditData as useCostCategoryLevelFinancialVirementEditData,
  useMapOverwrittenFinancialVirements,
  useOnUpdateCostCategoryLevel,
} from "./CostCategoryLevelFinancialVirementEdit.logic";
import {
  CostCategoryLevelFinancialVirementEditSchemaType,
  costCategoryLevelFinancialVirementEditErrorMap,
  costCategoryLevelFinancialVirementEditSchema,
} from "./CostCategoryLevelFinancialVirementEdit.zod";

/**
 * hook to return edit page content
 */
export function useEditPageContent() {
  const { getContent } = useContent();

  return {
    summaryTitle: getContent(x => x.pages.financialVirementEdit.summaryTitle),
    saveButton: getContent(x => x.pages.financialVirementEdit.saveButton),

    introMessage: getContent(x => x.pages.financialVirementEdit.editPageMessage.intro),
    virementsMessage: getContent(x => x.pages.financialVirementEdit.editPageMessage.virements),
    requestsMessage: getContent(x => x.pages.financialVirementEdit.editPageMessage.requests),

    costCategoryName: getContent(x => x.financialVirementLabels.costCategoryName),
    costCategoryOriginalEligibleCosts: getContent(x => x.financialVirementLabels.costCategoryOriginalEligibleCosts),
    costCategoryCostsClaimed: getContent(x => x.financialVirementLabels.costCategoryCostsClaimed),
    costCategoryNewEligibleCosts: getContent(x => x.financialVirementLabels.costCategoryNewEligibleCosts),
    costCategoryDifferenceCosts: getContent(x => x.financialVirementLabels.costCategoryDifferenceCosts),
    partnerTotals: getContent(x => x.financialVirementLabels.partnerTotals),
    projectOriginalEligibleCosts: getContent(x => x.financialVirementLabels.projectOriginalEligibleCosts),
    projectNewEligibleCosts: getContent(x => x.financialVirementLabels.projectNewEligibleCosts),
    projectDifferenceCosts: getContent(x => x.financialVirementLabels.projectDifferenceCosts),
    projectOriginalRemainingGrant: getContent(x => x.financialVirementLabels.projectOriginalRemainingGrant),
    projectNewRemainingGrant: getContent(x => x.financialVirementLabels.projectNewRemainingGrant),
    projectDifferenceGrant: getContent(x => x.financialVirementLabels.projectDifferenceGrant),
    backToSummary: getContent(x => x.financialVirementLabels.backToSummary),
    costCategoryAwardRate: getContent(x => x.financialVirementLabels.costCategoryAwardRate),
    costCategoryNewRemainingGrant: getContent(x => x.financialVirementLabels.costCategoryNewRemainingGrant),
    costCategoryOriginalRemainingGrant: getContent(x => x.financialVirementLabels.costCategoryOriginalRemainingGrant),
  };
}

interface PartnerLevelFinancialVirementParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  pcrId: PcrId;
  itemId: PcrItemId;
}

/**
 * A page for editing Loans virements for a PCR.
 */
const EditPage = ({ projectId, pcrId, itemId, partnerId }: PartnerLevelFinancialVirementParams & BaseProps) => {
  const routes = useRoutes();
  const { getContent } = useContent();

  const { project, partner, financialVirementsForCosts, financialVirementsForParticipants, partners } =
    useCostCategoryLevelFinancialVirementEditData({ projectId, partnerId, itemId });

  const mapFinancialVirement = useMapOverwrittenFinancialVirements({
    financialVirementsForCosts,
    financialVirementsForParticipants,
    partners,
    pcrItemId: itemId,
  });

  const { virementData: initialVirementData } = mapFinancialVirement();

  const initialPartnerVirement = initialVirementData.partners.find(x => x.partnerId === partnerId)!;

  const { register, watch, handleSubmit, setError, formState, getFieldState } = useForm<
    z.input<CostCategoryLevelFinancialVirementEditSchemaType>
  >({
    resolver: zodResolver(costCategoryLevelFinancialVirementEditSchema, {
      errorMap: costCategoryLevelFinancialVirementEditErrorMap,
    }),
    defaultValues: {
      form: FormTypes.PcrFinancialVirementsCostCategorySaveAndContinue,
      projectId,
      pcrId,
      pcrItemId: itemId,
      partnerId,
      virements: initialPartnerVirement.virements.map(x => ({
        costCategoryId: x.costCategoryId,
        costsClaimedToDate: x.costsClaimedToDate,
        newEligibleCosts: String(x.newEligibleCosts),
        costCategoryName: x.costCategoryName,
      })),
    },
  });

  const defaults = useServerInput();
  const validationErrors = useZodErrors(setError, formState.errors);

  const { virementData } = mapFinancialVirement(watch("virements"));

  const { onUpdate, isProcessing } = useOnUpdateCostCategoryLevel({
    mapFinancialVirement,
  });

  const partnerVirement = virementData.partners.find(x => x.partnerId === partnerId)!;

  const { isPm } = getAuthRoles(project.roles);
  const { isKTP } = checkProjectCompetition(project.competitionType);
  const displayIntroMessage: boolean = isKTP && isPm;

  return (
    <Page
      backLink={
        <BackLink
          route={routes.pcrPrepareItem.getLink({
            projectId: projectId,
            pcrId: pcrId,
            itemId: itemId,
          })}
        >
          <Content value={x => x.financialVirementLabels.backToSummary} />
        </BackLink>
      }
      pageTitle={<Title projectNumber={project.projectNumber} title={project.title} />}
      validationErrors={validationErrors}
    >
      <AwardRateOverridesMessage
        projectId={projectId}
        partnerId={partnerId}
        overrideLabel={AwardRateOverrideLabel.PROJECT}
      />
      {displayIntroMessage && (
        <>
          <SimpleString>{getContent(x => x.pages.financialVirementEdit.editPageMessage.intro)}</SimpleString>
          <SimpleString>{getContent(x => x.pages.financialVirementEdit.editPageMessage.virements)}</SimpleString>
          <SimpleString>{getContent(x => x.pages.financialVirementEdit.editPageMessage.requests)}</SimpleString>
        </>
      )}

      <Form
        onSubmit={handleSubmit(data =>
          onUpdate({
            // RHF reports the type as the input type,
            // but it has already been transformed to the output type.
            data: data as unknown as z.output<CostCategoryLevelFinancialVirementEditSchemaType>,
          }),
        )}
      >
        <input type="hidden" value={FormTypes.PcrFinancialVirementsCostCategorySaveAndContinue} {...register("form")} />
        <input type="hidden" value={projectId} {...register("projectId")} />
        <input type="hidden" value={pcrId} {...register("pcrId")} />
        <input type="hidden" value={itemId} {...register("pcrItemId")} />
        <input type="hidden" value={partnerId} {...register("partnerId")} />

        <Section title={partner.name}>
          <Table>
            <THead>
              <TR>
                <TH>Cost Category</TH>
                <TH numeric>Total eligible costs</TH>
                <TH numeric>Costs claimed</TH>
                <TH numeric>New total eligible costs</TH>
                <TH numeric>Costs reallocated</TH>
              </TR>
            </THead>
            <TBody>
              {partnerVirement.virements.map((x, i) => (
                <TR key={x.costCategoryId} hasError={!!getFieldState(`virements.${i}`).error}>
                  <TD>{x.costCategoryName}</TD>
                  <TD numeric>
                    <Currency value={x.originalEligibleCosts} />
                  </TD>
                  <TD numeric>
                    <Currency value={x.costsClaimedToDate} />
                  </TD>
                  <TD numeric>
                    <input type="hidden" value={x.virementCostId} {...register(`virements.${i}.virementCostId`)} />
                    <Fieldset>
                      <ValidationError error={getFieldState(`virements.${i}.newEligibleCosts`).error} />
                      <NumberInput
                        {...register(`virements.${i}.newEligibleCosts`)}
                        id={`virements_${i}_newEligibleCosts`}
                        disabled={isProcessing}
                        hasError={!!getFieldState(`virements.${i}.newEligibleCosts`).error}
                        defaultValue={defaults?.newEligibleCosts ?? x.newEligibleCosts}
                      />
                    </Fieldset>
                  </TD>
                  <TD numeric>
                    <Currency value={roundCurrency(x.newEligibleCosts - x.originalEligibleCosts)} />
                  </TD>
                </TR>
              ))}
            </TBody>
            <TFoot>
              <TR>
                <TD bold>Project Totals</TD>
                <TD bold numeric>
                  <Currency value={partnerVirement.originalEligibleCosts} />
                </TD>
                <TD bold numeric>
                  <Currency value={partnerVirement.costsClaimedToDate} />
                </TD>
                <TD bold numeric>
                  <Currency value={partnerVirement.newEligibleCosts} />
                </TD>
                <TD bold numeric>
                  <Currency
                    value={roundCurrency(partnerVirement.newEligibleCosts - partnerVirement.originalEligibleCosts)}
                  />
                </TD>
              </TR>
            </TFoot>
          </Table>
          <Section title={getContent(x => x.pages.financialVirementEdit.summaryTitle)}>
            <Table data-qa="summary-table">
              <THead>
                <TR>
                  <TH>Total eligible costs</TH>
                  <TH>New total eligible costs</TH>
                  <TH>Difference</TH>
                  <TH>Total remaining grant</TH>
                  <TH>New total remaining grant</TH>
                  <TH>Difference</TH>
                </TR>
              </THead>
              <TBody>
                <TR>
                  <TD>
                    <Currency value={virementData.originalEligibleCosts} />
                  </TD>
                  <TD>
                    <Currency value={virementData.newEligibleCosts} />
                  </TD>
                  <TD>
                    <Currency value={virementData.costDifference} />
                  </TD>
                  <TD>
                    <Currency value={virementData.originalRemainingGrant} />
                  </TD>
                  <TD>
                    <Currency value={virementData.newRemainingGrant} />
                  </TD>
                  <TD>
                    <Currency value={virementData.grantDifference} />
                  </TD>
                </TR>
              </TBody>
            </Table>
          </Section>
        </Section>

        <Fieldset>
          <Button type="submit" styling="Primary" disabled={isProcessing}>
            Save and return to reallocate project costs
          </Button>
        </Fieldset>
      </Form>
    </Page>
  );
};

const PartnerLevelFinancialVirementRoute = defineRoute({
  // pm reallocates costs for participant at cost category level
  routeName: "partnerLevelFinancialVirementEdit",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/financial/:partnerId",
  container: EditPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
    partnerId: route.params.partnerId as PartnerId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.financialVirementEdit.title),
});

export { PartnerLevelFinancialVirementParams, PartnerLevelFinancialVirementRoute };
