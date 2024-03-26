import type { Meta, StoryObj } from "@storybook/react";
import { Page } from "./Page";
import { ValidationError } from "../../atoms/validation/ValidationError/ValidationError";
import { BrowserRouter } from "react-router-dom";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";

const validationErrors = {
  input: {
    message: "Field cannot be empty",
    type: "required",
  },
};

const PageExample = () => (
  <Page pageTitle={<h1>Demo page</h1>} validationErrors={validationErrors} isActive>
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
