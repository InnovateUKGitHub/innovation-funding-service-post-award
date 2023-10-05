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

  const createIssue = (
    i18n: string,
    { type, path }: { type?: string; path?: (string | number)[] } = {},
  ): z.IssueData => ({
    code: z.ZodIssueCode.custom,
    fatal: true,
    params: {
      i18n,
      type,
    },
    path,
  });

  return z
    .array(
      validation
        .superRefine((val, ctx) => {
          const currentOption = pcrItemInfo.find(x => x.type === val);

          if (currentOption) {
            switch (currentOption.disabledReason) {
              case PCRItemDisabledReason.AnotherPcrAlreadyHasThisType:
                ctx.addIssue(
                  createIssue("errors.another_pcr_already_has_this_type", { type: currentOption.displayName }),
                );
                break;
              case PCRItemDisabledReason.ThisPcrAlreadyHasThisType:
                ctx.addIssue(createIssue("errors.this_pcr_already_has_this_type", { type: currentOption.displayName }));
                break;
              case PCRItemDisabledReason.NotEnoughPartnersToActionThisType:
                ctx.addIssue(
                  createIssue("errors.not_enough_partners_to_action_this_type", { type: currentOption.displayName }),
                );
                break;
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
        ),
    )
    .min(1)
    .superRefine((vals, ctx) => {
      const renamePos = vals.indexOf(PCRItemType.AccountNameChange);
      const removePos = vals.indexOf(PCRItemType.PartnerWithdrawal);

      const renameSelected = renamePos >= 0;
      const removeSelected = removePos >= 0;

      let numberOfAdditions = 0;
      let numberOfRenames = renameSelected ? 1 : 0;
      let numberOfRemoves = removeSelected ? 1 : 0;

      for (const item of currentPcrItems) {
        if (item.type === PCRItemType.PartnerAddition) numberOfAdditions += 1;
        if (item.type === PCRItemType.PartnerWithdrawal) numberOfRemoves += 1;
        if (item.type === PCRItemType.AccountNameChange) numberOfRenames += 1;
      }

      const maxNumberOfRemoves = numberOfAdditions === 0 ? numberOfPartners - 1 : numberOfPartners;
      const maxNumberOfRenames = numberOfPartners;
      const maxNumberOfBoth = numberOfPartners;

      if (numberOfRenames + numberOfRemoves > maxNumberOfBoth) {
        if (removeSelected) {
          ctx.addIssue(createIssue("errors.not_enough_partners_to_remove"));
        }
        if (renameSelected) {
          ctx.addIssue(createIssue("errors.not_enough_partners_to_rename"));
        }
      } else if (renameSelected && numberOfRenames > maxNumberOfRenames) {
        ctx.addIssue(createIssue("errors.not_enough_partners_to_rename"));
      } else if (removeSelected && numberOfRemoves > maxNumberOfRemoves) {
        ctx.addIssue(createIssue("errors.not_enough_partners_to_remove"));
      }
    });
};

export const getPcrCreateSchema = (props: PCRValidatorExtraProps) =>
  z.object({
    form: z.literal(FormTypes.ProjectChangeRequestCreate),
    projectId: projectIdValidation,
    types: getPcrTypeValidation(props),
  });
export type PcrCreateSchemaType = ReturnType<typeof getPcrCreateSchema>;

export const getPcrUpdateTypesSchema = (props: PCRValidatorExtraProps) =>
  z.object({
    form: z.literal(FormTypes.ProjectChangeRequestUpdateTypes),
    projectId: projectIdValidation,
    pcrId: pcrIdValidation,
    types: getPcrTypeValidation(props),
  });
export type PcrUpdateTypesSchemaType = ReturnType<typeof getPcrUpdateTypesSchema>;

export const getPcrModifyTypesSchema = (props: PCRValidatorExtraProps) =>
  z.discriminatedUnion("form", [getPcrCreateSchema(props), getPcrUpdateTypesSchema(props)]);
export type PcrModifyTypesSchemaType = ReturnType<typeof getPcrModifyTypesSchema>;
