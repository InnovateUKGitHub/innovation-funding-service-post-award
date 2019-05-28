import {
  findClaimsByPartner,
  findClaimsByProject,
  getCurrentClaim, getPreviousClaims,
  getProjectCurrentClaims, getProjectPreviousClaims
} from "../../../src/ui/redux/selectors";
import getRootState from "./getRootState";
import createClaim from "./createClaim";

const rootState = getRootState();

describe("claims by project", () => {
  describe("findClaimsByProject", () => {

    const claims = {
      "projectId=1": {
        data: [
          createClaim({ id: "p11", partnerId: "p1" }),
          createClaim({ id: "p12", partnerId: "p2" })
        ],
        error: undefined,
        status: 3
      },
      "projectId=2": {
        data: [],
        error: undefined,
        status: 3
      }
    };

    const state = Object.assign({}, rootState);
    state.data = Object.assign({}, state.data, { claims });

    it("should return the claims for the queried partner", () => {
      const foundClaims = findClaimsByProject("1").getPending(state).data;
      expect(foundClaims).toEqual(claims["projectId=1"].data);
    });

    it("should return an empty array when there are no claims for the queried partner", () => {
      const foundClaims = findClaimsByProject("2").getPending(state).data;
      expect(foundClaims).toEqual([]);
    });
  });
  describe("getProjectCurrentClaims", () => {
    const openClaim = createClaim({ id: "p11", partnerId: "p3", isApproved: false });
    const claims = {
      "projectId=3": {
        data: [
          openClaim,
          createClaim({ id: "p12", partnerId: "p3", isApproved: true })
        ],
        error: undefined,
        status: 3
      },
      "projectId=4": {
        data: [
          createClaim({ id: "p21", partnerId: "p4", isApproved: true }),
          createClaim({ id: "p22", partnerId: "p4", isApproved: true })
        ],
        error: undefined,
        status: 3
      },
      "projectId=x": {
        data: null as any,
        error: undefined,
        status: 3
      }
    };

    const state = Object.assign({}, rootState);
    state.data = Object.assign({}, state.data, { claims });

    it("should return the open claims", () => {
      const foundClaim = getProjectCurrentClaims(state, "3").data;
      expect(foundClaim).toEqual([openClaim]);
    });
    it("should return an empty array when there are no open claims", () => {
      const foundClaim = getProjectCurrentClaims(state, "4").data;
      expect(foundClaim).toEqual([]);
    });
  });
  describe("getProjectPreviousClaims", () => {

    const closedClaim = createClaim({
      id: "p11",
      partnerId: "p3",
      isApproved: true
    });

    const claims = {
      "projectId=3": {
        data: [
          closedClaim,
          createClaim({ id: "p12", partnerId: "p3", isApproved: false })
        ],
        error: undefined,
        status: 3
      },
      "projectId=4": {
        data: [
          createClaim({ id: "p21", partnerId: "p4", isApproved: false }),
          createClaim({ id: "p22", partnerId: "p4", isApproved: false })
        ],
        error: undefined,
        status: 3
      },
      "projectId=x": {
        data: null as any,
        error: undefined,
        status: 3
      }
    };

    const state = Object.assign({}, rootState);
    state.data = Object.assign({}, state.data, { claims });

    it("should return the previous claims", () => {
      const foundClaim = getProjectPreviousClaims(state, "3").data;
      expect(foundClaim).toEqual([closedClaim]);
    });
    it("should return empty array when there is no open claims", () => {
      const foundClaim = getProjectPreviousClaims(state, "4").data;
      expect(foundClaim).toEqual([]);
    });
  });
});

describe("claims by partner", () => {
  describe("findClaimsByPartner", () => {

    const claims = {
      "partnerId=1": {
        data: [
          createClaim({ id: "p11", partnerId: "1" }),
          createClaim({ id: "p12", partnerId: "1" })
        ],
        error: undefined,
        status: 3
      },
      "partnerId=2": {
        data: [],
        error: undefined,
        status: 3
      }
    };

    const state = Object.assign({}, rootState);
    state.data = Object.assign({}, state.data, { claims });

    it("should return the claims for the queried partner", () => {
      const foundClaims = findClaimsByPartner("1").getPending(state).data;
      expect(foundClaims).toEqual(claims["partnerId=1"].data);
    });

    it("should return an empty array when there are no claims for the queried partner", () => {
      const foundClaims = findClaimsByPartner("2").getPending(state).data;
      expect(foundClaims).toEqual([]);
    });
  });
  describe("getCurrentClaim", () => {

    const openClaim = createClaim({
      id: "p11",
      partnerId: "3",
      isApproved: false
    });

    const claims = {
      "partnerId=3": {
        data: [
          openClaim,
          createClaim({ id: "p12", partnerId: "3", isApproved: true })
        ],
        error: undefined,
        status: 3
      },
      "partnerId=4": {
        data: [
          createClaim({ id: "p21", partnerId: "4", isApproved: true }),
          createClaim({ id: "p22", partnerId: "4", isApproved: true })
        ],
        error: undefined,
        status: 3
      }
    };

    const state = Object.assign({}, rootState);
    state.data = Object.assign({}, state.data, { claims });

    it("should return the open claim", () => {
      const foundClaim = getCurrentClaim(state, "3").data;
      expect(foundClaim).toEqual(openClaim);
    });
    it("should return null when there is no open claim", () => {
      const foundClaim = getCurrentClaim(state, "4").data;
      expect(foundClaim).toEqual(null);
    });
    it("should return null when the partner is not found", () => {
      const foundClaim = getCurrentClaim(state, "4").data;
      expect(foundClaim).toEqual(null);
    });
  });
  describe("getPreviousClaims", () => {

    const closedClaims = [
      createClaim({ id: "p11", partnerId: "3", isApproved: true }),
      createClaim({ id: "p12", partnerId: "3", isApproved: true })
    ];

    const claims = {
      "partnerId=3": {
        data: [
          ...closedClaims,
          createClaim({ id: "p12", partnerId: "3", isApproved: false })
        ],
        error: undefined,
        status: 3
      },
      "partnerId=4": {
        data: [
          createClaim({ id: "p21", partnerId: "4", isApproved: false }),
          createClaim({ id: "p22", partnerId: "4", isApproved: false })
        ],
        error: undefined,
        status: 3
      }
    };

    const state = Object.assign({}, rootState);
    state.data = Object.assign({}, state.data, { claims });

    it("should return the approved claims", () => {
      const foundClaim = getPreviousClaims(state, "3").data;
      expect(foundClaim).toEqual(closedClaims);
    });
    it("should return an empty array when no open claims are found", () => {
      const foundClaim = getPreviousClaims(state, "4").data;
      expect(foundClaim).toEqual([]);
    });
    it("should return an empty array when the partner is not found", () => {
      const foundClaim = getPreviousClaims(state, "4").data;
      expect(foundClaim).toEqual([]);
    });
  });
});
