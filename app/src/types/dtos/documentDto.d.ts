
interface IStream {
  pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean; }): T;
}

interface DocumentSummaryDto {
  fileName: string;
  link: string;
  id: string;
  description?: string;
}

interface DocumentDto {
  fileName: string;
  fileType: string | null;
  contentLength: number;
  stream: IStream;
}
