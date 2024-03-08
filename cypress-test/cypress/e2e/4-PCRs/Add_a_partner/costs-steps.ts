import { pounds } from "common/pounds";
import { addPartnerLabourGuidance } from "../steps";

/**
 * check the total for the new item page
 */
const checkTotalCostEquals = (value: string) => cy.get("h3").contains("Total cost").siblings().contains(value);

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

let grandTotal = 0;

export const checkAddLabourItem = () => {
  cy.clickLink("Labour", "Edit");
  cy.log("check the guidance for the labour section");
  addPartnerLabourGuidance();
  cy.log("check that the table has the expected headers");
  cy.tableHeader("Description");
  cy.tableHeader("Cost (£)");
  cy.tableHeader("Total labour");
  cy.log("navigate to add a cost");
  cy.clickOn("Add a cost");
  cy.get("h2").contains("Labour");
  cy.log("testing invalid states");
  checkTotalCostEquals("£0.00");
  cy.clickOn("Save and return to labour");
  cy.validationLink("Enter description of role.");
  cy.validationLink("Enter gross cost of role.");
  cy.validationLink("Enter rate per day.");
  cy.validationLink("Enter days spent on project.");
  cy.getByLabel("Role within project").type("Law keeper");
  cy.validateCurrency("Gross employee cost", "Gross cost of role", "50000");
  cy.validateCurrency("Rate (£/day)", "rate per day", "500");
  cy.validatePositiveWholeNumber("Days to be spent by all staff with this role", "Days spent on project", "100");
  checkTotalCostEquals("£50,000.00");
  cy.clickOn("Save and return to labour");
  cy.checkTotalFor("Law keeper", "£50,000");
  cy.checkTotalFor("Total labour", "£50,000");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Labour", "£50,000");
  grandTotal += 50000;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};

export const checkAddOverheadItem = () => {
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
  cy.getByLabel("calculated").click();
  checkTotalCostEquals("£0.00");
  cy.clickOn("Save and return to project costs");
  cy.validateCurrency("Total cost of overheads as calculated in the spreadsheet (£)", "Total cost", "15000");
  checkTotalCostEquals("£15,000.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Overheads", "£15,000");
  grandTotal += 15000;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};

export const checkAddMaterialsItem = () => {
  cy.clickLink("Materials", "Edit");
  cy.get("h2").contains("Materials");
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
  cy.validatePositiveWholeNumber("Quantity", "Quantity", "25000");
  cy.validateCurrency("Cost per item (£)", "cost per item", "29.99");
  checkTotalCostEquals("£749,750.00");
  cy.clickOn("Save and return to materials");
  cy.checkTotalFor("dinosaur toys", "£749,750.00");
  cy.checkTotalFor("Total materials", "£749,750.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Materials", "£749,750.00");
  grandTotal += 749750;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};

export const checkAddCapitalUsageItem = () => {
  cy.clickLink("Capital usage", "Edit");
  cy.get("h2").contains("Capital usage");
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
  cy.get("h3").contains("Net cost").siblings().contains("£8,000.00");
  cy.clickOn("Save and return to capital usage");
  cy.checkTotalFor("Slush fund usage", "£8,000.00");
  cy.checkTotalFor("Total capital usage", "£8,000.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Capital usage", "£8,000.00");
  grandTotal += 8000;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};

export const checkAddSubcontractingItem = () => {
  cy.clickLink("Subcontracting", "Edit");
  cy.get("h2").contains("Subcontracting");
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
  cy.getByLabel("Subcontractor name").type("Donald duck");
  cy.getByLabel("Country where the subcontractor will work").type("USA");
  cy.getByLabel("Role of the the subcontractor in the project and description of the work they will do").type(
    "ducky activities",
  );
  cy.validateCurrency("Cost (£)", "cost", "2500");
  cy.clickOn("Save and return to subcontracting");
  cy.checkTotalFor("Donald duck", "£2,500.00");
  cy.checkTotalFor("Total subcontracting", "£2,500.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Subcontracting", "£2,500.00");
  grandTotal += 2500;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};

export const checkAddTravelAndSubsistenceItem = () => {
  cy.clickLink("Travel and subsistence", "Edit");
  cy.get("h2").contains("Travel and subsistence");
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

  cy.getByLabel("Purpose of journey or description of subsistence cost").type("Trip to las vegas");
  cy.validatePositiveWholeNumber("Number of times", "Number of times", "3");
  cy.validateCurrency("Cost of each (£)", "cost of each", "12000");
  checkTotalCostEquals("£36,000.00");
  cy.clickOn("Save and return to travel and subsistence");
  cy.checkTotalFor("Trip to las vegas", "£36,000.00");
  cy.checkTotalFor("Total travel and subsistence", "£36,000.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Travel and subsistence", "£36,000.00");
  grandTotal += 36000;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};

export const checkAddOtherCostsItem = (pageNumber: OtherCostPages) => {
  const page = pageNumber === "1" ? "Other costs" : "Other costs " + pageNumber;
  cy.clickLink(page, "Edit");
  cy.get("h2").contains(page);
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

  cy.getByLabel("Description and justification of the cost").type("Other expenses");
  cy.validateCurrency("Estimated cost (£)", "estimated cost", "2000");
  cy.clickOn(`Save and return to ${page.toLowerCase()}`);
  cy.checkTotalFor("Other expenses", "£2,000.00");
  cy.checkTotalFor(`Total ${page.toLowerCase()}`, "£2,000.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor(page, "£2,000.00");
  grandTotal += 2000;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};

const navTo = (page: Category, link?: string, remove?: boolean) => {
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
  navTo("Labour");
  cy.getByLabel("Role within project").type("Bar keeper");
  cy.getByLabel("Gross employee cost").type("20000");
  cy.getByLabel("Rate (£/day)").type("200");
  cy.getByLabel("Days to be spent by all staff with this role").type("100");
  checkTotalCostEquals("£20,000.00");
  cy.clickOn("Save and return to labour");
  cy.checkTotalFor("Bar keeper", "£20,000");
  cy.checkTotalFor("Total labour", "£70,000");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Labour", "£70,000");
  grandTotal += 20000;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};
export const checkAddAdditionalMaterialsItem = () => {
  navTo("Materials");
  cy.getByLabel("Item").type("Beach balls");
  cy.getByLabel("Quantity").type("100");
  cy.getByLabel("Cost per item (£)").type("4.99");
  checkTotalCostEquals("£499.00");
  cy.clickOn("Save and return to materials");
  cy.checkTotalFor("Beach balls", "£499.00");
  cy.checkTotalFor("Total materials", "£750,249.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Materials", "£750,249.00");
  grandTotal += 499;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};
export const checkAddAdditionalCapitalUsageItem = () => {
  navTo("Capital usage");
  cy.getByLabel("Item description").type("credit swap");
  cy.getByLabel("Existing").click();
  cy.getByLabel("Depreciation period (months)").type("24");
  cy.getByLabel("Net present value (£)").type("2000000");
  cy.getByLabel("Residual value at end of project (£)").type("1500000");
  cy.getByLabel("Utilisation (%)").type("50");
  cy.get("h3").contains("Net cost").siblings().contains("£250,000.00");
  cy.clickOn("Save and return to capital usage");
  cy.checkTotalFor("credit swap", "£250,000.00");
  cy.checkTotalFor("Total capital usage", "£258,000.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Capital usage", "£258,000.00");
  grandTotal += 250000;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};
export const checkAddAdditionalSubcontractingItem = () => {
  navTo("Subcontracting");
  cy.getByLabel("Subcontractor name").type("Dodgy roofing");
  cy.getByLabel("Country where the subcontractor will work").type("UK");
  cy.getByLabel("Role of the the subcontractor in the project and description of the work they will do").type(
    "roof repair",
  );
  cy.getByLabel("Cost (£)").type("12000");
  cy.clickOn("Save and return to subcontracting");
  cy.checkTotalFor("Dodgy roofing", "£12,000.00");
  cy.checkTotalFor("Total subcontracting", "£14,500.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Subcontracting", "£14,500.00");
  grandTotal += 12000;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};
export const checkAddAdditionalTravelAndSubsistenceItem = () => {
  navTo("Travel and subsistence");
  cy.getByLabel("Purpose of journey or description of subsistence cost").type("Caviar and champagne");
  cy.getByLabel("Number of times").type("8");
  cy.getByLabel("Cost of each (£)").type("8500");
  checkTotalCostEquals("£68,000.00");
  cy.clickOn("Save and return to travel and subsistence");
  cy.checkTotalFor("Caviar and champagne", "£68,000.00");
  cy.checkTotalFor("Total travel and subsistence", "£104,000.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Travel and subsistence", "£104,000.00");
  grandTotal += 68000;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};
export const checkAddAdditionalOtherCostsItem = (pageNumber: OtherCostPages) => {
  const page = pageNumber === "1" ? "Other costs" : (("Other costs " + pageNumber) as Category);
  navTo(page);
  cy.getByLabel("Description and justification of the cost").type("Other expenses 2");
  cy.getByLabel("Estimated cost (£)").type("2000");
  cy.clickOn(`Save and return to ${page.toLowerCase()}`);
  cy.checkTotalFor("Other expenses 2", "£2,000.00");
  cy.checkTotalFor(`Total ${page.toLowerCase()}`, "£4,000.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor(page, "£4,000.00");
  grandTotal += 2000;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};

export const checkEditLabourItem = () => {
  navTo("Labour", "Bar keeper");
  cy.getByLabel("Days to be spent by all staff with this role").clear().type("50");
  checkTotalCostEquals("£10,000.00");
  cy.clickOn("Save and return to labour");
  cy.checkTotalFor("Bar keeper", "£10,000");
  cy.checkTotalFor("Total labour", "£60,000");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Labour", "£60,000");
  grandTotal -= 10000;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};

export const checkEditOverheads = () => {
  cy.clickLink("Overheads", "Edit");
  cy.get("h2").contains("Overheads");
  cy.getByLabel("20%").click();
  checkTotalCostEquals("£12,000.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Overheads", "£12,000");
  grandTotal -= 3000;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};

export const checkEditMaterialsItem = () => {
  navTo("Materials", "Beach balls");
  cy.getByLabel("Quantity").clear().type("200");
  checkTotalCostEquals("£998.00");
  cy.clickOn("Save and return to materials");
  cy.checkTotalFor("Beach balls", "£998.00");
  cy.checkTotalFor("Total materials", "£750,748.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Materials", "£750,748.00");
  grandTotal += 499;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};
export const checkEditCapitalUsageItem = () => {
  navTo("Capital usage", "credit swap");
  cy.getByLabel("Residual value at end of project (£)").clear().type("1000000");
  cy.get("h3").contains("Net cost").siblings().contains("£500,000.00");
  cy.clickOn("Save and return to capital usage");
  cy.checkTotalFor("credit swap", "£500,000.00");
  cy.checkTotalFor("Total capital usage", "£508,000.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Capital usage", "£508,000.00");
  grandTotal += 250000;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};
export const checkEditSubcontractingItem = () => {
  navTo("Subcontracting", "Dodgy roofing");
  cy.getByLabel("Cost (£)").clear().type("10000");
  cy.clickOn("Save and return to subcontracting");
  cy.checkTotalFor("Dodgy roofing", "£10,000.00");
  cy.checkTotalFor("Total subcontracting", "£12,500.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Subcontracting", "£12,500.00");
  grandTotal -= 2000;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};
export const checkEditTravelAndSubsistenceItem = () => {
  navTo("Travel and subsistence", "Caviar and champagne");
  cy.getByLabel("Purpose of journey or description of subsistence cost").type("Caviar and champagne");
  cy.getByLabel("Number of times").clear().type("10");
  checkTotalCostEquals("£85,000.00");
  cy.clickOn("Save and return to travel and subsistence");
  cy.checkTotalFor("Caviar and champagne", "£85,000.00");
  cy.checkTotalFor("Total travel and subsistence", "£121,000.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Travel and subsistence", "£121,000.00");
  grandTotal += 17000;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};
export const checkEditOtherCostsItem = (pageNumber: OtherCostPages) => {
  const page = pageNumber === "1" ? "Other costs" : (("Other costs " + pageNumber) as Category);
  navTo(page, "Other expenses 2");
  cy.getByLabel("Estimated cost (£)").clear().type("4000");
  cy.clickOn(`Save and return to ${page.toLowerCase()}`);
  cy.checkTotalFor("Other expenses 2", "£4,000.00");
  cy.checkTotalFor(`Total ${page.toLowerCase()}`, "£6,000.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor(page, "£6,000.00");
  grandTotal += 2000;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};

export const checkDeleteLabourItem = () => {
  navTo("Labour", "Bar keeper", true);
  cy.clickOn("Delete cost");
  cy.checkTotalFor("Total labour", "£50,000");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Labour", "£50,000");
  grandTotal -= 10000;
  grandTotal -= 2000; // overhead recalculation
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};

export const checkDeleteMaterialsItem = () => {
  navTo("Materials", "Beach balls", true);
  cy.clickOn("Delete cost");
  cy.checkTotalFor("Total materials", "£749,750.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Materials", "£749,750.00");
  grandTotal -= 998;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};
export const checkDeleteCapitalUsageItem = () => {
  navTo("Capital usage", "credit swap", true);
  cy.clickOn("Delete cost");
  cy.checkTotalFor("Total capital usage", "£8,000.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Capital usage", "£8,000.00");
  grandTotal -= 500000;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};
export const checkDeleteSubcontractingItem = () => {
  navTo("Subcontracting", "Dodgy roofing", true);
  cy.clickOn("Delete cost");
  cy.checkTotalFor("Total subcontracting", "£2,500.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Subcontracting", "£2,500.00");
  grandTotal -= 10000;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};
export const checkDeleteTravelAndSubsistenceItem = () => {
  navTo("Travel and subsistence", "Caviar and champagne", true);
  cy.clickOn("Delete cost");
  cy.checkTotalFor("Total travel and subsistence", "£36,000.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor("Travel and subsistence", "£36,000.00");
  grandTotal -= 85000;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};
export const checkDeleteOtherCostsItem = (pageNumber: OtherCostPages) => {
  const page = pageNumber === "1" ? "Other costs" : (("Other costs " + pageNumber) as Category);
  navTo(page, "Other expenses 2", true);
  cy.clickOn("Delete cost");
  cy.checkTotalFor(`Total ${page.toLowerCase()}`, "£2,000.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.checkTotalFor(page, "£2,000.00");
  grandTotal -= 4000;
  cy.checkTotalFor("Total costs (£)", pounds(grandTotal));
};
