import { enCopy, ktpEnCopy, loansEnCopy, sbriEnCopy, sbriIfsEnCopy } from "@copy/data";

// The type that is returned from fetching a translation from the JSON.
export type TranslationResult = string;

// Replace a type with another.
type Replacement<M extends [any, any], T> = [T] extends [M[0]] ? M[1] : never;

/**
 * Replace keys and types in a object such that...
 * 1. If a key "hello_one" exists, infer that "hello" also exists
 * 2. If a key { hello: A } exists, replace it with { hello: B }
 *    where A and B are passed in as an array to M.
 */
type DeepReplace<T, M extends [any, any]> = {
  [P in keyof T as P extends `${infer B}_one` ? B : P]: T[P] extends M[0]
    ? Replacement<M, T[P]>
    : T[P] extends object
    ? DeepReplace<T[P], M>
    : T[P];
};

// Describes a translation that requires input before text can be returned.
export type TranslationResultFunction = (options: DataOption) => TranslationResult;

// An interface-like-type with ALL possible copy keys, mapped from key -> string
export type PossibleCopyStrings = typeof enCopy &
  typeof ktpEnCopy &
  typeof sbriEnCopy &
  typeof sbriIfsEnCopy &
  typeof loansEnCopy;

// An interface-like-type with ALL possible copy keys, mapped from key -> TranslationResultFunction
// This means that users will have to pass in a ContentSelector to consume the Content.
export type PossibleCopyFunctions<T = PossibleCopyStrings> = DeepReplace<
  T,
  [TranslationResult, TranslationResultFunction]
>;

// Describes a function which allows a developer to select a leaf in the copy JSON.
// The result can then be optionally called to pass input before text is returned.
export type ContentSelector<T = PossibleCopyStrings> = (
  content: PossibleCopyFunctions<T>,
) => TranslationResult | TranslationResultFunction;

// Parameters that could POSSIBLY be passed into a translation.
export interface DataOption {
  [key: string]: any;
}

// A content selector that fetches Titles.
export type TitleContentSelector = (content: PossibleCopyFunctions) => {
  html: ContentSelector;
  display: ContentSelector;
};

// Localised title
export interface TitleContentResult {
  htmlTitle: string;
  displayTitle: string;
}

// Interface to store ContentSelector key and potential inputs.
export interface ContentSelectorCallInformation {
  i18nKey: string;
  values: DataOption;
}
