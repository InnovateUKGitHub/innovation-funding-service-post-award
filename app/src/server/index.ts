import * as DotEnv from "dotenv";
DotEnv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { router } from "./router";
import cookieSession from "cookie-session";
import { IUser } from "../shared/IUser";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieSession({
  name: "chocolate-chip",
  keys: ["thekey", "thesecret"]
}));

// serve the public folder contents
app.use(express.static("public"));

// until sso is configured this user is created and stored in the session
// this user email is used to connect to salesforce.
app.use((req, resp, next) => {
  if (!req.session || !req.session.user) {
    const newSession: { user: IUser } = {
      user: {
        email: "etlsalesforce@innovateuk.gov.uk.bjsspoc2",
        name: "Salesforce service account"
      }
    };

    if (req.session) {
      req.session.user = newSession.user;
    }
    else {
      req.session = newSession;
    }
  }
  next();
});

// all our defined routes
app.use(router);

app.listen(port);

console.log(`Listening at http://localhost:${port}`);
