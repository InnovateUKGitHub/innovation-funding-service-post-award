import "jest";
import React from "react";
import { Email } from "../../../src/components/layout/email";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { shallow } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("Email", () => {
   it("should render tedtester@example.com as a mail link", () => {
       const email = "tedtester@email.com";
       const wrapper = shallow(<Email value={email} />);
       const expectedRender =  <a href="mailto:tedtester@example.com" className="govuk-link govuk-!-font-size-19">tedtester@example.com</a>;
       expect(wrapper.equals(expectedRender));
   });

   it("should render an empty link", () => {
       const wrapper = shallow(<Email value="" />);
       const expectedRender =  <a href="" className="govuk-link govuk-!-font-size-19" />;
       expect(wrapper.equals(expectedRender));
   });
});
