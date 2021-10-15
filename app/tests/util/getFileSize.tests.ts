import { getFileSize } from "@framework/util";

describe("getFileSize()", () => {
  test.each`
    name               | bytes         | expected
    ${"less than 1KB"} | ${1023}       | ${"0.999KB"}
    ${"more than 1KB"} | ${1024}       | ${"1KB"}
    ${"1MB"}           | ${1048576}    | ${"1MB"}
    ${"more than 1MB"} | ${5000000}    | ${"4.768MB"}
    ${"over 1gb"}      | ${1048576000} | ${"1,000MB"}
  `("$name", ({ bytes, expected }) => {
    expect(getFileSize(bytes)).toBe(expected);
  });
});
