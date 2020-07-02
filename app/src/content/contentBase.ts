import i18next from "i18next";

export interface ContentResult {
  readonly key: string;
  readonly content: string;
  readonly markdown: boolean;
}

export interface MarkdownOption { markdown?: boolean; }
export interface DataOption { [key: string]: any; }

export abstract class ContentBase {
  constructor(private readonly parent: ContentBase | null, private readonly name: string | null) {
  }

  protected getNameParts(): string[] {
    const result = this.parent ? this.parent.getNameParts() : [];
    if (this.name) {
      result.push(this.name);
    }
    return result;
  }

  protected getContent(key: string, options?: MarkdownOption & DataOption): ContentResult {
    const { markdown, ...i18tOptions } = options || { markdown: false };
    const parts = this.getNameParts();
    key.split(".").forEach(x => parts.push(x));
    const initialKey = parts.join(".");
    while (parts.length) {
      const fullKey = parts.join(".");
      if (i18next.exists(fullKey)) {
        return {
          key: fullKey,
          content: i18next.t(fullKey, i18tOptions),
          markdown: markdown || false
        };
      }
      parts.shift();
    }
    return {
      key: initialKey,
      content: initialKey,
      markdown: markdown || false
    };
  }
}
