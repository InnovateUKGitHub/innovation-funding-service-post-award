import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { getGraphQLSchema } from "./schema";
import { SalesforceConnection } from "./sf/SalesforceConnection";

const getGraphQLRoutes = async () => {
  const router = express.Router();

  router.use(
    "/graphql",
    (req, res, next) => {
      res.header("Content-Security-Policy", undefined);

      if (req.session?.user) {
        req.sf = new SalesforceConnection(req.session.user.email);
      } else {
        req.sf = undefined;
      }

      next();
    },

    createHandler({
      schema: await getGraphQLSchema(),
    }),
  );

  return router;
};

export { getGraphQLRoutes };
