import { ProjectRole } from "@framework/constants";
import { BankDetails, PartnerDto } from "@framework/dtos";
import { Partner } from "@framework/entities";
import { createPartnerDto } from "@framework/util/stubDtos";
import { MapToPartnerDtoCommand } from "@server/features/partners/mapToPartnerDto";

describe("mapToPartnerDto", () => {
  const stubForecastLastModifiedDate = new Date();

  const bankDetails = {
    companyNumber: "stubCompanyNumber",
    sortCode: "stubSortCode",
    accountNumber: "stubAccountNumber",
    firstName: "stubFirstName",
    lastName: "stubLastName",
    address: {
      accountPostcode: "stubAccountPostcode",
      accountStreet: "stubAccountStreet",
      accountBuilding: "stubAccountBuilding",
      accountLocality: "stubAccountLocality",
      accountTownOrCity: "stubAccountTownOrCity",
    },
  } as BankDetails;

  const validationResponse = {
    validationCheckPassed: false,
    iban: "stubIban",
    validationConditionsSeverity: "stubValidationConditionsSeverity",
    validationConditionsCode: "stubValidationConditionsCode",
    validationConditionsDesc: "validationConditionsDesc",
  };

  const verificationResponse = {
    verificationConditionsSeverity: "To do",
    verificationConditionsCode: "stubVerificationConditionsCode",
    verificationConditionsDesc: "stubVerificationConditionsDesc",
  };

  const stubPartnerToMap = {
    id: "a0D0C000001AEZzUAO",
    accountId: "0010C00000AtnOAQAZ",
    name: "Test account 2A",
    organisationType: "Industrial",
    participantType: "Business",
    projectRole: "Lead",
    projectRoleName: "Project Lead",
    projectId: "a0E0C000001zU2sUAE",
    competitionType: "CR&D",
    totalParticipantCosts: 186000,
    totalApprovedCosts: 37000,
    capLimit: 50,
    awardRate: 50,
    totalPaidCosts: 123,
    totalFutureForecastsForParticipant: 48820.8,
    forecastLastModifiedDate: stubForecastLastModifiedDate,
    overdueProject: false,
    claimsOverdue: 1,
    claimsUnderQuery: 1,
    trackingClaims: "Claims Overdue",
    overheadRate: 20,
    participantStatus: "Active",
    participantStatusLabel: "Active",
    totalCostsSubmitted: 37000,
    totalCostsAwarded: 20,
    auditReportFrequencyName: "With all claims",
    totalPrepayment: 123,
    postcode: "BS1 6AC",
    postcodeStatusLabel: "Complete",
    postcodeStatus: "30",
    newForecastNeeded: false,
    companyNumber: bankDetails.companyNumber,
    sortCode: bankDetails.sortCode,
    accountNumber: bankDetails.accountNumber,
    firstName: bankDetails.firstName,
    lastName: bankDetails.lastName,
    accountPostcode: bankDetails.address.accountPostcode,
    accountStreet: bankDetails.address.accountStreet,
    accountBuilding: bankDetails.address.accountBuilding,
    accountLocality: bankDetails.address.accountLocality,
    accountTownOrCity: bankDetails.address.accountTownOrCity,
    spendProfileStatus: "30",
    spendProfileStatusLabel: "To do",
    bankDetailsTaskStatus: "30",
    bankDetailsTaskStatusLabel: "To do",
    bankCheckStatus: "Verification passed",
    validationCheckPassed: validationResponse.validationCheckPassed,
    iban: validationResponse.iban,
    validationConditionsSeverity: validationResponse.validationConditionsSeverity,
    validationConditionsCode: validationResponse.validationConditionsCode,
    validationConditionsDesc: validationResponse.validationConditionsDesc,
    personalDetailsScore: null,
    addressScore: null,
    companyNameScore: null,
    regNumberScore: null,
    verificationConditionsSeverity: verificationResponse.verificationConditionsSeverity,
    verificationConditionsCode: verificationResponse.verificationConditionsCode,
    verificationConditionsDesc: verificationResponse.verificationConditionsDesc,
    totalGrantApproved: 0,
    remainingParticipantGrant: 74500,
    isNonFunded: false,
  } as Partner;

  test("when valid mapping", () => {
    const stubExpectedPartnerDto = {
      totalPrepayment: 123,
      totalPaidCosts: 123,
      postcodeStatus: 30,
      postcodeStatusLabel: "Complete",
      claimsOverdue: 1,
      forecastLastModifiedDate: stubForecastLastModifiedDate,
      bankDetails,
      validationResponse,
      verificationResponse,
    } as Partial<PartnerDto>;

    const expected = createPartnerDto(stubExpectedPartnerDto);
    const mappedPartnerDto = new MapToPartnerDtoCommand(stubPartnerToMap, 7, ProjectRole.ProjectManager).run();

    expect(mappedPartnerDto).toMatchObject(expected);
  });
});
