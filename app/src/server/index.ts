import "module-alias/register";
import "isomorphic-fetch";
import "isomorphic-form-data";
import "reflect-metadata";

import { Command } from "commander";
import { Server } from "./server";
import { Logger } from "@shared/developmentLogger";

const logger = new Logger("Welcome");
logger.info("Welcome to IFS Post Award!");

interface CustomProcessArgs {
  dev?: boolean;
}

const program = new Command();
program.option("--dev", "Enable development endpoints for use in esbuild", false);
program.parse();

const { dev } = program.opts() as CustomProcessArgs;

const server = new Server(dev ?? false);
server.start();
