// fixtures.ts
import { test as base } from "playwright-bdd";
import { DeveloperHomepage } from "./pages/DeveloperHomepage";

export const test = base.extend<{ developerHomepage: DeveloperHomepage }>({
  developerHomepage: ({ page }, use) => use(new DeveloperHomepage(page)),
});
