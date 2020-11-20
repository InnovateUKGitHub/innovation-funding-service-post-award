// tslint:disable:no-duplicate-string
import React from "react";
// tslint:disable-next-line: import-blacklist
import { mount } from "enzyme";

import { NavigationArrows } from "../../src/ui/components";
import { createStore } from "redux";
import { rootReducer } from "../../src/ui/redux/reducers";
import { IClientUser, ProjectRole } from "@framework/types";
import { routeConfig } from "@ui/routing";
import TestBed from "@shared/TestBed";
import { IStores } from "@ui/redux/storesProvider";

const routes = routeConfig;

const store = createStore(rootReducer, {
  user: {
    email: "iuk.accproject@bjss.com.bjsspoc2",
    roleInfo: {
      a0C0Q000001tr5yUAA: {
        projectRoles: ProjectRole.MonitoringOfficer,
        partnerRoles: {},
      },
    },
    csrf: "CSFR",
  } as IClientUser,
}) as IStores;

const previousLink = {
  label: "Overheads",
  route: routes.reviewClaimLineItems.getLink({
    partnerId: "a0B0Q000001e3HdUAI",
    projectId: "a0C0Q000001tr5yUAA",
    periodId: 2,
    costCategoryId: "a060Q000000oAYZQA2",
  }),
};

const nextLink = {
  label: "Labour",
  route: routes.reviewClaimLineItems.getLink({
    partnerId: "a0B0Q000001e3HdUAI",
    projectId: "a0C0Q000001tr5yUAA",
    periodId: 2,
    costCategoryId: "a060Q000000oAYYQA2",
  }),
};

describe("NavigationArrows", () => {
  it("renders only the next arrow if no previous link is given", () => {
    const wrapper = mount(
      <TestBed stores={store}>
        <NavigationArrows previousLink={null} nextLink={nextLink} />
      </TestBed>
    );

    expect(wrapper.find("a").length).toEqual(1);
    expect(wrapper.find("a").find("span").at(0).text()).toEqual("Next");
    expect(wrapper.find("a").find("span").at(1).text()).toEqual(nextLink.label);
  });

  it("renders the previous and the next arrow", () => {
    const wrapper = mount(
      <TestBed stores={store}>
        <NavigationArrows previousLink={previousLink} nextLink={nextLink} />
      </TestBed>
    );

    expect(wrapper.find("a").length).toEqual(2);

    expect(wrapper.find("a").at(0).find("span").at(0).text()).toEqual(
      "Previous"
    );
    expect(wrapper.find("a").at(0).find("span").at(1).text()).toEqual(
      previousLink.label
    );

    expect(wrapper.find("a").at(1).find("span").at(0).text()).toEqual("Next");
    expect(wrapper.find("a").at(1).find("span").at(1).text()).toEqual(
      nextLink.label
    );
  });

  it("renders only the previous arrow if no next link is given", () => {
    const wrapper = mount(
      <TestBed stores={store}>
        <NavigationArrows previousLink={previousLink} nextLink={null} />
      </TestBed>
    );

    expect(wrapper.find("a").length).toEqual(1);
    expect(wrapper.find("a").find("span").at(0).text()).toEqual("Previous");
    expect(wrapper.find("a").find("span").at(1).text()).toEqual(
      previousLink.label
    );
  });

  it("renders no arrows if no links are given", () => {
    const wrapper = mount(
      <TestBed stores={store}>
        <NavigationArrows previousLink={null} nextLink={null} />
      </TestBed>
    );

    expect(wrapper.find("a").length).toEqual(0);
  });
});
