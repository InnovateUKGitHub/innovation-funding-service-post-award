import { TsforceCompositeSubrequestError } from "../TsforceDataloader";

const isSfdcException = (info: unknown): info is TsforceCompositeSubrequestError => {
  return typeof info === "object" && info !== null && "httpStatusCode" in info && "reference" in info;
};

class TsforceSalesforceErrorException extends Error {
  info: TsforceCompositeSubrequestError | null;

  constructor({ info }: { info?: unknown }) {
    let message: string;
    const isException = isSfdcException(info);

    if (isException) {
      message = info.body.map(x => x.message).join("\n");
    } else {
      message = JSON.stringify(info);
    }

    super(message);

    if (isException) {
      this.info = info;
    } else {
      this.info = null;
    }
  }
}

export { TsforceSalesforceErrorException };
