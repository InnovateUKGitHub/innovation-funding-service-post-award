import { Router } from "express";
import csrf from "csurf";

import { healthRouter } from "@server/health";
import { router as apiRoutes } from "@server/apis";

import { configureFormRouter } from "@server/forms/formRouter";
import { NotFoundError } from "@shared/appError";
import { serverRender } from "@server/serverRender";
import { componentGuideRender } from "@server/componentGuideRender";
import { isAccDevOrDemo, isLocalDevelopment } from "@shared/isEnv";
import { getGraphQLRoutes } from "@gql/getGraphQLExpressRoutes";

export const noAuthRouter = Router();

// Support routes
noAuthRouter.use("/api/health", healthRouter);

const getServerRoutes = async () => {
  const router = Router();

  const csrfProtection = csrf();

  // App routes
  router.use("/api", apiRoutes);
  router.use(await getGraphQLRoutes());

  // Only enable the components page if we're in development mode.
  if (isAccDevOrDemo || isLocalDevelopment) {
    router.use("/components", csrfProtection, componentGuideRender);
  }

  // Form posts
  router.post("*", configureFormRouter(csrfProtection));
  router.get("*", csrfProtection, (req, res) => serverRender(req, res));

  // Fallback route
  router.all("*", (req, res) => serverRender(req, res, new NotFoundError()));

  return router;
};

export { getServerRoutes };
