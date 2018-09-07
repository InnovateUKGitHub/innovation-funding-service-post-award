import "jest";
import React from "react";
import { Details } from "../../src/ui/components/details";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("Details", () => {
  describe("forData", () => {
    describe("DetailsComponent", () => {
      it("renders react fragment with no children", () => {
        const DTest   = Details.forData({});
        const result  = <DTest.Details />;
        const wrapper = shallow(result);
        expect(wrapper.getElement()).toMatchObject(<React.Fragment />);
      });

      it("renders children in wrapper div", () => {
        const DTest   = Details.forData({});
        const result  = <DTest.Details>testing</DTest.Details>;
        const wrapper = shallow(result);
        expect(wrapper.contains(<div className="govuk-grid-row govuk-!-margin-top-4" key={`details-row-1`}>testing</div>)).toBeTruthy();
      });

      it("renders given children", () => {
        const DTest   = Details.forData({});
        const result  = <DTest.Details><span>t1</span><span>t2</span></DTest.Details>;
        const wrapper = shallow(result);
        expect(wrapper.contains(<span>t1</span>)).toBeTruthy();
        expect(wrapper.contains(<span>t2</span>)).toBeTruthy();
      });
    });

    describe("DetailsString", () => {
      it("should render a simpleString", () => {
        const DTest   = Details.forData({});
        const result  = <DTest.String label="Test Label" value={() => "123"} />;
        const wrapper = shallow(result);
        expect(wrapper.contains(<p className="govuk-body">123</p>)).toBeTruthy();
      });
    });
  });
});
