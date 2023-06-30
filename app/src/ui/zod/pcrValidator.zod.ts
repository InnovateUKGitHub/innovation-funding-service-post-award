import { PCRItemDisabledReason, pcrItems, PCRItemType } from "@framework/constants/pcrConstants";
import { PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { makeZodI18nMap } from "@shared/zodi18n";
import { z } from "zod";
import { FormTypes } from "./FormTypes";
import { pcrIdValidation, projectIdValidation } from "./helperValidators.zod";

interface PCRValidatorExtraProps {
  pcrItemInfo: Pick<PCRItemTypeDto, "type" | "disabled" | "disabledReason" | "displayName">[];
  numberOfPartners: number;
  currentPcrItems: { type: PCRItemType }[];
}

export const pcrModifyErrorMap = makeZodI18nMap({ keyPrefix: ["pcrModify"] });

const getPcrTypeValidation = ({ pcrItemInfo, numberOfPartners, currentPcrItems }: PCRValidatorExtraProps) => {
  const validation = z.coerce
    .number()
    .refine(x => pcrItems.includes(x), {
      params: {
        i18n: "errors.invalid_enum_value",
      },
    })
    .transform(x => x as PCRItemType);

  if (pcrItemInfo) {
    return validation
      .superRefine((val, ctx) => {
        const validOptions = pcrItemInfo.map(x => x.type);
        const currentOption = pcrItemInfo.find(x => x.type === val);

        const createIssue = (i18n: string): z.IssueData => ({
          code: z.ZodIssueCode.custom,
          options: validOptions,
          received: val,
          fatal: true,
          params: {
            i18n,
            type: currentOption?.displayName,
          },
        });

        if (currentOption) {
          if (currentOption?.type === PCRItemType.PartnerWithdrawal) {
            // Special rules for partner withdrawal :)
            // If there are `n` partners, you cannot add `n` removals,
            // ...unless there is also at least 1 addition, in which you can.

            let numberOfAdditions = 0;
            let numberOfWithdrawls = 1; // Starting from 1, because we're including the one we're about to execute

            for (const item of currentPcrItems) {
              if (item.type === PCRItemType.PartnerAddition) numberOfAdditions += 1;
              if (item.type === PCRItemType.PartnerWithdrawal) numberOfWithdrawls += 1;
            }

            const maxNumberOfWithdrawls = numberOfAdditions === 0 ? numberOfPartners - 1 : numberOfPartners;

            if (numberOfWithdrawls > maxNumberOfWithdrawls) {
              ctx.addIssue(createIssue("errors.not_enough_partners_to_action_this_type"));
            }
          } else if (currentOption) {
            switch (currentOption.disabledReason) {
              case PCRItemDisabledReason.AnotherPcrAlreadyHasThisType:
                ctx.addIssue(createIssue("errors.another_pcr_already_has_this_type"));
                break;
              case PCRItemDisabledReason.ThisPcrAlreadyHasThisType:
                ctx.addIssue(createIssue("errors.this_pcr_already_has_this_type"));
                break;
              case PCRItemDisabledReason.NotEnoughPartnersToActionThisType:
                ctx.addIssue(createIssue("errors.not_enough_partners_to_action_this_type"));
                break;
            }
          }
        }
      })
      .refine(
        x =>
          !pcrItemInfo.some(
            y => x === y.type && y.disabledReason === PCRItemDisabledReason.AnotherPcrAlreadyHasThisType,
          ),
      )
      .refine(
        x =>
          !pcrItemInfo.some(
            y => x === y.type && y.disabledReason === PCRItemDisabledReason.NotEnoughPartnersToActionThisType,
          ),
      );
  }

  return validation;
};

export const getPcrCreateSchema = (props: PCRValidatorExtraProps) =>
  z.object({
    form: z.literal(FormTypes.ProjectChangeRequestCreate),
    projectId: projectIdValidation,
    types: z.array(getPcrTypeValidation(props)).min(1),
  });
export type PcrCreateSchemaType = ReturnType<typeof getPcrCreateSchema>;

export const getPcrUpdateTypesSchema = (props: PCRValidatorExtraProps) =>
  z.object({
    form: z.literal(FormTypes.ProjectChangeRequestUpdateTypes),
    projectId: projectIdValidation,
    pcrId: pcrIdValidation,
    types: z.array(getPcrTypeValidation(props)).min(1),
  });
export type PcrUpdateTypesSchemaType = ReturnType<typeof getPcrUpdateTypesSchema>;

export const getPcrModifyTypesSchema = (props: PCRValidatorExtraProps) =>
  z.discriminatedUnion("form", [getPcrCreateSchema(props), getPcrUpdateTypesSchema(props)]);
export type PcrModifyTypesSchemaType = ReturnType<typeof getPcrModifyTypesSchema>;
