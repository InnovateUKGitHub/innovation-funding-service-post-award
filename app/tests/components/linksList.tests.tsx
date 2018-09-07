import "jest";
import React from "react";
import Enzyme, { mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { LinksList } from "../../src/ui/components";

Enzyme.configure({ adapter: new Adapter() });

describe("Links Lists", () => {
  it("should render a react fragment", () => {
    const links   = [];
    const result  = <LinksList links={links} />;
    const wrapper = shallow(result);
    expect(wrapper.getElement()).toMatchObject(<React.Fragment />);
  });

  it("should render given link", () => {
    const links   = [{ url: "test1", text: "testtext1" }];
    const result  = <LinksList links={links} />;
    const wrapper = shallow(result);
    expect(wrapper.contains(<a href="test1" className="govuk-link govuk-!-font-size-19">testtext1</a>)).toBeTruthy();
  });

  it("should render given 3 links", () => {
    const links   = [
      { url: "test1", text: "testtext1" },
      { url: "test2", text: "testtext2" },
      { url: "test3", text: "testtext3" },
    ];
    const result  = <LinksList links={links} />;
    const wrapper = shallow(result);
    expect(wrapper.contains(<a href="test1" className="govuk-link govuk-!-font-size-19">testtext1</a>)).toBeTruthy();
    expect(wrapper.contains(<a href="test2" className="govuk-link govuk-!-font-size-19">testtext2</a>)).toBeTruthy();
    expect(wrapper.contains(<a href="test3" className="govuk-link govuk-!-font-size-19">testtext3</a>)).toBeTruthy();
  });

  it("should not error for null props", () => {
    const links   = null;
    const result  = <LinksList links={links} />;
    const wrapper = shallow(result);
    expect(wrapper.getElement()).toMatchObject(<React.Fragment />);
  });

  it("should not error for object props", () => {
    const links   = {} as any;
    const result  = <LinksList links={links} />;
    const wrapper = shallow(result);
    expect(wrapper.getElement()).toMatchObject(<React.Fragment />);
  });

});
