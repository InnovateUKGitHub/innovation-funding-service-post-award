import { initStubTestIntl } from "@shared/initStubTestIntl";
import { getGenericCurrencyValidation } from "./currencyValidator.zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { z } from "zod";

describe("generic currency validator", () => {
  beforeAll(async () => {
    await initStubTestIntl({
      forms: {
        errors: {
          generic: {
            currency: {
              required: "the value '{{label, lowercase}}' is required",
              invalid_type: "the value '{{label, lowercase}}' is an invalid type",
              invalid_string: "the value '{{label, lowercase}}' is an invalid string",
              not_a_number: "the value '{{label, lowercase}}' is not a number",
              too_big: "the value '{{label, lowercase}}' is too bigg ({{ count }})",
              too_small: "the value '{{label, lowercase}}' is too smol ({{ count }})",
              two_decimal_places: "the value '{{label, lowercase}}' is not 2dp",
              invalid_currency: "the value '{{label, lowercase}}' is not a currency value",
              not_pounds: "the value '{{label, lowercase}}' is not gbp",
            },
          },
        },
        beans: {
          means: {
            heinz: {
              label: "NewJeans",
            },
          },
        },
      },
    });
  });

  const errorMap = makeZodI18nMap({ keyPrefix: ["beans", "means"] });

  test.each([
    ["accept 0", "0", true],
    ["accept 1", "1", true],
    ["accept 2", "2", true],
    ["accept 3", "3", true],
    ["accept 5", "5", true],
    ["accept 1.01", "1.01", true],
    ["accept 500", "500", true],
    ["accept £0", "£0", true],
    ["accept £1", "£1", true],
    ["accept £2", "£2", true],
    ["accept £3", "£3", true],
    ["accept £5", "£5", true],
    ["accept £1.01", "£1.01", true],
    ["accept £500", "£500", true],
    ["decline infinity", Infinity, false],
    ["decline bad input", "IUK MO Company", false],
    ["decline too big", "£999999999999999999999999", false],
    ["decline too little", "-9999999999999999999999999", false],
    ["decline too many dp", "£12,345.777", false],
    ["accept too few dp", "£12.2", true],
  ])("%s", (name, input, accept) => {
    const parse = z
      .object({
        heinz: getGenericCurrencyValidation({
          max: 1_000_000,
          min: 0,
          required: true,
        }),
      })
      .safeParse({ heinz: input }, { errorMap });
    expect(parse.success).toBe(accept);
    expect(parse as unknown).toMatchSnapshot();
  });
});
