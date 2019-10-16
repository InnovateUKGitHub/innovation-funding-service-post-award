// tslint:disable:no-duplicate-string
import "jest";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, {mount, shallow} from "enzyme";
import {ClaimPeriodDate} from "../../../src/ui/components/claims/claimPeriodDate";

Enzyme.configure({ adapter: new Adapter() });

const startDate = new Date("1993/01/07 09:02:01");
const endDate = new Date("1993/01/07 09:02:01");
const claim = {
  periodStartDate: startDate,
  periodEndDate: endDate,
  periodId: 1
};

const partner = {
  name: "Test partner"
};

describe("ClaimPeriodDate", () => {
  it("should render as null if no claim is given", () => {
    const wrapper = mount(<ClaimPeriodDate claim={null} />);
    expect(wrapper.html()).toBeNull();
  });

  it("should render period range without partner name if only claim is given", () => {
    const wrapper = shallow(<ClaimPeriodDate claim={claim as any} />).render();
    expect(wrapper.text()).toEqual("Period 1: 7 Jan to 7 Jan 1993");
  });

  it("should render period range with partner name", () => {
    const wrapper = shallow(<ClaimPeriodDate claim={claim as any} partner={partner as any}/>).render();
    expect(wrapper.text()).toEqual("Test partner claim for period 1: 7 Jan to 7 Jan 1993");
  });
});
