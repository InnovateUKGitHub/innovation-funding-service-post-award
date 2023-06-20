import { IGuide } from "@framework/types/IGuide";
import { createTypedForm } from "@ui/components/form";
import { noop } from "@ui/helpers/noop";

const Form = createTypedForm<string>();

export const textareaInputGuide: IGuide = {
  name: "Textarea",
  options: [
    {
      name: "with character count (default) - ascending (without minValue)",
      comments: "JS environment only, character is rendered as the user types.",
      example: `<Form.MultilineString label="..." name="..." hint="..." value={x => x} update={...} />`,
      render: () => (
        <Form.Form data="">
          <Form.MultilineString
            label="Comments"
            name="comments"
            hint="Please explain where possible"
            value={x => x}
            update={noop}
          />
        </Form.Form>
      ),
    },
    {
      name: "with character count - ascending",
      comments: "JS environment only, character is rendered as the user types.",
      example: `<Form.MultilineString characterCountOptions={{ type: "ascending", minValue: 15 }} label="..." name="..." hint="..." value={x => x} update={...} />`,
      render: () => (
        <Form.Form data="">
          <Form.MultilineString
            label="Comments"
            name="comments"
            hint="Please explain where possible"
            value={x => x}
            update={noop}
            characterCountOptions={{ type: "ascending", minValue: 15 }}
          />
        </Form.Form>
      ),
    },
    {
      name: "with character count - decending",
      comments: "JS environment only, character is rendered as the user types.",
      example: `<Form.MultilineString characterCountOptions={{ type: "descending", maxValue: 15 }} label="..." name="..." hint="..." value={x => x} update={...} />`,
      render: () => (
        <Form.Form data="">
          <Form.MultilineString
            label="Comments"
            name="comments"
            hint="Please explain where possible"
            value={x => x}
            update={noop}
            characterCountOptions={{ type: "descending", maxValue: 15 }}
          />
        </Form.Form>
      ),
    },
    {
      name: "Character count disabled",
      comments: "Renders textfield with no character count.",
      example: `<Form.MultilineString characterCountOptions="off" label="..." name="..." hint="..." value={x => x} update={...} />`,
      render: () => (
        <Form.Form data="">
          <Form.MultilineString
            characterCountOptions="off"
            label="Comments"
            name="comments"
            hint="Please explain where possible"
            value={x => x}
            update={noop}
          />
        </Form.Form>
      ),
    },
  ],
};
