/// <reference types="cypress" />

describe("Login flow", () => {
  it("should log in successfully", () => {
    cy.visit("/login");
    cy.get('input[placeholder="Email"]').type("cliente@youdrive.com");
    cy.get('input[placeholder="Password"]').type("password");
    cy.contains("Sign In").click();

    cy.url().should("include", "/profile");
    cy.contains("Profile picture").should("be.visible");
  });

  it("should display error on invalid login", () => {
    cy.visit("/login");
    cy.get('input[placeholder="Email"]').type("cliente@youdrive.com");
    cy.get('input[placeholder="Password"]').type("wrongpassword");
    cy.contains("Sign In").click();

    cy.url().should("not.include", "/profile");
    cy.contains("Login failed.").should("be.visible");
  });

  it("should display field error on submitting empty form", () => {
    cy.visit("/login");
    cy.contains("Sign In").click();

    cy.url().should("not.include", "/profile");

    cy.get('input[placeholder="Email"]')
      .parent()
      .contains("Required")
      .should("be.visible");

    cy.get('input[placeholder="Password"]')
      .parent()
      .contains("Required")
      .should("be.visible");
  });

  it("should display email error on submitting with invalid e-mail format", () => {
    cy.visit("/login");
    cy.get('input[placeholder="Email"]').type("invalid-email");
    cy.get('input[placeholder="Password"]').type("wrongpassword");
    cy.contains("Sign In").click();

    cy.url().should("not.include", "/profile");

    cy.get('input[placeholder="Email"]')
      .parent()
      .contains("Invalid e-mail address")
      .should("be.visible");
  });
});
