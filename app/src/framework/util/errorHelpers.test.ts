import { Result } from "@ui/validation/result";
import {
  convertErrorFormatFromRhfForErrorSummary,
  convertResultErrorsToReactHookFormFormat,
  convertResultErrorsToZodFormat,
  convertZodErrorsToRhfFormat,
} from "./errorHelpers";
import { ZodError } from "zod";

describe("convertResultErrorsToReactHookFormFormat", () => {
  it("should handle the simple case of converting a server side error to rhf format", () => {
    const resultError = [
      { errorMessage: "You should have eaten the lettuce", key: "lettuce" },
      { errorMessage: "You should have had the pocari sweat", key: "pocariSweat" },
    ] as Result[];

    expect(convertResultErrorsToReactHookFormFormat(resultError)).toEqual({
      lettuce: {
        message: "You should have eaten the lettuce",
        originalData: {},
      },
      pocariSweat: {
        message: "You should have had the pocari sweat",
        originalData: {},
      },
    });
  });

  it("should handle nested errors", () => {
    const resultError = [
      {
        errorMessage: "No Good",
        key: "food",
        results: [
          {
            errors: [
              {
                errorMessage: "You should have eaten the lettuce",
                key: "lettuce",
              },
              {
                errorMessage: "You should have had the pocari sweat",
                key: "pocariSweat",
              },
            ],
          },
          {
            errors: [
              {
                errorMessage: "You should have eaten the mama",
                key: "mama",
              },
              {
                errorMessage: "You should have had the fish snacks",
                key: "fishSnacks",
              },
            ],
          },
        ],
      },
    ] as unknown as Result[];

    expect(convertResultErrorsToReactHookFormFormat(resultError)).toEqual({
      food: [
        {
          lettuce: {
            message: "You should have eaten the lettuce",
            originalData: {
              errors: [
                {
                  errorMessage: "You should have eaten the lettuce",
                  key: "lettuce",
                },
                {
                  errorMessage: "You should have had the pocari sweat",
                  key: "pocariSweat",
                },
              ],
            },
          },
          pocariSweat: {
            message: "You should have had the pocari sweat",
            originalData: {
              errors: [
                {
                  errorMessage: "You should have eaten the lettuce",
                  key: "lettuce",
                },
                {
                  errorMessage: "You should have had the pocari sweat",
                  key: "pocariSweat",
                },
              ],
            },
          },
        },
        {
          mama: {
            message: "You should have eaten the mama",
            originalData: {
              errors: [
                {
                  errorMessage: "You should have eaten the mama",
                  key: "mama",
                },
                {
                  errorMessage: "You should have had the fish snacks",
                  key: "fishSnacks",
                },
              ],
            },
          },
          fishSnacks: {
            message: "You should have had the fish snacks",
            originalData: {
              errors: [
                {
                  errorMessage: "You should have eaten the mama",
                  key: "mama",
                },
                {
                  errorMessage: "You should have had the fish snacks",
                  key: "fishSnacks",
                },
              ],
            },
          },
        },
      ],
    });
  });
});

describe("convertZodErrorsToRhfFormat", () => {
  it("should convert a zod error into an rhf error", () => {
    const zodError = {
      issues: [
        {
          code: "custom",
          message: "You should have eaten the lettuce",
          path: ["lettuce"],
        },
        {
          code: "custom",
          message: "You should have had the pocari sweat",
          path: ["pilk"],
        },
      ],
    } as ZodError<{ lettuce: string; pilk: string }>;

    const rhfError = {
      lettuce: {
        message: "You should have eaten the lettuce",
      },
      pilk: {
        message: "You should have had the pocari sweat",
      },
    };

    expect(convertZodErrorsToRhfFormat(zodError)).toEqual(rhfError);
  });
});

describe("convertResultErrorsToZodFormat", () => {
  it("should handle the simple case of converting a server side error to zod format", () => {
    const resultError = [
      { errorMessage: "You should have eaten the lettuce", key: "Key:0", keyId: "lettuce" },
      { errorMessage: "You should have had the pocari sweat", key: "Key:1", keyId: "pilk" },
    ] as Result[];

    expect(convertResultErrorsToZodFormat(resultError)).toEqual([
      {
        code: "custom",
        message: "You should have eaten the lettuce",
        path: ["lettuce"],
      },
      {
        code: "custom",
        message: "You should have had the pocari sweat",
        path: ["pilk"],
      },
    ]);
  });

  it("should handle nested errors", () => {
    const resultError = [
      {
        errorMessage: "No Good",
        key: "food",
        results: [
          {
            errors: [
              {
                errorMessage: "You should have eaten the lettuce",
                keyId: "lettuce",
              },
              {
                errorMessage: "You should have had the pocari sweat",
                keyId: "pocariSweat",
              },
            ],
          },
          {
            errors: [
              {
                errorMessage: "You should have eaten the mama",
                keyId: "mama",
              },
              {
                errorMessage: "You should have had the fish snacks",
                keyId: "fishSnacks",
              },
            ],
          },
        ],
      },
    ] as unknown as Result[];

    expect(convertResultErrorsToZodFormat(resultError)).toMatchSnapshot();
  });
});

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

  it("should handle the case of converting a nested rhf error to the format for error summary", () => {
    const rhfError = {
      details: {
        firstName: {
          message: "enter your first name",
          type: "required",
        },
        lastName: {
          message: "enter your last name",
          type: "required",
        },
      },
      bank: {
        sortcode: {
          message: "enter a sort code",
          type: "required",
        },
        accountNumber: {
          message: "enter your account number",
          type: "required",
        },
      },
    };

    expect(convertErrorFormatFromRhfForErrorSummary(rhfError)).toEqual([
      { key: "details_firstName", message: "enter your first name" },
      { key: "details_lastName", message: "enter your last name" },
      { key: "bank_sortcode", message: "enter a sort code" },
      { key: "bank_accountNumber", message: "enter your account number" },
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

  it("should handle the case of formatting an array of deeply nested errors", () => {
    const formErrors = {
      reasoningStatus: {
        message: "Reasons entry must be complete.",
        type: "invalid_enum_value",
      },
      questions: [
        null,
        {
          comments: {
            message: "Comment is too long",
            type: "too_big",
          },
          optionId: {
            message: "Select an option",
            type: "required",
          },
        },
        {
          comments: {
            message: "Comment is too small",
            type: "too_small",
          },
        },
      ],
    };

    expect(convertErrorFormatFromRhfForErrorSummary(formErrors)).toEqual([
      { key: "reasoningStatus", message: "Reasons entry must be complete." },
      { key: "questions_0", message: null },
      { key: "questions_1_comments", message: "Comment is too long" },
      { key: "questions_1_optionId", message: "Select an option" },
      { key: "questions_2_comments", message: "Comment is too small" },
    ]);
  });
});
