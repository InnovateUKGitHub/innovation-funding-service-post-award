import { IContext } from "@framework/types/IContext";
import { ISessionUser } from "@framework/types/IUser";
import { Context } from "./context";
import { salesforceConnectionWithToken } from "@server/repositories/salesforceConnection";
import { configuration } from "./config";

class ContextProvider {
  private getConnection(username: string, traceId: string) {
    return salesforceConnectionWithToken(
      {
        clientId: configuration.salesforceServiceUser.clientId,
        connectionUrl: configuration.salesforceServiceUser.connectionUrl,
        currentUsername: username,
      },
      traceId,
    );
  }

  start({ user, traceId }: { user: ISessionUser; traceId: string }): Promise<IContext> {
    return Promise.all([
      this.getConnection(user.email, traceId),
      this.getConnection(configuration.salesforceServiceUser.serviceUsername, traceId),
      this.getConnection(configuration.bankDetailsValidationUser.serviceUsername, traceId),
    ]).then(
      ([connection, systemConnection, bankConnection]) =>
        new Context({ user, traceId, connection, systemConnection, bankConnection }),
    );
  }
}

export const contextProvider = new ContextProvider();
