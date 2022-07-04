import { FinancialVirementDto, PartnerDto, PartnerVirementsDto } from "@framework/dtos";
import { createDto } from "@framework/util";

import { partnerSummaryData } from "@ui/containers/pcrs/components/PcrSummary/summary-sections/reallocate-costs";

describe("partnerSummaryData()", () => {
  const stubFirstVirement = createDto<PartnerVirementsDto>({
    partnerId: "stub-stubFirstVirement-uid",
    originalRemainingGrant: 100,
    newRemainingGrant: 90,
  });

  const stubSecondVirement = createDto<PartnerVirementsDto>({
    partnerId: "stub-stubSecondVirement-uid",
    originalRemainingGrant: 100,
    newRemainingGrant: 105,
  });

  const stubBaseVirement = createDto<FinancialVirementDto>({ partners: [stubFirstVirement, stubSecondVirement] });

  describe("@returns correctly", () => {
    describe("with different partner population", () => {
      test("with one partner with no matching virement", () => {
        const stubPartnerUid = "stub-secondPartner-uid";
        const stubPartner = createDto<PartnerDto>({ id: stubPartnerUid });
        const stubVirementPartner = {
          ...stubFirstVirement,
          partnerId: "I should not match stubPartnerUid :(",
        };
        const stubVirement = createDto<FinancialVirementDto>({ partners: [stubVirementPartner] });

        const payload = partnerSummaryData({ partners: [stubPartner], virement: stubVirement });

        expect(payload.data.projectCostsOfPartners).toHaveLength(0);
      });

      test("with no partners", () => {
        const payload = partnerSummaryData({ partners: [], virement: stubBaseVirement });

        expect(payload.data.projectCostsOfPartners).toHaveLength(0);
      });

      test("with one partner", () => {
        const firstPartnerUid = "stub-firstPartner-uid";
        const stubFirstPartner = createDto<PartnerDto>({ id: firstPartnerUid });
        const stubVirementPartner = { ...stubFirstVirement, partnerId: firstPartnerUid };
        const stubVirement = createDto<FinancialVirementDto>({ partners: [stubVirementPartner] });

        const payload = partnerSummaryData({ partners: [stubFirstPartner], virement: stubVirement });

        expect(payload.data.projectCostsOfPartners).toHaveLength(1);
      });

      test("with multiple partners", () => {
        const firstPartnerUid = "stub-firstPartner-uid";
        const secondPartnerUid = "stub-secondPartner-uid";
        const stubFirstPartner = createDto<PartnerDto>({ id: firstPartnerUid });
        const stubSecondPartner = createDto<PartnerDto>({ id: secondPartnerUid });

        const stubFirstVirementPartner = { ...stubFirstVirement, partnerId: firstPartnerUid };
        const stubSecondVirementPartner = { ...stubFirstVirement, partnerId: secondPartnerUid };

        const stubVirement = createDto<FinancialVirementDto>({
          partners: [stubFirstVirementPartner, stubSecondVirementPartner],
        });

        const payload = partnerSummaryData({
          partners: [stubFirstPartner, stubSecondPartner],
          virement: stubVirement,
        });

        expect(payload.data.projectCostsOfPartners).toHaveLength(2);
      });
    });

    describe("with correct values", () => {
      describe("with total partner count", () => {
        test("with one partner", () => {
          const firstPartnerUid = "stub-firstPartner-uid";
          const stubFirstPartner = createDto<PartnerDto>({ id: firstPartnerUid });
          const stubVirementPartner = createDto<PartnerVirementsDto>({
            partnerId: firstPartnerUid,
            newRemainingGrant: 140,
            originalRemainingGrant: 200,
          });
          const stubVirement = createDto<FinancialVirementDto>({ partners: [stubVirementPartner] });

          const payload = partnerSummaryData({ partners: [stubFirstPartner], virement: stubVirement });

          const expectedPayload = {
            data: {
              hasAvailableGrant: true,
              hasMatchingGrant: false,
              newGrantDifference: -60,
              totalNewGrant: 140,
              totalOriginalGrant: 200,
              projectCostsOfPartners: [
                {
                  partner: { id: "stub-firstPartner-uid" },
                  partnerVirement: {
                    newRemainingGrant: 140,
                    originalRemainingGrant: 200,
                    partnerId: "stub-firstPartner-uid",
                  },
                },
              ],
            },
            isSummaryValid: true,
          };

          expect(payload).toStrictEqual(expectedPayload);
        });

        test("with multiple partners", () => {
          const firstPartnerUid = "stub-firstPartner-uid";
          const stubFirstPartner = createDto<PartnerDto>({ id: firstPartnerUid });
          const stubFirstVirementPartner = {
            ...stubFirstVirement,
            partnerId: firstPartnerUid,
            newRemainingGrant: 80,
            originalRemainingGrant: 100,
          };

          const secondPartnerUid = "stub-secondPartner-uid";
          const stubSecondPartner = createDto<PartnerDto>({ id: secondPartnerUid });
          const stubSecondVirementPartner = {
            ...stubFirstVirement,
            partnerId: secondPartnerUid,
            newRemainingGrant: 120,
            originalRemainingGrant: 150,
          };
          const stubVirement = createDto<FinancialVirementDto>({
            partners: [stubFirstVirementPartner, stubSecondVirementPartner],
          });

          const payload = partnerSummaryData({
            partners: [stubFirstPartner, stubSecondPartner],
            virement: stubVirement,
          });

          const expectedPayload = {
            isSummaryValid: true,
            data: {
              hasAvailableGrant: true,
              hasMatchingGrant: false,
              newGrantDifference: -50,
              totalNewGrant: 200,
              totalOriginalGrant: 250,
              projectCostsOfPartners: [
                {
                  partner: { id: "stub-firstPartner-uid" },
                  partnerVirement: {
                    newRemainingGrant: 80,
                    originalRemainingGrant: 100,
                    partnerId: "stub-firstPartner-uid",
                  },
                },
                {
                  partner: { id: "stub-secondPartner-uid" },
                  partnerVirement: {
                    newRemainingGrant: 120,
                    originalRemainingGrant: 150,
                    partnerId: "stub-secondPartner-uid",
                  },
                },
              ],
            },
          };

          expect(payload).toStrictEqual(expectedPayload);
        });
      });

      describe("with newRemainingGrant value", () => {
        test("when matching the originalRemainingGrant", () => {
          const firstPartnerUid = "stub-firstPartner-uid";
          const stubFirstPartner = createDto<PartnerDto>({ id: firstPartnerUid });
          const stubFirstVirementPartner = {
            ...stubFirstVirement,
            partnerId: firstPartnerUid,
            newRemainingGrant: 100,
            originalRemainingGrant: 100,
          };

          const stubVirement = createDto<FinancialVirementDto>({ partners: [stubFirstVirementPartner] });

          const payload = partnerSummaryData({ partners: [stubFirstPartner], virement: stubVirement });

          if (!payload.data) {
            throw Error("newGrantDifference, should be defined for this test to pass!");
          }

          expect(payload.isSummaryValid).toBe(true);
          expect(payload.data.newGrantDifference).toBe(0);
          expect(payload.data.totalNewGrant).toBe(100);
          expect(payload.data.totalOriginalGrant).toBe(100);
        });

        test("when lower than originalRemainingGrant", () => {
          const firstPartnerUid = "stub-firstPartner-uid";
          const stubFirstPartner = createDto<PartnerDto>({ id: firstPartnerUid });
          const stubFirstVirementPartner = {
            ...stubFirstVirement,
            partnerId: firstPartnerUid,
            newRemainingGrant: 50,
            originalRemainingGrant: 100,
          };

          const secondPartnerUid = "stub-secondPartner-uid";
          const stubSecondPartner = createDto<PartnerDto>({ id: secondPartnerUid });
          const stubSecondVirementPartner = {
            ...stubFirstVirement,
            partnerId: secondPartnerUid,
            newRemainingGrant: 100,
            originalRemainingGrant: 200,
          };
          const stubVirement = createDto<FinancialVirementDto>({
            partners: [stubFirstVirementPartner, stubSecondVirementPartner],
          });

          const payload = partnerSummaryData({
            partners: [stubFirstPartner, stubSecondPartner],
            virement: stubVirement,
          });

          if (!payload.data.newGrantDifference) {
            throw Error("newGrantDifference, should be defined and negative for this test to pass!");
          }

          expect(payload.isSummaryValid).toBe(true);
          expect(payload.data.hasAvailableGrant).toBe(true);
          expect(payload.data.hasMatchingGrant).toBe(false);
          expect(Math.sign(payload.data.newGrantDifference)).toBe(-1);
        });

        test("when higher than originalRemainingGrant", () => {
          const firstPartnerUid = "stub-firstPartner-uid";
          const stubFirstPartner = createDto<PartnerDto>({ id: firstPartnerUid });
          const stubFirstVirementPartner = {
            ...stubFirstVirement,
            partnerId: firstPartnerUid,
            newRemainingGrant: 190,
            originalRemainingGrant: 100,
          };

          const secondPartnerUid = "stub-secondPartner-uid";
          const stubSecondPartner = createDto<PartnerDto>({ id: secondPartnerUid });
          const stubSecondVirementPartner = {
            ...stubFirstVirement,
            partnerId: secondPartnerUid,
            newRemainingGrant: 220,
            originalRemainingGrant: 200,
          };
          const stubVirement = createDto<FinancialVirementDto>({
            partners: [stubFirstVirementPartner, stubSecondVirementPartner],
          });

          const payload = partnerSummaryData({
            partners: [stubFirstPartner, stubSecondPartner],
            virement: stubVirement,
          });

          if (!payload.data.newGrantDifference) {
            throw Error("newGrantDifference, should be defined and positive for this test to pass!");
          }

          expect(payload.isSummaryValid).toBe(false);
          expect(payload.data.hasAvailableGrant).toBe(false);
          expect(payload.data.hasMatchingGrant).toBe(false);
          expect(Math.sign(payload.data.newGrantDifference)).toBe(1);
        });
      });
    });
  });
});
