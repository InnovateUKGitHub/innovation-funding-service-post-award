import { Page } from "@playwright/test";
import { ProjectState } from "../fixtures/projectFactory/ProjectState";
import { DevTools } from "../components/DevTools";

export const switchUserTo = async (
  page: Page,
  projectState: ProjectState,
  userType: "Monitoring Officer" | "Project Manager" | "Finance Contact" | "MO" | "PM" | "FC",
) => {
  const projectNumber = projectState.prefix;
  let userTypeShort = "";

  switch (userType) {
    case "Monitoring Officer":
    case "MO":
      userTypeShort = "mo";
      break;

    case "Project Manager":
    case "PM":
      userTypeShort = "pm";
      break;

    case "Finance Contact":
    case "FC":
      userTypeShort = "fc";
      break;
  }

  const email = `${projectNumber}${userTypeShort}@x.gov.uk`;

  const isUserSwitcherOpen = await page.locator("#user-switcher-manual-input").isVisible();
  if (!isUserSwitcherOpen) {
    await page.locator("summary").filter({ hasText: "User Switcher" }).click();
  }

  await page.locator("#user-switcher-manual-input").clear({});
  await page.locator("#user-switcher-manual-input").fill(email);
  await page.waitForTimeout(8000);
  await page.getByText("Switch user and stay on page").click();

  await DevTools.isLoggedInAs(page, email);
  await DevTools.isLoaded(page);
};
