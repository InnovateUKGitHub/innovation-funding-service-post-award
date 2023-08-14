import { partnerLevelDelete, projectLevelDelete } from "./documentValidators.zod";
import { FormTypes } from "./FormTypes";

describe("documentValidators", () => {
  describe("projectLevelDelete", () => {
    test.each([
      [
        "accept normal input",
        { form: FormTypes.ProjectLevelDelete, projectId: "a0E project id", documentId: "string" },
        true,
      ],
      [
        "decline incorrect form",
        { form: FormTypes.ClaimLevelUpload, projectId: "a0E project id", documentId: "" },
        false,
      ],
      [
        "decline incorrect projectId prefix",
        { form: FormTypes.ProjectLevelDelete, projectId: "", documentId: "" },
        false,
      ],
      ["decline empty object", {}, false],
      ["decline empty form", { form: FormTypes.ProjectLevelDelete }, false],
    ])("%s", (param, input, accept) => {
      const parse = projectLevelDelete.safeParse(input);
      expect(parse.success).toBe(accept);
      expect(parse as unknown).toMatchSnapshot();
    });
  });

  describe("partnerLevelDelete", () => {
    test.each([
      [
        "accept normal input",
        {
          form: FormTypes.PartnerLevelDelete,
          projectId: "a0E project id",
          partnerId: "a0D project participant id",
          documentId: "string",
        },
        true,
      ],
      [
        "decline missing partner id",
        {
          form: FormTypes.PartnerLevelDelete,
          projectId: "a0E project id",
          documentId: "string",
        },
        false,
      ],
      [
        "decline incorrect form",
        {
          form: FormTypes.ClaimLevelUpload,
          projectId: "a0E project id",
          partnerId: "a0D project participant id",
          documentId: "",
        },
        false,
      ],
      [
        "decline incorrect projectId prefix",
        { form: FormTypes.PartnerLevelDelete, projectId: "", partnerId: "a0D project participant id", documentId: "" },
        false,
      ],
      ["decline empty object", {}, false],
      ["decline empty form", { form: FormTypes.PartnerLevelDelete }, false],
    ])("%s", (param, input, accept) => {
      const parse = partnerLevelDelete.safeParse(input);
      expect(parse.success).toBe(accept);
      expect(parse as unknown).toMatchSnapshot();
    });
  });
});
