export type IAppPermittedTypes = Record<
  "pdfTypes" | "textTypes" | "presentationTypes" | "spreadsheetTypes" | "imageTypes",
  readonly string[]
>;

export interface IAppOptions {
  readonly maxFileSize: number;
  readonly maxTotalFileSize: number;
  readonly maxUploadFileCount: number;
  readonly maxFileBasenameLength: number;
  readonly permittedTypes: IAppPermittedTypes;
  readonly bankCheckValidationRetries: number;
  readonly bankCheckAddressScorePass: number;
  readonly bankCheckCompanyNameScorePass: number;
  readonly standardOverheadRate: number;
  readonly numberOfProjectsToSearch: number;
  readonly maxClaimLineItems: number;
  readonly nonJsMaxClaimLineItems: number;
}
