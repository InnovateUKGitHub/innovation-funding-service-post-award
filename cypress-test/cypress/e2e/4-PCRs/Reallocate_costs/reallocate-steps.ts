export const reallocateRequestPage = () => {
  cy.get("h2").contains("Details");
  [
    ["Request number", "2"],
    ["Types", "Reallocate project costs"],
  ].forEach(([key, list]) => {
    cy.getListItemFromKey(key, list);
  });
  [
    "Give us information",
    "Explain why you want to make the changes",
    "Status and comments log",
    "How do you want to proceed?",
  ].forEach(sectionHeading => {
    cy.get("h2").contains(sectionHeading);
  });
  ["Reallocate project costs", "Complete"].forEach(pcrItem => {
    cy.getByQA("WhatDoYouWantToDo").within(() => {
      cy.get("li").contains(pcrItem);
    });
  });
  ["Reasoning for Innovate UK", "Complete"].forEach(reasoning => {
    cy.getByQA("reasoning").within(() => {
      cy.get("li").contains(reasoning);
    });
  });
  ["Date and time", "Status update", "Created by"].forEach((header, index) => {
    cy.getByQA("projectChangeRequestStatusChangeTable").within(() => {
      cy.get(`th:nth-child(${index + 1})`).contains(header);
    });
  });
  ["13 Mar 2024, 1:37pm", "Submitted to Monitoring Officer", "James Black"].forEach((rowItem, index) => {
    cy.getByQA("projectChangeRequestStatusChangeTable").within(() => {
      cy.get("tr")
        .eq(1)
        .within(() => {
          cy.get(`td:nth-child(${index + 1})`).contains(rowItem);
        });
    });
    ["Query the request", "Send for approval"].forEach(label => {
      cy.getByLabel(label);
    });
    cy.getByLabel("Add your comments");
    cy.paragraph("You have 1000 characters remaining");
  });
  cy.button("Submit");
};

export const reallocateInReviewCostsTable = () => {
  [
    "Partner",
    "Total eligible costs",
    "New total eligible costs",
    "Difference",
    "Funding level",
    "New funding level",
    "Remaining grant",
    "New remaining grant",
    "Difference",
  ].forEach((header, index) => {
    cy.get(`th:nth-child(${index + 1})`).contains(header);
  });
  [
    [
      "EUI Small Ent Health (Lead)",
      "£350,000.00",
      "£350,000.00",
      "£0.00",
      "65.00%",
      "65.00%",
      "£227,500.00",
      "£227,500.77",
      "£0.77",
    ],
    [
      "A B Cad Services",
      "£350,000.00",
      "£349,999.33",
      "-£0.67",
      "65.00%",
      "65.00%",
      "£227,500.00",
      "£227,498.79",
      "-£1.21",
    ],
    [
      "ABS EUI Medium Enterprise",
      "£350,000.00",
      "£350,000.67",
      "£0.67",
      "65.00%",
      "65.00%",
      "£227,500.00",
      "£227,500.44",
      "£0.44",
    ],
  ].forEach((cols, index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        for (let i = 0; i < 9; i++) {
          cy.get(`td:nth-child(${i + 1})`).contains(cols[i]);
        }
      });
  });
};

export const workingForwardArrow = () => {
  cy.getByQA("arrow-left").contains("Reasoning");
  cy.get("a").contains("Next").click();
  cy.heading("Reasons for Innovate UK");
  cy.get("a").contains("Previous").click();
  cy.heading("Reallocate project costs");
};

export const displayReasoningTab = () => {
  cy.get("details").should("not.have.attr", "open");
  cy.clickOn("Reasoning for the request");
  cy.get("details").should("have.attr", "open");
  cy.paragraph(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  );
  cy.clickOn("Reasoning for the request");
  cy.get("details").should("not.have.attr", "open");
};

export const euiCostsTable = () => {
  ["Cost category", "Total eligible costs", "New total eligible costs", "Costs reallocated"].forEach(
    (header, index) => {
      cy.get(`th:nth-child(${index + 1})`).contains(header);
    },
  );
  [
    ["Labour", "£35,000.00", "£30,000.00", "-£5,000.00"],
    ["Overheads", "£35,000.00", "£40,000.00", "£5,000.00"],
    ["Materials", "£35,000.00", "£34,999.33", "-£0.67"],
    ["Capital usage", "£35,000.00", "£35,000.67", "£0.67"],
    ["Subcontracting", "£0.00", "£0.00", "£0.00"],
    ["Travel and subsistence", "£35,000.00", "£35,000.00", "£0.00"],
    ["Other costs", "£35,000.00", "£35,000.00", "£0.00"],
    ["Other costs 2", "£35,000.00", "£35,000.00", "£0.00"],
    ["Other costs 3", "£35,000.00", "£35,000.00", "£0.00"],
    ["Other costs 4", "£35,000.00", "£35,000.00", "£0.00"],
    ["Other costs 5", "£35,000.00", "£35,000.00", "£0.00"],
  ].forEach((cols, index) => {
    for (let i = 0; i < 0; i++) {
      cy.get("tr")
        .eq(index + 1)
        .within(() => {
          cy.get(`td:nth-child(${i + 1})`).contains(cols[i]);
        });
    }
  });
  ["Partner totals", "£350,000.00", "£350,000.00", "£0.00"].forEach((footer, index) => {
    cy.get("tfoot").within(() => {
      cy.get(`td:nth-child(${index + 1})`).contains(footer);
    });
  });
};

export const abCadCostsTable = () => {
  ["Cost category", "Total eligible costs", "New total eligible costs", "Costs reallocated"].forEach(
    (header, index) => {
      cy.get(`th:nth-child(${index + 1})`).contains(header);
    },
  );
  [
    ["Labour", "£35,000.00", "£34,999.33", "-£0.67"],
    ["Overheads", "£35,000.00", "£35,000.00", "£0.00"],
    ["Materials", "£35,000.00", "£35,000.00", "£0.00"],
    ["Capital usage", "£35,000.00", "£35,000.00", "£0.00"],
    ["Subcontracting", "£0.00", "£0.00", "£0.00"],
    ["Travel and subsistence", "£35,000.00", "£35,000.00", "£0.00"],
    ["Other costs", "£35,000.00", "£35,000.00", "£0.00"],
    ["Other costs 2", "£35,000.00", "£35,000.00", "£0.00"],
    ["Other costs 3", "£35,000.00", "£35,000.00", "£0.00"],
    ["Other costs 4", "£35,000.00", "£35,000.00", "£0.00"],
    ["Other costs 5", "£35,000.00", "£35,000.00", "£0.00"],
  ].forEach((cols, index) => {
    for (let i = 0; i < 0; i++) {
      cy.get("tr")
        .eq(index + 1)
        .within(() => {
          cy.get(`td:nth-child(${i + 1})`).contains(cols[i]);
        });
    }
  });
  ["Partner totals", "£350,000.00", "£349,999.33", "-£0.67"].forEach((footer, index) => {
    cy.get("tfoot").within(() => {
      cy.get(`td:nth-child(${index + 1})`).contains(footer);
    });
  });
};

export const absEuiMediumCostsTable = () => {
  ["Cost category", "Total eligible costs", "New total eligible costs", "Costs reallocated"].forEach(
    (header, index) => {
      cy.get(`th:nth-child(${index + 1})`).contains(header);
    },
  );
  [
    ["Labour", "£35,000.00", "£35,000.67", "£0.67"],
    ["Overheads", "£35,000.00", "£35,000.00", "£0.00"],
    ["Materials", "£35,000.00", "£35,000.00", "£0.00"],
    ["Capital usage", "£35,000.00", "£35,000.00", "£0.00"],
    ["Subcontracting", "£0.00", "£0.00", "£0.00"],
    ["Travel and subsistence", "£35,000.00", "£35,000.00", "£0.00"],
    ["Other costs", "£35,000.00", "£35,000.00", "£0.00"],
    ["Other costs 2", "£35,000.00", "£35,000.00", "£0.00"],
    ["Other costs 3", "£35,000.00", "£35,000.00", "£0.00"],
    ["Other costs 4", "£35,000.00", "£35,000.00", "£0.00"],
    ["Other costs 5", "£35,000.00", "£35,000.00", "£0.00"],
  ].forEach((cols, index) => {
    for (let i = 0; i < 0; i++) {
      cy.get("tr")
        .eq(index + 1)
        .within(() => {
          cy.get(`td:nth-child(${i + 1})`).contains(cols[i]);
        });
    }
  });
  ["Partner totals", "£350,000.00", "£350,000.67", "£0.67"].forEach((footer, index) => {
    cy.get("tfoot").within(() => {
      cy.get(`td:nth-child(${index + 1})`).contains(footer);
    });
  });
};

export const validateEmptyGrantMoving = () => {
  cy.get("input#grantMovingOverFinancialYear").clear();
  cy.get("legend").contains("Mark as complete");
  cy.clickCheckBox("I agree with this change");
  cy.submitButton("Save and return to request");
  cy.validationLink("Enter grant value moving over financial year end.");
  cy.paragraph("Enter grant value moving over financial year end.");
};

export const accessReallocateCosts = () => {
  cy.get("a").contains("Reallocate project costs").click();
  cy.heading("Reallocate project costs");
  cy.get("a").contains("EUI Small Ent Health (Lead)").click();
  cy.get("h2").contains("EUI Small Ent Health");
};

export const reallocateLabourToMaterials = () => {
  cy.getByAriaLabel("Labour").clear().type("34000");
  cy.getCellFromHeaderAndRowNumber("Costs reallocated", 1).contains("-£1,000.00");
  cy.getByAriaLabel("Materials").clear().type("36000");
  cy.getCellFromHeaderAndRowNumber("Costs reallocated", 3).contains("£1,000.00");
};

export const clickSaveAndReturn = (options?: { expectValidation: boolean }) => {
  cy.get("#grantMovingOverFinancialYear").type("0");
  cy.getByLabel("I agree with this change").check();
  cy.clickOn("Save and return to request");
  if (options?.expectValidation) {
    cy.validationLink("There was a problem validating the virement for A B Cad Services.");
  }
};

export const accessAbCadCheckValidation = () => {
  cy.get("td").contains("A B Cad Services").click();
  cy.get("h2").contains("A B Cad Services");
  cy.clickOn("Save and return to reallocate project costs");
  [
    ["1", "Labour", "£35,001.00"],
    ["6", "Travel and subsistence", "£35,000.01"],
  ].forEach(([rowNum, costCat, overspend]) => {
    let row = Math.floor(parseInt(rowNum));

    cy.get("tr")
      .eq(row)
      .within(() => {
        cy.get("td:nth-child(4)").contains(`${costCat} must be ${overspend} or more.`);
      });
    cy.validationLink(`${costCat} must be ${overspend} or more.`);
  });
};

export const reallocateMatsToLabourRemoveVal = () => {
  cy.getByAriaLabel("Materials").clear().type("33998.99");
  cy.getByAriaLabel("Labour").clear().type("35001");
  cy.getByAriaLabel("Travel and subsistence").clear().type("35000.01");
  cy.getByQA("validation-summary").should("not.exist");
  cy.get("p").should("not.contain", "Eligible costs must be greater than amount already claimed for Labour.");
};

export const revertToIncomplete = () => {
  cy.get("a").contains("Reallocate project costs").click();
  cy.heading("Reallocate project costs");
  cy.getByLabel("I agree with this change").uncheck();
  cy.clickOn("Save and return to request");
  cy.heading("Request");
  cy.get("strong").contains("Incomplete");
};

export const reAccessAbCadCheckValidation = () => {
  cy.get("a").contains("Reallocate project costs").click();
  cy.heading("Reallocate project costs");
  cy.get("a").contains("A B Cad Services").click();
  cy.get("h2").contains("A B Cad Services");
  cy.getByAriaLabel("Materials").clear().type("35000");
  cy.getByAriaLabel("Labour").clear().type("35000");
  cy.clickOn("Save and return to reallocate project costs");
  cy.validationLink("Labour must be £35,001.00 or more.");
  cy.getCellFromHeaderAndRowNumber("New total eligible costs", 1).contains("Labour must be £35,001.00 or more.");
};
