export interface IAppOptions {
  readonly maxFileSize: number;
  readonly maxTotalFileSize: number;

  readonly maxUploadFileCount: number;
  readonly maxFileBasenameLength: number;
  /**
   * @deprecated since ACC-7394
   */
  readonly permittedFileTypes: readonly string[];
  readonly permittedTypes: Record<
    "pdfTypes" | "textTypes" | "presentationTypes" | "spreadsheetTypes" | "imageTypes",
    readonly string[]
  >;
  readonly bankCheckValidationRetries: number;
  readonly bankCheckAddressScorePass: number;
  readonly bankCheckCompanyNameScorePass: number;
  readonly standardOverheadRate: number;
  readonly numberOfProjectsToSearch: number;
  readonly maxClaimLineItems: number;
  readonly nonJsMaxClaimLineItems: number;
}
