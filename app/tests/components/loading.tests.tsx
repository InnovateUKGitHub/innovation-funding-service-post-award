import React from "react";
import { mount, render, shallow } from "enzyme";

import { Loader } from "../../src/ui/components";
import { LoadingStatus } from "../../src/shared/pending";

describe("Loader", () => {
  test("Preload - renderFunctions null", () => {
    const renderFunction = jest.fn();
    const pending = { state: LoadingStatus.Preload } as any;
    const wrapper = shallow(<Loader render={renderFunction} pending={pending} />);
    expect(wrapper.html()).toBeNull();
  });

  test("Done - calls renderFunction with data and false", () => {
    const renderFunction  = jest.fn();
    const data    = { test: 123 };
    const pending = { state: LoadingStatus.Done, data } as any;
    shallow(<Loader render={renderFunction} pending={pending} />);
    expect(renderFunction).toHaveBeenCalledWith(data, false);
  });

  test("Done - renderFunction returns string", () => {
    const renderFunction  = jest.fn(() => "testing");
    const data    = { test: 123 };
    const pending = { state: LoadingStatus.Done, data } as any;
    const wrapper = shallow(<Loader render={renderFunction} pending={pending} />);
    expect(renderFunction).toHaveBeenCalledWith(data, false);
    expect(wrapper.html()).toBe("<span>testing</span>");
  });

  test("Done - renderFunction returns array", () => {
    const results = ["testing1", "testing2"];
    const renderFunction  = jest.fn(() => results);
    const data    = { test: 123 };
    const pending = { state: LoadingStatus.Done, data } as any;
    const wrapper = shallow(<Loader render={renderFunction} pending={pending} />);
    expect(renderFunction).toHaveBeenCalledWith(data, false);
    expect(wrapper.html()).toBe(`<div>${results.join("")}</div>`);
  });

  test("Loading with data - calls renderFunction with data and true", () => {
    const renderFunction  = jest.fn();
    const data    = { test: 123 };
    const pending = { state: LoadingStatus.Loading, data } as any;
    shallow(<Loader render={renderFunction} pending={pending} />);
    expect(renderFunction).toHaveBeenCalledWith(data, true);
  });

  test("Loading without data - renderFunctions default loading message", () => {
    const callback  = jest.fn();
    const pending = { state: LoadingStatus.Loading } as any;
    const wrapper = render(<Loader render={callback} pending={pending} />);
    expect(wrapper.text()).toBe("Loading...");
    expect(callback).not.toHaveBeenCalled();
  });

  test("Loading without data, with renderFunctionLoading override - calls given renderFunctionLoading", () => {
    const renderFunction  = jest.fn();
    const loading = jest.fn();
    const pending = { state: LoadingStatus.Loading } as any;
    shallow(<Loader render={renderFunction} pending={pending} renderLoading={loading} />);
    expect(loading).toHaveBeenCalled();
    expect(renderFunction).not.toHaveBeenCalled();
  });

  test("Stale with data - calls renderFunction with data and true", () => {
    const renderFunction  = jest.fn();
    const data    = { test: 123 };
    const pending = { state: LoadingStatus.Stale, data } as any;
    shallow(<Loader render={renderFunction} pending={pending} />);
    expect(renderFunction).toHaveBeenCalledWith(data, true);
  });

  test("Stale without data - renderFunctions default loading message", () => {
    const renderFunction  = jest.fn();
    const pending = { state: LoadingStatus.Stale } as any;
    const wrapper = render(<Loader render={renderFunction} pending={pending} />);
    expect(wrapper.text()).toBe("Loading...");
    expect(renderFunction).not.toHaveBeenCalled();
  });

  test("Stale without data, with renderFunctionLoading override - calls given renderFunctionLoading", () => {
    const renderFunction  = jest.fn();
    const loading = jest.fn();
    const pending = { state: LoadingStatus.Stale } as any;
    shallow(<Loader render={renderFunction} pending={pending} renderLoading={loading} />);
    expect(loading).toHaveBeenCalled();
    expect(renderFunction).not.toHaveBeenCalled();
  });

  test("Failed without error - renderFunctions null", () => {
    const renderFunction  = jest.fn();
    const pending = { state: LoadingStatus.Failed } as any;
    const wrapper = mount(<Loader render={renderFunction} pending={pending} />);
    expect(wrapper.html()).toBeNull();
    expect(renderFunction).not.toHaveBeenCalled();
  });

  test("Failed with error - renderFunctions ErrorSummary", () => {
    const renderFunction  = jest.fn();
    const pending = { state: LoadingStatus.Failed, error: true } as any;
    const wrapper = mount(<Loader render={renderFunction} pending={pending} />);
    expect(wrapper.html()).toContain("There is a problem");
    expect(renderFunction).not.toHaveBeenCalled();
  });

  test("Unknown - throws exception", () => {
    const renderFunction  = jest.fn();
    const pending = { state: "not a state" } as any;
    let error = null;
    try {
      shallow(<Loader render={renderFunction} pending={pending} />);
    }
    catch(e) {
      error = e;
    }
    expect(error).toBeInstanceOf(Error);
    expect(renderFunction).not.toHaveBeenCalled();
  });
});
