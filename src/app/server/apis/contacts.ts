import express from 'express';
import range from '../../shared/range';

var apiRouter = express.Router();

var result = range(5).map((id) => ({ id, name: "Item " + id}));

apiRouter.route('/contacts')
    .get((req, res) => {
        res.status(200).json(result);
    });

export default apiRouter;