import express from "express";
import { serverRender } from "./serverRender";
import { apiRoutes } from './apis';

export const router = express.Router();

router.get("*.css", (req, res) => res.status(404).send(""));
router.get("*.png", (req, res) => res.status(404).send(""));
router.get("*.ico", (req, res) => res.status(404).send(""));

router.use('/api', apiRoutes);
router.get('*', serverRender);
router.get('*', (req, res) => res.status(404).send("Not found"));
