import * as React from "react";
import { Request, Response } from "express";
import { renderToString } from "react-dom/server";
import { Guide } from "../ui/componentsGuide/guide";
import * as colour from "../ui/styles/colours";

export function componentGuideRender(req: Request, res: Response) {
    res.send(renderGuide(renderToString(<Guide source="server" filter={req.query.guide}/>)));
}

const renderGuide = (html: string) => {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8" />
            <title>GOV.UK - Innovate Funding Service</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="theme-color" content="${colour.GOVUK_COLOUR_BLACK}" />

            <link rel="shortcut icon" href="/assets/images/favicon.ico" type="image/x-icon" />
            <link rel="mask-icon" href="/assets/images/govuk-mask-icon.svg" color="${colour.GOVUK_TEXT_COLOUR}">
            <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/govuk-apple-touch-icon-180x180.png">
            <link rel="apple-touch-icon" sizes="167x167" href="/assets/images/govuk-apple-touch-icon-167x167.png">
            <link rel="apple-touch-icon" sizes="152x152" href="/assets/images/govuk-apple-touch-icon-152x152.png">
            <link rel="apple-touch-icon" href="/assets/images/govuk-apple-touch-icon.png">
            <!--[if !IE 8]><!-->
            <link href="/govuk-frontend-1.2.0.min.css" rel="stylesheet" />
            <!--<![endif]-->
            <link href="/govuk-overrides.css" rel="stylesheet" />

            <!--[if IE 8]>
            <link href="/govuk-frontend-ie8-1.2.0.min.css" rel="stylesheet" />
            <![endif]-->

            <meta property="og:image" content="/assets/images/govuk-opengraph-image.png">
        </head>
        <body class="govuk-template__body ">
            <script>
                document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' : 'js-enabled');
            </script>
            <a href="#main-content" class="govuk-skip-link">Skip to main content</a>
            <div id="root">${html}</div>
            <script src="/govuk-frontend-1.2.0.min.js"></script>
            <script src="/vendor.js"></script>
            <script src="/componentsGuide.js"></script>
            <script>
                window.GOVUKFrontend.initAll()
            </script>
        </body>
    </html>
    `;
};
