import { render } from "@testing-library/react";
import { ClaimPeriodDate, ClaimPeriodProps } from "./claimPeriodDate";

const startDate = new Date("1993/01/07 09:02:01");
const endDate = new Date("1993/01/07 09:02:01");
const claim = {
  periodStartDate: startDate,
  periodEndDate: endDate,
  periodId: 1,
};

const partner = {
  name: "Test partner",
  isWithdrawn: false,
  isLead: false,
};

const setup = (props: ClaimPeriodProps) => render(<ClaimPeriodDate {...props} />);

describe("<ClaimPeriodDate />", () => {
  describe("@renders", () => {
    test("period range without partner name if only claim is given", () => {
      const { queryByText } = setup({ claim });
      expect(queryByText("Period 1:")).toBeInTheDocument();
    });

    test("period range with partner name", () => {
      const { queryByText } = setup({ claim, partner });
      expect(queryByText("Test partner claim for period 1:")).toBeInTheDocument();
    });
  });
});
