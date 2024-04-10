import { HelmetData } from "react-helmet";
import * as colour from "../ui/styles/colours";
import pkg from "../../package.json";
import { SSRCache } from "react-relay-network-modern-ssr/lib/server";
import { PreloadedState } from "redux";
import { IAppError } from "@framework/types/IAppError";
import { Result } from "@ui/validation/result";
import { configuration } from "./features/common/config";
import { IClientConfig } from "../types/IClientConfig";

let versionInformation = "";

const { ACC_BUILD_EPOCH, ACC_BUILD_TAG } = process.env;

const BUILD_DATETIME = ACC_BUILD_EPOCH
  ? new Date(parseInt(ACC_BUILD_EPOCH, 10) * 1000).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    })
  : "(unknown build time)";

versionInformation = `
  <!--
    Innovation Funding Service (Post Award)
    Innovate UK, UK Research and Innovation
  
    Built on ${BUILD_DATETIME}
    ${ACC_BUILD_TAG ?? "(unknown build tag)"}
  -->
  `;

const injectJson = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

/**
 * The template into which the React App is injected. It includes the meta tags, links and google tag manager
 */
export function renderHtml({
  HelmetInstance,
  html,
  preloadedState = {},
  nonce,
  relayData = [],
  formError,
  apiError,
  clientConfig,
}: {
  HelmetInstance: HelmetData;
  html: string;
  preloadedState: PreloadedState<AnyObject>;
  nonce: string;
  relayData?: SSRCache;
  formError: Result[] | undefined;
  apiError: IAppError | undefined;
  clientConfig: IClientConfig;
}) {
  const titleMetaTag = HelmetInstance.title.toString();

  const govukFrontendVersion = pkg.devDependencies["govuk-frontend"].replace(/[^0-9/.]/, "");

  return `
  <!DOCTYPE html>

  ${versionInformation}

  <html lang="en-GB">
      <head>
          ${renderJSGoogleTagManager(configuration.googleTagManagerCode, nonce)}
          
          <meta charset="utf-8" />
          ${titleMetaTag}
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="theme-color" content="${colour.govukColourBlack}" />

          <link rel="shortcut icon" href="/assets/images/favicon.ico" type="image/x-icon" />
          <link rel="mask-icon" href="/assets/images/govuk-mask-icon.svg" color="${colour.govukTextColour}">
          <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/govuk-apple-touch-icon-180x180.png">
          <link rel="apple-touch-icon" sizes="167x167" href="/assets/images/govuk-apple-touch-icon-167x167.png">
          <link rel="apple-touch-icon" sizes="152x152" href="/assets/images/govuk-apple-touch-icon-152x152.png">
          <link rel="apple-touch-icon" href="/assets/images/govuk-apple-touch-icon.png">

          <link href="/build/styles.css?build=${configuration.build}" rel="stylesheet" />

          <meta property="og:image" content="/assets/images/govuk-opengraph-image.png">
      </head>
      <body class="govuk-template__body">
          ${renderNonJSGoogleTagManager(configuration.googleTagManagerCode)}

          <div id="root">${html}</div>

          <script nonce="${nonce}">
            // if js enabled then hide page for moment to allow any difference from server v client rendering to be sorted
            document.body.style.visibility = "hidden";
            setTimeout(function () {
              document.body.style.visibility = "visible";
            }, 10);
            window.__CLIENT_CONFIG__ = ${injectJson(clientConfig)}
            window.__PRELOADED_STATE__ = ${injectJson(preloadedState)}
            window.__RELAY_BOOTSTRAP_DATA__ = ${injectJson(relayData)}
            window.__PRELOADED_FORM_ERRORS__ = ${formError ? injectJson(formError) : undefined}
            window.__PRELOADED_API_ERRORS__ = ${apiError ? injectJson(apiError) : undefined}
          </script>

          <script nonce="${nonce}" src="/govuk-frontend-${govukFrontendVersion}.min.js?build=${
    configuration.build
  }"></script>
          <script nonce="${nonce}" src="/build/bundle.js?build=${configuration.build}"></script>
      </body>
  </html>
`;
}

const renderJSGoogleTagManager = (tagManagerCode: string, nonce: string) => {
  if (!tagManagerCode) {
    return "";
  }
  return `
<!-- Google Tag Manager -->
<script nonce="${nonce}">
    (function(w,d,s,l,i){
      w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;
        j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        var n=d.querySelector('[nonce]');
        n&&j.setAttribute('nonce',n.nonce||n.getAttribute('nonce'));
        f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', '${tagManagerCode}');
</script>
<!-- End Google Tag Manager -->
    `;
};

const renderNonJSGoogleTagManager = (tagManagerCode: string) => {
  if (!tagManagerCode) {
    return "";
  }
  return `
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${tagManagerCode}"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
  `;
};
