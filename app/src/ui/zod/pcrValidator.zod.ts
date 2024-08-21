import { PCRItemHiddenReason, pcrItems, PCRItemType, pcrItemTypes } from "@framework/constants/pcrConstants";
import { PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { makeZodI18nMap } from "@shared/zodi18n";
import { z } from "zod";
import { FormTypes } from "./FormTypes";
import { pcrIdValidation, projectIdValidation } from "./helperValidators/helperValidators.zod";

interface PCRValidatorExtraProps {
  pcrItemInfo: Pick<PCRItemTypeDto, "type" | "hidden" | "hiddenReason" | "displayName">[];
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

  return z
    .array(
      validation
        .superRefine((val, ctx) => {
          const currentOption = pcrItemInfo.find(x => x.type === val);

          if (currentOption) {
            switch (currentOption.hiddenReason) {
              case PCRItemHiddenReason.AnotherPcrAlreadyHasThisType:
                ctx.addIssue(
                  createIssue("errors.another_pcr_already_has_this_type", { type: currentOption.displayName }),
                );
                break;
              case PCRItemHiddenReason.ThisPcrAlreadyHasThisType:
                ctx.addIssue(createIssue("errors.this_pcr_already_has_this_type", { type: currentOption.displayName }));
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
            !pcrItemInfo.some(y => x === y.type && y.hiddenReason === PCRItemHiddenReason.AnotherPcrAlreadyHasThisType),
        )
        .refine(
          x =>
            !pcrItemInfo.some(
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
                    types: pcrItemInfo
                      .filter(x => x?.type !== type.type && vals.includes(x.type))
                      .map(x => x?.displayName),
                    type: pcrItemInfo.find(x => x?.type === type.type)?.displayName,
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

      for (const item of currentPcrItems) {
        if (item.type === PCRItemType.PartnerAddition) numberOfAdditions += 1;
        if (item.type === PCRItemType.PartnerWithdrawal) numberOfRemoves += 1;
        if (item.type === PCRItemType.AccountNameChange) numberOfRenames += 1;
      }

      const maxNumberOfRemoves = numberOfAdditions === 0 ? numberOfPartners - 1 : numberOfPartners;
      const maxNumberOfRenames = numberOfPartners;
      const maxNumberOfBoth = numberOfPartners;

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
