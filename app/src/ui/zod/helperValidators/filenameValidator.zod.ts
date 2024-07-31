import { IAppOptions } from "@framework/types/IAppOptions";
import { z } from "zod";

const filenameValidatior = (options: IAppOptions) =>
  z
    .string()
    .min(1)
    .max(options.maxFileBasenameLength)
    .superRefine((filename, ctx) => {
      const x = new URL(filename);

      if (x.)
    });

export { filenameValidatior };
