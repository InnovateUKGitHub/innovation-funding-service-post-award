import { convertErrorFormatFromRhfForErrorSummary } from "./errorHelpers";

describe("convertErrorFormatFromRhfForErrorSummary", () => {
  it("should handle the simple case of converting an rhf error to the format for error summary", () => {
    const rhfError = {
      firstName: {
        message: "enter your first name",
        type: "required",
      },
      lastName: {
        message: "enter your last name",
        type: "required",
      },
    };

    expect(convertErrorFormatFromRhfForErrorSummary(rhfError)).toEqual([
      { key: "firstName", message: "enter your first name" },
      { key: "lastName", message: "enter your last name" },
    ]);
  });

  it("should handle the case of formatting an array of errors", () => {
    const formErrors = {
      reasoningStatus: {
        message: "Reasons entry must be complete.",
        type: "invalid_enum_value",
      },
      items: [
        null,
        {
          message: "Change project duration must be complete.",
          type: "custom",
        },
        {
          message: "Add a partner must be complete.",
          type: "custom",
        },
        {
          message: "Add a partner must be complete.",
          type: "custom",
        },
        {
          message: "Change a partner's name must be complete.",
          type: "custom",
        },
      ],
    };

    expect(convertErrorFormatFromRhfForErrorSummary(formErrors)).toEqual([
      { key: "reasoningStatus", message: "Reasons entry must be complete." },
      { key: "items_0", message: null },
      { key: "items_1", message: "Change project duration must be complete." },
      { key: "items_2", message: "Add a partner must be complete." },
      { key: "items_3", message: "Add a partner must be complete." },
      { key: "items_4", message: "Change a partner's name must be complete." },
    ]);
  });
});
