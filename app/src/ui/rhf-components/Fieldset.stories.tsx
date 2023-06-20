import type { Meta, StoryObj } from "@storybook/react";
import { Fieldset } from "./Fieldset";
import { Hint } from "./Hint";
import { Label } from "./Label";
import { TextInput } from "./TextInput";

const FieldSetExample = () => (
  <Fieldset>
    <Label htmlFor="first-name">First name</Label>
    <Hint id="hint-for-first-name">your first name is your current legally registered first name</Hint>
    <TextInput
      aria-describedby="hint-for-first-name"
      id="first-name"
      name="first-name"
      placeholder="first name"
      inputWidth={10}
    />
  </Fieldset>
);
const meta: Meta<typeof Fieldset> = {
  title: "React Hook Form/Fieldset",
  component: FieldSetExample,
};

export default meta;

type Story = StoryObj<typeof FieldSetExample>;

export const StandardFieldset: Story = {
  args: {},
};
