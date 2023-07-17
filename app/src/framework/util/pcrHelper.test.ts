import { PCRDto } from "@framework/dtos/pcrDtos";
import { mergePcrData } from "./pcrHelper";

const pcrData = {
  id: "a0G26000007LUrbEAG",
  projectId: "a0E2600000om3ABEAY",
  items: [
    {
      accountName: "banana services",
      id: "a0G26000007LUrgEAG",
      partnerNameSnapshot: "A B Cad Services",
      shortName: "Change a partner's name",
    },
    {
      id: "a0G26000007LdsWEAS",
      organisationName: "Swindon University",
      shortName: "Add a partner",
      statusName: "Complete",
      contact1Forename: "Ramsey",
      contact1Surname: "Bolton",
    },
    {
      id: "a0G26000007Ldgjhk",
      organisationName: "Wetherspoons",
      shortName: "Add a partner",
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
      typeName: "Add a partner",
      shortName: "Add a partner",

      organisationName: "Swindon University",
      organisationType: "Academic",
      projectRoleLabel: "Collaborator",
      partnerTypeLabel: "Research",
      projectLocationLabel: "Inside the United Kingdom",
    },
    {
      id: "a0G26000007LUrgEAG",
      guidance:
        "This will change the partner's name in all projects they are claiming funding for. You must upload a change of name certificate from Companies House as evidence of the change.\n",
      typeName: "Change a partner's name",
      status: 3,
      statusName: "Complete",
      shortName: "Change a partner's name",
      partnerId: "a0D2600000zYOlEEAW",
    },
  ],
} as unknown as PCRDto;

describe("mergePcrData", () => {
  it("should merge PcrData left to right matching and merging items", () => {
    expect(mergePcrData(pcrData, existingData)).toMatchSnapshot();
  });
});
