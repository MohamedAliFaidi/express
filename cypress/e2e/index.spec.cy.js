// cypress/integration/server.spec.js

describe("Server Setup", () => {
  // Check server functionality
  it("Server is running and responds with 200 status code", () => {
    // Visit the root URL of your server
    cy.visit("http://localhost:3000/");

    // Verify that the server responds with a 200 status code
    cy.request("http://localhost:3000/").its("status").should("equal", 200);
  });

  // Check security best practices
  context("Environment", () => {
    beforeEach(() => {
      Cypress.env("isProd", true); // Set environment flag
      console.log(cy);
    });


    //production only
    // it("Uses HTTPS", () => {
    //   if (Cypress.env("isProd")) {
    //     // Verify that the page is loaded over HTTPS only in production
    //     // {
    //     //   cy.location("protocol").should("eq", "https:");
    //     // }

    //     cy.location("protocol").should("eq", "http:");
    //   }

      // For dev testing
   // });

    it("Sets Secure Headers", () => {
      if (Cypress.env("isProd")) {
        // Verify that secure headers are set only in production
        cy.request("http://localhost:3000/")
          .its("headers")
          .then((headers) => {
            expect(headers).to.include.keys(
              "strict-transport-security",
              "x-content-type-options",
              "x-frame-options",
              "x-xss-protection",
              "content-security-policy"
            );
          });
      }
    });
  });

  // Check security best practices for both production and development environments
  context("Security Best Practices", () => {
    it("Prevents XSS Vulnerabilities", () => {
      // Test for Cross-Site Scripting (XSS) vulnerabilities
      cy.request("http://localhost:3000/")
        .its("body")
        .should("not.contain", "<script>");
    });

    it("Prevents CORS Misconfigurations", () => {
      // Test for Cross-Origin Resource Sharing (CORS) misconfigurations
      cy.request({
        url: "https://example.com", // Make a request to an external domain
        failOnStatusCode: false, // Don't fail the test if there's a CORS error
      })
        .its("status")
        .should("not.equal", 403); // Ensure that the request does not result in a CORS error
    });
  });
});
