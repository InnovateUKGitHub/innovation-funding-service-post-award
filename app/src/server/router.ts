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
import { Router } from "express";
import { createHandler } from "graphql-http/lib/use/express";

export const noAuthRouter = Router();

// Support routes
noAuthRouter.use("/api/health", healthRouter);

const getServerRoutes = async () => {
  const router = Router();
  const csrfProtection = csrf();

  const adminApi = await Api.asSystemUser();
  const schema = await getGraphQLSchema({ api: adminApi });

  // App routes
  router.use("/api", apiRoutes);
  router.use("/graphql", async (req, res, next) => {
    createHandler({
      schema,
      context: await createContext({ req, res }),
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
