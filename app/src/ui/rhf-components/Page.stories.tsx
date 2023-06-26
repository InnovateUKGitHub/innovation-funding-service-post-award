import type { Meta, StoryObj } from "@storybook/react";
import { Page } from "./Page";
import { P } from "./Typography";
import { FormGroup } from "./FormGroup";
import { TextInput } from "./TextInput";
import { Label } from "./Label";
import { ValidationError } from "./ValidationError";
import { BrowserRouter } from "react-router-dom";

const validationErrors = {
  input: {
    message: "Field cannot be empty",
    type: "required",
  },
};

const PageExample = () => (
  <Page pageTitle={<h1>Demo page</h1>} validationErrors={validationErrors}>
    <P>This is a GovUk Page</P>
    <FormGroup>
      <Label htmlFor="input">This is an input</Label>
      <ValidationError error={validationErrors.input} />
      <TextInput id="input" inputWidth="one-third"></TextInput>
    </FormGroup>
  </Page>
);
const meta: Meta<typeof Page> = {
  title: "React Hook Form/Page",
  component: PageExample,
  decorators: [
    Story => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PageExample>;

export const StandardPage: Story = {
  args: {},
};
