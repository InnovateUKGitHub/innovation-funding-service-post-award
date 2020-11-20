import React from "react";
import {
  Breadcrumbs,
  BreadcrumbsProps,
} from "../../../src/ui/components/layout/breadcrumbs";
// tslint:disable-next-line: import-blacklist
import { mount } from "enzyme";

import { findByQa } from "../helpers/find-by-qa";
import TestBed from "@shared/TestBed";

describe("Breadcrumbs", () => {
  const testID = 5;

  const linkStubs: BreadcrumbsProps["links"] = [
    { routeName: "home", text: "Home", routeParams: {} },
    { routeName: "contacts", text: "Contacts", routeParams: {} },
    {
      routeName: "contact_details",
      text: `Contact ${testID}`,
      routeParams: { id: testID },
    },
  ];

  const defaultProps = {
    children: "test",
    links: [],
  };

  const setup = (props?: Partial<BreadcrumbsProps>) => {
    return mount(<TestBed><Breadcrumbs {...defaultProps} {...props} /></TestBed>);
  };

  it("tests the three breadcrumbs", () => {
    const wrapper = setup({ links: linkStubs });
    linkStubs.forEach((link, i) => {
      // Note: using at due to router link HOC
      const target = findByQa(wrapper, "breadcrumb-item")
        .at(i)
        .find("a")
        .text();
      expect(target).toBe(link.text);
    });
  });

  it("should only render current page breadcrumb navigation", () => {
    const wrapper = setup();
    const target = findByQa(wrapper, "breadcrumb-current-item");

    expect(target.text()).toBe(defaultProps.children);
  });
});
