import React from "react";
import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { FinancialVirementDto, PartnerDto, PCRItemType } from "@framework/types";

import { PcrSummaryProps } from "@ui/containers/pcrs/components/PcrSummary/pcr-summary.interface";
import {
  PcrSummaryConsumer,
  PcrSummaryProvider,
  usePcrSummaryContext,
  PcrSummaryProviderProps,
} from "@ui/containers/pcrs/components/PcrSummary";

import { createDto } from "../../../../../../tests/test-utils/dtoHelpers";

describe("PcrSummary", () => {
  const firstPartner = createDto<PartnerDto>({ id: "1-partner" });
  const secondPartner = createDto<PartnerDto>({ id: "2-partner" });
  const stubVirement = createDto<FinancialVirementDto>({ partners: [] });

  const stubPartners: PartnerDto[] = [firstPartner, secondPartner];

  describe("<PcrSummaryProvider>", () => {
    function StubPcrSummaryContextHookFetcher() {
      const context = usePcrSummaryContext();

      return <span data-qa="isSummaryValid">{`${context?.isSummaryValid}`}</span>;
    }
    const setupPcrEnv = (props: PcrSummaryProviderProps) => render(<PcrSummaryProvider {...props} />);

    test("returns data as expected", () => {
      const { queryByTestId } = setupPcrEnv({
        type: PCRItemType.MultiplePartnerFinancialVirement,
        partners: stubPartners,
        virement: stubVirement,
        children: <StubPcrSummaryContextHookFetcher />,
      });

      const contextPayload = queryByTestId("isSummaryValid");

      if (!contextPayload) throw Error("No context data found");

      expect(contextPayload.innerHTML).toBeDefined();
    });
  });

  describe("usePcrSummaryContext()", () => {
    const setupContextEnv = (props: PcrSummaryProps) =>
      renderHook(usePcrSummaryContext, {
        wrapper: (hookProps: { children: React.ReactElement }) => (
          <PcrSummaryProvider {...props}>{hookProps.children}</PcrSummaryProvider>
        ),
      });

    test("returns correctly", () => {
      const { result } = setupContextEnv({
        type: PCRItemType.MultiplePartnerFinancialVirement,
        partners: stubPartners,
        virement: stubVirement,
      });

      if (!result.current) throw Error("No data found from context");

      expect(result.current).toBeDefined();
    });
  });

  describe("<PcrSummaryConsumer/>", () => {
    test("returns valid payload", () => {
      const stubContextProps = {
        type: PCRItemType.MultiplePartnerFinancialVirement,
        partners: stubPartners,
        virement: stubVirement,
      } as Omit<PcrSummaryProviderProps, "children">;

      const { queryByTestId } = render(
        <PcrSummaryProvider {...stubContextProps}>
          <PcrSummaryConsumer>
            {context => <span data-qa="isSummaryValid">{`${context?.isSummaryValid}`}</span>}
          </PcrSummaryConsumer>
        </PcrSummaryProvider>,
      );

      const contextPayload = queryByTestId("isSummaryValid");

      if (!contextPayload) throw Error("No context data found");

      expect(contextPayload.innerHTML).toBeDefined();
    });

    test("throws error when no context is available", () => {
      // TODO: Improve solution for console.error suppression for this test - https://github.com/facebook/react/issues/11098
      // Note: This needs to reside within the expect callback to work
      expect(() => render(<PcrSummaryConsumer>{() => <></>}</PcrSummaryConsumer>)).toThrow(
        "usePcrSummaryContext must be used within a PcrSummaryProvider",
      );
    });
  });
});
