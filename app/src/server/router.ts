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
import { ErrorRequestHandler, Request, Router } from "express";
import { execute, parse } from "graphql";
import { createYoga } from "graphql-yoga";
import { ConcreteRequest } from "relay-runtime";
import { configuration } from "./features/common";
import { upload } from "./forms/memoryStorage";
import staticHtmlError from "./staticError.html";
import { File } from "@whatwg-node/fetch"

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

  const yoga = createYoga<{
    req: Request;
  }>({
    schema,
    context: async initialContext => await createContext({ req: initialContext.req }),
    graphiql: false,
  });

  /**
   * API routes
   */
  router.use("/api", apiRoutes);
  router.post("/graphql/nojs", upload.any(), async (req, res, next) => {
    const { _csrf, _mutation, _success, ...variables } = req.body;

    const context = await createContext({ req });

    try {
      const value = await execute({
        schema,
        document: parse(_mutation),
        contextValue: context,
        variableValues: {...variables, files: req.files?.map(x => new File([x.buffer], x.originalname))},
      });

      if (_success) {
        res.redirect(_success);
      } else {
        res.json(value);
      }
    } catch (err: unknown) {
      next(err);
    }
  });
  router.use("/graphql", (req, res) => {
    yoga(req, res);
  });

  /**
   * CSRF Protection
   * TODO: Swap this out for another CSRF package.
   */
  router.use(csrfProtection);

  // Only enable the components page if we're in development mode.
  if (isAccDevOrDemo || isLocalDevelopment) {
    router.use("/components", componentGuideRender);
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
