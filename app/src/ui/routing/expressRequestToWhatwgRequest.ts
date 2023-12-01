import express from "express";

const expressRequestToWhatwgRequest = (req: express.Request) => {
  const origin = `${req.protocol}://${req.get("host")}`;
  // Note: This had to take originalUrl into account for presumably vite's proxying
  const url = new URL(req.originalUrl || req.url, origin);

  const controller = new AbortController();
  req.on("close", () => controller.abort());

  const headers = new Headers();

  for (const [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  const init: Partial<Request> = {
    method: req.method,
    headers,
    signal: controller.signal,

    // Do not map BODY
  };

  return new Request(url.href, init);
};

export { expressRequestToWhatwgRequest };
