import { initStubTestIntl } from "@shared/initStubTestIntl";
import { getTextValidation } from "./textareaValidator.zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { z } from "zod";

describe("generic textarea validator", () => {
  beforeAll(async () => {
    await initStubTestIntl({
      forms: {
        errors: {
          generic: {
            textarea: {
              required: "{{ label }} required!",
              invalid_range: "{{ label }} {{ count }} not between {{ min }} {{ max }}!",
              too_small: "{{ label }} must be bigger than {{ count }}!",
              too_big: "{{ label }} must be smaller than {{ count }}!",
            },
          },
        },
        my: {
          nice: {
            error: {
              label: "ARTMS",
            },
          },
        },
        pcr: {
          addPartner: {
            organisationName: {
              label: "Organisation name",
            },
          },
        },
      },
    });
  });

  describe("max length validation", function () {
    test.each`
      name                                 | input                                    | output                                | required | accept
      ${"non required empty"}              | ${null}                                  | ${{ organisationName: undefined }}    | ${false} | ${true}
      ${"required empty"}                  | ${null}                                  | ${undefined}                          | ${true}  | ${false}
      ${"3 chars long"}                    | ${"ops"}                                 | ${{ organisationName: "ops" }}        | ${true}  | ${true}
      ${"35 chars long"}                   | ${"this is much too big and impossible"} | ${undefined}                          | ${true}  | ${false}
      ${"10 chars long"}                   | ${"acceptable"}                          | ${{ organisationName: "acceptable" }} | ${true}  | ${true}
      ${"spaces are treated as undefined"} | ${"          "}                          | ${{ organisationName: "" }}           | ${false} | ${true}
      ${"spaces are not allowed"}          | ${"          "}                          | ${undefined}                          | ${true}  | ${false}
    `("$name", ({ input, required, output, accept }) => {
      const errorMap = makeZodI18nMap({ keyPrefix: ["pcr", "addPartner"] });
      const parse = z
        .object({
          organisationName: getTextValidation({
            maxLength: 20,
            required,
          }),
        })
        .safeParse({ organisationName: input }, { errorMap });

      expect(parse.success).toBe(accept);
      expect(parse.data).toStrictEqual(output);
      expect(parse).toMatchSnapshot();
    });
  });

  describe("ranged validation", function () {
    test.each`
      name                                 | input                                    | output          | required | accept
      ${"non required empty"}              | ${null}                                  | ${undefined}    | ${false} | ${true}
      ${"required empty"}                  | ${null}                                  | ${undefined}    | ${true}  | ${false}
      ${"too small"}                       | ${"ops"}                                 | ${undefined}    | ${true}  | ${false}
      ${"too big"}                         | ${"this is much too big and impossible"} | ${undefined}    | ${true}  | ${false}
      ${"acceptable"}                      | ${"acceptable"}                          | ${"acceptable"} | ${true}  | ${true}
      ${"spaces are treated as undefined"} | ${"          "}                          | ${""}           | ${false} | ${true}
      ${"spaces are not allowed"}          | ${"          "}                          | ${undefined}    | ${true}  | ${false}
    `("$name", ({ input, required, output, accept }) => {
      const errorMap = makeZodI18nMap({ keyPrefix: ["my", "nice", "error"] });
      const parse = getTextValidation({
        maxLength: 20,
        minLength: 5,
        required,
      }).safeParse(input, { errorMap });

      expect(parse.success).toBe(accept);
      expect(parse.data).toBe(output);
      expect(parse).toMatchSnapshot();
    });
  });
});
