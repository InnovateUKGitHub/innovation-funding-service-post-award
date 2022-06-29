import { renderToString } from "react-dom/server";
import { Request, Response } from "express";
import { combineReducers, createStore } from "redux";
import { Provider } from "react-redux";

import { TestBed } from "@shared/TestBed";
import { Content } from "@content/content";
import { Guide } from "@ui/componentsGuide/guide";
import * as colour from "@ui/styles/colours";
import * as pkg from "../../package.json";
import { configuration } from "./features/common";

export function componentGuideRender(req: Request, res: Response) {
  const nonce = res.locals.nonce;

  const reducer = combineReducers({});

  const store = createStore(reducer, { });

  const html = renderToString(
    <Provider store={store}>
      <TestBed isServer content={new Content()} shouldOmitRouterProvider>
        <Guide source="server" filter={req.query.guide as string} />
      </TestBed>
    </Provider>,
  );

  res.send(renderGuide(nonce, html));
}

const renderGuide = (nonce: string, html: string) => {
  const govukFrontendVersion = pkg.devDependencies["govuk-frontend"].replace(/[^0-9/.]/, "");

  return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8" />
            <title>GOV.UK - Innovation Funding Service</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="theme-color" content="${colour.govukColourBlack}" />

            <link rel="shortcut icon" href="/assets/images/favicon.ico" type="image/x-icon" />
            <link rel="mask-icon" href="/assets/images/govuk-mask-icon.svg" color="${colour.govukTextColour}">
            <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/govuk-apple-touch-icon-180x180.png">
            <link rel="apple-touch-icon" sizes="167x167" href="/assets/images/govuk-apple-touch-icon-167x167.png">
            <link rel="apple-touch-icon" sizes="152x152" href="/assets/images/govuk-apple-touch-icon-152x152.png">
            <link rel="apple-touch-icon" href="/assets/images/govuk-apple-touch-icon.png">

            <link href="/govuk-frontend-${govukFrontendVersion}.min.css?build=${configuration.build}" rel="stylesheet" />
            <link href="/ifspa-govuk-overrides.css" rel="stylesheet" />
            <link href="/ifspa-govuk-overrides-modal.css" rel="stylesheet" />

            <link href="/ifspa-govuk-print-overrides.css?build=${configuration.build}" rel="stylesheet" media="print"/>

            <meta property="og:image" content="/assets/images/govuk-opengraph-image.png">
        </head>
        <body class="govuk-template__body ">
            <script nonce="${nonce}">
                // if js enabled then hide page for moment to allow any difference from server v client rendering to be sorted
                document.body.style.visibility = "hidden";
                setTimeout(() => {
                    document.body.style.visibility = "visible";
                }, 10);
                document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' : 'js-enabled');
            </script>

            <a href="#main-content" class="govuk-skip-link">Skip to main content</a>

            <div id="root">${html}</div>

            <script nonce="${nonce}" src="/govuk-frontend-${govukFrontendVersion}.min.js"></script>
            <script nonce="${nonce}" src="/build/vendor.js?build=${configuration.build}"></script>
            <script nonce="${nonce}" src="/build/componentsGuide.js?build=${configuration.build}"></script>
        </body>
    </html>
    `;
};
