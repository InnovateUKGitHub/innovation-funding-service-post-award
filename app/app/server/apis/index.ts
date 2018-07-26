import express, { Router } from 'express';
import contacts from './contacts'

var apiRouter = express.Router();

export const apiRoutes : Router[] = [
    contacts,
    apiRouter.all("*", (req, res) => res.status(404).json({ error: "api route not found" }))
];