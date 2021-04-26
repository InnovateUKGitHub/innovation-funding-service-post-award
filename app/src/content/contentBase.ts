import i18next from "i18next";

import { projectCompetition } from "@ui/hooks";

export interface ContentResult {
  readonly key: string;
  readonly content: string;
  readonly markdown: boolean;
}

export interface MarkdownOption {
  markdown?: boolean;
}
export interface DataOption {
  [key: string]: any;
}

export abstract class ContentBase {
  constructor(
    private readonly parent: ContentBase | null,
    private readonly name: string | null,
    protected competitionType?: string,
  ) {}

  protected getNameParts(): string[] {
    const result = this.parent ? this.parent.getNameParts() : [];
    if (this.name) {
      result.push(this.name);
    }
    return result;
  }

  protected getContent(key: string, options?: MarkdownOption & DataOption): ContentResult {
    const { markdown } = options || { markdown: false };
    const parts = this.getNameParts();
    key.split(".").forEach(x => parts.push(x));
    const initialKey = parts.join(".");

    while (parts.length) {
      const fullKey = parts.join(".");
      const contentResult = this.getCustomContent(fullKey, options);

      if (contentResult) return contentResult;
      parts.shift();
    }

    return {
      key: initialKey,
      content: initialKey,
      markdown: markdown || false,
    };
  }

  private getCustomContent(fullKey: string, options?: MarkdownOption & DataOption): ContentResult | undefined {
    const { markdown, ...i18tOptions } = options || { markdown: false };
    if (this.competitionType) {
      const fullKeyWithCompetitionType = `${this.competitionType}.${fullKey}`;

      if (i18next.exists(fullKeyWithCompetitionType)) {
        return {
          key: fullKeyWithCompetitionType,
          content: i18next.t(fullKeyWithCompetitionType, i18tOptions),
          markdown: markdown || false,
        };
      }
    }

    if (i18next.exists(fullKey)) {
      return {
        key: fullKey,
        content: i18next.t(fullKey, i18tOptions),
        markdown: markdown || false,
      };
    }
  }

  protected getGrantOrContract() {
    const { isCombinationOfSBRI } = projectCompetition(this.competitionType || "");

    return isCombinationOfSBRI ? "contract" : "grant";
  }
}
