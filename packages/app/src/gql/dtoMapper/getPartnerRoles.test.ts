import { getPartnerRoles } from "./getPartnerRoles";

describe("getPartnerRoles", () => {
  it("should map from the partnerRoles object to a list of partner roles", () => {
    const node = {
      partnerRoles: [
        {
          isFc: true,
          isPm: false,
          isMo: false,
          isAssociate: false,
          partnerId: "1",
          accountId: "a1",
        },
        {
          isFc: false,
          isPm: true,
          isMo: false,
          isAssociate: false,
          partnerId: "2",
          accountId: "a2",
        },
        {
          isFc: false,
          isPm: false,
          isMo: true,
          isAssociate: false,
          partnerId: "3",
          accountId: "a3",
        },
        {
          isFc: false,
          isPm: false,
          isMo: false,
          isAssociate: true,
          partnerId: "4",
          accountId: "a4",
        },
      ],
    };

    expect(getPartnerRoles(node)).toMatchSnapshot();
  });
});
