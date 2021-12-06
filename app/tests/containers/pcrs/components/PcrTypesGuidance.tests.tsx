import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TestBed, TestBedContent } from "@shared/TestBed";
import { PcrTypesGuidance, PcrTypesGuidanceProps } from "@ui/containers/pcrs/components/PcrTypesGuidance";
import { PCRItemTypeDto } from "@framework/dtos";
import { PCRItemType } from "@framework/constants";

describe("PcrTypes Components", () => {
  describe("PcrTypesGuidance", () => {
    describe("@renders", () => {
      const stubContent = {
        pcrCreate: {
          learnMoreAboutTitle: { content: "stub-learnMoreAboutTitle" },

          selectTypesHint: { content: "stub-selectTypesHint" },

          reallocateCostsTitle: { content: "stub-reallocateCostsTitle" },
          reallocateCostsMessage: { content: "stub-reallocateCostsMessage" },
          removePartnerTitle: { content: "stub-removePartnerTitle" },
          removePartnerMessage: { content: "stub-removePartnerMessage" },
          addPartnerTitle: { content: "stub-addPartnerTitle" },
          addPartnerMessage: { content: "stub-addPartnerMessage" },
          changeScopeTitle: { content: "stub-changeScopeTitle" },
          changeScopeMessage: { content: "stub-changeScopeMessage" },
          changeDurationTitle: { content: "stub-changeDurationTitle" },
          changeDurationMessage: { content: "stub-changeDurationMessage" },
          changePartnersNameTitle: { content: "stub-changePartnersNameTitle" },
          changePartnersNameMessage: { content: "stub-changePartnersNameMessage" },
          putProjectOnHoldTitle: { content: "stub-putProjectOnHoldTitle" },
          putProjectOnHoldMessage: { content: "stub-putProjectOnHoldMessage" },
          endProjectEarlyTitle: { content: "stub-endProjectEarlyTitle" },
          endProjectEarlyMessage: { content: "stub-endProjectEarlyMessage" },
        },
      };

      const defaultProps: PcrTypesGuidanceProps = {
        qa: "stub-qa",
        types: [],
      };

      const stubPcrItem: PCRItemTypeDto = {
        type: PCRItemType.Unknown,
        displayName: "stub-displayName",
        recordTypeId: "stub-recordTypeId",
        enabled: true,
        disabled: false,
        files: [],
      };

      const setup = (props?: Partial<PcrTypesGuidanceProps>) => {
        const rtl = render(
          <TestBed content={stubContent as TestBedContent}>
            <PcrTypesGuidance {...defaultProps} {...props} />
          </TestBed>,
        );

        const getReallocateCostsMessage = () => rtl.queryByText(stubContent.pcrCreate.reallocateCostsMessage.content);
        const getRemovePartnerMessage = () => rtl.queryByText(stubContent.pcrCreate.removePartnerMessage.content);
        const getAddPartnerMessage = () => rtl.queryByText(stubContent.pcrCreate.addPartnerMessage.content);
        const getChangeScopeMessage = () => rtl.queryByText(stubContent.pcrCreate.changeScopeMessage.content);
        const getChangeDurationMessage = () => rtl.queryByText(stubContent.pcrCreate.changeDurationMessage.content);
        const getChangePartnersNameMessage = () =>
          rtl.queryByText(stubContent.pcrCreate.changePartnersNameMessage.content);
        const getPutProjectOnHoldMessage = () => rtl.queryByText(stubContent.pcrCreate.putProjectOnHoldMessage.content);
        const getEndProjectEarlyMessage = () => rtl.queryByText(stubContent.pcrCreate.endProjectEarlyMessage.content);

        return {
          ...rtl,
          getReallocateCostsMessage,
          getRemovePartnerMessage,
          getAddPartnerMessage,
          getChangeScopeMessage,
          getChangeDurationMessage,
          getChangePartnersNameMessage,
          getPutProjectOnHoldMessage,
          getEndProjectEarlyMessage,
        };
      };

      describe("@renders", () => {
        test("as default", () => {
          const { queryByText } = setup();

          const titleElement = queryByText(stubContent.pcrCreate.learnMoreAboutTitle.content);
          const hintElement = queryByText(stubContent.pcrCreate.selectTypesHint.content);

          expect(titleElement).toBeInTheDocument();
          expect(hintElement).toBeInTheDocument();
        });

        test("with qa", () => {
          const stubQaValue = "stub-qa";
          const { queryByTestId } = setup({ qa: stubQaValue });

          expect(queryByTestId(stubQaValue)).toBeInTheDocument();
          expect(queryByTestId(`${stubQaValue}-guidance`)).toBeInTheDocument();
        });

        test("with no pcrItemTypes", () => {
          const {
            getReallocateCostsMessage,
            getRemovePartnerMessage,
            getAddPartnerMessage,
            getChangeScopeMessage,
            getChangeDurationMessage,
            getChangePartnersNameMessage,
            getPutProjectOnHoldMessage,
            getEndProjectEarlyMessage,
          } = setup();

          expect(getReallocateCostsMessage()).not.toBeInTheDocument();
          expect(getRemovePartnerMessage()).not.toBeInTheDocument();
          expect(getAddPartnerMessage()).not.toBeInTheDocument();
          expect(getChangeScopeMessage()).not.toBeInTheDocument();
          expect(getChangeDurationMessage()).not.toBeInTheDocument();
          expect(getChangePartnersNameMessage()).not.toBeInTheDocument();
          expect(getPutProjectOnHoldMessage()).not.toBeInTheDocument();
          expect(getEndProjectEarlyMessage()).not.toBeInTheDocument();
        });

        test("with given pcrItemTypes", () => {
          const types: PCRItemTypeDto[] = [
            { ...stubPcrItem, type: PCRItemType.MultiplePartnerFinancialVirement },
            { ...stubPcrItem, type: PCRItemType.PartnerWithdrawal },
          ];
          const {
            getReallocateCostsMessage,
            getRemovePartnerMessage,
            getAddPartnerMessage,
            getChangeScopeMessage,
            getChangeDurationMessage,
            getChangePartnersNameMessage,
            getPutProjectOnHoldMessage,
            getEndProjectEarlyMessage,
          } = setup({ types });

          expect(getReallocateCostsMessage()).toBeInTheDocument();
          expect(getRemovePartnerMessage()).toBeInTheDocument();

          expect(getAddPartnerMessage()).not.toBeInTheDocument();
          expect(getChangeScopeMessage()).not.toBeInTheDocument();
          expect(getChangeDurationMessage()).not.toBeInTheDocument();
          expect(getChangePartnersNameMessage()).not.toBeInTheDocument();
          expect(getPutProjectOnHoldMessage()).not.toBeInTheDocument();
          expect(getEndProjectEarlyMessage()).not.toBeInTheDocument();
        });

        test("when clicked additional details should be visible", () => {
          const types: PCRItemTypeDto[] = [{ ...stubPcrItem, type: PCRItemType.MultiplePartnerFinancialVirement }];
          const { queryByText, getByText } = setup({ types });

          const reallocateCostsMessage = queryByText(stubContent.pcrCreate.reallocateCostsMessage.content);
          const toggleElement = getByText(stubContent.pcrCreate.learnMoreAboutTitle.content);

          userEvent.click(toggleElement);
          expect(reallocateCostsMessage).toBeVisible();
        });

        test("when clicked twice additional details should not be visible", () => {
          const types: PCRItemTypeDto[] = [{ ...stubPcrItem, type: PCRItemType.MultiplePartnerFinancialVirement }];
          const { queryByText, getByText } = setup({ types });

          const reallocateCostsMessage = queryByText(stubContent.pcrCreate.reallocateCostsMessage.content);
          const toggleElement = getByText(stubContent.pcrCreate.learnMoreAboutTitle.content);

          userEvent.click(toggleElement);
          expect(reallocateCostsMessage).toBeVisible();

          userEvent.click(toggleElement);
          expect(reallocateCostsMessage).not.toBeVisible();
        });
      });
    });
  });
});
