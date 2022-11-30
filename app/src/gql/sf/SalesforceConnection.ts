import * as Common from "@server/features/common";
import { ISalesforceConnectionDetails, salesforceConnectionWithToken } from "@server/repositories/salesforceConnection";
import { Connection as JSForceConnection, Query } from "jsforce";

const config = Common.configuration;

class SalesforceConnection {
  private readonly userDetails: ISalesforceConnectionDetails;
  private jsforceConnection?: JSForceConnection;

  constructor(email: string) {
    this.userDetails = {
      clientId: config.salesforceServiceUser.clientId,
      connectionUrl: config.salesforceServiceUser.connectionUrl,
      serviceUsername: config.salesforceServiceUser.serviceUsername,
      currentUsername: email,
    };
  }

  private async getConnection(): Promise<JSForceConnection> {
    if (this.jsforceConnection) return this.jsforceConnection;
    const connection = await salesforceConnectionWithToken(this.userDetails);
    this.jsforceConnection = connection;
    return connection;
  }

  public runQuery<T>(query: Query<T>): Promise<T[]> {
    return new Promise(async (resolve, reject) => {
      query.execute({}, (error, records) => {
        if (error) {
          reject(error);
        } else {
          resolve(records);
        }
      });
    });
  }
}

export { SalesforceConnection };
