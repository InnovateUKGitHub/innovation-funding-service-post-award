import { render } from "@testing-library/react";

import { gdsHeadingClasses, GdsHeadingTypes } from "@ui/components/typography/Heading";
import * as variantModule from "@ui/components/typography/Heading.variants";

describe("Heading variants", () => {
  const headingVariants = Object.keys(gdsHeadingClasses) as GdsHeadingTypes[];

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
    const testVariants = test.each(headingVariants);

    testVariants("with %s", variantKey => {
      // Note: variant ("h1") => uppercase ("H1") => and cast as module for object look-up
      const moduleKey = variantKey.toUpperCase() as Uppercase<typeof variantKey>;
      const Variant = variantModule[moduleKey];

      if (!Variant) {
        throw Error(`No component was found using "${moduleKey}" in "Heading.variants".`);
      }

      const { container } = render(<Variant>Look ma! I'm a Variant!</Variant>);

      const expectedElement = container.querySelector(Variant.name.toLowerCase());

      expect(expectedElement).toBeInTheDocument();
      expect(expectedElement).toHaveClass(gdsHeadingClasses[variantKey]);
    });

    describe("when rendered 'as' another element", () => {
      testVariants("with %s", variantKey => {
        const moduleKey = variantKey.toUpperCase() as Uppercase<typeof variantKey>;
        const HeadingVariant = variantModule[moduleKey];

        const { container } = render(<HeadingVariant as="p">Look ma! I'm a Variant!</HeadingVariant>);

        const expectedElement = container.querySelector("p");

        expect(expectedElement).toBeInTheDocument();
        expect(expectedElement).toHaveClass(gdsHeadingClasses[variantKey]);
      });
    });
  });
});
