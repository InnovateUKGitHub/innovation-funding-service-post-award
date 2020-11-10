import { IFileWrapper } from "@framework/types";

export class ClientFileWrapper implements IFileWrapper {
  constructor(public readonly file: File) {
    this.fileName = file.name;
    this.size = file.size;
  }

  public readonly size: number;
  public readonly fileName: string;
}
