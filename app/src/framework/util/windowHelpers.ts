export const scrollToTheTopSmoothly = () =>
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
export const scrollToTheTopInstantly = () => requestAnimationFrame(() => window.scrollTo(0, 0));

export const scrollToTheTagSmoothly = (tag: string) => {
  requestAnimationFrame(() => {
    // Find the first instance of the NAME or ID
    const [nameTag] = [...document.getElementsByName(tag)];

    // If it exists, scroll to it.
    if (nameTag) {
      nameTag.scrollIntoView({ behavior: "smooth" });
    }
  });
};
