// TodoPage.ts
import { Page, expect } from "@playwright/test";
import { Fixture, Given, When, Then } from "playwright-bdd/decorators";

export
@Fixture("developerHomepage")
class DeveloperHomepage {
  constructor(public page: Page) {}

  @Given("I am on todo page")
  async open() {
    await this.page.goto("https://demo.playwright.dev/todomvc/");
  }

  @When("I add todo {string}")
  async addToDo(text: string) {
    await this.page.locator("input.new-todo").fill(text);
    await this.page.locator("input.new-todo").press("Enter");
  }

  @Then("visible todos count is {int}")
  async checkVisibleTodosCount(count: number) {
    await expect(this.page.getByTestId("todo-item")).toHaveCount(count);
  }
}
