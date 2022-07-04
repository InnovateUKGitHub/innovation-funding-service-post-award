import { v4 as uuid } from "uuid";

import { LoanStatus } from "@framework/entities";
import {
  CostCategoryVirementDtoValidator,
  FinancialLoanVirementDtoValidator,
  FinancialVirementDtoValidator,
  PartnerVirementsDtoValidator,
} from "@ui/validators/financialVirementDtoValidator";
import {
  CostCategoryVirementDto,
  FinancialLoanVirementDto,
  FinancialVirementDto,
  PartnerVirementsDto,
} from "@framework/dtos/finacialVirementDto";

describe("financialVirementDtoValidator", () => {
  describe("@validates", () => {
    describe("partner eligible costs", () => {
      test.each`
        name                                              | newEligibleCosts | isValid
        ${"given null"}                                   | ${null}          | ${false}
        ${"given value lower than costs claimed to date"} | ${2_100}         | ${true}
        ${"given negative value"}                         | ${-15}           | ${false}
      `("$name", ({ newEligibleCosts, isValid }) => {
        const stubCostCategoryVirement = {
          costsClaimedToDate: 2_000,
          newEligibleCosts,
        } as CostCategoryVirementDto;

        const validation = new CostCategoryVirementDtoValidator(stubCostCategoryVirement, false);
        expect(validation.newPartnerEligibleCosts.isValid).toBe(isValid);
      });
    });

    describe("partner remaining grant", () => {
      test.each`
        name                         | newRemainingGrant | expectedResult
        ${"given null"}              | ${null}           | ${false}
        ${"given negative value"}    | ${-10}            | ${false}
        ${"given value is zero"}     | ${0}              | ${true}
        ${"given number above zero"} | ${10}             | ${true}
      `("$name", ({ newRemainingGrant, expectedResult }) => {
        const stubPartnerVirements = {
          originalRemainingGrant: 2_500,
          newRemainingGrant,
        } as PartnerVirementsDto;

        const validation = new PartnerVirementsDtoValidator(stubPartnerVirements, false);
        expect(validation.newRemainingGrant.isValid).toBe(expectedResult);
      });
    });

    describe("validate single partner", () => {
      test.each`
        name                          | currentPartnerId      | expectedLength
        ${"given no current partner"} | ${undefined}          | ${4}
        ${"given current partnerId"}  | ${"stub-partnerId-3"} | ${1}
        ${"given invalid partnerId"}  | ${"stub-partnerId-5"} | ${4}
      `("$name", ({ currentPartnerId, expectedLength }) => {
        const stubFinancialVirement = {
          currentPartnerId,
          partners: [
            {
              partnerId: "stub-partnerId-1",
            },
            {
              partnerId: "stub-partnerId-2",
            },
            {
              partnerId: "stub-partnerId-3",
            },
            {
              partnerId: "stub-partnerId-4",
            },
          ] as PartnerVirementsDto[],
        } as FinancialVirementDto;

        const validation = new FinancialVirementDtoValidator(stubFinancialVirement, false, true);
        expect(validation.partners.results).toHaveLength(expectedLength);
      });
    });

    describe("total remaining grant", () => {
      test.each`
        name                                                       | newRemainingGrant | isValid  | submit
        ${"given null, no submit"}                                 | ${null}           | ${false} | ${true}
        ${"given new grant lower than remaining grant, to submit"} | ${4_000}          | ${true}  | ${true}
        ${"given new grant lower than remaining grant, no submit"} | ${1}              | ${true}  | ${false}
      `("$name", ({ newRemainingGrant, isValid }) => {
        const stubFinancialVirement = {
          originalRemainingGrant: 5_000,
          newRemainingGrant,
        } as FinancialVirementDto;

        const validation = new FinancialVirementDtoValidator(stubFinancialVirement, false, true);
        expect(validation.newRemainingGrant.isValid).toBe(isValid);
      });
    });
  });
});

describe("FinancialLoanVirementDtoValidator", () => {
  const stubLoanVirementDto: FinancialLoanVirementDto = {
    pcrItemId: "stub-pcrItemId",
    loans: [],
  };

  const stubLoanVirement = (): FinancialLoanVirementDto["loans"][0] => {
    const currentDate = new Date(Date.UTC(2022, 1));

    return {
      id: uuid(),
      isEditable: true,
      period: 1,
      status: LoanStatus.PLANNED,

      currentDate,
      newDate: currentDate,

      currentValue: 2000,
      newValue: 2000,
    };
  };

  describe("@validates", () => {
    describe("with totals", () => {
      test.each`
        name                  | payload                                                                                                                                                      | expectedResponse
        ${"with single loan"} | ${{ ...stubLoanVirementDto, loans: [{ ...stubLoanVirement(), currentValue: 10, newValue: 11 }] }}                                                            | ${{ currentTotal: 10, updatedTotal: 11 }}
        ${"with many loans"}  | ${{ ...stubLoanVirementDto, loans: [{ ...stubLoanVirement(), currentValue: 10, newValue: 11 }, { ...stubLoanVirement(), currentValue: 10, newValue: 11 }] }} | ${{ currentTotal: 20, updatedTotal: 22 }}
      `("$name", ({ payload, expectedResponse }) => {
        const validation = new FinancialLoanVirementDtoValidator(payload, true, true);
        expect(validation.totals).toStrictEqual(expectedResponse);
      });
    });

    describe("with totalValue", () => {
      /**
       * @description returns a stub object for testing, requires args needed for testing
       */
      const createTotalValueStub = (
        stubs?: Pick<FinancialLoanVirementDto["loans"][0], "isEditable" | "period" | "currentValue" | "newValue">[],
      ): FinancialLoanVirementDto => {
        if (!stubs) return { ...stubLoanVirementDto, loans: [stubLoanVirement()] };

        // Note: We only care about object from args, spread over the stub object
        const loans = stubs.map((x, i) => {
          // Note: Every following date is valid and sequential
          const currentDate = new Date(Date.UTC(2022, i + 1));
          return { ...stubLoanVirement(), currentDate, newDate: currentDate, ...x };
        });
        return { ...stubLoanVirementDto, loans };
      };

      test.each`
        name                        | payload                                                                                                                                                     | expectedResponse | expectedError
        ${"with one item to check"} | ${createTotalValueStub([{ isEditable: true, period: 1, currentValue: 10, newValue: 10 }])}                                                                  | ${true}          | ${null}
        ${"when matching"}          | ${createTotalValueStub([{ isEditable: true, period: 1, currentValue: 10, newValue: 10 }, { isEditable: true, period: 2, currentValue: 10, newValue: 10 }])} | ${true}          | ${null}
        ${"when non-matching"}      | ${createTotalValueStub([{ isEditable: true, period: 1, currentValue: 10, newValue: 20 }, { isEditable: true, period: 2, currentValue: 10, newValue: 20 }])} | ${false}         | ${"You cannot exceed '£20.00' by '£20.00'. Adjust period '1, 2' to proceed."}
      `("$name", ({ payload, expectedResponse, expectedError }) => {
        const validation = new FinancialLoanVirementDtoValidator(payload, true, true);

        expect(validation.totalValue.isValid).toBe(expectedResponse);

        if (!validation.totalValue.isValid) {
          expect(validation.totalValue.errorMessage).toBe(expectedError);
        }
      });

      test("with submit as false", () => {
        const stubPayload = createTotalValueStub();
        const validation = new FinancialLoanVirementDtoValidator(stubPayload, true, false);

        expect(validation.totalValue.isValid).toBeTruthy();
      });
    });

    describe("with items", () => {
      /**
       * @description returns a stub object for testing, requires args needed for testing
       */
      const createItemsStub = (
        stubs?: Pick<
          FinancialLoanVirementDto["loans"][0],
          "isEditable" | "period" | "currentValue" | "currentDate" | "newValue" | "newDate"
        >[],
      ): FinancialLoanVirementDto => {
        if (!stubs) return { ...stubLoanVirementDto, loans: [stubLoanVirement()] };

        // Note: We only care about object from args, spread over the stub object
        const loans = stubs.map(x => ({ ...stubLoanVirement(), ...x }));
        return { ...stubLoanVirementDto, loans };
      };

      test("with submit as false", () => {
        const stubPayload = createItemsStub();
        const validation = new FinancialLoanVirementDtoValidator(stubPayload, true, false);

        expect(validation.totalValue.isValid).toBeTruthy();
      });

      describe("with period", () => {
        test("when entry has positive id", () => {
          const positivePeriodEntry = {
            isEditable: true,
            period: 10,
            currentValue: 10,
            currentDate: new Date(Date.UTC(2022, 1)),
            newValue: 10,
            newDate: new Date(Date.UTC(2022, 1)),
          };
          const stubData = [positivePeriodEntry];

          const stubPayload = createItemsStub(stubData);
          const validation = new FinancialLoanVirementDtoValidator(stubPayload, true, true);

          const [onlyEntryValidation] = validation.items.results;

          expect(onlyEntryValidation.period.isValid).toBeTruthy();
        });

        test("when period is a negative value", () => {
          const negativePeriodEntry = {
            isEditable: true,
            period: -1,
            currentValue: 10,
            currentDate: new Date(Date.UTC(2022, 1)),
            newValue: 10,
            newDate: new Date(Date.UTC(2022, 1)),
          };

          const stubPayload = createItemsStub([negativePeriodEntry]);
          const validation = new FinancialLoanVirementDtoValidator(stubPayload, true, true);

          const [onlyEntryValidation] = validation.items.results;

          expect(onlyEntryValidation.period.isValid).toBeFalsy();
          expect(onlyEntryValidation.period.errorMessage).toBe("Virement 'period' is not valid.");
        });
      });

      describe("with newDate", () => {
        test("when submit is false", () => {
          const stubData = [
            {
              isEditable: true,
              period: 1,
              currentValue: 10,
              currentDate: new Date(Date.UTC(2022, 1)),
              newValue: 10,
              newDate: new Date(Date.UTC(2022, 1)),
            },
            {
              isEditable: true,
              period: 2,
              currentValue: 10,
              currentDate: new Date(Date.UTC(2022, 2)),
              newValue: 10,
              newDate: new Date(Date.UTC(2022, 2)),
            },
          ];

          const stubPayload = createItemsStub(stubData);
          const validation = new FinancialLoanVirementDtoValidator(stubPayload, true, false);

          stubData.forEach((_, i) => {
            expect(validation.items.results[i].newDate.isValid).toBeTruthy();
          });
        });

        test("when valid date", () => {
          const stubData = [
            {
              isEditable: true,
              period: 1,
              currentValue: 10,
              currentDate: new Date(Date.UTC(2022, 1)),
              newValue: 10,
              newDate: new Date(Date.UTC(2022, 1)),
            },
            {
              isEditable: true,
              period: 2,
              currentValue: 10,
              currentDate: new Date(Date.UTC(2022, 2)),
              newValue: 10,
              newDate: new Date(Date.UTC(2022, 2)),
            },
          ];

          const stubPayload = createItemsStub(stubData);
          const validation = new FinancialLoanVirementDtoValidator(stubPayload, true, true);

          stubData.forEach((_, i) => {
            expect(validation.items.results[i].newDate.isValid).toBeTruthy();
          });
        });

        test("when invalid date", () => {
          const stubYear = 2022;
          const stubInvalidPreviousYear = stubYear - 1;

          const stubData = [
            {
              isEditable: true,
              period: 1,
              currentValue: 10,
              currentDate: new Date(Date.UTC(stubYear, 1)),
              newValue: 10,
              newDate: new Date(Date.UTC(stubYear, 1)),
            },
            {
              isEditable: true,
              period: 2,
              currentValue: 10,
              currentDate: new Date(Date.UTC(stubYear, 1)),
              newValue: 10,
              newDate: new Date(Date.UTC(stubInvalidPreviousYear, 1)),
            },
          ];

          const stubPayload = createItemsStub(stubData);
          const validation = new FinancialLoanVirementDtoValidator(stubPayload, true, true);

          expect(validation.items.results[0].newDate.isValid).toBeTruthy();

          expect(validation.items.results[1].newDate.isValid).toBeFalsy();
          expect(validation.items.results[1].newDate.errorMessage).toBe(
            "Period '2' must be dated after period '1' drawdown.",
          );
        });

        test("when last 2 dates of 3 are invalid", () => {
          const stubYear = 2022;
          const stubMonth = 6;

          const stubData = [
            {
              isEditable: true,
              period: 1,
              currentValue: 10,
              currentDate: new Date(Date.UTC(stubYear, stubMonth)),
              newValue: 10,
              newDate: new Date(Date.UTC(stubYear, stubMonth)),
            },
            {
              isEditable: true,
              period: 2,
              currentValue: 10,
              currentDate: new Date(Date.UTC(stubYear, stubMonth)),
              newValue: 10,
              newDate: new Date(Date.UTC(stubYear - 1, stubMonth)),
            },
            {
              isEditable: true,
              period: 3,
              currentValue: 10,
              currentDate: new Date(Date.UTC(stubYear, stubMonth)),
              newValue: 10,
              newDate: new Date(Date.UTC(stubYear - 2, stubMonth)),
            },
          ];

          const stubPayload = createItemsStub(stubData);
          const validation = new FinancialLoanVirementDtoValidator(stubPayload, true, true);

          expect(validation.items.results[0].newDate.isValid).toBeTruthy();

          expect(validation.items.results[1].newDate.isValid).toBeFalsy();
          expect(validation.items.results[1].newDate.errorMessage).toBe(
            "Period '2' must be dated after period '1' drawdown.",
          );

          expect(validation.items.results[2].newDate.isValid).toBeFalsy();
          expect(validation.items.results[2].newDate.errorMessage).toBe(
            "Period '3' must be dated after period '2' drawdown.",
          );
        });
      });

      describe("with newValue", () => {
        describe("with single entry", () => {
          test("when entry is editable and valid", () => {
            const editableEntry = {
              isEditable: true,
              period: 1,
              currentValue: 10,
              currentDate: new Date(Date.UTC(2022, 1)),
              newValue: 10,
              newDate: new Date(Date.UTC(2022, 1)),
            };
            const stubData = [editableEntry];

            const stubPayload = createItemsStub(stubData);
            const validation = new FinancialLoanVirementDtoValidator(stubPayload, true, true);

            const [onlyEntryValidation] = validation.items.results;

            expect(onlyEntryValidation.isValid).toBeTruthy();
          });

          test("when entry is uneditable always returns valid", () => {
            const unEditableEntry = {
              isEditable: false,
              period: 1,
              currentValue: 10,
              currentDate: new Date(Date.UTC(2022, 1)),
              newValue: 10,
              newDate: new Date(Date.UTC(2022, 1)),
            };

            const stubPayload = createItemsStub([unEditableEntry]);
            const validation = new FinancialLoanVirementDtoValidator(stubPayload, true, true);

            const [onlyEntryValidation] = validation.items.results;

            expect(onlyEntryValidation.isValid).toBeTruthy();
          });

          test("when submit is false", () => {
            const stubPayload = createItemsStub();
            const validation = new FinancialLoanVirementDtoValidator(stubPayload, true, false);

            const [onlyEntryValidation] = validation.items.results;

            expect(onlyEntryValidation.newValue.isValid).toBeTruthy();
          });

          test("when single value is overdrawn", () => {
            const stubCurrentValue = 10;
            const stubNewValue = stubCurrentValue + 1;

            const overdrawnEntry = {
              isEditable: true,
              period: 1,
              currentValue: stubCurrentValue,
              currentDate: new Date(Date.UTC(2022, 1)),
              newValue: stubNewValue,
              newDate: new Date(Date.UTC(2022, 1)),
            };

            const stubPayload = createItemsStub([overdrawnEntry]);
            const validation = new FinancialLoanVirementDtoValidator(stubPayload, true, true);

            const [onlyEntryValidation] = validation.items.results;

            expect(onlyEntryValidation.newValue.isValid).toBeFalsy();
            expect(onlyEntryValidation.newValue.errorMessage).toBe(
              "You cannot exceed '£10.00' by '£1.00'. Adjust period '1' to proceed.",
            );
          });

          test("when single value is not overdrawn", () => {
            const stubCurrentValue = 10;

            const overdrawnEntry = {
              isEditable: true,
              period: 1,
              currentValue: stubCurrentValue,
              currentDate: new Date(Date.UTC(2022, 1)),
              newValue: stubCurrentValue,
              newDate: new Date(Date.UTC(2022, 1)),
            };

            const stubPayload = createItemsStub([overdrawnEntry]);
            const validation = new FinancialLoanVirementDtoValidator(stubPayload, true, true);

            const [onlyEntryValidation] = validation.items.results;

            expect(onlyEntryValidation.newValue.isValid).toBeTruthy();
          });

          test("does not validate newValue (parent validator checks plural)", () => {
            const stubPayload = createItemsStub();
            const validation = new FinancialLoanVirementDtoValidator(stubPayload, true, true);

            const [onlyEntryValidation] = validation.items.results;

            expect(validation.isValid).toBeTruthy();

            expect(onlyEntryValidation.newValue.isValid).toBeTruthy();
            expect(validation.totalValue.isValid).toBeTruthy();
          });
        });

        describe("with many entries", () => {
          test("with valid (parent checks plural items)", () => {
            const stubCurrentValue = 10;
            const stubItemsFirstItemOverdrawn = [
              {
                isEditable: true,
                period: 1,
                currentValue: stubCurrentValue,
                newValue: stubCurrentValue + 1,
                currentDate: new Date(Date.UTC(2022, 1)),
                newDate: new Date(Date.UTC(2022, 1)),
              },
              {
                isEditable: true,
                period: 2,
                currentValue: stubCurrentValue,
                newValue: stubCurrentValue,
                currentDate: new Date(Date.UTC(2022, 2)),
                newDate: new Date(Date.UTC(2022, 2)),
              },
            ];

            const stubPayload = createItemsStub(stubItemsFirstItemOverdrawn);
            const validation = new FinancialLoanVirementDtoValidator(stubPayload, true, true);

            expect(validation.isValid).toBeFalsy();

            expect(validation.totalValue.isValid).toBeFalsy();
            expect(validation.totalValue.errorMessage).toBe(
              "You cannot exceed '£20.00' by '£1.00'. Adjust period '1, 2' to proceed.",
            );

            // All items should be valid
            stubItemsFirstItemOverdrawn.forEach((_, i) => {
              expect(validation.items.results[i].isValid).toBeTruthy();
            });
          });
        });
      });
    });
  });
});
