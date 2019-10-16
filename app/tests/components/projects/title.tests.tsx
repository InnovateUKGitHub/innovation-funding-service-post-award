import "jest";
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Title } from "../../../src/ui/components/projects/title";
import { IStores, StoresProvider } from "@ui/redux";
import { ProjectDto } from "@framework/dtos";

Enzyme.configure({ adapter: new Adapter() });

describe("Title", () => {
  it("should render with the correct title", () => {
    const stores: IStores = {
      navigation: {
        getPageTitle: () => ({displayTitle: "", htmlTitle: ""})
      }
    } as IStores;

    const project: Partial<ProjectDto> = {
      projectNumber: "3",
      title: "project title"
    };

    const result = <StoresProvider value={stores}><Title project={project as ProjectDto} /></StoresProvider>;
    const wrapper = mount(result);

    expect(wrapper.text()).toContain("3 : project title");
  });
});
