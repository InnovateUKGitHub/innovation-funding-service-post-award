import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import { pcrIdValidation, pcrItemIdValidation, projectIdValidation } from "@ui/zod/helperValidators.zod";
import { ZodIssueCode, z } from "zod";
import { MapVirements, mapVirements } from "../../utils/useMapFinancialVirements";
import { getGenericCurrencyValidation } from "@ui/zod/currencyValidator.zod";

const financialVirementsSummaryErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "financialVirements"] });

const grantMovingOverFinancialYearLabel = "forms.pcr.grantMovingOverFinancialYear.label";

const getFinancialVirementsSummaryValidator = ({
  mapFinancialVirementProps,
}: {
  mapFinancialVirementProps: MapVirements;
}) => {
  return z
    .object({
      projectId: projectIdValidation,
      pcrId: pcrIdValidation,
      pcrItemId: pcrItemIdValidation,
      form: z.literal(FormTypes.PcrFinancialVirementsSummary),
      grantMovingOverFinancialYear: getGenericCurrencyValidation({
        label: grantMovingOverFinancialYearLabel,
        required: false,
      }),
      markedAsComplete: z.boolean(),
    })
    .superRefine((data, ctx) => {
      const { isSummaryValid, virementData, virementMeta } = mapVirements(mapFinancialVirementProps);

      if (data.markedAsComplete) {
        virementData.partners.forEach(partner => {
          if (
            partner.virements.some(
              costCategoryVirement => costCategoryVirement.newEligibleCosts < costCategoryVirement.costsClaimedToDate,
            )
          ) {
            ctx.addIssue({
              code: ZodIssueCode.custom,
              path: ["partner", partner.partnerId],
              params: {
                i18n: "errors.costs_too_small",
                name: partner.name,
              },
            });
          }
        });

        getGenericCurrencyValidation({ label: grantMovingOverFinancialYearLabel, required: true }).parse(
          data.grantMovingOverFinancialYear,
          { errorMap: financialVirementsSummaryErrorMap, path: ["grantMovingOverFinancialYear"] },
        );

        if (!isSummaryValid) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              i18n: "errors.virement_too_big",
              difference: virementMeta.grantDifference,
              total: virementMeta.originalRemainingGrant,
            },
          });
        }
      }
    });
};

type FinancialVirementsSummaryValidatorSchema = ReturnType<typeof getFinancialVirementsSummaryValidator>;

export {
  financialVirementsSummaryErrorMap,
  getFinancialVirementsSummaryValidator,
  FinancialVirementsSummaryValidatorSchema,
};
