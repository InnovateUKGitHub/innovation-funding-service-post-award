import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FullDateInput, MonthYearInput } from "@ui/components/bjss/inputs/dateInput";

describe("FullDateInput", () => {
  it("Renders with given name", () => {
    render(<FullDateInput name="testName" />);
    expect(document.querySelector('[name="testName_day"]')).toBeInTheDocument();
    expect(document.querySelector('[name="testName_month"]')).toBeInTheDocument();
    expect(document.querySelector('[name="testName_year"]')).toBeInTheDocument();
  });

  it("Update component day state with value", async () => {
    const { getByLabelText } = render(<FullDateInput name="testName" />);

    const dateInput = getByLabelText("Day") as HTMLInputElement;
    expect(dateInput.value).toBe("");
    await act(async () => {
      await userEvent.type(dateInput, "25");
    });
    expect(dateInput.value).toEqual("25");
  });

  it("Update component month state with value", async () => {
    const { getByLabelText } = render(<FullDateInput name="testName" />);

    const dateInput = getByLabelText("Month") as HTMLInputElement;
    expect(dateInput.value).toBe("");
    await act(async () => {
      await userEvent.type(dateInput, "05");
    });
    expect(dateInput.value).toEqual("05");
  });

  it("Update component year state with value", async () => {
    const { getByLabelText } = render(<FullDateInput name="testName" />);

    const dateInput = getByLabelText("Year") as HTMLInputElement;
    expect(dateInput.value).toBe("");
    await act(async () => {
      await userEvent.type(dateInput, "2020");
    });
    expect(dateInput.value).toEqual("2020");
  });

  it("Invalid date causes onchange with NaN date", async () => {
    let lastUpdate: Date | null = null;
    const { getByLabelText } = render(
      <FullDateInput name="testName" onChange={jest.fn(v => (lastUpdate = v))} debounce={false} />,
    );

    const dateInput = getByLabelText("Year") as HTMLInputElement;
    expect(dateInput.value).toBe("");
    await act(async () => {
      await userEvent.type(dateInput, "Blah blah");
    });
    expect(lastUpdate).not.toBeNull();
    expect((lastUpdate as unknown as Date).getTime()).toBeNaN();
  });

  it("Valid date causes onchange with correctly generated date", async () => {
    let lastUpdate: Date | null = null;
    const { getByLabelText } = render(
      <FullDateInput name="testName" onChange={jest.fn(v => (lastUpdate = v))} debounce={false} />,
    );

    await act(async () => {
      await userEvent.type(getByLabelText("Day"), "25");
      await userEvent.type(getByLabelText("Month"), "10");
      await userEvent.type(getByLabelText("Year"), "2020 ");
    });

    expect(lastUpdate).toEqual(new Date("2020-10-25T12:00:00"));
  });
});

describe("MonthYearInput", () => {
  it("Renders with given name", () => {
    render(<MonthYearInput name="testName" startOrEnd="start" />);
    expect(document.querySelector('[name="testName_month"]')).toBeInTheDocument();
    expect(document.querySelector('[name="testName_year"]')).toBeInTheDocument();
  });

  it("Update component month state with value", async () => {
    const { getByLabelText } = render(<MonthYearInput name="testName" startOrEnd="start" />);

    const dateInput = getByLabelText("Month") as HTMLInputElement;
    expect(dateInput.value).toBe("");
    await act(async () => {
      await userEvent.type(dateInput, "05");
    });
    expect(dateInput.value).toEqual("05");
  });

  it("Update component year state with value", async () => {
    const { getByLabelText } = render(<MonthYearInput name="testName" startOrEnd="start" />);

    const dateInput = getByLabelText("Month") as HTMLInputElement;
    expect(dateInput.value).toBe("");
    await act(async () => {
      await userEvent.type(dateInput, "2020");
    });
    expect(dateInput.value).toEqual("2020");
  });

  it("Sets the date to the first day of the month", async () => {
    let lastUpdate: Date | null = null;

    const { getByLabelText } = render(
      <MonthYearInput name="testName" startOrEnd="start" onChange={jest.fn(v => (lastUpdate = v))} debounce={false} />,
    );

    await act(async () => {
      await userEvent.type(getByLabelText("Month"), "11");
      await userEvent.type(getByLabelText("Year"), "2019 ");
    });
    expect(lastUpdate).toEqual(new Date("2019-11-01T12:00:00"));
  });

  it("Sets the date to the last day of the month", async () => {
    let lastUpdate: Date | null = null;

    const { getByLabelText } = render(
      <MonthYearInput name="testName" startOrEnd="end" onChange={jest.fn(v => (lastUpdate = v))} debounce={false} />,
    );

    await act(async () => {
      await userEvent.type(getByLabelText("Month"), "11");
      await userEvent.type(getByLabelText("Year"), "2019 ");
    });

    expect(lastUpdate).toEqual(new Date("2019-11-30T12:00:00"));
  });
});
