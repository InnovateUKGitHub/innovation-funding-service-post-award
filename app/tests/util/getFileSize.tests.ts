
import { getFileSize } from "@framework/util";

describe("getFileSize", () => {
  it("should render Bytes", () => {
    expect(getFileSize(999, "B")).toBe("999B");
  });

  it("should render KB", () => {
    expect(getFileSize(999, "KB")).toBe("999KB");
  });

  it("should render MB", () => {
    expect(getFileSize(999, "MB")).toBe("999MB");
  });

  it("should render GB", () => {
    expect(getFileSize(999, "GB")).toBe("999GB");
  });

  it("should render 1000 Bytes as KB", () => {
    expect(getFileSize(1000)).toBe("0.98KB");
  });

  it("should render 1024 Bytes as KB", () => {
    expect(getFileSize(1024)).toBe("1KB");
  });

  it("should render 1000 KB as MB", () => {
    expect(getFileSize(1000, "KB")).toBe("0.98MB");
  });

  it("should render 1048576 Bytes as MB", () => {
    expect(getFileSize(1048576)).toBe("1MB");
  });

  it("should render 1073741824 Bytes as GB", () => {
    expect(getFileSize(1073741824)).toBe("1GB");
  });

  it("should render 1040000 Bytes as MB", () => {
    expect(getFileSize(1040000)).toBe("0.99MB");
  });

  it("should render 1040000 KiloBytes as GB", () => {
    expect(getFileSize(1040000, "KB")).toBe("0.99GB");
  });

});
