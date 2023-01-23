import { getGraphQLSchema } from "@gql/getGraphQLSchema";
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
import { Router } from "express";
import { createHandler } from "graphql-http/lib/use/express";

export const noAuthRouter = Router();

// Support routes
noAuthRouter.use("/api/health", healthRouter);

const getServerRoutes = async () => {
  const router = Router();
  const logger = new Logger("Router");

  const csrfProtection = csrf();

  const adminApi = await Api.asSystemUser();
  const schema = await getGraphQLSchema({ api: adminApi });

  router.use(async (req, res, next) => {
    // Obtain a Salesforce access token and URL
    try {
      const email = req.session?.user.email ?? null;

      if (email) {
        // If a user is logged in, use their email to create a connection to Salesforce.
        // Store this connection into `res.locals` so that either "/graphql" or serverRender
        // can use this.
        const api = await Api.asUser(email);
        res.locals.api = api;
        res.locals.email = email;
      }
    } catch {
      res.locals.email = null;
    }

    next();
  });

  // App routes
  router.use("/api", apiRoutes);
  router.use("/graphql", async (req, res, next) => {
    logger.debug("Executing GraphQL", res.locals.email);

    createHandler({
      schema,
      context: {
        api: res.locals.api,
        email: res.locals.email,
        logger,
      },
    })(req, res, next);
  });

  // Only enable the components page if we're in development mode.
  if (isAccDevOrDemo || isLocalDevelopment) {
    router.use("/components", csrfProtection, componentGuideRender);
  }

  // Form posts
  router.post("*", configureFormRouter({ schema })(csrfProtection));
  router.get("*", csrfProtection, (req, res) => serverRender({ schema })(req, res));

  // Fallback route
  router.all("*", (req, res) => serverRender({ schema })(req, res, new NotFoundError()));

  return router;
};

export { getServerRoutes };
