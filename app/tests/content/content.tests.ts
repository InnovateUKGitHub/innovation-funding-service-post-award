
import { ContentBase } from "@content/contentBase";
import i18next from "i18next";

class SimpleTestContent extends ContentBase {
  constructor() {
    super(null, null);
  }

  public testPath(path: string) {
    return this.getContent(path);
  }

  public testInterpolated(path: string, options: {}) {
    return this.getContent(path, options);
  }
}

class NamedTestContent extends ContentBase {
  constructor(parent?: ContentBase) {
    super(parent || null, "named");
  }

  public testPath(path: string) {
    return this.getContent(path);
  }

  public testMarkdown(path: string) {
    return this.getContent(path, { markdown: true });
  }

  public testArgs(path: string, options: {}) {
    return this.getContent(path, options);
  }
}

class ParentTestContent extends ContentBase {
  constructor() {
    super(null, "parent");
  }

  child = new NamedTestContent(this);

}

const addResources = (resourceBundle: any) => {
  i18next.addResourceBundle("en", "default", resourceBundle);
};

const resources = {
  example1: {
    example2: "The full path"
  },
  example2: "The sub path",
  named: {
    example2: "The named path"
  },
  parent: {
    named: {
      example2: "The parent named path"
    }
  },
  interpolated: "This is the interpolated value with '{{value}}'."
};

describe("Content", () => {
  beforeAll(() => {
    i18next.init({
      lng: "en",
      fallbackLng: "en",
      defaultNS: "default",
    });

    addResources(resources);
  });

  it("uses full path", () => {
    const result = new SimpleTestContent().testPath("example1.example2");
    expect(result.content).toEqual(resources.example1.example2);
  });

  it("uses fullback", () => {
    const result = new SimpleTestContent().testPath("example2");
    expect(result.content).toEqual(resources.example2);
  });

  it("uses fullback if not found", () => {
    const result = new SimpleTestContent().testPath("example.example2");
    expect(result.content).toEqual(resources.example2);
  });

  it("returns key if not found", () => {
    const result = new SimpleTestContent().testPath("example.not.found");
    expect(result.content).toEqual("example.not.found");
  });

  it("uses named component in path", () => {
    const result = new NamedTestContent().testPath("example2");
    expect(result.content).toEqual(resources.named.example2);
  });

  it("uses parent component in path", () => {
    const result = new ParentTestContent().child.testPath("example2");
    expect(result.content).toEqual(resources.parent.named.example2);
  });

  it("uses arguments passed in", () => {
    const result = new SimpleTestContent().testInterpolated("interpolated", { value: "The Injected Text" });
    expect(result.content).toEqual("This is the interpolated value with 'The Injected Text'.");
  });
});
