const replaceTitleTemplateWithArg = (title: string, args: any): string =>
  /(.*)(\$\d+)(\.*)/.test(title)
    ? replaceTitleTemplateWithArg(
        title.replace(/(.*)(\$\d+)(\.*)/, function (m, p1, p2, p3) {
          const index = parseInt(p2.replace("$", ""));
          const interpolation = Array.isArray(args) ? args[index] : args;
          return `${p1}${interpolation}${p3}`;
        }),
        args,
      )
    : title;

/**
 *
 * Test each allows you to run multiple similar tests.
 * First call should be an array of arguments, if there is more than one argument this should also be an array.
 * Second call takes two arguments. The first is the title string and the second is the test function that will be called with the argument from the first call.
 *
 * To interpolate the argument into the title string use the syntax `$0` for the first element in the array in the arguments list etc.
 *
 * @example
 * testEach(["apple","banana"]) ("$0 should be a fruit", shouldBeAFruit)
 *
 * testEach([["fly", 6],["spider", 8], ["slug", 0]]) ("$0 should have $1 legs", shouldHaveLegs)
 *
 **/
export const testEach =
  <T>(testArray: T[]) =>
  // eslint-disable-next-line no-unused-vars
  (title: string, fn: (args: T) => void) => {
    testArray.forEach(element => {
      it(replaceTitleTemplateWithArg(title, element), () => fn(element));
    });
  };

export function abortTestsAfterFail() {
  // very long tests should be aborted after first fail to save time
  if (this.currentTest.state === "failed") {
    cy.log("stopping this test file because of failure in one test");
    console.warn("Stopping tests file because of failure in one test");
    // casting as any because Cypress typings do not expose "internal" api
    (Cypress as any).runner.stop();
  }
}
