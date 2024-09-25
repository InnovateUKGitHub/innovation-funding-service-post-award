import { IContext } from "@framework/types/IContext";
import { ISessionUser } from "@framework/types/IUser";
import { Context } from "./context";
import { salesforceConnectionWithToken } from "@server/repositories/salesforceConnection";
import { configuration } from "./config";

class ContextProvider {
  private getConnection(username: string, tid: string) {
    return salesforceConnectionWithToken(
      {
        clientId: configuration.salesforceServiceUser.clientId,
        connectionUrl: configuration.salesforceServiceUser.connectionUrl,
        currentUsername: username,
      },
      tid,
    );
  }

  start({ user, tid }: { user: ISessionUser; tid: string }): Promise<IContext> {
    return Promise.all([
      this.getConnection(user.email, tid),
      this.getConnection(configuration.salesforceServiceUser.serviceUsername, tid),
      this.getConnection(configuration.bankDetailsValidationUser.serviceUsername, tid),
    ]).then(
      ([connection, systemConnection, bankConnection]) =>
        new Context({ user, tid, connection, systemConnection, bankConnection }),
    );
  }
}

export const contextProvider = new ContextProvider();
