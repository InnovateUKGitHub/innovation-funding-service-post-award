import { HelmetData } from "react-helmet";
import type { PreloadedState } from "redux";
import * as colour from "../ui/styles/colours";
import { configuration } from "../server/features/common";

import * as pkg from "../../package.json";
import { execSync } from "child_process";
import { SSRCache } from "react-relay-network-modern-ssr/lib/server";

let versionInformation = "";

try {
  /**
   * Run a command, capturing the stdout as a string.
   * stderr is ignored.
   *
   * Returns undefined if an error occurs.
   *
   * @author Leondro Lio <leondro.lio@iuk.ukri.org>
   */
  const runCmd = (line: string): string | undefined => {
    try {
      return execSync(line, { stdio: ["pipe", "ignore", "ignore"] })
        .toString()
        .trim();
    } catch {
      return undefined;
    }
  };

  const BUILD_DATETIME = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour12: true,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  });

  const BUILD_GIT_COMMIT_HASH = process.env.BUILD_COMMIT_HASH ?? runCmd("git rev-parse HEAD") ?? "Unknown commit";
  const BUILD_GIT_BRANCH_NAME = process.env.GIT_BRANCH ?? runCmd("git symbolic-ref --short HEAD") ?? "Unknown branch";
  const BUILD_DIRTY_FLAG = runCmd("git status --short --porcelain")?.length ? "-dirty" : "";

  versionInformation = `
  <!--
    Innovation Funding Service (Post Award)
    Innovate UK, UK Research and Innovation
  
    Built on ${BUILD_DATETIME}
    ${BUILD_GIT_BRANCH_NAME} (${BUILD_GIT_COMMIT_HASH}${BUILD_DIRTY_FLAG})
  -->
  `;
} catch {}

/**
 * The template into which the React App is injected. It includes the meta tags, links and google tag manager
 */
export function renderHtml({
  HelmetInstance,
  html,
  preloadedState = {},
  nonce,
  relayData = [],
}: {
  HelmetInstance: HelmetData;
  html: string;
  preloadedState: any;
  nonce: string;
  relayData?: SSRCache;
}) {
  const titleMetaTag = HelmetInstance.title.toString();

  const govukFrontendVersion = pkg.devDependencies["govuk-frontend"].replace(/[^0-9/.]/, "");

  return `
  <!DOCTYPE html>

  ${versionInformation}

  <html lang="en-GB">
      <head>
          <script nonce="${nonce}">document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' : 'js-enabled');</script>
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
            window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, "\\u003c")}
            window.__RELAY_BOOTSTRAP_DATA__ = ${JSON.stringify(relayData).replace(/</g, "\\u003c")}
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
