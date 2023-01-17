/**
 * Whether the instance of IFS PA is the `acc-dev` environment, or an `acc-dev[0000]` instance.
 */
let isAccDev: boolean;

/**
 * Whether the instance of IFS PA is the `acc-demo` environment.
 */
let isAccDemo: boolean;

/**
 * Whether the instance of IFS PA is the `acc-dev`, `acc-dev[0000]` or `acc-demo` environments.
 */
let isAccDevOrDemo: boolean;

/**
 * Whether we are developing on localhost
 */
let isLocalDevelopment: boolean;

/**
 * Whether the NODE_ENV is development.
 */
let isDevelopment = false;

if (typeof process !== "undefined") {
  isDevelopment = process.env.NODE_ENV === "development";
  isAccDev = process.env.ENV_NAME ? /^acc-dev/.test(process.env.ENV_NAME) : false;
  isAccDemo = process.env.ENV_NAME ? /^acc-demo/.test(process.env.ENV_NAME) : false;
  isAccDevOrDemo = isAccDev || isAccDemo;
  isLocalDevelopment =
    isDevelopment ||
    (process.env.SERVER_URL
      ? process.env.SERVER_URL.includes("localhost") || /127(\.\d{1,3}){3}/.test(process.env.SERVER_URL)
      : false);
}

if (typeof window !== "undefined") {
  isAccDev = window.location.host.startsWith("www-acc-dev") && window.location.host.endsWith(".innovateuk.ukri.org");
  isAccDemo = window.location.host.startsWith("www-acc-demo") && window.location.host.endsWith(".innovateuk.ukri.org");
  isAccDevOrDemo = isAccDev || isAccDemo;
  isLocalDevelopment = window.location.hostname === "localhost" || /^127(\.\d{1,3}){3}$/.test(window.location.hostname);
}

export { isAccDev, isAccDemo, isAccDevOrDemo, isLocalDevelopment, isDevelopment };
