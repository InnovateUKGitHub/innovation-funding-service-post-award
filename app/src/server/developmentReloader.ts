import express, { Response } from "express";
import { Logger } from "@shared/developmentLogger";

const logger = new Logger("Develop");

const developmentRouter = express.Router();

const clients: Response[] = [];

developmentRouter.get("/dev/hook", (req, res) => {
  logger.info("Development client connected!");

  const client = res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
    Connection: "keep-alive",
  });

  clients.push(client);
});

developmentRouter.get("/dev/refresh", (req, res) => {
  logger.info("Client refresh requested.");
  let client;

  // For each client in our array...
  // (using pop to empty clients as they will disconnect)
  while ((client = clients.pop())) {
    client.write("data: update\n\n");
  }

  // Let esbuild know that everything is ok!
  res.send(201);
});

developmentRouter.get("/dev/reload", (req, res) => {
  // When esbuild requests a server reload, close the server.
  // esbuild will help re-create a new server.
  logger.info("Server reload requested.");
  res.send(201);
  process.exit(0);
});

export { developmentRouter };
