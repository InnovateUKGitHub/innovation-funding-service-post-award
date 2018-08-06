import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { router } from "./router";

const app  = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// serve the public folder contents
app.use(express.static('public'));
// all our defined routes
app.use(router);

app.listen(port);

console.log(`Listening at http://localhost:${port}`);
