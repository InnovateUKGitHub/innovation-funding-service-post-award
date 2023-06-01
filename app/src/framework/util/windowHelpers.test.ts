import { scrollToTheTopInstantly, scrollToTheTopSmoothly } from "./windowHelpers";

global.window.scrollTo = jest.fn();
describe("windowHelpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    (window.requestAnimationFrame as jest.Mock).mockRestore();
  });

  test("scrollToTheTopSmoothly", () => {
    scrollToTheTopSmoothly();
    expect(global.window.scrollTo).toBeCalledWith({ top: 0, behavior: "smooth" });
  });

  test("scrollToTheTopInstantly", () => {
    scrollToTheTopInstantly();
    expect(global.window.scrollTo).toBeCalledWith(0, 0);
  });
});
