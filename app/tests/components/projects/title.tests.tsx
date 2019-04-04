import "jest";
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Title } from "../../../src/ui/components/projects";

Enzyme.configure({ adapter: new Adapter() });

describe("Title", () => {
  it("should render with the correct title", () => {
    const wrapper = mount(<Title pageTitle="page title" project={{projectNumber: "3", title: "project title"} as any}/>);

    expect(wrapper.text()).toEqual("3 : project titlepage title");
  });
});
