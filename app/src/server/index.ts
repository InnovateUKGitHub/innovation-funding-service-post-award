import * as DotEnv from "dotenv";
DotEnv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import "isomorphic-fetch";
import "isomorphic-form-data";

import { router } from "./router";

const defaultSalesforceEmail = process.env.SALESFORCEUSERNAME || "iuk.accproject@bjss.com.bjsspoc2";

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
        email: defaultSalesforceEmail,
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
