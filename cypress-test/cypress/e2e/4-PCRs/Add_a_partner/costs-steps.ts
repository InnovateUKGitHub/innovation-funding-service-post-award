import { pounds } from "common/pounds";
import { addPartnerLabourGuidance } from "../steps";
import { visitApp } from "common/visit";
import { loremIpsum131k, loremIpsum255Char } from "common/lorem";
import { navigateToCostCat } from "./add-partner-e2e-steps";

const refreshTest = () => {
  cy.get("main").then($main => {
    if ($main.text().includes("Internal Developer Error")) {
      cy.log("refreshing after failure");
      visitApp({
        asUser: "james.black@euimeabs.test",
        path: "/projects/a0E2600000kSotUEAS/pcrs/a0GAd000001Rj5SMAS/prepare/item/a0GAd000001RqrZMAS?step=9",
      });
    }
  });
};

const getCost = (el: JQuery<HTMLElement>) => {
  const val = el.text();
  const num = Number((val as unknown as string).replace("£", "").replace(/,/g, ""));
  if (isNaN(num)) throw new Error("cost is not a number");
  return num;
};

/**
 * check the total for the new item page
 */
const checkTotalCostEquals = (value: string, totalCostLabel: string = "Total cost") => {
  cy.log("==checking total cost===");
  cy.get("h3").contains(totalCostLabel).siblings().contains(value);
};

type OtherCostPages = "1" | "2" | "3" | "4" | "5";
type Category =
  | "Labour"
  | "Materials"
  | "Capital usage"
  | "Subcontracting"
  | "Travel and subsistence"
  | "Other costs"
  | "Other costs 2"
  | "Other costs 3"
  | "Other costs 4"
  | "Other costs 5";

const checkSummary = (
  category: Category,
  description: string,
  cost: number,
  categoryTotal: number,
  totalCost: number,
) => {
  cy.clickOn(`Save and return to ${category.toLowerCase()}`);
  cy.checkTotalFor(description, pounds(cost));
  cy.checkTotalFor(`Total ${category.toLowerCase()}`, pounds(categoryTotal + cost));
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor(category, pounds(categoryTotal + cost));
  cy.checkTotalFor("Total costs (£)", pounds(totalCost + cost));
};

export function checkAddLabourItem() {
  refreshTest();
  cy.get("th#new-partner-total-costs").then($span => {
    const totalCost = getCost($span);
    const cost = 50000;
    cy.clickLink("Labour", "Edit");
    addPartnerLabourGuidance();
    cy.get("th#category-total-cost").then(function ($span) {
      const categoryTotal = getCost($span);
      cy.tableHeader("Description");
      cy.tableHeader("Cost (£)");
      cy.tableHeader("Total labour");
      cy.log("navigate to add a cost");
      cy.clickOn("Add a cost");
      cy.get("h2").contains("Labour");
      cy.clickOn("Save and return to labour");
      cy.validationLink("Enter description of role.");
      cy.validationLink("Enter gross cost of role.");
      cy.validationLink("Enter rate per day.");
      cy.validationLink("Enter days spent on project.");
      cy.getByLabel("Role within project").type("Law keeper");
      cy.validateCurrency("Gross employee cost", "Gross cost of role", "50000");
      cy.validateCurrency("Rate (£/day)", "rate per day", "500");
      cy.validatePositiveWholeNumber("Days to be spent by all staff with this role", "Days spent on project", "100");
      checkTotalCostEquals(pounds(cost));
      checkSummary("Labour", "Law keeper", cost, categoryTotal, totalCost);
    });
  });
}

export const checkAddOverheadItem = () => {
  refreshTest();
  cy.get("th#new-partner-total-costs").then($span => {
    const totalCost = getCost($span);
    const cost = 15000;
    cy.checkTotalFor("Total costs (£)", pounds(totalCost)), "overheads before";
    cy.clickLink("Overheads", "Edit");
    cy.get("h2").contains("Overheads");
    cy.log("check the guidance for the overheads section");
    cy.get("span").contains("Overheads guidance").click();
    cy.contains(
      "You may claim for no overhead costs or 20% of your labour costs without providing any further supporting documentation or calculations. Actual costs can be claimed up to a maximum of the calculated figure.",
    );
    cy.contains(
      "If you feel your overheads are higher than 20% you may calculate a value using the Innovate UK model in the spreadsheet available below. The model shows you which types of indirect costs associated with your project you may claim. For support with this option, please contact our Customer Support Service on 0300 321 4357. Any value claimed under this model will be subject to a review. This will assess the appropriateness of your claim if your grant application is successful.",
    );
    checkTotalCostEquals("£0.00");
    cy.getByLabel("0%").click();
    checkTotalCostEquals("£0.00");
    cy.getByLabel("20%").click();
    checkTotalCostEquals("£10,000.00");
    cy.getByLabel("Calculated").click();
    checkTotalCostEquals("£0.00");
    cy.clickOn("Save and return to project costs");
    cy.validateCurrency("Total cost of overheads as calculated in the spreadsheet (£)", "Total cost", "15000");
    checkTotalCostEquals(pounds(cost));
    cy.clickOn("Save and return to project costs");
    cy.get("h2").contains("Project costs for new partner");
    cy.checkTotalFor("Overheads", pounds(cost));
    cy.checkTotalFor("Total costs (£)", pounds(totalCost + cost));
  });
};

export const checkAddMaterialsItem = () => {
  refreshTest();
  cy.get("th#new-partner-total-costs").then($span => {
    const totalCost = getCost($span);
    const quantity = 25000;
    const costPerItem = 29.99;
    const cost = quantity * costPerItem;
    cy.clickLink("Materials", "Edit");
    cy.get("h2").contains("Materials");
    cy.get("th#category-total-cost").then($span => {
      const categoryTotal = getCost($span);
      cy.log("check the guidance for the materials section");
      cy.get("span").contains("Materials guidance").click();
      cy.contains("You can claim the costs of materials used on your project providing:");
      [
        "they are not already purchased or included in the overheads",
        "they are purchased from third parties",
        "they won’t have a residual/resale value at the end of your project. If they do you can claim the costs minus this value",
      ].forEach(x => cy.contains("li", x));

      cy.contains("Materials supplied by associated companies or project partners should be charged at cost.");
      cy.contains(
        "Software that you have purchased specifically for use during your project may be included. If you already own the software then only additional costs which are incurred and paid during your project, will be eligible. For example, installation, training or customisation.",
      );
      cy.contains("Material costs must be itemised to justify that they are eligible.");
      cy.clickOn("Add a cost");
      cy.clickOn("Save and return to materials");
      cy.validationLink("Enter item description.");
      cy.getByLabel("Item").clear().type("dinosaur toys");
      cy.validatePositiveWholeNumber("Quantity", "Quantity", String(quantity));
      cy.validateCurrency("Cost per item (£)", "cost per item", String(costPerItem));
      checkTotalCostEquals(pounds(cost));
      checkSummary("Materials", "dinosaur toys", cost, categoryTotal, totalCost);
    });
  });
};

export const checkAddCapitalUsageItem = () => {
  refreshTest();
  cy.get("th#new-partner-total-costs").then($span => {
    const totalCost = getCost($span);
    const cost = 8000;
    cy.clickLink("Capital usage", "Edit");
    cy.get("h2").contains("Capital usage");
    cy.get("th#category-total-cost").then($span => {
      const categoryTotal = getCost($span);
      cy.log("check the guidance for the capital usage section");
      cy.get("span").contains("Capital usage guidance").click();
      cy.contains("You can claim the usage costs of capital assets you will buy for, or use on, your project.");
      cy.contains(
        "You will need to calculate a ‘usage’ value for each item. You can do this by deducting its expected value from its original price at the end of your project. If you owned the equipment before the project started then you should use its net present value",
      );
      cy.contains(
        "This value is then multiplied by the amount, in percentages, that is used during the project. This final value represents the eligible cost to your project.",
      );
      cy.clickOn("Add a cost");
      cy.clickOn("Save and return to capital usage");
      cy.log("checking invalid states");
      cy.validationLink("Enter item description.");
      cy.validationLink("Select item type.");
      cy.validationLink("Enter net present value.");
      cy.validationLink("Enter residual value.");
      cy.validationLink("Enter depreciation period.");
      cy.validationLink("Enter utilisation.");
      cy.getByLabel("Item").clear().type("Slush fund usage");
      cy.getByLabel("New").click();
      cy.validatePositiveWholeNumber("Depreciation period (months)", "Depreciation period", "24");
      cy.validateCurrency("Net present value (£)", "net present value", "25000");
      cy.validateCurrency("Residual value at end of project (£)", "residual value", "9000");
      cy.getByLabel("Utilisation (%)").clear().type("banana");
      cy.validationLink("Utilisation must be a number.");
      cy.getByLabel("Utilisation (%)").clear().type("-23");
      cy.validationLink("Utilisation must be 0 or more.");
      cy.getByLabel("Utilisation (%)").clear().type("223");
      cy.validationLink("Utilisation must be a value under 100%.");
      cy.getByLabel("Utilisation (%)").clear().type("22.33333");
      cy.validationLink("Utilisation must be 2 decimal places or fewer.");
      cy.getByLabel("Utilisation (%)").clear().type("100");
      cy.validationLink("Utilisation must be a value under 100%.");
      cy.getByLabel("Utilisation (%)").clear().type("50");
      checkTotalCostEquals("£8,000.00", "Net cost");
      checkSummary("Capital usage", "Slush fund usage", cost, categoryTotal, totalCost);
    });
  });
};

export const checkAddSubcontractingItem = () => {
  refreshTest();
  cy.get("th#new-partner-total-costs").then($span => {
    const totalCost = getCost($span);
    const cost = 2500;
    cy.clickLink("Subcontracting", "Edit");
    cy.get("h2").contains("Subcontracting");
    cy.get("th#category-total-cost").then($span => {
      const categoryTotal = getCost($span);
      cy.log("check the guidance for the subcontracting section");
      cy.get("span").contains("Subcontracting guidance").click();
      cy.contains(
        "You can subcontract work if you don’t have the expertise in your project team. You can also subcontract if it is cheaper than developing your skills in-house.",
      );

      cy.contains(
        "Subcontracting costs relate to work carried out by third party organisations. These organisations are not part of your project.",
      );
      cy.contains(
        "Subcontracting is eligible providing it is justified as to why the work cannot be performed by a project partner.",
      );
      cy.contains("Subcontracting associate companies should be charged at cost.");
      cy.contains(
        "Where possible you should select a UK based contractor. You should name the subcontractor (where known) and describe what they will be doing. You should also state where the work will be undertaken. We will look at the size of this contribution when assessing your eligibility and level of support.",
      );
      cy.clickOn("Add a cost");
      cy.clickOn("Save and return to subcontracting");
      cy.validationLink("Enter subcontractor name.");
      cy.validationLink("Enter subcontractor country.");
      cy.validationLink("Enter role and description.");
      cy.validationLink("Enter cost.");
      cy.getByLabel("Subcontractor name").invoke("val", loremIpsum255Char).trigger("input");
      cy.getByLabel("Subcontractor name").type("{moveToEnd}tt");
      cy.getByLabel("Country where the subcontractor will work").invoke("val", loremIpsum255Char).trigger("input");
      cy.getByLabel("Country where the subcontractor will work").type("{moveToEnd}tt");
      cy.getByLabel("Role of the the subcontractor in the project and description of the work they will do")
        .invoke("val", loremIpsum131k)
        .trigger("input");
      cy.getByLabel("Role of the the subcontractor in the project and description of the work they will do").type(
        "{moveToEnd}t",
      );
      cy.paragraph("You have 131073 characters");
      cy.clickOn("Save and return to subcontracting");
      cy.validationLink("Subcontractor name must be 255 or fewer.");
      cy.paragraph("Subcontractor name must be 255 or fewer.");
      cy.validationLink("Subcontractor country must be 255 characters or fewer.");
      cy.paragraph("Subcontractor country must be 255 characters or fewer.");
      cy.validationLink("Role and description must be 131072 or fewer.");
      cy.paragraph("Role and description must be 131072 or fewer.");
      cy.getByLabel("Subcontractor name").type("{backspace}");
      cy.getByLabel("Country where the subcontractor will work").type("{backspace}");
      cy.getByLabel("Role of the the subcontractor in the project and description of the work they will do").type(
        "{backspace}",
      );
      cy.paragraph("You have 131072 characters");
      [
        "Subcontractor name must be 255 or fewer.",
        "Subcontractor country must be 255 characters or fewer.",
        "Role and description must be 131072 or fewer.",
      ].forEach(validation => {
        cy.getByQA("validation-summary").should("not.contain", validation);
      });
      cy.getByLabel("Role of the the subcontractor in the project and description of the work they will do")
        .clear()
        .type("ducky activities");
      cy.paragraph("You have 16 characters");
      cy.getByLabel("Subcontractor name").clear().type("Donald duck");
      cy.getByLabel("Country where the subcontractor will work").clear().type("USA");
      cy.validateCurrency("Cost (£)", "cost", String(cost));
      checkSummary("Subcontracting", "Donald duck", cost, categoryTotal, totalCost);
    });
  });
};

export const checkAddTravelAndSubsistenceItem = () => {
  refreshTest();
  cy.get("th#new-partner-total-costs").then($span => {
    const totalCost = getCost($span);
    const cost = 12000 * 3;
    cy.clickLink("Travel and subsistence", "Edit");
    cy.get("h2").contains("Travel and subsistence");
    cy.get("th#category-total-cost").then($span => {
      const categoryTotal = getCost($span);
      cy.log("check the guidance for the travel and subsistence section");
      cy.get("span").contains("Travel and subsistence guidance").click();
      cy.contains(
        "Include all travel and subsistence costs that relate to this project. Be specific and add each item separately.",
      );
      cy.contains(
        "You can claim reasonable travel and subsistence costs for those individuals identified in the labour table. Costs must be necessary and be solely for the progression of your project.",
      );
      cy.contains(
        "Travel costs must be at economy travel only. State the reason for travel, number of people travelling, mode of transport, cost per trip and number of trips.",
      );
      cy.contains(
        "Provide full details and the purpose for any subsistence expenditure, including the number of staff involved.",
      );
      cy.clickOn("Add a cost");

      cy.clickOn("Save and return to travel and subsistence");
      cy.validationLink("Enter description of cost.");
      cy.validationLink("Enter number of times.");
      cy.validationLink("Enter cost of each.");
      cy.getByLabel("Purpose of journey or description of subsistence cost").clear().type("Lorem");
      cy.validatePositiveWholeNumber("Number of times", "Number of times", "10000000000000000000");
      cy.validateCurrency("Cost of each (£)", "cost of each", "10000000000000000000");
      cy.clickOn("Save and return to travel and subsistence");
      cy.validationLink("Cost of each must be £999,999,999,999.00 or less.");
      cy.paragraph("Cost of each must be £999,999,999,999.00 or less.");
      cy.validationLink("Number of times must be 9999999999 or less.");
      cy.paragraph("Number of times must be 9999999999 or less.");
      cy.validatePositiveWholeNumber("Number of times", "Number of times", "999999999999");
      cy.validateCurrency("Cost of each (£)", "cost of each", "999999999999");
      cy.clickOn("Save and return to travel and subsistence");
      cy.validationLink("Total cost must be less than £10,000,000,000,000.00.");
      cy.paragraph("Total cost must be less than £10,000,000,000,000.00.");
      cy.getByLabel("Purpose of journey or description of subsistence cost").clear().type("Trip to las vegas");
      cy.validatePositiveWholeNumber("Number of times", "Number of times", "3");
      cy.validateCurrency("Cost of each (£)", "cost of each", "12000");
      checkTotalCostEquals(pounds(cost));
      checkSummary("Travel and subsistence", "Trip to las vegas", cost, categoryTotal, totalCost);
    });
  });
};

export const checkAddOtherCostsItem = (pageNumber: OtherCostPages) => {
  refreshTest();
  cy.get("th#new-partner-total-costs").then($span => {
    const totalCost = getCost($span);
    const cost = 2000;
    const page = (pageNumber === "1" ? "Other costs" : "Other costs " + pageNumber) as Category;
    cy.clickLink(page, "Edit");
    cy.get("h2").contains(page);
    cy.get("th#category-total-cost").then($span => {
      const categoryTotal = getCost($span);
      cy.log(`check the guidance for the ${page} section`);
      cy.get("span").contains(`${page} guidance`).click();

      cy.contains(
        "This category can be used for any direct project costs which are not covered in the other categories. Examples of other costs include:",
      );
      cy.contains("h4", "Workshop/laboratory usage charge outs");
      cy.contains(
        "Costs relating to workshops or laboratories that can be identified specifically as directly attributable to the project can be claimed in this section.",
      );
      cy.contains(
        "You should provide details of how the workshop or laboratory charge out rates are calculated per hour/day. This can include specific labour (such as staff permanently in place to maintain and run the workshop or laboratory and not considered project specific), rent, rates, maintenance and equipment calibration costs. These should form the overall costs together with the available operational hours to inform the hourly/daily charge out rates. Each workshop or laboratory will need to be supported with actual usage data to claim costs.",
      );
      cy.contains("h4", "Training costs");
      cy.contains(
        "These costs are eligible where they are specific to and necessary for your project. We may consider support for management training specific to your project but will not support ongoing training.",
      );
      cy.contains("h4", "Preparation of technical reports");
      cy.contains(
        "Project costs related to technical reports may be eligible for example where the main aim of your project is the support of standards or technology transfer. You should show how this report is above and beyond what good project management would produce.",
      );
      cy.contains("h4", "Market assessment");
      cy.contains(
        "There is some scope for support of market assessment studies to help understand how your project results are applicable to the intended market. Market research as a promotional tool is ineligible.",
      );
      cy.contains("h4", "Licensing in new technologies");
      cy.contains(
        "We may consider support where we deem it makes sense to do so, for example, to avoid ‘reinventing the wheel’. If imported technology makes up a large part of your project (which is technology valued at more than £100,000) then we expect the development of that technology as part of your project.",
      );
      cy.contains("h4", "Patent filing costs for new intellectual property (IP)");
      cy.contains(
        "IP costs generated by your project are eligible. This cost is allowable for SMEs up to a limit of £7,500 per partner. These should not include legal costs relating to the filing of trademark related expenditure as these are considered to be marketing/exploitation costs and therefore ineligible.",
      );
      cy.contains(
        "Regulatory compliance costs are eligible if necessary to carry out your project. Project audit and accountancy feeds are not eligible.",
      );
      cy.clickOn("Add a cost");
      cy.clickOn(`Save and return to ${page.toLowerCase()}`);
      cy.validationLink("Enter description of cost.");
      cy.validationLink("Enter estimated cost.");
      cy.getByLabel("Description and justification of the cost").invoke("val", loremIpsum131k).trigger("input");
      cy.getByLabel("Description and justification of the cost").type("{moveToEnd}t");
      cy.paragraph("You have 131073 characters");
      cy.button("Save and return to other costs").click();
      cy.validationLink("Description of cost must be 131072 or fewer.");
      cy.paragraph("Description of cost must be 131072 or fewer.");
      cy.getByLabel("Description and justification of the cost").type("{backspace}");
      cy.getByQA("validation-summary").should("not.contain", "Description of cost must be 131072 or fewer.");
      cy.getByLabel("Description and justification of the cost").clear().type("Other expenses");
      cy.validateCurrency("Estimated cost (£)", "estimated cost", String(cost));
      checkSummary(page, "Other expenses", cost, categoryTotal, totalCost);
    });
  });
};

const navTo = (page: Category, link?: string, remove?: boolean) => {
  cy.log("navigating to " + page + " " + link);
  cy.clickLink(page, "Edit");
  if (!link) {
    cy.clickOn("Add a cost");
  } else if (remove) {
    cy.clickLink(link, "Remove");
  } else {
    cy.clickLink(link, "Edit");
  }

  cy.get("h2").contains(remove ? "Delete " + page.toLowerCase() : page);
};

export const checkAddAdditionalLabourItem = () => {
  refreshTest();
  cy.get("th#new-partner-total-costs").then($span => {
    const totalCost = getCost($span);
    const cost = 200 * 100;
    navTo("Labour");
    cy.get("th#category-total-cost").then($span => {
      const categoryTotal = getCost($span);
      cy.getByLabel("Role within project").type("Bar keeper");
      cy.getByLabel("Gross employee cost").type("20000");
      cy.getByLabel("Rate (£/day)").type("200");
      cy.getByLabel("Days to be spent by all staff with this role").type("100");
      checkTotalCostEquals(pounds(cost));
      checkSummary("Labour", "Bar keeper", cost, categoryTotal, totalCost);
    });
  });
};
export const checkAddAdditionalMaterialsItem = () => {
  refreshTest();
  cy.get("th#new-partner-total-costs").then($span => {
    const totalCost = getCost($span);
    const cost = 100 * 4.99;
    navTo("Materials");
    cy.get("th#category-total-cost").then($span => {
      const categoryTotal = getCost($span);
      cy.getByLabel("Item").type("Beach balls");
      cy.getByLabel("Quantity").type("100");
      cy.getByLabel("Cost per item (£)").type("4.99");
      checkTotalCostEquals(pounds(cost));
      checkSummary("Materials", "Beach balls", cost, categoryTotal, totalCost);
    });
  });
};
export const checkAddAdditionalCapitalUsageItem = () => {
  refreshTest();
  cy.get("th#new-partner-total-costs").then($span => {
    const totalCost = getCost($span);
    const cost = (2000000 - 1500000) * 0.5;
    navTo("Capital usage");
    cy.get("th#category-total-cost").then($span => {
      const categoryTotal = getCost($span);
      cy.getByLabel("Item description").type("credit swap");
      cy.getByLabel("Existing").click();
      cy.getByLabel("Depreciation period (months)").type("24");
      cy.getByLabel("Net present value (£)").type("2000000");
      cy.getByLabel("Residual value at end of project (£)").type("1500000");
      cy.getByLabel("Utilisation (%)").type("50");
      checkTotalCostEquals(pounds(cost), "Net cost");
      checkSummary("Capital usage", "credit swap", cost, categoryTotal, totalCost);
    });
  });
};
export const checkAddAdditionalSubcontractingItem = () => {
  refreshTest();
  cy.get("th#new-partner-total-costs").then($span => {
    const totalCost = getCost($span);
    const cost = 12500;
    navTo("Subcontracting");
    cy.get("th#category-total-cost").then($span => {
      const categoryTotal = getCost($span);
      cy.getByLabel("Subcontractor name").type("Dodgy roofing");
      cy.getByLabel("Country where the subcontractor will work").type("UK");
      cy.getByLabel("Role of the the subcontractor in the project and description of the work they will do").type(
        "roof repair",
      );
      cy.getByLabel("Cost (£)").type(String(cost));
      checkSummary("Subcontracting", "Dodgy roofing", cost, categoryTotal, totalCost);
    });
  });
};
export const checkAddAdditionalTravelAndSubsistenceItem = () => {
  refreshTest();
  cy.get("th#new-partner-total-costs").then($span => {
    const totalCost = getCost($span);
    const cost = 8 * 8500;
    const category: Category = "Travel and subsistence";
    const description = "Caviar and champagne";
    navTo(category);
    cy.get("th#category-total-cost").then($span => {
      const categoryTotal = getCost($span);
      cy.getByLabel("Purpose of journey or description of subsistence cost").type(description);
      cy.getByLabel("Number of times").type("8");
      cy.getByLabel("Cost of each (£)").type("8500");
      checkTotalCostEquals(pounds(cost));
      checkSummary(category, description, cost, categoryTotal, totalCost);
    });
  });
};

export const checkAddAdditionalOtherCostsItem = (pageNumber: OtherCostPages) => {
  refreshTest();
  cy.get("th#new-partner-total-costs").then($span => {
    const totalCost = getCost($span);
    const cost = 2000;
    const description = "Other expenses 2";
    const page = (pageNumber === "1" ? "Other costs" : "Other costs " + pageNumber) as Category;
    navTo(page);
    cy.get("th#category-total-cost").then($span => {
      const categoryTotal = getCost($span);
      cy.getByLabel("Description and justification of the cost").type(description);
      cy.getByLabel("Estimated cost (£)").type(String(cost));
      checkSummary(page, description, cost, categoryTotal, totalCost);
    });
  });
};

const checkSummaryForEdit = (
  category: Category,
  description: string,
  cost: number,
  diff: number,
  label: string,
  newValue: string,
  saveAndReturn: boolean,
) => {
  refreshTest();
  cy.get("th#new-partner-total-costs").then($span => {
    const totalCost = getCost($span);
    navTo(category, description);
    cy.get("th#category-total-cost").then($span => {
      const categoryTotal = getCost($span);
      cy.getByLabel(label).clear().type(newValue);
      if (["Labour", "Materials", "Capital usage", "Travel and subsistence"].includes(category)) {
        checkTotalCostEquals(pounds(cost), category === "Capital usage" ? "Net cost" : "Total cost");
      }
      cy.clickOn(`Save and return to ${category.toLowerCase()}`);
      cy.checkTotalFor(description, pounds(cost));
      cy.checkTotalFor(`Total ${category.toLowerCase()}`, pounds(categoryTotal + diff));
      if (saveAndReturn === true) {
        cy.clickOn("Save and return to project costs");
        cy.get("h2").contains("Project costs for new partner");
        cy.checkTotalFor(category, pounds(categoryTotal + diff));
        cy.checkTotalFor("Total costs (£)", pounds(totalCost + diff));
      }
    });
  });
};

export const checkCapUsageSavedData = (
  lineItem: string,
  newOrExisting: string,
  period: number,
  netValue: number,
  residualValue: number,
  utilisation: number,
  netCost: string,
) => {
  cy.tableCell(lineItem).siblings().contains("a", "Edit").click();
  cy.get("h2").contains("Capital usage");
  cy.getByAriaLabel("Item description").should("have.value", lineItem);
  cy.getByLabel(newOrExisting).should("have.attr", "checked");
  cy.getByLabel("Depreciation period (months)").should("have.value", period);
  cy.getByLabel("Net present value (£)").should("have.value", netValue);
  cy.getByLabel("Residual value at end of project (£)").should("have.value", residualValue);
  cy.getByLabel("Utilisation (%)").should("have.value", utilisation);
  cy.paragraph(netCost);
  cy.clickOn("Save and return to capital usage");
  cy.get("span").contains("Capital usage guidance");
};

export const checkEditLabourItem = () => {
  const cost = 10000;
  const diff = -10000;
  checkSummaryForEdit("Labour", "Bar keeper", cost, diff, "Days to be spent by all staff with this role", "50", true);
};

export const checkEditOverheads = () => {
  refreshTest();
  cy.get("th#new-partner-total-costs").then($span => {
    const totalCost = getCost($span);
    cy.clickLink("Overheads", "Edit");
    cy.get("h2").contains("Overheads");
    cy.getByLabel("20%").click();
    checkTotalCostEquals("£12,000.00");
    cy.clickOn("Save and return to project costs");
    cy.get("h2").contains("Project costs for new partner");
    cy.checkTotalFor("Overheads", "£12,000");

    cy.checkTotalFor("Total costs (£)", pounds(totalCost - 3000));
  });
};

export const checkEditMaterialsItem = () => {
  const cost = 200 * 4.99;
  const diff = 100 * 4.99;
  checkSummaryForEdit("Materials", "Beach balls", cost, diff, "Quantity", "200", true);
};
export const checkEditCapitalUsageItem = () => {
  const cost = 500000;
  const diff = 250000;

  checkSummaryForEdit(
    "Capital usage",
    "credit swap",
    cost,
    diff,
    "Residual value at end of project (£)",
    "1000000",
    false,
  );
  checkCapUsageSavedData("credit swap", "Existing", 24, 2000000, 1000000, 50, "£500,000.00");
  checkCapUsageSavedData("Slush fund usage", "New", 24, 25000, 9000, 50, "£8,000.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
};
export const checkEditSubcontractingItem = () => {
  const cost = 10000;
  const diff = -2500;
  checkSummaryForEdit("Subcontracting", "Dodgy roofing", cost, diff, "Cost (£)", String(cost), true);
};
export const checkEditTravelAndSubsistenceItem = () => {
  const cost = 10 * 8500;
  const diff = cost - 8 * 8500;
  checkSummaryForEdit("Travel and subsistence", "Caviar and champagne", cost, diff, "Number of times", "10", true);
};
export const checkEditOtherCostsItem = (pageNumber: OtherCostPages) => {
  const cost = 4000;
  const diff = 2000;
  const page = pageNumber === "1" ? "Other costs" : (("Other costs " + pageNumber) as Category);
  checkSummaryForEdit(page, "Other expenses 2", cost, diff, "Estimated cost (£)", String(cost), true);
};

const checkDeleteItem = (category: Category, itemName: string, cost: number, overheadsAdjustment: number = 0) => {
  refreshTest();
  cy.get("th#new-partner-total-costs").then($span => {
    const totalCost = getCost($span);
    cy.clickLink(category, "Edit");
    cy.get("th#category-total-cost").then($span => {
      cy.clickLink(itemName, "Remove");
      const categoryTotal = getCost($span);
      cy.clickOn("Delete cost");
      cy.checkTotalFor(`Total ${category.toLowerCase()}`, pounds(categoryTotal - cost));
      cy.clickOn("Save and return to project costs");
      cy.get("h2").contains("Project costs for new partner");
      cy.checkTotalFor(category, pounds(categoryTotal - cost));
      cy.checkTotalFor("Total costs (£)", pounds(totalCost - (cost + overheadsAdjustment)));
    });
  });
};

export const checkDeleteLabourItem = () => {
  const cost = 10000;
  const overheadsAdjustment = 2000;
  checkDeleteItem("Labour", "Bar keeper", cost, overheadsAdjustment);
};

export const checkDeleteMaterialsItem = () => {
  const cost = 998;
  checkDeleteItem("Materials", "Beach balls", cost);
};

export const checkDeleteCapitalUsageItem = () => {
  const cost = 500000;
  checkDeleteItem("Capital usage", "credit swap", cost);
};
export const checkDeleteSubcontractingItem = () => {
  const cost = 10000;
  checkDeleteItem("Subcontracting", "Dodgy roofing", cost);
};
export const checkDeleteTravelAndSubsistenceItem = () => {
  const cost = 85000;
  checkDeleteItem("Travel and subsistence", "Caviar and champagne", cost);
};
export const checkDeleteOtherCostsItem = (pageNumber: OtherCostPages) => {
  const cost = 4000;
  const page = pageNumber === "1" ? "Other costs" : (("Other costs " + pageNumber) as Category);
  checkDeleteItem(page, "Other expenses 2", cost);
};

export const costsInCorrectOrder = () => {
  for (let i = 1; i < 21; i++) {
    cy.get("tr")
      .eq(i)
      .within(() => {
        cy.tableCell(`Lorem ${i}`);
      });
  }
};

/**
 * Steps for Add partner > Calculated Overheads tests
 */

export const validateValueRequired = () => {
  cy.clickOn("Save and return to project costs");
  cy.validationLink("Enter total cost.");
  cy.paragraph("Enter total cost.");
};

export const validateAlphaNotAllowed = () => {
  cy.getByLabel("Total cost of overheads as calculated in the spreadsheet (£)").clear().type("lorem");
  cy.validationLink("Total cost must be a number");
  cy.paragraph("Total cost must be a number");
};

export const validateThreeDecimalPlaces = () => {
  cy.getByLabel("Total cost of overheads as calculated in the spreadsheet (£)").clear().type("100.333");
  cy.validationLink("Total cost must be 2 decimal places or fewer.");
  cy.paragraph("Total cost must be 2 decimal places or fewer.");
};

export const calculateOverheadsDocsButton = () => {
  cy.clickOn("Calculate overheads documents");
  cy.getByQA("validation-summary").should("not.exist");
  cy.get("h2").contains("Calculate overheads");
};

export const calculatedGuidance = () => {
  cy.paragraph(
    "If the new partner feels their overheads are higher than 20% they may calculate a value using the Innovate UK model in the spreadsheet available below. The model shows which types of indirect costs associated with the project they may claim. For support with this option, contact our Customer Support Service.",
  );
  cy.paragraph(
    "Any value claimed under this model will be subject to a review to assess the appropriateness of the claim.",
  );
};

export const clickTwentyPercentAndSave = () => {
  cy.getByLabel("20%").click();
  cy.wait(500);
  cy.clickOn("Save and return to project costs");
  cy.getByQA("validation-summary").should("not.exist");
  cy.get("h2").contains("Project costs for new partner");
};

export const clickCalculatedAccessDocs = () => {
  cy.getByLabel("Calculated").click();
  cy.clickOn("Calculate overheads documents");
  cy.getByQA("validation-summary").should("not.exist");
  cy.get("h2").contains("Calculate overheads");
};

export const saveAndReturnEnter10k = () => {
  cy.clickOn("Save and return to overheads costs");
  cy.get("h2").contains("Overheads");
  cy.getByLabel("Total cost of overheads as calculated in the spreadsheet (£)").clear().type("10000");
  cy.clickOn("Save and return to project costs");
  cy.getByQA("validation-summary").should("not.exist");
  cy.get("h2").contains("Project costs for new partner");
};

export const navigateBackSelectZeroPercent = () => {
  navigateToCostCat("Overheads", 2);
  cy.getByLabel("0%").click();
  cy.clickOn("Save and return to project costs");
  cy.getByQA("validation-summary").should("not.exist");
  cy.get("h2").contains("Project costs for new partner");
};
