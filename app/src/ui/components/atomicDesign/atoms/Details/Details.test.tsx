import { render } from "@testing-library/react";
import { MountedProvider } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";

import { Info } from "./Details";

describe("<Info />", () => {
  describe("@renders", () => {
    test("with string contents", () => {
      const { container } = render(
        <MountedProvider>
          <Info summary="Slimming World">Did you know that apples are mostly red?</Info>
        </MountedProvider>,
      );

      expect(container).toMatchSnapshot();
    });

    test("with ReactNode contents", () => {
      const { container } = render(
        <MountedProvider>
          <Info
            summary={
              <>
                Slimming <b>world</b>
              </>
            }
          >
            <h1>Sus Individuals</h1>
            <ul>
              <li>Red</li>
              <li>Orange</li>
            </ul>
          </Info>
        </MountedProvider>,
      );

      expect(container).toMatchSnapshot();
    });
  });
});
