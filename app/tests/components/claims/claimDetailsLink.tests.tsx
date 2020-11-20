// tslint:disable:no-duplicate-string
import React from "react";

// tslint:disable-next-line: import-blacklist
import { mount } from "enzyme";
import { ProjectRole } from "@framework/dtos";
import { ClaimStatus } from "@framework/constants";
import { createStore } from "redux";
import { rootReducer } from "../../../src/ui/redux/reducers";
import { IClientUser } from "@framework/types";
import { routeConfig } from "@ui/routing/routeConfig";
import { ClaimDetailsLink } from "@ui/components/claims/claimDetailsLink";
import { TestBed } from "@shared/TestBed";
import { IStores } from "@ui/redux";

const routes = routeConfig;

const partnerId = "a0B0Q000001eWRHUA2";
const projectId = "a0C0Q000001uK5VUAU";
const claimId = "a050Q00000206gHQAQ";

const store = createStore(rootReducer, { user: {
  email: "iuk.accproject@bjss.com.bjsspoc2",
  roleInfo: {
    a0C0Q000001uK5VUAU: {
      projectRoles: 7,
      partnerRoles: {
        a0B0Q000001eWRHUA2: 7,
      },
    },
  },
  csrf: "CSFR",
} as IClientUser}) as IStores;

describe("ClaimDetailsLink", () => {
  describe("as a monitoring officer", () => {
    it("should render a Review Claim link when claim is submitted", () => {
      const wrapper = mount(
        <TestBed>
          <ClaimDetailsLink
            claim={
              { id: claimId, periodId: 3, status: ClaimStatus.SUBMITTED } as any
            }
            project={
              { id: projectId, roles: ProjectRole.MonitoringOfficer } as any
            }
            partner={{ id: partnerId } as any}
            routes={routes}
          />
        </TestBed>
      );
      expect(wrapper.text()).toEqual("Review claim");
    });
  });

  describe("as an unknown role", () => {
    it("should render a View Claim link when claim is MO Queried", () => {
      const wrapper = mount(
        <TestBed stores={store}>
          <ClaimDetailsLink
            claim={
              {
                id: claimId,
                periodId: 3,
                status: ClaimStatus.MO_QUERIED,
              } as any
            }
            project={{ id: projectId } as any}
            partner={{ id: partnerId, roles: ProjectRole.Unknown } as any}
            routes={routes}
          />
        </TestBed>
      );
      expect(wrapper.text()).toEqual("View claim");
    });

    it("should render a View Claim link when claim is Innovate Queried", () => {
      const wrapper = mount(
        <TestBed stores={store}>
          <ClaimDetailsLink
            claim={
              {
                id: claimId,
                periodId: 3,
                status: ClaimStatus.INNOVATE_QUERIED,
              } as any
            }
            project={{ id: projectId } as any}
            partner={{ id: partnerId, roles: ProjectRole.Unknown } as any}
            routes={routes}
          />
        </TestBed>
      );
      expect(wrapper.text()).toEqual("View claim");
    });
  });

  describe("as a financial contact", () => {
    it("should render an Edit Claim link when claim is MO Queried", () => {
      const wrapper = mount(
        <TestBed stores={store}>
          <ClaimDetailsLink
            claim={
              {
                id: claimId,
                periodId: 3,
                status: ClaimStatus.MO_QUERIED,
              } as any
            }
            project={{ id: projectId } as any}
            partner={
              { id: partnerId, roles: ProjectRole.FinancialContact } as any
            }
            routes={routes}
          />
        </TestBed>
      );
      expect(wrapper.text()).toEqual("Edit claim");
    });

    it("should render an Edit Claim link when claim is Innovate Queried", () => {
      const wrapper = mount(
        <TestBed stores={store}>
          <ClaimDetailsLink
            claim={
              {
                id: claimId,
                periodId: 3,
                status: ClaimStatus.INNOVATE_QUERIED,
              } as any
            }
            project={{ id: projectId } as any}
            partner={
              { id: partnerId, roles: ProjectRole.FinancialContact } as any
            }
            routes={routes}
          />
        </TestBed>
      );
      expect(wrapper.text()).toEqual("Edit claim");
    });

    it("should render an Edit Claim link when claim is in draft", () => {
      const wrapper = mount(
        <TestBed stores={store}>
          <ClaimDetailsLink
            claim={
              { id: claimId, periodId: 3, status: ClaimStatus.DRAFT } as any
            }
            project={{ id: projectId } as any}
            partner={
              { id: partnerId, roles: ProjectRole.FinancialContact } as any
            }
            routes={routes}
          />
        </TestBed>
      );
      expect(wrapper.text()).toEqual("Edit claim");
    });
  });

  it("should render a View Claim link by default", () => {
    const wrapper = mount(
      <TestBed stores={store}>
        <ClaimDetailsLink
          claim={{ id: claimId, periodId: 3 } as any}
          project={{ id: projectId } as any}
          partner={{ id: partnerId } as any}
          routes={routes}
        />
      </TestBed>
    );
    expect(wrapper.text()).toEqual("View claim");
  });

  it("should render null if partner is someone other than a finance contact, and claim is in draft", () => {
    const wrapper = mount(
      <TestBed stores={store}>
        <ClaimDetailsLink
          claim={{ id: claimId, periodId: 3, status: ClaimStatus.DRAFT } as any}
          project={{ id: projectId } as any}
          partner={{ id: partnerId } as any}
          routes={routes}
        />
      </TestBed>
    );
    expect(wrapper.html()).toEqual(null);
  });
});
