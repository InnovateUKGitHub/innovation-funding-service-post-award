import express from 'express';
import range from '../../shared/range';
import contextProvider from '../features/common/contextProvider';
import {default as GetAllQuery} from '../features/contacts/getAllQuery';
import {GetByIdQuery} from '../features/contacts/getByIdQuery';
import {ResultDto} from '../features/contacts/getByIdQuery';


const apiRouter = express.Router();       

var result = range(5).map((id) => ({ id, name: "Item " + id}));

apiRouter.route('/contacts')
    .get(async (req, res) => {
        let context = contextProvider.start();
        let query = new GetAllQuery();
        let result = await context.runQuery<ResultDto[]>(query);
        res.status(200).json(result);
    });

    
apiRouter.route('/contacts/:id')
    .get(async (req, res) => {
    let context = contextProvider.start();
    let query = new GetByIdQuery();
    query.id = req.params.id;
    let result = await context.runQuery<ResultDto>(query);
    res.status(200).json(result);
});

export default apiRouter;