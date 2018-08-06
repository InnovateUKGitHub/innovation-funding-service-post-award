import express from 'express';
import contextProvider from '../features/common/contextProvider';
import { GetAllQuery } from '../features/contacts/getAllQuery';
import { GetByIdQuery } from '../features/contacts/getByIdQuery';

const apiRouter = express.Router();

apiRouter.route('/contacts')
    .get(async (req, res, next) => {
        try {
            let context = contextProvider.start();
            let query = new GetAllQuery();
            let result = await context.runQuery(query);
            res.status(200).json(result);
        }
        catch (e) {
            next(e);
        }
    });


apiRouter.route('/contacts/:id')
    .get(async (req, res, next) => {
        try {
            let context = contextProvider.start();
            let query = new GetByIdQuery(req.params.id);
            let result = await context.runQuery(query);
            res.status(200).json(result);
        }
        catch (e) {
            next(e);
        }
    });

export default apiRouter;