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
    expect(global.window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  test("scrollToTheTopInstantly", () => {
    scrollToTheTopInstantly();
    expect(global.window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
