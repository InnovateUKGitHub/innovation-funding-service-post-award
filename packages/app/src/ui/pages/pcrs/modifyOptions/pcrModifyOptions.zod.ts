import { PCRItemHiddenReason, pcrItems, PCRItemType, pcrItemTypes } from "@framework/constants/pcrConstants";
import { PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { makeZodI18nMap } from "@shared/zodi18n";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { evaluateObject } from "@ui/zod/helperValidators/helperValidators.zod";

interface PCRValidatorExtraProps {
  pcrItemInfo: Pick<PCRItemTypeDto, "type" | "hidden" | "hiddenReason" | "displayName">[];
  numberOfPartners: number;
  currentPcrItems: PCRItemType[];
}

export const pcrModifyErrorMap = makeZodI18nMap({ keyPrefix: ["pcrModify"] });

const pcrTypeValidation = z.coerce
  .number()
  .refine(x => pcrItems.includes(x), {
    params: {
      i18n: "errors.invalid_enum_value",
    },
  })
  .transform(x => x as PCRItemType);

const createIssue = (
  i18n: string,
  { type, path, params }: { type?: string; path?: (string | number)[]; params?: AnyObject } = {},
): z.IssueData => ({
  code: z.ZodIssueCode.custom,
  fatal: true,
  params: {
    i18n,
    type,
    ...params,
  },
  path,
});

export const pcrCreateSchema = evaluateObject((data: PCRValidatorExtraProps) => {
  return {
    types: z
      .array(
        pcrTypeValidation
          .superRefine((val, ctx) => {
            const currentOption = data.pcrItemInfo.find(x => x.type === val);

            if (currentOption) {
              switch (currentOption.hiddenReason) {
                case PCRItemHiddenReason.Exclusive:
                  ctx.addIssue(createIssue("errors.exclusive", { type: currentOption.displayName }));
                  break;
                case PCRItemHiddenReason.AnotherPcrAlreadyHasThisType:
                  ctx.addIssue(
                    createIssue("errors.another_pcr_already_has_this_type", { type: currentOption.displayName }),
                  );
                  break;
                case PCRItemHiddenReason.ThisPcrAlreadyHasThisType:
                  ctx.addIssue(
                    createIssue("errors.this_pcr_already_has_this_type", { type: currentOption.displayName }),
                  );
                  break;
                case PCRItemHiddenReason.NotEnoughPartnersToActionThisType:
                  ctx.addIssue(
                    createIssue("errors.not_enough_partners_to_action_this_type", { type: currentOption.displayName }),
                  );
                  break;
              }
            }
          })
          .refine(
            x =>
              !data.pcrItemInfo.some(
                y => x === y.type && y.hiddenReason === PCRItemHiddenReason.AnotherPcrAlreadyHasThisType,
              ),
          )
          .refine(
            x =>
              !data.pcrItemInfo.some(
                y => x === y.type && y.hiddenReason === PCRItemHiddenReason.NotEnoughPartnersToActionThisType,
              ),
          ),
      )
      .min(1)
      .superRefine((vals: PCRItemType[], ctx) => {
        let additionSelected = false;
        let renameSelected = false;
        let removeSelected = false;

        for (const selectedVal of vals) {
          for (const type of pcrItemTypes) {
            if (type.type === selectedVal && type.exclusive) {
              if (vals.length > 1) {
                ctx.addIssue(
                  createIssue("errors.exclusive", {
                    params: {
                      types: data.pcrItemInfo
                        .filter(x => x?.type !== type.type && vals.includes(x.type))
                        .map(x => x?.displayName),
                      type: data.pcrItemInfo.find(x => x?.type === type.type)?.displayName,
                    },
                  }),
                );
              }
            }
          }

          if (selectedVal === PCRItemType.PartnerAddition) additionSelected = true;
          if (selectedVal === PCRItemType.AccountNameChange) renameSelected = true;
          if (selectedVal === PCRItemType.PartnerWithdrawal) removeSelected = true;
        }

        let numberOfAdditions = additionSelected ? 1 : 0;
        let numberOfRenames = renameSelected ? 1 : 0;
        let numberOfRemoves = removeSelected ? 1 : 0;

        for (const item of data.currentPcrItems) {
          if (item === PCRItemType.PartnerAddition) numberOfAdditions += 1;
          if (item === PCRItemType.PartnerWithdrawal) numberOfRemoves += 1;
          if (item === PCRItemType.AccountNameChange) numberOfRenames += 1;
        }

        const maxNumberOfRemoves = numberOfAdditions === 0 ? data.numberOfPartners - 1 : data.numberOfPartners;
        const maxNumberOfRenames = data.numberOfPartners;
        const maxNumberOfBoth = data.numberOfPartners;

        if (numberOfRenames + numberOfRemoves > maxNumberOfBoth) {
          if (removeSelected && renameSelected) {
            ctx.addIssue(createIssue("errors.not_enough_partners_to_rename_and_remove"));
          } else if (removeSelected) {
            ctx.addIssue(createIssue("errors.not_enough_partners_to_remove"));
          } else if (renameSelected) {
            ctx.addIssue(createIssue("errors.not_enough_partners_to_rename"));
          }
        } else if (renameSelected && numberOfRenames > maxNumberOfRenames) {
          ctx.addIssue(createIssue("errors.not_enough_partners_to_rename"));
        } else if (removeSelected && numberOfRemoves > maxNumberOfRemoves) {
          ctx.addIssue(createIssue("errors.not_enough_partners_to_remove"));
        }
      }),
    pcrItemInfo: z
      .object({
        type: pcrTypeValidation,
        hidden: z.boolean(),
        displayName: z.string(),
        hiddenReason: z.number().transform(x => x as PCRItemHiddenReason),
      })
      .array(),
    numberOfPartners: z.number(),
    currentPcrItems: z.array(pcrTypeValidation),
    form: z.union([
      z.literal(FormTypes.ProjectChangeRequestUpdateTypes),
      z.literal(FormTypes.ProjectChangeRequestCreate),
    ]),
  };
});

export type PcrCreateSchemaType = typeof pcrCreateSchema;
