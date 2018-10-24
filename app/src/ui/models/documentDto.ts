import {Stream} from "stream";

export interface DocumentSummaryDto {
  fileName: string;
  link: string;
}

export interface DocumentDto {
  fileName: string;
  fileType: string;
  contentLength: number;
  stream: Stream;
}
