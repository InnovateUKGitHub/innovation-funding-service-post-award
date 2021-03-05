import { render } from "@testing-library/react";

import { GdsHeadingClasses, GdsHeadingTypes } from "@ui/components/typography/Heading";
import * as variantModule from "@ui/components/typography/Heading.variants";

describe("Heading variants", () => {
  const expectVariants: Record<GdsHeadingTypes, GdsHeadingClasses> = {
    h1: "govuk-heading-xl",
    h2: "govuk-heading-l",
    h3: "govuk-heading-m",
    h4: "govuk-heading-s",
  };

  const headingVariants = Object.keys(expectVariants) as GdsHeadingTypes[];

  test("returns with correct variant total count", () => {
    /*
     * Note: A sneaky test... "headingVariants" should contain all variants
     *
     * Typescript will throw an error if the contract is not valid between type and array.
     * We can assume that the string has the correct total of variants, so we just need to check the total
     */

    expect(headingVariants).toHaveLength(4);
  });

  describe("@renders", () => {
    test.each(headingVariants)("with %s", variantKey => {
      // Note: variant ("h1") => uppercase ("H1") => and cast as module for object look-up
      const moduleKey = variantKey.toUpperCase() as Uppercase<typeof variantKey>;
      const Variant = variantModule[moduleKey];

      if (!Variant) {
        throw Error(`No component was found using "${moduleKey}" in "Heading.variants".`);
      }

      const { container } = render(<Variant>Look ma! I'm a Variant!</Variant>);

      const expectedElement = container.querySelector(Variant.name);

      expect(expectedElement).toBeInTheDocument();
      expect(expectedElement).toHaveClass(expectVariants[variantKey]);
    });
  });
});
