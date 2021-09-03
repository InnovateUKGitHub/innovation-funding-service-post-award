import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TestBed, TestBedContent } from "@shared/TestBed";
import { PcrTypesGuidance, PcrTypesGuidanceProps } from "@ui/containers/pcrs/components/PcrTypesGuidance";

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
      };

      const setup = (props?: Partial<PcrTypesGuidanceProps>) =>
        render(
          <TestBed content={stubContent as TestBedContent}>
            <PcrTypesGuidance {...defaultProps} {...props} />
          </TestBed>,
        );

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

        test("with guidance when toggle details is clicked", () => {
          const { queryByText, getByText } = setup();

          const elementsToCheck = [
            queryByText(stubContent.pcrCreate.reallocateCostsTitle.content),
            queryByText(stubContent.pcrCreate.reallocateCostsMessage.content),
            queryByText(stubContent.pcrCreate.removePartnerTitle.content),
            queryByText(stubContent.pcrCreate.removePartnerMessage.content),
            queryByText(stubContent.pcrCreate.addPartnerTitle.content),
            queryByText(stubContent.pcrCreate.addPartnerMessage.content),
            queryByText(stubContent.pcrCreate.changeScopeTitle.content),
            queryByText(stubContent.pcrCreate.changeScopeMessage.content),
            queryByText(stubContent.pcrCreate.changeDurationTitle.content),
            queryByText(stubContent.pcrCreate.changeDurationMessage.content),
            queryByText(stubContent.pcrCreate.changePartnersNameTitle.content),
            queryByText(stubContent.pcrCreate.changePartnersNameMessage.content),
            queryByText(stubContent.pcrCreate.putProjectOnHoldTitle.content),
            queryByText(stubContent.pcrCreate.putProjectOnHoldMessage.content),
            queryByText(stubContent.pcrCreate.endProjectEarlyTitle.content),
            queryByText(stubContent.pcrCreate.endProjectEarlyMessage.content),
          ];

          elementsToCheck.forEach(guidenceElement => expect(guidenceElement).not.toBeVisible());

          const toggleElement = getByText(stubContent.pcrCreate.learnMoreAboutTitle.content);
          userEvent.click(toggleElement);

          elementsToCheck.forEach(guidenceElement => expect(guidenceElement).toBeVisible());
        });
      });
    });
  });
});
