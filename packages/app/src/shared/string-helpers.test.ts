import { removeSpaces, removeUndefinedString, capitalizeFirstWord } from "./string-helpers";

describe("string helpers", () => {
  describe("removeSpaces", () => {
    it("should remove start and end spaces of string and any interior spaces", () => {
      expect(removeSpaces("   hello, world   ")).toEqual("hello,world");
    });

    it("should replace empty spaces with a passed in replacer", () => {
      expect(removeSpaces("   hello, world   ", "%")).toEqual("hello,%world");
    });
  });

  describe("removeUndefinedString", () => {
    it("should remove any instances of undefined strings", () => {
      expect(removeUndefinedString("undefinedhello, undefinedworldundefined")).toEqual("hello, world");
    });
  });

  describe("capitalizeFirstWord", () => {
    it.each([
      ["with an all lower case string", "hello, world, leo says hello"],
      ["with an all upper case string", "HELLO, WORLD, LEO SAYS HELLO"],
      ["with each word capitalised", "Hello, World, Leo Says Hello"],
    ])("should return a string with only the first word capitalized %s", (desc, arg) => {
      expect(capitalizeFirstWord(arg)).toEqual("Hello, world, leo says hello");
    });
  });
});
