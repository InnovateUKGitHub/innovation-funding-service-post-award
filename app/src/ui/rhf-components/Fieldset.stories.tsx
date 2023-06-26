import type { Meta, StoryObj } from "@storybook/react";
import { Fieldset } from "./Fieldset";
import { Hint } from "./Hint";
import { Label } from "./Label";
import { TextInput } from "./TextInput";
import { Legend } from "./Legend";
import { FormGroup } from "./FormGroup";
import { ValidationError } from "./ValidationError";
import { BrowserRouter } from "react-router-dom";

const validationError = {
  message: "first name is required",
  type: "required",
};

const FieldSetExample = () => (
  <Fieldset>
    <Legend>Personal details</Legend>
    <FormGroup>
      <Label htmlFor="first-name">First name</Label>
      <Hint id="hint-for-first-name">your first name is your current legally registered first name</Hint>
      <ValidationError error={validationError} />
      <TextInput
        aria-describedby="hint-for-first-name"
        id="first-name"
        name="first-name"
        placeholder="first name"
        inputWidth={10}
      />
    </FormGroup>
  </Fieldset>
);
const meta: Meta<typeof Fieldset> = {
  title: "React Hook Form/Fieldset",
  component: FieldSetExample,
  decorators: [
    Story => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof FieldSetExample>;

export const StandardFieldset: Story = {
  args: {},
};
