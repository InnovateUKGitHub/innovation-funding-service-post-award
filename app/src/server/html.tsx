import * as colour from "../ui/styles/colours";
import { configuration } from "../server/features/common";

export function renderHtml(html: string, htmlTitle: string, preloadedState: any = {}, nonce: string) {
  return `
  <!DOCTYPE html>
  <html lang="en">
      <head>
          <meta charset="utf-8" />
          <title>${htmlTitle}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="theme-color" content="${colour.govukColourBlack}" />

          <link rel="shortcut icon" href="/assets/images/favicon.ico" type="image/x-icon" />
          <link rel="mask-icon" href="/assets/images/govuk-mask-icon.svg" color="${colour.govukTextColour}">
          <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/govuk-apple-touch-icon-180x180.png">
          <link rel="apple-touch-icon" sizes="167x167" href="/assets/images/govuk-apple-touch-icon-167x167.png">
          <link rel="apple-touch-icon" sizes="152x152" href="/assets/images/govuk-apple-touch-icon-152x152.png">
          <link rel="apple-touch-icon" href="/assets/images/govuk-apple-touch-icon.png">

          <!--[if !IE 8]><!-->
          <link href="/govuk-frontend-3.0.0.min.css" rel="stylesheet" />
          <!--<![endif]-->

          <!--[if IE 8]>
          <link href="/govuk-frontend-ie8-3.0.0.min.css" rel="stylesheet" />
          <![endif]-->
          <link href="/govuk-overrides.css?build=${configuration.build}" rel="stylesheet" />
          <link href="/govuk-overrides-modal.css?build=${configuration.build}" rel="stylesheet" />
          <link href="/govuk-print.css?build=${configuration.build}" rel="stylesheet" media="print"/>
          <link href="/govuk-print-overrides.css?build=${configuration.build}" rel="stylesheet" media="print"/>

          <meta property="og:image" content="/assets/images/govuk-opengraph-image.png">

      </head>
      <body class="govuk-template__body">
          <a href="#main-content" class="govuk-skip-link">Skip to main content</a>
          <div id="root">${html}</div>
          ${renderJSGoogleTagManager(configuration.googleTagManagerCode, nonce)}
          <script nonce=${nonce}>
            // if js enabled then hide page for moment to allow any difference from server v client rendering to be sorted
            document.body.style.visibility = "hidden";
            setTimeout(function () {
              document.body.style.visibility = "visible";
            }, 10);
            document.body.className = document.body.className + ' js-enabled';
            window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, "\\u003c")}
          </script>
          <script nonce=${nonce} src="/govuk-frontend-3.0.0.min.js"></script>
          <script nonce=${nonce} src="/build/vendor.js?build=${configuration.build}"></script>
          <script nonce=${nonce} src="/build/bundle.js?build=${configuration.build}"></script>
          ${renderNonJSGoogleTagManager(configuration.googleTagManagerCode)}
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
      <script nonce="${nonce}">( function(w,d,s,l,i) {
        w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;
        j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        var n=d.querySelector('[nonce]');
        n&&j.setAttribute('nonce',n.nonce||n.getAttribute('nonce'));
        f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${tagManagerCode}');</script>
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
