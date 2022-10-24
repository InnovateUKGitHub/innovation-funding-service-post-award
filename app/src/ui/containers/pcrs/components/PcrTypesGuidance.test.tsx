import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TestBed } from "@shared/TestBed";
import { PcrTypesGuidance, PcrTypesGuidanceProps } from "@ui/containers/pcrs/components/PcrTypesGuidance";
import { PCRItemTypeDto } from "@framework/dtos";
import { PCRItemType } from "@framework/constants";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

describe("PcrTypes Components", () => {
  describe("PcrTypesGuidance", () => {
    describe("@renders", () => {
      const stubContent = {
        pages: {
          pcrCreate: {
            selectRequestTypesTitle: "stub-selectRequestTypesTitle",
            selectTypesHint: "stub-selectTypesHint",
            backLink: "stub-backLink",
            buttonCreateRequest: "stub-buttonCreateRequest",
            buttonCancelRequest: "stub-buttonCancelRequest",
            learnMoreTitle: "stub-learnMoreTitle",
            reallocateCostsTitle: "stub-reallocateCostsTitle",
            reallocateCostsMessage: "stub-reallocateCostsMessage",
            removePartnerTitle: "stub-removePartnerTitle",
            removePartnerMessage: "stub-removePartnerMessage",
            addPartnerTitle: "stub-addPartnerTitle",
            addPartnerMessage: "stub-addPartnerMessage",
            changeScopeTitle: "stub-changeScopeTitle",
            changeScopeMessage: "stub-changeScopeMessage",
            changeDurationTitle: "stub-changeDurationTitle",
            changeDurationMessage: "stub-changeDurationMessage",
            changePartnersNameTitle: "stub-changePartnersNameTitle",
            changePartnersNameMessage: "stub-changePartnersNameMessage",
            putProjectOnHoldTitle: "stub-putProjectOnHoldTitle",
            putProjectOnHoldMessage: "stub-putProjectOnHoldMessage",
            endProjectEarlyTitle: "stub-endProjectEarlyTitle",
            endProjectEarlyMessage: "stub-endProjectEarlyMessage",
            loanDrawdownChangeTitle: "stub-loanDrawdownChangeTitle",
            loanDrawdownChangeMessage: "stub-loanDrawdownChangeMessage",
            loanDrawdownExtensionTitle: "stub-loanDrawdownExtensionTitle",
            loanDrawdownExtensionMessage: "stub-loanDrawdownExtensionMessage",
          },
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
          <TestBed>
            <PcrTypesGuidance {...defaultProps} {...props} />
          </TestBed>,
        );

        const getReallocateCostsMessage = () => rtl.queryByText(stubContent.pages.pcrCreate.reallocateCostsMessage);
        const getRemovePartnerMessage = () => rtl.queryByText(stubContent.pages.pcrCreate.removePartnerMessage);
        const getAddPartnerMessage = () => rtl.queryByText(stubContent.pages.pcrCreate.addPartnerMessage);
        const getChangeScopeMessage = () => rtl.queryByText(stubContent.pages.pcrCreate.changeScopeMessage);
        const getChangeDurationMessage = () => rtl.queryByText(stubContent.pages.pcrCreate.changeDurationMessage);
        const getChangePartnersNameMessage = () =>
          rtl.queryByText(stubContent.pages.pcrCreate.changePartnersNameMessage);
        const getPutProjectOnHoldMessage = () => rtl.queryByText(stubContent.pages.pcrCreate.putProjectOnHoldMessage);
        const getEndProjectEarlyMessage = () => rtl.queryByText(stubContent.pages.pcrCreate.endProjectEarlyMessage);

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

      beforeAll(async () => {
        await testInitialiseInternationalisation(stubContent);
      })

      describe("@renders", () => {
        test("as default", () => {
          const { queryByText } = setup();

          const titleElement = queryByText(stubContent.pages.pcrCreate.learnMoreTitle);
          const hintElement = queryByText(stubContent.pages.pcrCreate.selectTypesHint);

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

        test("when clicked additional details should be visible", async () => {
          const types: PCRItemTypeDto[] = [{ ...stubPcrItem, type: PCRItemType.MultiplePartnerFinancialVirement }];
          const { queryByText, getByText } = setup({ types });

          const reallocateCostsMessage = queryByText(stubContent.pages.pcrCreate.reallocateCostsMessage);
          const toggleElement = getByText(stubContent.pages.pcrCreate.learnMoreTitle);

          await userEvent.click(toggleElement);
          expect(reallocateCostsMessage).toBeVisible();
        });

        test("when clicked twice additional details should not be visible", async () => {
          const types: PCRItemTypeDto[] = [{ ...stubPcrItem, type: PCRItemType.MultiplePartnerFinancialVirement }];
          const { queryByText, getByText } = setup({ types });

          const reallocateCostsMessage = queryByText(stubContent.pages.pcrCreate.reallocateCostsMessage);
          const toggleElement = getByText(stubContent.pages.pcrCreate.learnMoreTitle);

          await userEvent.click(toggleElement);
          expect(reallocateCostsMessage).toBeVisible();

          await userEvent.click(toggleElement);
          expect(reallocateCostsMessage).not.toBeVisible();
        });
      });
    });
  });
});
