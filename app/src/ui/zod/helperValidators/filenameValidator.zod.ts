import { IAppOptions } from "@framework/types/IAppOptions";
import _ from "lodash";
import path from "path-browserify";
import { z } from "zod";

enum CharacterType {
  ASCII_CONTROL_CHARACTERS = "ascii_control",
  UNICODE_CONTROL_CHARACTERS = "unicode_control",
  PRIVATE_USE_AREA = "private_use",
  DIRECTION_OVERRIDES = "direction_overrides",
  EMOJIS = "emojis",
  FILESYSTEM = "fs",
}

const toChar =
  (type: CharacterType) =>
  (x: number): [string, CharacterType] => [String.fromCodePoint(x), type];

const badCharactersList: [string, CharacterType][] = [
  /**
   * ASCII
   */
  // ASCII control characters
  ..._.range(0x00, 0x20).map(toChar(CharacterType.ASCII_CONTROL_CHARACTERS)),
  // Delete
  ["\x7F", CharacterType.ASCII_CONTROL_CHARACTERS],

  /**
   * Bad Windows/Mac OS X/*nix characters
   */
  ["<", CharacterType.FILESYSTEM],
  [">", CharacterType.FILESYSTEM],
  [":", CharacterType.FILESYSTEM],
  ['"', CharacterType.FILESYSTEM],
  ["/", CharacterType.FILESYSTEM],
  ["\\", CharacterType.FILESYSTEM],
  ["|", CharacterType.FILESYSTEM],
  ["?", CharacterType.FILESYSTEM],
  ["*", CharacterType.FILESYSTEM],

  /**
   * Unicode Fun Corner
   */

  // NULL
  ["\uFFFF", CharacterType.UNICODE_CONTROL_CHARACTERS],
  // LINE SEPARATOR
  ["\u2028", CharacterType.UNICODE_CONTROL_CHARACTERS],
  // PARAGRAPH SEPARATOR
  ["\u2029", CharacterType.UNICODE_CONTROL_CHARACTERS],
  // LANGUAGE TAG
  ["\u{E0001}", CharacterType.UNICODE_CONTROL_CHARACTERS],
  // CANCEL TAG
  ["\u{E007F}", CharacterType.UNICODE_CONTROL_CHARACTERS],
  // INTERLINEAR ANNOTATION ANCHOR
  ["\uFFF9", CharacterType.UNICODE_CONTROL_CHARACTERS],
  // INTERLINEAR ANNOTATION SEPARATOR
  ["\uFFFA", CharacterType.UNICODE_CONTROL_CHARACTERS],
  // INTERLINEAR ANNOTATION TERMINATOR
  ["\uFFFB", CharacterType.UNICODE_CONTROL_CHARACTERS],

  // PRIVATE USE AREAS
  ..._.range(0xe000, 0xf900).map(toChar(CharacterType.PRIVATE_USE_AREA)),
  ..._.range(0xf0000, 0xffffe).map(toChar(CharacterType.PRIVATE_USE_AREA)),
  ..._.range(0x100000, 0x10fffe).map(toChar(CharacterType.PRIVATE_USE_AREA)),

  // ARABIC LETTER MARK
  ["\u061C", CharacterType.DIRECTION_OVERRIDES],
  // LEFT-TO-RIGHT MARK
  ["\u200E", CharacterType.DIRECTION_OVERRIDES],
  // RIGHT-TO-LEFT MARK
  ["\u200F", CharacterType.DIRECTION_OVERRIDES],
  // LEFT-TO-RIGHT EMBEDDING
  ["\u202A", CharacterType.DIRECTION_OVERRIDES],
  // RIGHT-TO-LEFT EMBEDDING
  ["\u202B", CharacterType.DIRECTION_OVERRIDES],
  // POP DIRECTIONAL FORMATTING
  ["\u202C", CharacterType.DIRECTION_OVERRIDES],
  // LEFT-TO-RIGHT OVERRIDE
  ["\u202D", CharacterType.DIRECTION_OVERRIDES],
  // RIGHT-TO-LEFT OVERRIDE
  ["\u202E", CharacterType.DIRECTION_OVERRIDES],
  // LEFT-TO-RIGHT ISOLATE
  ["\u2066", CharacterType.DIRECTION_OVERRIDES],
  // RIGHT-TO-LEFT ISOLATE
  ["\u2067", CharacterType.DIRECTION_OVERRIDES],
  // FIRST STRONG ISOLATE
  ["\u2068", CharacterType.DIRECTION_OVERRIDES],
  // POP DIRECTIONAL ISOLATE
  ["\u2069", CharacterType.DIRECTION_OVERRIDES],

  /**
   * Emojis!
   */

  // Man in Business Suit Levitating
  // ["\u{1F574}", CharacterType.EMOJIS],
];

const badFileNames = [
  "con",
  "prn",
  "aux",
  "nul",
  ..._.range(1, 10)
    .map(x => [`com${x}`, `lpt${x}`])
    .flat(),
];

const filenameValidator = (options: Pick<IAppOptions, "maxFileBasenameLength" | "permittedTypes">) => {
  const allowedExtensions = Object.values(options.permittedTypes).flat();

  return z
    .string()
    .min(1)
    .max(options.maxFileBasenameLength)
    .superRefine((filename, ctx) => {
      const normalisedName = filename.normalize("NFC");
      const parsedFile = path.parse(normalisedName);

      if (parsedFile.root !== "" && parsedFile.dir !== "") {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: {
            i18n: "errors.invalid_path",
            ...parsedFile,
          },
        });
      }

      const lowercaseFilename = parsedFile.name.toLowerCase();

      if (parsedFile.ext === "") {
        if (parsedFile.name.startsWith(".")) {
          return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: {
              i18n: "errors.no_filename",
              ...parsedFile,
            },
          });
        }

        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: {
            i18n: "errors.invalid_extension",
            ...parsedFile,
          },
        });
      }

      let foundGoodExtension = false;
      for (const allowedExtension of allowedExtensions) {
        if ("." + allowedExtension === parsedFile.ext) {
          foundGoodExtension = true;
        }
      }
      if (!foundGoodExtension) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: {
            i18n: "errors.invalid_extension",
            allowedExtensions,
            ...parsedFile,
          },
        });
      }

      for (const badFileName of badFileNames) {
        if (badFileName === lowercaseFilename) {
          return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: {
              i18n: "errors.microsoft_windows_invalid_filename",
              ...parsedFile,
            },
          });
        }
      }

      if (parsedFile.name.startsWith(" ")) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: {
            i18n: "errors.starts_with_space",
            ...parsedFile,
          },
        });
      }

      const foundBadCharacters: [string, CharacterType][] = [];
      let everyCharacterIsSpace = true;
      let everyCharacterIsFullStop = true;
      let forcePlural = false;
      for (const character of parsedFile.name) {
        if (character !== " ") {
          everyCharacterIsSpace = false;
        }
        if (character !== ".") {
          everyCharacterIsFullStop = false;
        }

        for (const [badCharacter, type] of badCharactersList) {
          if (character === badCharacter) {
            foundBadCharacters.push([badCharacter, type]);
            everyCharacterIsSpace = false;
            everyCharacterIsFullStop = false;

            // Edge case - looks like web browsers turn `/` into `:`
            // Show an error message for both if this occurs.
            if (character === ":") {
              foundBadCharacters.push(["/", CharacterType.FILESYSTEM]);
            }

            if (
              type === CharacterType.ASCII_CONTROL_CHARACTERS ||
              type === CharacterType.DIRECTION_OVERRIDES ||
              type === CharacterType.EMOJIS ||
              type === CharacterType.PRIVATE_USE_AREA ||
              type === CharacterType.UNICODE_CONTROL_CHARACTERS
            ) {
              // These are "categories" of characters, which should
              // force the output error to be a plural.
              // i.e. Cannot use invisible characters
              // not. Cannot use the invisible character
              forcePlural = true;
            }
          }
        }
      }

      if (foundBadCharacters.length > 0) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: {
            i18n: "errors.bad_characters",
            characters: foundBadCharacters,
            count: forcePlural ? 2 : foundBadCharacters.length,
            ...parsedFile,
          },
        });
      }

      if (everyCharacterIsSpace) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: {
            i18n: "errors.every_char_space",
            ...parsedFile,
          },
        });
      }

      if (everyCharacterIsFullStop) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: {
            i18n: "errors.every_char_full_stop",
            ...parsedFile,
          },
        });
      }
    });
};

export { filenameValidator, CharacterType };
