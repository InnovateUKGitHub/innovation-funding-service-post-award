import { getPartnerRoles } from "./getPartnerRoles";

describe("getPartnerRoles", () => {
  it("should map from the partnerRoles object to a list of partner roles", () => {
    const node = {
      partnerRoles: [
        {
          isFc: true,
          isPm: false,
          isMo: false,
          partnerId: "1",
          accountId: "11",
        },
        {
          isFc: false,
          isPm: true,
          isMo: false,
          partnerId: "2",
          accountId: "12",
        },
        {
          isFc: false,
          isPm: false,
          isMo: true,
          partnerId: "3",
          accountId: "13",
        },
      ],
    };

    expect(getPartnerRoles(node)).toMatchSnapshot();
  });
});
