import { Locator, Page, expect } from "@playwright/test";
import { Fixture, Then, When } from "playwright-bdd/decorators";
import { PageHeading } from "../../../components/PageHeading";
import { Commands } from "../../Commands";
import { CrdClaims } from "./Claims/crdClaims";
import { DataTable } from "playwright-bdd";

export
@Fixture("viewForecast")
class ViewForecast {
  protected readonly page: Page;
  protected readonly commands: Commands;

  private readonly pageTitle: PageHeading;
  private readonly continueToSummaryButton: Locator;
  private readonly claimSummaryTitle: PageHeading;
  private readonly backToUpdateForecast: Locator;
  private readonly updateForecastHeading: PageHeading;
  private readonly submitChangesButton: Locator;
  private readonly xlsDownloadLink: Locator;
  private readonly csvDownloadLink: Locator;
  private readonly invalidForecastData: Array<[string, string]>;
  private readonly forecastCostsWarningQa: Locator;
  private readonly forecastCostsWarningMessage: Locator;
  private readonly forecastCostsWarningListItem: Locator;
  private readonly forecastWarningMoStatement: Locator;
  private readonly monthList = <const>[
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  constructor({ page, commands }: { page: Page; commands: Commands }) {
    this.page = page;
    this.commands = commands;
    this.pageTitle = PageHeading.fromTitle(page, "Forecast");
    this.continueToSummaryButton = this.page.getByRole("button").filter({ hasText: "Continue to summary" });
    this.claimSummaryTitle = PageHeading.fromTitle(this.page, "Claim summary");
    this.backToUpdateForecast = this.commands.backLink("Back to update forecast");
    this.updateForecastHeading = PageHeading.fromTitle(this.page, "Update forecast");
    this.submitChangesButton = this.page.getByRole("button").filter({ hasText: "Submit changes" });
    this.xlsDownloadLink = this.page.getByRole("link").filter({ hasText: "Download forecast (.xlsx" });
    this.csvDownloadLink = this.page.getByRole("link").filter({ hasText: "Download forecast (.csv)" });
    this.invalidForecastData = [
      ["", "Enter forecast."],
      ["10000000", "Your overall total cannot be higher than your total eligible costs."],
      ["-10000000000", "Forecast must be -£1,000,000,000.00 or more."],
      ["1000000000000", "Forecast must be £999,999,999,999.00 or less."],
    ];
    this.forecastCostsWarningQa = this.page.getByTestId("forecasts-warning-fc-content");
    this.forecastCostsWarningMessage = this.forecastCostsWarningQa.filter({
      hasText: "The amount you are requesting is more than the agreed costs for:",
    });
    this.forecastCostsWarningListItem = this.forecastCostsWarningQa.locator("ul").locator("li");
    this.forecastWarningMoStatement = this.forecastCostsWarningQa.filter({
      hasText: "Your Monitoring Officer will let you know if they have any concerns.",
    });
  }

  @Then("the user sees the project forecast for {string}")
  async isPage(partnerName: string, table: DataTable) {
    await expect(this.pageTitle.get()).toBeVisible();
    await expect(this.page.locator("h2,h3,h4,h5,h6").filter({ hasText: partnerName })).toBeVisible();
    await this.viewForecastTable(table, true);
    await expect(this.xlsDownloadLink).toBeVisible();
    await expect(this.csvDownloadLink).toBeVisible();
  }
  @When("the user updates and saves the Claims forecast table")
  async updateClaimForecastTable(table: DataTable) {
    await this.completeForecastTable(table, true, false);
    await this.continueToSummaryButton.click();
    await this.claimSummaryTitle.isVisible();
    await this.backToUpdateForecast.click();
    await this.updateForecastHeading.isVisible();
  }

  @When("the user updates and saves the Project forecast table")
  async updateProjectForecastTable(table: DataTable) {
    await this.completeForecastTable(table, true, false);
    await this.submitChangesButton.click();
    await expect(this.xlsDownloadLink).toBeVisible();
    await expect(this.csvDownloadLink).toBeVisible();
  }

  @Then("the user can see the view-only Forecast table")
  async viewForecastTable(table: DataTable, forecastTile?: boolean, updated?: boolean) {
    if (forecastTile) {
      if (updated) {
        await this.completeForecastTable(table, false, true, "#ifspa-forecast-table", true);
      } else {
        await this.completeForecastTable(table, false, true, "#ifspa-forecast-table");
      }
    } else {
      await this.completeForecastTable(table, false, false, "#ifspa-forecast-table");
    }
  }

  @When("the user enters invalid information into the {string} forecast")
  async validateForecastTable(forecastType: string) {
    const labour2 = this.page.getByLabel(`Labour period 2`);
    for (const [data, message] of this.invalidForecastData) {
      await labour2.fill(data);
      if (forecastType === "Claim") {
        await this.continueToSummaryButton.click();
      } else {
        await this.submitChangesButton.click();
      }
      await this.commands.validationLink(message);
    }
    await labour2.fill("2000000");
    await expect(this.forecastCostsWarningMessage).toBeVisible();
    await expect(this.forecastCostsWarningListItem.filter({ hasText: "labour" })).toBeVisible();
    await expect(this.forecastCostsWarningListItem.filter({ hasText: "overheads" })).toBeVisible();
    await expect(this.forecastWarningMoStatement).toBeVisible();
    for (let i = 2; i < 8; i++) {
      await this.page.getByLabel(`Labour period ${i}`).fill("");
    }
    if (forecastType === "Claim") {
      await this.continueToSummaryButton.click();
    } else {
      await this.submitChangesButton.click();
    }
    await expect(
      this.page.getByTestId("validation-summary").getByRole("link").filter({ hasText: "Enter forecast." }),
    ).toHaveCount(6);
    for (let i = 2; i < 7; i++) {
      await this.page.getByLabel(`Labour period ${i}`).fill("1");
    }
  }

  @Then("the user will be advised of correct entries")
  async validationMessageOnscreen() {
    await this.commands.validationLink("Enter forecast.");
  }

  @When("the user enters more than the agreed value for {string}")
  async exceedCostsForCat(category: string) {
    await this.page.getByLabel(`${category} period 2`).fill("7800000.01");
    await this.submitChangesButton.click();
  }

  @Then("the user is advised they have exceeded costs for {string}")
  async advisedExceededCostsForCat(category: string) {
    await expect(
      this.forecastCostsWarningQa.filter({
        hasText: "The amount you are requesting is more than the agreed costs for:",
      }),
    ).toBeVisible();
    await expect(
      this.forecastCostsWarningQa.locator("ul").locator("li").filter({ hasText: category.toLowerCase() }),
    ).toBeVisible();
  }

  @When("the user exceeds the grant value")
  async exceedGrantValue() {
    await this.page.getByLabel(`Labour period 2`).fill("79560000.01");
    await this.submitChangesButton.click();
  }

  @Then("the user will be told they have exceeded the grant value")
  async exceedGrantValidation() {
    await this.commands.validationLink("Your overall total cannot be higher than your total eligible costs.");
  }

  @Then("the {string} figures accurately reflect the changes")
  async forecastTableUpdated(forecastType: string, table: DataTable) {
    if (forecastType === "Project") {
      await this.completeForecastTable(table, false, true, "#ifspa-forecast-table", true);
    } else {
      await this.completeForecastTable(table, false);
    }
  }

  /**
   * View and update Forecast methods
   * This function is setup to enable the feature to run independently of previous claims steps.
   */
  async completeForecastTable(
    table: DataTable,
    update: boolean,
    forecastTile?: boolean,
    viewOnlyID?: string,
    updated?: boolean,
  ) {
    const data = table.hashes();
    let updateFigure: number;
    let overheadsPeriodCost: string;
    let rowTotal: string;
    let oh: number;
    let col: number;
    let overheadsTotal: string;
    let columnTotal: string;
    let tableLocator: Locator;
    let period: string;
    let ifLabourPopulated: Locator;
    if (viewOnlyID) {
      tableLocator = this.page.locator(viewOnlyID);
      period = "Period";
    } else {
      tableLocator = this.page.getByRole("table");
      period = "period";
    }
    ifLabourPopulated = this.page.getByLabel(`Labour ${period} 1`).filter({ hasText: "£1,666.23" });
    if (await ifLabourPopulated.isVisible()) {
      updateFigure = 708939.43;
      overheadsPeriodCost = "£141,787.89";
      rowTotal = "£7,799,999.96";
      overheadsTotal = "£1,560,000.04";
      columnTotal = "£7,231,182.19";
    } else if (forecastTile) {
      if (updated) {
        updateFigure = 709090.9;
        rowTotal = "£7,799,999.90";
        overheadsPeriodCost = "£141,818.18";
        overheadsTotal = "£1,559,999.98";
        columnTotal = "£7,232,727.18";
      } else {
        updateFigure = 200000;
        rowTotal = "£7,700,000.00";
        oh = 40000;
        overheadsPeriodCost = oh.toLocaleString("en-GB", { style: "currency", currency: "GBP" });
        overheadsTotal = "£1,540,000.00";
        col = 2040000.0;
        columnTotal = col.toLocaleString("en-GB", { style: "currency", currency: "GBP" });
      }
    } else {
      updateFigure = 709090.9;
      rowTotal = "£7,799,999.90";
      overheadsPeriodCost = "£141,818.18";
      overheadsTotal = "£1,559,999.98";
      columnTotal = "£7,232,727.18";
    }
    //Table headers
    if (viewOnlyID) {
      if (forecastTile) {
        await this.forecastTableHeaders(true, viewOnlyID);
      } else {
        await this.forecastTableHeaders(false, viewOnlyID);
      }
    } else {
      await this.forecastTableHeaders();
    }
    /**
     * Note for the Forecast tile tests, the forecast costs jump in regular increments every period.
     * Instead of hardcoding this, the method below will update along the row accordingly.
     */
    let upFig = updateFigure;
    //Table body
    for (const cat of data) {
      for (let i = 2; i < 13; i++) {
        if (update) {
          await this.fillCell(cat["Category"], period, i, String(updateFigure));
          await this.checkCell(false, cat["Category"], period, i, String(updateFigure));
        } else {
          if (viewOnlyID) {
            let updateGbp = upFig.toLocaleString("en-GB", { style: "currency", currency: "GBP" });
            if (forecastTile) {
              if (updated) {
                await this.checkCell(true, cat["Category"], period, i, updateGbp);
              } else {
                await this.checkCell(true, cat["Category"], period, i, updateGbp);
                if (upFig === 1200000) {
                  upFig = updateFigure;
                } else {
                  upFig = upFig + 100000;
                }
              }
            } else {
              await this.checkCell(true, cat["Category"], period, i, updateGbp);
            }
          } else {
            await this.checkCell(false, cat["Category"], period, i, String(updateFigure));
          }
        }
      }
      //Row totals
      await this.checkRowTotal(tableLocator, Number(cat["Row number"]), 14, rowTotal);
    }
    //Overheads rows
    let upOh = oh;
    for (let i = 2; i < 13; i++) {
      if (update) {
        await this.checkCell(true, "Overheads", period, i, overheadsPeriodCost);
      } else {
        if (viewOnlyID) {
          if (forecastTile) {
            if (updated) {
              await this.checkCell(true, "Overheads", period, i, overheadsPeriodCost);
            } else {
              let updateOverheadsCost = upOh.toLocaleString("en-GB", { style: "currency", currency: "GBP" });
              await this.checkCell(true, "Overheads", period, i, updateOverheadsCost);
              if (upOh === 240000.0) {
                upOh = oh;
              } else {
                upOh = upOh + 20000;
              }
            }
          } else {
            await this.checkCell(true, "Overheads", period, i, overheadsPeriodCost);
          }
        } else {
          await this.checkCell(true, "Overheads", period, i, overheadsPeriodCost);
        }
      }
    }
    await this.checkRowTotal(tableLocator, 2, 14, overheadsTotal);
    //Column totals
    if (forecastTile) {
      if (updated) {
        for (let i = 1; i < 12; i++) {
          await this.checkFootCell(tableLocator, i, columnTotal);
        }
      } else {
        let colTotal = col;
        for (let i = 1; i < 12; i++) {
          let colTotalGBP = colTotal.toLocaleString("en-GB", { style: "currency", currency: "GBP" });
          await this.checkFootCell(tableLocator, i, colTotalGBP);
          colTotal = colTotal + 1020000;
        }
      }
    } else {
      for (let i = 1; i < 12; i++) {
        await this.checkFootCell(tableLocator, i, columnTotal);
      }
    }
  }
  async topThreeRows(forecastTile?: boolean, moViewID?: string) {
    let period1IarNeeded: string;
    let locator: Locator;
    if (moViewID) {
      if (forecastTile) {
        period1IarNeeded = "Yes";
      } else {
        period1IarNeeded = "No";
      }
      locator = this.page.locator(moViewID);
    } else {
      locator = this.page.getByRole("table");
      period1IarNeeded = "Yes";
    }
    const rowHeaders = [
      ["Period", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      ["IAR Due", period1IarNeeded, "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes"],
      [
        "Month",
        this.getPeriodDateRange(0),
        this.getPeriodDateRange(3),
        this.getPeriodDateRange(6),
        this.getPeriodDateRange(9),
        this.getPeriodDateRange(12),
        this.getPeriodDateRange(15),
        this.getPeriodDateRange(18),
        this.getPeriodDateRange(21),
        this.getPeriodDateRange(24),
        this.getPeriodDateRange(27),
        this.getPeriodDateRange(30),
        this.getPeriodDateRange(33),
      ],
    ];
    let rowNumber = 2;
    for (const row of rowHeaders) {
      for (let i = 1; i < 13; i++) {
        await expect(
          locator.locator(`//thead//tr[${rowNumber}]//th[${i}]`).filter({ hasText: row[i - 1] }),
        ).toBeVisible();
      }
      rowNumber++;
    }
  }

  async forecastTableHeaders(forecastTile?: boolean, moViewID?: string) {
    const topHeaders = ["Costs you are claiming", "Forecast", "Total", "Total eligible costs", "Difference"];
    let i = 1;
    let table: Locator;
    if (moViewID) {
      table = this.page.locator(moViewID);
    } else {
      table = this.page.getByRole("table");
    }
    for (const header of topHeaders) {
      await expect(
        table.locator("thead").locator("tr").nth(0).locator("th").nth(i).filter({ hasText: header }),
      ).toBeVisible();
      i++;
    }
    if (moViewID) {
      if (forecastTile) {
        await this.topThreeRows(true, moViewID);
      } else {
        await this.topThreeRows(false, moViewID);
      }
    } else {
      await this.topThreeRows();
    }
  }

  async checkCell(viewOnly: boolean, category: string, periodCase: string, periodNumber: number, cellValue: string) {
    if (viewOnly) {
      await expect(this.page.getByLabel(`${category} ${periodCase} ${periodNumber}`)).toHaveText(cellValue);
    } else {
      await expect(this.page.getByLabel(`${category} ${periodCase} ${periodNumber}`)).toHaveValue(cellValue);
    }
  }

  async checkFootCell(tableLocator: Locator, nth: number, text: string) {
    await expect(
      tableLocator.locator("tfoot").locator("tr").nth(0).locator("td").nth(nth).filter({ hasText: text }),
    ).toBeVisible();
  }

  async checkRowTotal(tableLocator: Locator, rowNum: number, colNum: number, total: string) {
    await expect(
      tableLocator.locator(`//tbody//tr[${rowNum}]//td[${colNum}]//span`).filter({ hasText: total }),
    ).toBeVisible();
  }

  async fillCell(category: string, periodCase: string, periodNumber: number, cellValue: string) {
    await this.page.getByLabel(`${category} ${periodCase} ${periodNumber}`).fill(cellValue);
  }

  getPeriodDateRange(startIncrement: number = 0) {
    const date = new Date();
    const startMonth = (date.getMonth() + startIncrement) % 12;
    const startMonthString = this.monthList[startMonth];
    /**
     * Commenting these two out for time being. It isn't strictly necessary but there for future.
     */
    //const endMonth = (startMonth + 2) % 12;
    //const endMonthString = this.monthList[endMonth];
    return startMonthString;
  }
}
