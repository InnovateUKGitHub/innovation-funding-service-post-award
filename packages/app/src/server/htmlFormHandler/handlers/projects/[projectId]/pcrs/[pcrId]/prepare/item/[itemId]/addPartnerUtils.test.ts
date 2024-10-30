import { PCRItemType, PCRPartnerType, PCRProjectRole } from "@framework/constants/pcrConstants";
import { getNextAddPartnerStep } from "./addPartnerUtils";
import { IContext } from "@framework/types/IContext";
import { TypeOfAid } from "@framework/constants/project";

const mockContext = {
  runQuery: jest.fn().mockResolvedValue({
    items: [
      {
        id: "0",
        type: PCRItemType.PartnerAddition,
        projectRole: PCRProjectRole.Collaborator,
        partnerType: PCRPartnerType.Business,
        isCommercialWork: false,
      },
      {
        id: "1",
        type: PCRItemType.PartnerAddition,
        projectRole: PCRProjectRole.Collaborator,
        partnerType: PCRPartnerType.Research,
        isCommercialWork: false,
      },
      {
        id: "2",
        type: PCRItemType.PartnerAddition,
        projectRole: PCRProjectRole.Collaborator,
        partnerType: PCRPartnerType.Business,
        isCommercialWork: true,
      },
      {
        id: "3",
        type: PCRItemType.PartnerAddition,
        projectRole: PCRProjectRole.Collaborator,
        partnerType: PCRPartnerType.Research,
        isCommercialWork: true,
      },
      {
        id: "4",
        type: PCRItemType.PartnerAddition,
        projectRole: PCRProjectRole.Collaborator,
        partnerType: PCRPartnerType.Business,
        isCommercialWork: true,
        typeOfAid: TypeOfAid.DeMinimisAid,
      },
      {
        id: "5",
        type: PCRItemType.PartnerAddition,
        projectRole: PCRProjectRole.Collaborator,
        partnerType: PCRPartnerType.Research,
      },
      {
        id: "6",
        type: PCRItemType.PartnerAddition,
        projectRole: PCRProjectRole.Collaborator,
        partnerType: PCRPartnerType.Business,
      },
      {
        id: "7",
        type: PCRItemType.PartnerAddition,
        projectRole: PCRProjectRole.Collaborator,
        partnerType: PCRPartnerType.Research,
      },
      {
        id: "8",
        type: PCRItemType.PartnerAddition,
        projectRole: PCRProjectRole.Collaborator,
        partnerType: PCRPartnerType.Business,
      },
      {
        id: "9",
        type: PCRItemType.PartnerAddition,
        projectRole: PCRProjectRole.Collaborator,
        partnerType: PCRPartnerType.Research,
      },
    ],
  }),
} as unknown as IContext;

describe("getNextAddPartnerStep", () => {
  beforeEach(jest.clearAllMocks);

  it("should throw an error if the pcrItemId does not find a matching item", async () => {
    await expect(
      getNextAddPartnerStep({
        context: mockContext,
        projectId: "123" as ProjectId,
        pcrId: "456" as PcrId,
        pcrItemId: "10" as PcrItemId,
        stepNumber: 1,
      }),
    ).rejects.toThrow("Cannot find PCR item ID");
  });

  it("should navigate to the summary from role and organisation step if `toSummary` is true", async () => {
    const result = await getNextAddPartnerStep({
      projectId: "123" as ProjectId,
      pcrId: "456" as PcrId,
      pcrItemId: "0" as PcrItemId,
      context: mockContext,
      toSummary: true,
      stepNumber: 1,
    });

    expect(result).toEqual("/projects/123/pcrs/456/prepare/item/0?:step");
  });

  it("should navigate to the `Non aid eligibility` step from role and organisation step if is not commercial work", async () => {
    const result = await getNextAddPartnerStep({
      projectId: "123" as ProjectId,
      pcrId: "456" as PcrId,
      pcrItemId: "0" as PcrItemId,
      context: mockContext,
      stepNumber: 1,
    });

    expect(result).toEqual("/projects/123/pcrs/456/prepare/item/0?step=2");
  });

  it("should navigate to the `De minimis funding` step from role and organisation step is commercial work and has de minimis aid", async () => {
    const result = await getNextAddPartnerStep({
      projectId: "123" as ProjectId,
      pcrId: "456" as PcrId,
      pcrItemId: "4" as PcrItemId,
      context: mockContext,
      stepNumber: 1,
    });

    expect(result).toEqual("/projects/123/pcrs/456/prepare/item/4?step=2");
  });

  it("should navigate to the `State aid funding` step from role and organisation step is commercial work and has state aid funding", async () => {
    const result = await getNextAddPartnerStep({
      projectId: "123" as ProjectId,
      pcrId: "456" as PcrId,
      pcrItemId: "2" as PcrItemId,
      context: mockContext,
      stepNumber: 1,
    });

    expect(result).toEqual("/projects/123/pcrs/456/prepare/item/2?step=2");
  });
});
