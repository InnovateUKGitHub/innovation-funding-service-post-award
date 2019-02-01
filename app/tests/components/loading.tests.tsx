import "jest";
import React from "react";
import Enzyme, { mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Loader, PageLoader } from "../../src/ui/components";
import { LoadingStatus } from "../../src/shared/pending";

Enzyme.configure({ adapter: new Adapter() });

describe("Loader", () => {
  test("Preload - Renders null", () => {
    const render = jest.fn();
    const pending = { state: LoadingStatus.Preload } as any;
    const wrapper = shallow(<Loader render={render} pending={pending} />);
    expect(wrapper.html()).toBeNull();
  });

  test("Done - calls render with data and false", () => {
    const render  = jest.fn();
    const data    = { test: 123 };
    const pending = { state: LoadingStatus.Done, data } as any;
    shallow(<Loader render={render} pending={pending} />);
    expect(render).toHaveBeenCalledWith(data, false);
  });

  test("Done - render returns string", () => {
    const render  = jest.fn(() => "testing");
    const data    = { test: 123 };
    const pending = { state: LoadingStatus.Done, data } as any;
    const wrapper = shallow(<Loader render={render} pending={pending} />);
    expect(render).toHaveBeenCalledWith(data, false);
    expect(wrapper.html()).toBe("<span>testing</span>");
  });

  test("Done - render returns array", () => {
    const results = ["testing1", "testing2"];
    const render  = jest.fn(() => results);
    const data    = { test: 123 };
    const pending = { state: LoadingStatus.Done, data } as any;
    const wrapper = shallow(<Loader render={render} pending={pending} />);
    expect(render).toHaveBeenCalledWith(data, false);
    expect(wrapper.html()).toBe(`<div>${results.join("")}</div>`);
  });

  test("Loading with data - calls render with data and true", () => {
    const render  = jest.fn();
    const data    = { test: 123 };
    const pending = { state: LoadingStatus.Loading, data } as any;
    shallow(<Loader render={render} pending={pending} />);
    expect(render).toHaveBeenCalledWith(data, true);
  });

  test("Loading without data - renders default loading message", () => {
    const render  = jest.fn();
    const pending = { state: LoadingStatus.Loading } as any;
    const wrapper = shallow(<Loader render={render} pending={pending} />);
    expect(wrapper.text()).toBe("Loading....");
    expect(render).not.toHaveBeenCalled();
  });

  test("Loading without data, with renderLoading override - calls given renderLoading", () => {
    const render  = jest.fn();
    const loading = jest.fn();
    const pending = { state: LoadingStatus.Loading } as any;
    shallow(<Loader render={render} pending={pending} renderLoading={loading} />);
    expect(loading).toHaveBeenCalled();
    expect(render).not.toHaveBeenCalled();
  });

  test("Stale with data - calls render with data and true", () => {
    const render  = jest.fn();
    const data    = { test: 123 };
    const pending = { state: LoadingStatus.Stale, data } as any;
    shallow(<Loader render={render} pending={pending} />);
    expect(render).toHaveBeenCalledWith(data, true);
  });

  test("Stale without data - renders default loading message", () => {
    const render  = jest.fn();
    const pending = { state: LoadingStatus.Stale } as any;
    const wrapper = shallow(<Loader render={render} pending={pending} />);
    expect(wrapper.text()).toBe("Loading....");
    expect(render).not.toHaveBeenCalled();
  });

  test("Stale without data, with renderLoading override - calls given renderLoading", () => {
    const render  = jest.fn();
    const loading = jest.fn();
    const pending = { state: LoadingStatus.Stale } as any;
    shallow(<Loader render={render} pending={pending} renderLoading={loading} />);
    expect(loading).toHaveBeenCalled();
    expect(render).not.toHaveBeenCalled();
  });

  test("Failed without error - renders null", () => {
    const render  = jest.fn();
    const pending = { state: LoadingStatus.Failed } as any;
    const wrapper = mount(<Loader render={render} pending={pending} />);
    expect(wrapper.html()).toBeNull();
    expect(render).not.toHaveBeenCalled();
  });

  test("Failed with error - renders ErrorSummary", () => {
    const render  = jest.fn();
    const pending = { state: LoadingStatus.Failed, error: true } as any;
    const wrapper = mount(<Loader render={render} pending={pending} />);
    expect(wrapper.html()).toContain("There is a problem");
    expect(render).not.toHaveBeenCalled();
  });

  test("Unknown - throws exception", () => {
    const render  = jest.fn();
    const pending = { state: "not a state" } as any;
    let error = null;
    try {
      shallow(<Loader render={render} pending={pending} />);
    }
    catch(e) {
      error = e;
    }
    expect(error).toBeInstanceOf(Error);
    expect(render).not.toHaveBeenCalled();
  });
});
