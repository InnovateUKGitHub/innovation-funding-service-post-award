import { render } from "@testing-library/react";
import WithScrollToTopOnPropChange from "./scroll-to-top-on-prop-change";
import * as windowHelpers from "@framework/util/windowHelpers";

describe("WithScrollToTopOnPropChange", () => {
  jest.spyOn(windowHelpers, "scrollToTheTopSmoothly").mockImplementation();
  const Child = () => <h1>child</h1>;
  it("should call the scroll function when the prop changes", () => {
    let prop = "step-one";
    const { rerender } = render(
      <WithScrollToTopOnPropChange propToScrollOn={prop}>
        <Child />
      </WithScrollToTopOnPropChange>,
    );

    expect(windowHelpers.scrollToTheTopSmoothly).toHaveBeenCalledTimes(1);

    rerender(
      <WithScrollToTopOnPropChange propToScrollOn={prop}>
        <Child />
      </WithScrollToTopOnPropChange>,
    );
    expect(windowHelpers.scrollToTheTopSmoothly).toHaveBeenCalledTimes(1);

    prop = "step-two";

    rerender(
      <WithScrollToTopOnPropChange propToScrollOn={prop}>
        <Child />
      </WithScrollToTopOnPropChange>,
    );
    expect(windowHelpers.scrollToTheTopSmoothly).toHaveBeenCalledTimes(2);
  });
});
