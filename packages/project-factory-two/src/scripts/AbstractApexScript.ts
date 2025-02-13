import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { AbstractProjectFactoryScript } from "./AbstractProjectFactoryScript";
import * as prettier from "prettier";

abstract class AbstractApexScript<Arguments> extends AbstractProjectFactoryScript<Record<string, never>, Arguments> {
  abstract getApex(args: Arguments): string;

  async script({
    connection,
    args,
  }: {
    connection: ITsforceConnection;
    args: Arguments;
  }): Promise<Record<string, never>> {
    const apexCode = this.getApex(args);

    const text = await connection.executeApex({
      query: apexCode,
    });

    if (text.includes(`<success>false</success>`)) {
      const lineStr = /<line>(\d+)<\/line>/.exec(text)?.[1];

      const exception = await prettier.format(text, {
        plugins: ["@prettier/plugin-xml"],
        bracketSameLine: false,
        xmlWhitespaceSensitivity: "ignore",
        parser: "xml",
      });

      let badApex = apexCode;

      if (lineStr) {
        const lineNumber = Number(lineStr);

        badApex = apexCode
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
