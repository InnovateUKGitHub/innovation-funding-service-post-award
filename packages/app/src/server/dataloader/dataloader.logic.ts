import { TsforceConnection } from "@innovateuk/tsforce/TsforceConnection";
import { DataloaderNotFoundError } from "@server/repositories/errors";

interface DataloaderParams {
  email: string;
  api: TsforceConnection;
}

interface DataloaderWithServiceUserParams extends DataloaderParams {
  adminApi: TsforceConnection;
}

const getRecord = <T>(record: Error | DataloaderNotFoundError | T): record is T => {
  if (record instanceof DataloaderNotFoundError) return false;
  if (record instanceof Error) throw record;
  return true;
};

export { DataloaderParams, DataloaderWithServiceUserParams, getRecord };
