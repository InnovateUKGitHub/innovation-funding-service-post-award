import React from "react";
import { mount, shallow } from "enzyme";

import { Loader, LoadingProps } from "../../src/ui/components";
import { LoadingStatus } from "../../src/shared/pending";
import TestBed from "./helpers/TestBed";
import { findByQa } from "./helpers/find-by-qa";

describe("<Loader />", () => {
  const pendingPreload = { state: LoadingStatus.Preload } as any;
  const pendingDone = { state: LoadingStatus.Done } as any;
  const pendingLoading = { state: LoadingStatus.Loading } as any;
  const pendingStale = { state: LoadingStatus.Stale } as any;
  const pendingFailed = { state: LoadingStatus.Failed } as any;

  const stubContent = {
    components: {
      errorSummary: {
        errorTitle: {
          content: "stub-errorContent",
        },
        expiredMessageContent: {
          content: "stub-expiredMessageContent",
        },
        unsavedWarningContent: {
          content: "stub-unsavedWarningContent",
        },
        somethingGoneWrongContent: {
          content: "stub-somethingGoneWrongContent",
        },
      },
      loading: {
        message: {
          content: "stub-loading-message",
        },
      },
    },
  };

  const setup = (props: LoadingProps<{}>) => {
    const shallowWrapper = shallow(
      <TestBed content={stubContent as any}>
        <Loader {...props} />
      </TestBed>,
    );
    const mountWrapper = mount(
      <TestBed content={stubContent as any}>
        <Loader {...props} />
      </TestBed>,
    );

    const loadingMessageElement = findByQa(mountWrapper, "loading-message");

    return {
      shallowWrapper,
      mountWrapper,
      loadingMessageElement,
    };
  };

  test("Preload - renderFunctions null", () => {
    const renderFunction = jest.fn();
    const { mountWrapper } = setup({ render: renderFunction, pending: pendingPreload });
    expect(mountWrapper.html()).toBeNull();
  });

  test("Done - calls renderFunction with data and false", () => {
    const renderFunction = jest.fn(() => null);
    const data = { test: 123 };
    const pendingDoneWithData = { ...pendingDone, data };
    setup({ render: renderFunction, pending: pendingDoneWithData });
    expect(renderFunction).toHaveBeenCalledWith(data, false);
  });

  test("Done - renderFunction returns string", () => {
    const renderFunction = jest.fn(() => "testing");
    const data = { test: 123 };
    const pendingDoneWithData = { ...pendingDone, data };
    const { shallowWrapper } = setup({ render: renderFunction, pending: pendingDoneWithData });

    expect(renderFunction).toHaveBeenCalledWith(data, false);
    expect(shallowWrapper.html()).toBeDefined();
  });

  test("Done - renderFunction returns array", () => {
    const results = ["testing1", "testing2"];
    const renderFunction = jest.fn(() => results);
    const data = { test: 123 };
    const pendingDoneWithData = { ...pendingDone, data };
    const { shallowWrapper } = setup({ render: renderFunction, pending: pendingDoneWithData });
    expect(renderFunction).toHaveBeenCalledWith(data, false);
    expect(shallowWrapper.html()).toBeDefined();
  });

  test("Loading with data - calls renderFunction with data and true", () => {
    const renderFunction = jest.fn(() => null);
    const data = { test: 123 };
    const pendingLoadingWithData = { ...pendingLoading, data };
    setup({ render: renderFunction, pending: pendingLoadingWithData });
    expect(renderFunction).toHaveBeenCalledWith(data, true);
  });

  test("Loading without data - renderFunctions default loading message", () => {
    const callback = jest.fn();
    const { loadingMessageElement } = setup({ render: callback, pending: pendingLoading });

    expect(loadingMessageElement.text()).toBe(stubContent.components.loading.message.content);
    expect(callback).not.toHaveBeenCalled();
  });

  test("Loading without data, with renderFunctionLoading override - calls given renderFunctionLoading", () => {
    const renderFunction = jest.fn();
    const loading = jest.fn(() => null);
    setup({ render: renderFunction, pending: pendingLoading, renderLoading: loading });
    expect(loading).toHaveBeenCalled();
    expect(renderFunction).not.toHaveBeenCalled();
  });

  test("Stale with data - calls renderFunction with data and true", () => {
    const renderFunction = jest.fn(() => null);
    const data = { test: 123 };
    const pendingStaleWithData = { ...pendingStale, data };
    setup({ render: renderFunction, pending: pendingStaleWithData });
    expect(renderFunction).toHaveBeenCalledWith(data, true);
  });

  test("Stale without data - renderFunctions default loading message", () => {
    const renderFunction = jest.fn();
    const { mountWrapper } = setup({ render: renderFunction, pending: pendingStale });
    expect(mountWrapper.text()).toBe(stubContent.components.loading.message.content);
    expect(renderFunction).not.toHaveBeenCalled();
  });

  test("Stale without data, with renderFunctionLoading override - calls given renderFunctionLoading", () => {
    const renderFunction = jest.fn();
    const loading = jest.fn(() => null);
    setup({ render: renderFunction, pending: pendingStale, renderLoading: loading });
    expect(loading).toHaveBeenCalled();
    expect(renderFunction).not.toHaveBeenCalled();
  });

  test("Failed without error - renderFunctions null", () => {
    const renderFunction = jest.fn();
    const { mountWrapper } = setup({ render: renderFunction, pending: pendingFailed });
    expect(mountWrapper.html()).toBeNull();
    expect(renderFunction).not.toHaveBeenCalled();
  });

  test("Failed with error - renderFunctions ErrorSummary", () => {
    const renderFunction = jest.fn();
    const error = true;
    const pendingWithError = { ...pendingFailed, error };
    const { mountWrapper } = setup({ render: renderFunction, pending: pendingWithError });
    expect(mountWrapper.html()).toBeDefined();
    expect(renderFunction).not.toHaveBeenCalled();
  });

  // TODO: This test needs a refactor and does not require a <TestBed>
  test("Unknown - throws exception", () => {
    const renderFunction = jest.fn();
    const pending = { state: "not a state" } as any;
    let error = null;
    try {
      shallow(<Loader render={renderFunction} pending={pending} />);
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(Error);
    expect(renderFunction).not.toHaveBeenCalled();
  });
});
