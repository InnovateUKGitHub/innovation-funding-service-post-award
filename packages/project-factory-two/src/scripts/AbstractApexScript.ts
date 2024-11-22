import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { AbstractProjectFactoryScript } from "./AbstractProjectFactoryScript";
import * as prettier from "prettier";

abstract class AbstractApexScript extends AbstractProjectFactoryScript<Record<string, never>> {
  abstract apex: string;

  async script({ connection }: { connection: ITsforceConnection }): Promise<Record<string, never>> {
    const text = await connection.executeApex({
      query: this.apex,
    });

    if (text.includes(`<success>false</success>`)) {
      const lineStr = /<line>(\d+)<\/line>/.exec(text)?.[1];

      const exception = await prettier.format(text, {
        plugins: ["@prettier/plugin-xml"],
        bracketSameLine: false,
        xmlWhitespaceSensitivity: "ignore",
        parser: "xml",
      });

      let badApex = this.apex;

      if (lineStr) {
        const lineNumber = Number(lineStr);

        badApex = this.apex
          .split("\n")
          .map((x, i) => `${i + 1 === lineNumber ? ">>>" : "   "} ${String(i + 1).padStart(4, " ")} | ${x}`)
          .filter((_, i) => i > lineNumber - 5 && i < lineNumber + 3)
          .join("\n");
      }

      throw new Error("Apex execution issue:\n\n" + exception + "\n\n" + badApex);
    }

    return {} as const;
  }
}

export { AbstractApexScript };
