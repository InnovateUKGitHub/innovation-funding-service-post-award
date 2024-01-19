import { PCRDto } from "@framework/dtos/pcrDtos";
import { mergePcrData } from "./pcrHelper";
import { PCRItemType } from "@framework/constants/pcrConstants";

describe("mergePcrData", () => {
  it("should merge new PCR on top of old PCR, matching and merging items", () => {
    const pcrData = {
      id: "a0G26000007LUrbEAG",
      projectId: "a0E2600000om3ABEAY",
      items: [
        {
          accountName: "banana services",
          id: "a0G26000007LUrgEAG",
          partnerNameSnapshot: "A B Cad Services",
          shortName: "Scope change",
          type: PCRItemType.ScopeChange,
        },
        {
          id: "a0G26000007LdsWEAS",
          organisationName: "Swindon University",
          shortName: "Change a partner's name",
          statusName: "Complete",
          contact1Forename: "Ramsey",
          contact1Surname: "Bolton",
          type: PCRItemType.AccountNameChange,
        },
        {
          id: "a0G26000007Ldgjhk",
          organisationName: "Wetherspoons",
          shortName: "Remove a partner",
          type: PCRItemType.PartnerWithdrawal,
        },
      ],
      comments: "",
    } as unknown as PCRDto;

    const existingData = {
      id: "a0G26000007LUrbEAG",
      projectId: "a0E2600000om3ABEAY",
      items: [
        {
          id: "a0G26000007LdsWEAS",
          typeName: "Change a partner name",
          shortName: "Change a partner's name",
          organisationName: "Swindon University",
          organisationType: "Academic",
          projectRoleLabel: "Collaborator",
          partnerTypeLabel: "Research",
          projectLocationLabel: "Inside the United Kingdom",
        },
        {
          id: "a0G26000007LUrgEAG",
          guidance: "This will change the project's scope.",
          typeName: "Change a project scope",
          status: 3,
          statusName: "Complete",
          shortName: "Scope change",
          partnerId: "a0D2600000zYOlEEAW",
        },
      ],
    } as unknown as PCRDto;

    expect(mergePcrData(pcrData, existingData)).toMatchSnapshot();
  });

  it("should merge new PCR types without an ID", () => {
    const newPcr = {
      items: [
        // New type!
        { type: PCRItemType.TimeExtension },

        // Types with IDs
        {
          id: "apple",
          partnerNameSnapshot: "✅ This should have overridden the PCR item type ✅",
          type: PCRItemType.ProjectTermination,
        },
        { id: "cherry", contact1Forename: "Cherry / This should exist", type: PCRItemType.PartnerWithdrawal },
      ],
    } as unknown as PCRDto;

    const existingPcr = {
      items: [
        {
          id: "apple",
          partnerNameSnapshot: "❌ This should be overwritten ❌",
          accountName: "✅ This should not be overwritten ✅",
        },
        {
          id: "banana",
          contact1Forename: "Banana / This should exist",
        },
      ],
    } as unknown as PCRDto;

    expect(mergePcrData(newPcr, existingPcr)).toMatchSnapshot();
  });
});
