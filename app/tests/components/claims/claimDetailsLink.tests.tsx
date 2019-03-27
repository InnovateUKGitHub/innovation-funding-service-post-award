// tslint:disable:no-duplicate-string
import "jest";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { mount } from "enzyme";
import { ClaimDetailsLink } from "../../../src/ui/components/claims";
import { ProjectRole } from "../../../src/types/dtos";
import { ClaimStatus } from "../../../src/types/constants";
import { createRouter } from "router5";
import browserPluginFactory from "router5/plugins/browser";
import { createStore } from "redux";
import { rootReducer } from "../../../src/ui/redux/reducers";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router5";
import { IClientUser } from "../../../src/types";

Enzyme.configure({ adapter: new Adapter() });

const route = {routeName: "test", routeParams: { id : "exampleId"}, accessControl: () => true};
const router = createRouter([{name: route.routeName, path: "/test/:id" }]).usePlugin(browserPluginFactory({ useHash: false }));

const partnerId = "a0B0Q000001eWRHUA2";
const projectId = "a0C0Q000001uK5VUAU";
const claimId = "a050Q00000206gHQAQ";

const preloadedState: IClientUser = {
  email: "iuk.accproject@bjss.com.bjsspoc2",
  roleInfo: {
    a0C0Q000001uK5VUAU: {
      projectRoles: 7,
      partnerRoles: {
        a0B0Q000001eWRHUA2: 7
      }
    }
  }
};

describe("ClaimDetailsLink", () => {
  describe("as a monitoring officer", () => {
    it("should render a Review Claim link when claim is submitted", () => {
      const wrapper = mount(
        <Provider store={createStore(rootReducer, {user: preloadedState})}>
          <RouterProvider router={router}>
            <ClaimDetailsLink claim={{id: claimId, periodId: 3, status: ClaimStatus.SUBMITTED} as any} project={{id: projectId, roles: ProjectRole.MonitoringOfficer} as any} partner={{id: partnerId} as any}/>
          </RouterProvider>
        </Provider>
      );
      expect(wrapper.text()).toEqual("Review claim");
    });
  });

  describe("as an unknown role", () => {
    it("should render a View Claim link when claim is MO Queried", () => {
      const wrapper = mount(
        <Provider store={createStore(rootReducer, {user: preloadedState})}>
          <RouterProvider router={router}>
            <ClaimDetailsLink claim={{id: claimId, periodId: 3, status: ClaimStatus.MO_QUERIED} as any} project={{id: projectId} as any} partner={{id: partnerId, roles: ProjectRole.Unknown} as any}/>
          </RouterProvider>
        </Provider>
      );
      expect(wrapper.text()).toEqual("View claim");
    });

    it("should render a View Claim link when claim is Innovate Queried", () => {
      const wrapper = mount(
        <Provider store={createStore(rootReducer, {user: preloadedState})}>
          <RouterProvider router={router}>
            <ClaimDetailsLink claim={{id: claimId, periodId: 3, status: ClaimStatus.INNOVATE_QUERIED} as any} project={{id: projectId} as any} partner={{id: partnerId, roles: ProjectRole.Unknown} as any}/>
          </RouterProvider>
        </Provider>
      );
      expect(wrapper.text()).toEqual("View claim");
    });
  });

  describe("as a financial contact", () => {
    it("should render an Edit Claim link when claim is MO Queried", () => {
      const wrapper = mount(
        <Provider store={createStore(rootReducer, {user: preloadedState})}>
          <RouterProvider router={router}>
            <ClaimDetailsLink claim={{id: claimId, periodId: 3, status: ClaimStatus.MO_QUERIED} as any} project={{id: projectId} as any} partner={{id: partnerId, roles: ProjectRole.FinancialContact} as any}/>
          </RouterProvider>
        </Provider>
      );
      expect(wrapper.text()).toEqual("Edit claim");
    });

    it("should render an Edit Claim link when claim is Innovate Queried", () => {
      const wrapper = mount(
        <Provider store={createStore(rootReducer, {user: preloadedState})}>
          <RouterProvider router={router}>
            <ClaimDetailsLink claim={{id: claimId, periodId: 3, status: ClaimStatus.INNOVATE_QUERIED} as any} project={{id: projectId} as any} partner={{id: partnerId, roles: ProjectRole.FinancialContact} as any}/>
          </RouterProvider>
        </Provider>
      );
      expect(wrapper.text()).toEqual("Edit claim");
    });

    it("should render an Edit Claim link when claim is in draft", () => {
      const wrapper = mount(
        <Provider store={createStore(rootReducer, {user: preloadedState})}>
          <RouterProvider router={router}>
            <ClaimDetailsLink claim={{id: claimId, periodId: 3, status: ClaimStatus.DRAFT} as any} project={{id: projectId} as any} partner={{id: partnerId, roles: ProjectRole.FinancialContact} as any}/>
          </RouterProvider>
        </Provider>
      );
      expect(wrapper.text()).toEqual("Edit claim");
    });
  });

  it("should render a View Claim link by default", () => {
    const wrapper = mount(
      <Provider store={createStore(rootReducer, {user: preloadedState})}>
        <RouterProvider router={router}>
          <ClaimDetailsLink claim={{id: claimId, periodId: 3} as any} project={{id: projectId} as any} partner={{id: partnerId} as any}/>
        </RouterProvider>
      </Provider>
    );
    expect(wrapper.text()).toEqual("View claim");
  });

  it("should render null if partner is someone other than a finance contact, and claim is in draft", () => {
    const wrapper = mount(
      <Provider store={createStore(rootReducer, {user: preloadedState})}>
        <RouterProvider router={router}>
          <ClaimDetailsLink claim={{id: claimId, periodId: 3, status: ClaimStatus.DRAFT} as any} project={{id: projectId} as any} partner={{id: partnerId} as any}/>
        </RouterProvider>
      </Provider>
    );
    expect(wrapper.html()).toEqual(null);
  });
});
