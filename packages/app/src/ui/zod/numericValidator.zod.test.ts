import { initStubTestIntl } from "@shared/initStubTestIntl";
import { getNumberValidation } from "./numericValidator.zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { z } from "zod";
import copy from "@copy/default.en-GB.json";

describe("number currency validator", () => {
  beforeAll(async () => {
    await initStubTestIntl({
      forms: {
        errors: {
          generic: {
            number: copy.forms.errors.generic.number,
          },
        },
        beans: {
          means: {
            heinz: {
              label: "New Jeans",
            },
          },
        },
      },
    });
  });

  const errorMap = makeZodI18nMap({ keyPrefix: ["beans", "means"] });

  test.each([
    ["accept 0", 0, true],
    ["accept 1", 1, true],
    ["accept 2", 2, true],
    ["accept 3", 3, true],
    ["accept 5", 5, true],
    ["accept 1.01", 1.01, true],
    ["accept 500", 500, true],
    ["decline too small", -10, false],
    ["decline too big", 20000000, false],
    ["decline infinity", Infinity, false],
    ["decline null", null, false],
    ["decline undefined", undefined, false],
    ["decline NaN", NaN, false],
  ])("%s when required", (name, input, accept) => {
    const parse = z
      .object({
        heinz: getNumberValidation({
          max: 1_000_000,
          min: 0,
          required: true,
        }),
      })
      .safeParse({ heinz: input }, { errorMap });
    expect(parse.success).toBe(accept);
    expect(parse as unknown).toMatchSnapshot();
  });

  test.each([
    ["accept 0", 0, true],
    ["accept 1", 1, true],
    ["accept 2", 2, true],
    ["accept 3", 3, true],
    ["accept 5", 5, true],
    ["accept 1.01", 1.01, true],
    ["accept 500", 500, true],
    ["decline too small", -10, false],
    ["decline too big", 20000000, false],
    ["decline infinity", Infinity, false],
    ["accept null", null, true],
    ["accept undefined", undefined, true],
    ["decline NaN", NaN, false],
  ])("%s when not required", (name, input, accept) => {
    const parse = z
      .object({
        heinz: getNumberValidation({
          max: 1_000_000,
          min: 0,
          required: false,
        }),
      })
      .safeParse({ heinz: input }, { errorMap });
    expect(parse.success).toBe(accept);
    expect(parse as unknown).toMatchSnapshot();
  });
});
