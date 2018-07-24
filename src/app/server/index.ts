import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { apiRoutes } from './apis';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//only allow access to specific build assets
const assetsToReturn = ['client.js', 'client.js.map'];
assetsToReturn.map(asset => app.use('/dist/' + asset, (req, res) => res.sendFile(asset, { root: "dist/"})));

//anything in the public folder can be returned
app.use(express.static('public'));

app.use('/api', apiRoutes);

app.use('/', (req, res) => res.send("<html><body><div id=\"app\"></div><script src=\"/dist/client.js\"></script></body></html>"));


app.get('*', (req, res) => res.status(404).send("Not found"));

app.listen(port);

console.log(`Listening at http://localhost:${port}`);