export const scrollToTheTopSmoothly = () =>
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
export const scrollToTheTopInstantly = () => requestAnimationFrame(() => window.scrollTo(0, 0));
