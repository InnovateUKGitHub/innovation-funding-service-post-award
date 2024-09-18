import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { PartnerStatus, PostcodeTaskStatus } from "@framework/constants/partner";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { evaluateObject } from "@ui/zod/helperValidators.zod";

export const postcodeErrorMap = makeZodI18nMap({ keyPrefix: ["partnerDetailsEdit"] });

export const postcodeSchema = evaluateObject(
  (data: { postcodeStatus: PostcodeTaskStatus; isSetup: boolean; partnerStatus: PartnerStatus }) => {
    return {
      form: z.literal(FormTypes.PartnerDetailsEdit),
      postcodeStatus: z.nativeEnum(PostcodeTaskStatus),
      partnerStatus: z.nativeEnum(PartnerStatus),
      isSetup: z.boolean(),
      postcode: getTextValidation({
        maxLength: 10,
        required: data.isSetup
          ? data.partnerStatus === PartnerStatus.Active
          : data.postcodeStatus !== PostcodeTaskStatus.ToDo,
      }),
    };
  },
);

export type PostcodeSchema = typeof postcodeSchema;
