import React from "react";
import Enzyme from "enzyme";

import { LinksList } from "../../src/ui/components/linksList";

describe("Links Lists", () => {
  it("should render a react fragment", () => {
    const links   = [] as any[];
    const result  = <LinksList links={links} />;
    const wrapper = Enzyme.shallow(result);
    expect(wrapper.getElement()).toMatchObject(<React.Fragment />);
  });

  it("should render given link", () => {
    const links   = [{ url: "test1", text: "testtext1" }];
    const result  = <LinksList links={links} />;
    const wrapper = Enzyme.shallow(result);
    expect(wrapper.contains(<a target="" href="test1" className="govuk-link govuk-!-font-size-19">testtext1</a>)).toBe(true);
  });

  it("should render given 3 links", () => {
    const links   = [
      { url: "test1", text: "testtext1" },
      { url: "test2", text: "testtext2" },
      { url: "test3", text: "testtext3" },
    ];
    const result  = <LinksList links={links} />;
    const wrapper = Enzyme.shallow(result);
    expect(wrapper.contains(<a target="" href="test1" className="govuk-link govuk-!-font-size-19">testtext1</a>)).toBe(true);
    expect(wrapper.contains(<a target="" href="test2" className="govuk-link govuk-!-font-size-19">testtext2</a>)).toBe(true);
    expect(wrapper.contains(<a target="" href="test3" className="govuk-link govuk-!-font-size-19">testtext3</a>)).toBe(true);
  });

  it("should not error for null props", () => {
    const links   = null as any;
    const result  = <LinksList links={links} />;
    const wrapper = Enzyme.shallow(result);
    expect(wrapper.getElement()).toMatchObject(<React.Fragment />);
  });

  it("should not error for object props", () => {
    const links   = {} as any;
    const result  = <LinksList links={links} />;
    const wrapper = Enzyme.shallow(result);
    expect(wrapper.getElement()).toMatchObject(<React.Fragment />);
  });

});
