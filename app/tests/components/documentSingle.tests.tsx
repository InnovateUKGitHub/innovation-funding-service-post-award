import "jest";
import React from "react";
import { DocumentSingle } from "../../src/ui/components";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { mount, shallow } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("DocumentSingle", () => {
    it("should render LABOUR_COSTS_Q3_2017-11-05.pdf text as  https://www.google.com/ link ", () => {
        const document = { link: "https://www.google.com/", fileName: "LABOUR_COSTS_Q3_2017-11-05.pdf", id: "1" };
        const wrapper = shallow(<DocumentSingle message={"test"} document={document} qa={"qa"} />);
        expect(wrapper.find("a").get(0).props.href).toBe("https://www.google.com/");
        expect(wrapper.find("a").props().children).toBe("LABOUR_COSTS_Q3_2017-11-05.pdf");
    });

    it("should render a An IAR has been added to this claim section heading", () => {
        const document = { link: "https://www.google.com/", fileName: "LABOUR_COSTS_Q3_2017-11-05.pdf", id: "1" };
        const wrapper = mount(<DocumentSingle message={"An IAR has been added to this claim"} document={document} qa={"qa"} />);
        expect(wrapper.find("p").props().children).toBe("An IAR has been added to this claim");
    });
});
