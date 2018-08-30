import "jest";
import React from "react";
import { Email } from "../../../src/components/renderers";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { shallow } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("Email", () => {
   it("when valid should render tedtester@example.com as a mail link", () => {
       const email = "tedtester@email.com";
       const wrapper = shallow(<Email value={email} />);
       expect(wrapper.find("a").get(0).props.href).toBe("mailto:" + email);
       expect(wrapper.text()).toBe(email);
   });

   it("when empty should render null", () => {
       const wrapper = shallow(<Email value="" />);
       expect(wrapper.html()).toBeNull();
   });
});
