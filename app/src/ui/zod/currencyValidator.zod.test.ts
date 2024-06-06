import { getGenericCurrencyValidation } from "./currencyValidator.zod";

describe("generic currency validator", () => {
  test.each([
    ["accept 0", "0", true],
    ["accept 1", "1", true],
    ["accept 2", "2", true],
    ["accept 3", "3", true],
    ["accept 5", "5", true],
    ["accept 1.01", "1.01", true],
    ["accept 500", "500", true],
    ["accept £0", "£0", true],
    ["accept £1", "£1", true],
    ["accept £2", "£2", true],
    ["accept £3", "£3", true],
    ["accept £5", "£5", true],
    ["accept £1.01", "£1.01", true],
    ["accept £500", "£500", true],
    ["decline infinity", Infinity, false],
    ["decline bad input", "IUK MO Company", false],
    ["decline too big", "£999999999999999999999999", false],
    ["decline too little", "-9999999999999999999999999", false],
    ["decline too many dp", "£12,345.777", false],
    ["accept too few dp", "£12.2", true],
  ])("%s", (name, input, accept) => {
    const parse = getGenericCurrencyValidation({
      label: "Lottery winnings",
      max: 1_000_000,
      min: 0,
      required: true,
    }).safeParse(input);
    expect(parse.success).toBe(accept);
    expect(parse as unknown).toMatchSnapshot();
  });
});
