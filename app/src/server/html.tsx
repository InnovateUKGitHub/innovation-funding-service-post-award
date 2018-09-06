export function renderHtml(html: string, preloadedState: any = {}) {
  return `
  <!DOCTYPE html>
  <html>
      <head>
          <meta charset="utf-8" />
          <title>GOV.UK - Inovate Funding Service</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="theme-color" content="#0b0c0c" />

          <link rel="shortcut icon" href="/assets/images/favicon.ico" type="image/x-icon" />
          <link rel="mask-icon" href="/assets/images/govuk-mask-icon.svg" color="#0b0c0c">
          <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/govuk-apple-touch-icon-180x180.png">
          <link rel="apple-touch-icon" sizes="167x167" href="/assets/images/govuk-apple-touch-icon-167x167.png">
          <link rel="apple-touch-icon" sizes="152x152" href="/assets/images/govuk-apple-touch-icon-152x152.png">
          <link rel="apple-touch-icon" href="/assets/images/govuk-apple-touch-icon.png">

          <!--[if !IE 8]><!-->
          <link href="/govuk-frontend-1.2.0.min.css" rel="stylesheet" />
          <!--<![endif]-->

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
          <script>
              window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, "\\u003c")}
          </script>
          <script src="/govuk-frontend-1.2.0.min.js"></script>
          <script src="/vendor.js"></script>
          <script src="/bundle.js"></script>
          <script>
              window.GOVUKFrontend.initAll()
          </script>
      </body>
  </html>
`;
}
