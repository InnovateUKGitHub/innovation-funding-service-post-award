describe("Validate experian payload to Hydra", () => {
  it("Should successfully send a payload to validate experian", () => {
    cy.request({
      method: "POST",
      url: "https://uat.api.integrationplatform.iukservices.org/experianValidate",
      body: {
        sortcode: "122112",
        accountNumber: "12121221",
      },
    }).then(response => {
      expect(response.status).to.equal(200);
    });
  });
});
