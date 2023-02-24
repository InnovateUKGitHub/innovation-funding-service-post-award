import { getGraphQLSchema } from "@gql/getGraphQLSchema";
import { createContext } from "@gql/GraphQLContext";
import { Api } from "@gql/sf/Api";
import { router as apiRoutes } from "@server/apis";
import { componentGuideRender } from "@server/componentGuideRender";
import { configureFormRouter } from "@server/forms/formRouter";
import { healthRouter } from "@server/health";
import { serverRender } from "@server/serverRender";
import { NotFoundError } from "@shared/appError";
import { Logger } from "@shared/developmentLogger";
import { isAccDevOrDemo, isLocalDevelopment } from "@shared/isEnv";
import csrf from "csurf";
import { ErrorRequestHandler, Router } from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { configuration } from "./features/common";
import staticHtmlError from "./staticError.html";

export const noAuthRouter = Router();

const logger = new Logger("Router");

// Support routes
noAuthRouter.use("/api/health", healthRouter);

const getServerRoutes = async () => {
  const router = Router();
  const csrfProtection = csrf();

  let adminApi: Api | undefined;
  try {
    adminApi = await Api.asSystemUser();
  } catch {
    logger.error("Failed to create GraphQL Admin Salesforce API connector.");
  }
  const schema = await getGraphQLSchema({ api: adminApi });

  /**
   * API routes
   */
  router.use("/api", apiRoutes);
  router.use("/graphql", async (req, res, next) => {
    createHandler({
      schema,
      context: await createContext({ req }),
    })(req, res, next);
  });

  // Only enable the components page if we're in development mode.
  if (isAccDevOrDemo || isLocalDevelopment) {
    router.use("/components", csrfProtection, componentGuideRender);
  }

  /**
   * User Routes
   */

  // Form posts
  router.post("*", configureFormRouter({ schema, csrfProtection }));
  // React server renderer
  router.get("*", csrfProtection, (req, res, next) => serverRender({ schema })({ req, res, next }));

  /**
   * Fallback Routes
   */
  // If no error was thrown, render a "Not Found Error"
  router.use((req, res, next) => serverRender({ schema })({ req, res, next, err: new NotFoundError() }));

  // If an error occured, render the error.
  router.use(
    ((err, req, res, next) => {
      // Form validation errors are technically "an error" which could be caught.
      // This means CSRF protection may still be required.
      csrfProtection(req, res, () => {
        next(err);
      });
    }) as ErrorRequestHandler,
    ((err, req, res, next) => {
      serverRender({ schema })({ req, res, err, next });
    }) as ErrorRequestHandler,
  );

  // If an error occured, and all of our React rendering has failed, render the fallback error page.
  router.use(((err, req, res, next) => {
    logger.error("Failed to render React error page.", err);
    res.status(500).send(staticHtmlError.replace(/<<ifsroot>>/g, configuration.urls.ifsRoot));
  }) as ErrorRequestHandler);

  return router;
};

export { getServerRoutes };
