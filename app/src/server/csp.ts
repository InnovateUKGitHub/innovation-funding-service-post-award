import express from "express";
import { Logger } from "../server/features/common/logger";

export const router = express.Router();

const endpoint = "/api/csp";

// violation-report endpoint logs Content Security Policy Violations
router.post(`${endpoint}/violation-report`, async (req, res) => {
  const logger = new Logger("Content-Security-Policy-Report");
  logger.warn("Content security policy violation", req.body);
});
