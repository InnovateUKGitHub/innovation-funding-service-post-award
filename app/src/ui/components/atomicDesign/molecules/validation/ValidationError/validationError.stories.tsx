import { Meta, StoryObj } from "@storybook/react";
import { ValidationError } from "./validationError";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { Result } from "@ui/validation/result";
import { NestedResult } from "@ui/validation/nestedResult";
import { Results } from "@ui/validation/results";

const meta: Meta<typeof ValidationError> = {
  title: "GOV.UK Components/Form/Validation Error",
  component: ValidationError,
  decorators: [
    Story => (
      <FormGroup>
        <Label htmlFor="input">This is an input</Label>
        <Story />
        <TextInput id="input" inputWidth="one-third"></TextInput>
      </FormGroup>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ValidationError>;

export const BadInput: Story = {
  args: {
    error: new Result(null, true, false, "This message should appear", false),
  },
};

export const GoodInput: Story = {
  args: {
    error: new Result(null, true, true, "This message should not appear", false),
  },
};

export const VeryBadStory: Story = {
  args: {
    error: new NestedResult<Results<null>>(
      new Results({
        model: null,
        showValidationErrors: true,
        results: [new Result(null, true, false, "Parent Validation Error", false)],
      }),
      [
        new Results({
          model: null,
          showValidationErrors: true,
          results: [new Result(null, true, false, "Child Validation Error 1", false)],
        }),
        new Results({
          model: null,
          showValidationErrors: true,
          results: [new Result(null, true, false, "Child Validation Error 2", false)],
        }),
      ],
      new Result(null, true, false, "List Validation Error", false),
    ),
  },
};
