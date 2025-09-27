/// <reference types="cypress" />

describe("Logout flow", () => {
  it("should log out successfully", () => {
    cy.visit("/login");
    cy.get('input[placeholder="Email"]').type("cliente@youdrive.com");
    cy.get('input[placeholder="Password"]').type("password");
    cy.contains("Sign In").click();

    cy.url().should("include", "/profile");
    cy.contains("Profile picture").should("be.visible");

    cy.contains("Logout").click();

    cy.url().should("include", "/login");
    cy.get('input[placeholder="Email"]').should("be.visible");
    cy.get('input[placeholder="Password"]').should("be.visible");
  });
});
