describe("Validate experian payload to Hydra", () => {
  it("Should successfully send a payload to validate experian", () => {
    cy.request({
      method: "POST",
      url: "https://uat.api.integrationplatform.iukservices.org/bank/validate",
      body: {
        sortcode: "000004",
        accountNumber: "12345677",
      },
    }).then(response => {
      expect(response.status).to.equal(200);
    });
  });
});
