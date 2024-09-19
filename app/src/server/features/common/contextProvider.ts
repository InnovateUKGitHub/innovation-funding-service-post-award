import { IContext } from "@framework/types/IContext";
import { ISessionUser } from "@framework/types/IUser";
import { Context } from "./context";
import { salesforceConnectionWithToken } from "@server/repositories/salesforceConnection";
import { configuration } from "./config";

class ContextProvider {
  private getConnection(username: string) {
    return salesforceConnectionWithToken({
      clientId: configuration.salesforceServiceUser.clientId,
      connectionUrl: configuration.salesforceServiceUser.connectionUrl,
      currentUsername: username,
    });
  }

  start({ user, tid }: { user: ISessionUser; tid: string }): Promise<IContext> {
    return Promise.all([
      this.getConnection(user.email),
      this.getConnection(configuration.salesforceServiceUser.serviceUsername),
      this.getConnection(configuration.bankDetailsValidationUser.serviceUsername),
    ]).then(
      ([connection, systemConnection, bankConnection]) =>
        new Context({ user, tid, connection, systemConnection, bankConnection }),
    );
  }
}

export const contextProvider = new ContextProvider();
