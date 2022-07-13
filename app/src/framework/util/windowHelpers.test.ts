import {scrollToTheTopInstantly, scrollToTheTopSmoothly} from "./windowHelpers";

global.window.scrollTo = jest.fn();
describe("windowHelpers", () => {
  beforeEach(jest.clearAllMocks);

  test("scrollToTheTopSmoothly", () => {
    scrollToTheTopSmoothly();
    expect(global.window.scrollTo).toBeCalledWith({ top: 0, behavior: "smooth"});
  });


  test("scrollToTheTopInstantly", () => {
    scrollToTheTopInstantly();
    expect(global.window.scrollTo).toBeCalledWith(0,0);
  });
});
