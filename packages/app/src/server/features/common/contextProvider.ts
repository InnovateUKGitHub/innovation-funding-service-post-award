import { IContext } from "@framework/types/IContext";
import { ISessionUser } from "@framework/types/IUser";
import { Context } from "./context";
import { salesforceConnectionWithToken } from "@server/repositories/salesforceConnection";
import { configuration } from "./config";
import { TsforceTokenException } from "@innovateuk/tsforce/exceptions/TsforceTokenException";
import { TsforceInvalidUsernameException } from "@innovateuk/tsforce/exceptions/TsforceInvalidUsernameException";
import { UnauthenticatedError } from "@shared/appError";
import { DetailedErrorCode } from "@framework/constants/enums";

class ContextProvider {
  private getConnection(username: string, traceId: string) {
    return salesforceConnectionWithToken(
      {
        clientId: configuration.salesforceServiceUser.clientId,
        connectionUrl: configuration.salesforceServiceUser.connectionUrl,
        currentUsername: username,
        privateKey: configuration.certificates.salesforce,
      },
      traceId,
    );
  }

  async start({ user, traceId }: { user: ISessionUser; traceId: string }): Promise<IContext> {
    try {
      const [connection, systemConnection, bankConnection] = await Promise.all([
        this.getConnection(user.email, traceId),
        this.getConnection(configuration.salesforceServiceUser.serviceUsername, traceId),
        this.getConnection(configuration.bankDetailsValidationUser.serviceUsername, traceId),
      ]);
      return new Context({ user, traceId, connection, systemConnection, bankConnection });
    } catch (e) {
      if (e instanceof TsforceTokenException) {
        throw new UnauthenticatedError([{ code: DetailedErrorCode.SFDC_INVALID_GRANT }], e);
      } else if (e instanceof TsforceInvalidUsernameException) {
        throw new UnauthenticatedError([{ code: DetailedErrorCode.SFDC_INVALID_USERNAME }], e);
      } else {
        throw e;
      }
    }
  }
}

export const contextProvider = new ContextProvider();
