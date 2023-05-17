import { Copy } from "@copy/Copy";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { CopyNamespaces } from "./data";
import { PossibleCopyFunctions } from "./type";

describe("Copy", () => {
  const copy = new Copy();
  const ktpCopy = new Copy("ktp");
  const invalidNamespaceCopy = new Copy("not-a-valid-namespace");

  const copyData = {
    stub: {
      key: {
        hello: "world",
      },
    },
    second: {
      test: "foo",
    },
    third: {
      test_one: "We need {{count}} apple.",
      test_other: "We need {{count}} apples.",
    },
    fourth: {
      nicole: "Hedge's Hedges Ltd.",
    },
  };

  const ktpCopyData = {
    stub: {
      key: {
        hello: "I Love KTP!",
      },
    },
    second: {
      test: "KTP",
    },
    third: {
      test_one: "We need {{count}} KTP copy text.",
      test_other: "We need {{count}} KTP copy texts.",
    },
  };

  type PossibleTestCopyKeys = typeof copyData & typeof ktpCopyData;
  type PossibleTestCopyFunctions = PossibleCopyFunctions<PossibleTestCopyKeys>;

  describe("#getCopyString", () => {
    describe("before importing copy data", () => {
      test.each`
        name                                  | contentSelector                                                  | result
        ${"valid string input"}               | ${"stub.key.hello"}                                              | ${"stub.key.hello"}
        ${"valid content selector"}           | ${(x: PossibleTestCopyFunctions) => x.second.test}               | ${"second.test"}
        ${"valid content selector with data"} | ${(x: PossibleTestCopyFunctions) => x.third.test({ count: 12 })} | ${"third.test"}
      `("with $name", ({ contentSelector, result }) => {
        expect(copy.getCopyString(contentSelector)).toEqual(result);
        expect(ktpCopy.getCopyString(contentSelector)).toEqual("ktp:" + result);
        expect(invalidNamespaceCopy.getCopyString(contentSelector)).toEqual("not-a-valid-namespace:" + result);
      });
    });

    describe("after importing copy data", () => {
      beforeAll(async () => {
        await initStubTestIntl(copyData, {
          [CopyNamespaces.KTP]: ktpCopyData,
        });
      });

      test.each`
        name                        | contentSelector                                                 | result                   | ktpResult
        ${"valid string input"}     | ${"stub.key.hello"}                                             | ${"world"}               | ${"I Love KTP!"}
        ${"valid content selector"} | ${(x: PossibleTestCopyFunctions) => x.second.test}              | ${"foo"}                 | ${"KTP"}
        ${"singular"}               | ${(x: PossibleTestCopyFunctions) => x.third.test({ count: 1 })} | ${"We need 1 apple."}    | ${"We need 1 KTP copy text."}
        ${"plural"}                 | ${(x: PossibleTestCopyFunctions) => x.third.test({ count: 5 })} | ${"We need 5 apples."}   | ${"We need 5 KTP copy texts."}
        ${"namespace fallback"}     | ${(x: PossibleTestCopyFunctions) => x.fourth.nicole}            | ${"Hedge's Hedges Ltd."} | ${"Hedge's Hedges Ltd."}
      `("with $name", ({ contentSelector, result, ktpResult }) => {
        expect(copy.getCopyString(contentSelector)).toEqual(result);

        // Valid KTP namespace should use KTP data before falling back to default namespace
        expect(ktpCopy.getCopyString(contentSelector)).toEqual(ktpResult);

        // Unknown namespace (like CATAPULTS) should fall back to default namespace.
        expect(invalidNamespaceCopy.getCopyString(contentSelector)).toEqual(result);
      });
    });
  });
});
