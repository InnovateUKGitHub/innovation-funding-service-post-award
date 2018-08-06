import express from 'express';
import contextProvider from '../features/common/contextProvider';
import { GetAllQuery } from '../features/contacts/getAllQuery';
import { GetByIdQuery } from '../features/contacts/getByIdQuery';

const apiRouter = express.Router();

apiRouter.route('/contacts')
    .get(async (req, res, next) => {
        try {
            const context = contextProvider.start();
            const query = new GetAllQuery();
            const result = await context.runQuery(query);
            res.status(200).json(result);
        }
        catch (e) {
            next(e);
        }
    });

apiRouter.route('/contacts/:id')
    .get(async (req, res, next) => {
        try {
            const context = contextProvider.start();
            const query = new GetByIdQuery(req.params.id);
            const result = await context.runQuery(query);
            res.status(200).json(result);
        }
        catch (e) {
            next(e);
        }
    });

export default apiRouter;
