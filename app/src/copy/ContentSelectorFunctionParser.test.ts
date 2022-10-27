import { ContentSelectorFunctionParser } from "./ContentSelectorFunctionParser";
import { PossibleCopyFunctions } from "./type";

describe("ContentSelectorFunctionParser", () => {
  const copyData = {
    operatingSystems: {
      archLinux: "Arch Linux",
      debianLinux: "Debian",
      hannahMontanaLinux: "Hannah Montana Linux",
      windows22H2: "Windows 11 2022 Update",
    },
    impostors: {
      red: "Red",
      orange: "Orange",
    },
    messages: {
      eject: {
        skeld: "{{ person }} was ejected into space",
        airship: "{{ person }} was evacuated out of the airship",
      },
    },
    name: "Among Us",
  };

  type PossibleTestCopyKeys = typeof copyData;
  type PossibleTestCopyFunctions = PossibleCopyFunctions<PossibleTestCopyKeys>;

  test.each`
    name                               | contentSelector                                                                   | expectedKey                     | expectedDataOption
    ${"top level select"}              | ${(x: PossibleTestCopyFunctions) => x.name}                                       | ${"name"}                       | ${{}}
    ${"second level select"}           | ${(x: PossibleTestCopyFunctions) => x.operatingSystems.archLinux}                 | ${"operatingSystems.archLinux"} | ${{}}
    ${"second level select with data"} | ${(x: PossibleTestCopyFunctions) => x.impostors.red({ sus: "very" })}             | ${"impostors.red"}              | ${{ sus: "very" }}
    ${"third level select"}            | ${(x: PossibleTestCopyFunctions) => x.messages.eject.skeld}                       | ${"messages.eject.skeld"}       | ${{}}
    ${"third level select with data"}  | ${(x: PossibleTestCopyFunctions) => x.messages.eject.airship({ hello: "world" })} | ${"messages.eject.airship"}     | ${{ hello: "world" }}
  `("with $name", ({ contentSelector, expectedKey, expectedDataOption }) => {
    // Create an interceptor
    const contentSelectorFunctionParser = new ContentSelectorFunctionParser();
    const proxy = contentSelectorFunctionParser.getProxyContent();

    // Pass the interceptor into our contentSelector.
    contentSelector(proxy);

    // Obtain interception information.
    const { i18nKey, values } = contentSelectorFunctionParser.getContentCall();
    expect(i18nKey).toEqual(expectedKey);
    expect(values).toEqual(expectedDataOption);
  });
});
