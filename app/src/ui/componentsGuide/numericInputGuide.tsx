import { createTypedForm } from "@ui/components";
import { IGuide } from "@framework/types";

const ReportForm = createTypedForm<number>();

export const numericInputGuide: IGuide = {
  name: "Input",
  options: [
    {
      name: "Full width",
      comments: "Renders full width by default",
      example: `<ReportForm.Numeric name="name" value={(x) => x} update={x => x} />`,
      render: () => (
        <ReportForm.Form data={0}>
          <ReportForm.Numeric name="name" value={x => x} update={x => x} />
        </ReportForm.Form>
      ),
    },
    {
      name: "Full width",
      comments: "Renders full width",
      example: `<ReportForm.Numeric width="full" name="name" value={(x) => x} update={x => x} />`,
      render: () => (
        <ReportForm.Form data={0}>
          <ReportForm.Numeric width="full" name="name" value={x => x} update={x => x} />
        </ReportForm.Form>
      ),
    },
    {
      name: " Three-quarters width",
      comments: "Renders three-quarters width",
      example: `<ReportForm.Numeric width="three-quarters" name="name" value={(x) => x} update={x => x} />`,
      render: () => (
        <ReportForm.Form data={0}>
          <ReportForm.Numeric width="three-quarters" name="name" value={x => x} update={x => x} />
        </ReportForm.Form>
      ),
    },
    {
      name: " Two-thirds width",
      comments: "Renders two-thirds width",
      example: `<ReportForm.Numeric width="two-thirds" name="name" value={(x) => x} update={x => x} />`,
      render: () => (
        <ReportForm.Form data={0}>
          <ReportForm.Numeric width="two-thirds" name="name" value={x => x} update={x => x} />
        </ReportForm.Form>
      ),
    },
    {
      name: " One-half width",
      comments: "Renders one-half width",
      example: `<ReportForm.Numeric width="one-half" name="name" value={(x) => x} update={x => x} />`,
      render: () => (
        <ReportForm.Form data={0}>
          <ReportForm.Numeric width="one-half" name="name" value={x => x} update={x => x} />
        </ReportForm.Form>
      ),
    },
    {
      name: " One-third width",
      comments: "Renders one-third width",
      example: `<ReportForm.Numeric width="one-third" name="name" value={(x) => x} update={x => x} />`,
      render: () => (
        <ReportForm.Form data={0}>
          <ReportForm.Numeric width="one-third" name="name" value={x => x} update={x => x} />
        </ReportForm.Form>
      ),
    },
    {
      name: " One-quarter width",
      comments: "Renders one-quarter width",
      example: `<ReportForm.Numeric width="one-quarter" name="name" value={(x) => x} update={x => x} />`,
      render: () => (
        <ReportForm.Form data={0}>
          <ReportForm.Numeric width="one-quarter" name="name" value={x => x} update={x => x} />
        </ReportForm.Form>
      ),
    },
    {
      name: "20 characters wide",
      comments: "Renders 20 characters wide",
      example: `<ReportForm.Numeric width={20} name="name" value={(x) => x} update={x => x} />`,
      render: () => (
        <ReportForm.Form data={0}>
          <ReportForm.Numeric width={20} name="name" value={x => x} update={x => x} />
        </ReportForm.Form>
      ),
    },
    {
      name: "10 characters wide",
      comments: "Renders 10 characters wide",
      example: `<ReportForm.Numeric width={10} name="name" value={(x) => x} update={x => x} />`,
      render: () => (
        <ReportForm.Form data={0}>
          <ReportForm.Numeric width={10} name="name" value={x => x} update={x => x} />
        </ReportForm.Form>
      ),
    },
    {
      name: "5 characters wide",
      comments: "Renders 5 characters wide",
      example: `<ReportForm.Numeric width={5} name="name" value={(x) => x} update={x => x} />`,
      render: () => (
        <ReportForm.Form data={0}>
          <ReportForm.Numeric width={5} name="name" value={x => x} update={x => x} />
        </ReportForm.Form>
      ),
    },
    {
      name: "4 characters wide",
      comments: "Renders 4 characters wid",
      example: `<ReportForm.Numeric width={4} name="name" value={(x) => x} update={x => x} />`,
      render: () => (
        <ReportForm.Form data={0}>
          <ReportForm.Numeric width={4} name="name" value={x => x} update={x => x} />
        </ReportForm.Form>
      ),
    },
    {
      name: "3 characters wide",
      comments: "Renders 3 characters wide",
      example: `<ReportForm.Numeric width={3} name="name" value={(x) => x} update={x => x} />`,
      render: () => (
        <ReportForm.Form data={0}>
          <ReportForm.Numeric width={3} name="name" value={x => x} update={x => x} />
        </ReportForm.Form>
      ),
    },
    {
      name: "2 characters wide",
      comments: "Renders 2 characters wide",
      example: `<ReportForm.Numeric width={2} name="name" value={(x) => x} update={x => x} />`,
      render: () => (
        <ReportForm.Form data={0}>
          <ReportForm.Numeric width={2} name="name" value={x => x} update={x => x} />
        </ReportForm.Form>
      ),
    },
  ],
};
