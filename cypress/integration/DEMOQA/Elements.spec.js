///<reference types="cypress" />

describe("Elements", () => {
  beforeEach(() => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false;
    });
    cy.visit("https://demoqa.com/elements");
    cy.get ('div[class = "element-list collapse show"]').as ('list')
  });
  it("TextBox", () => {
      cy.get ('@list').find('li[id = "item-0"]').click();
      cy.url().should('contain', 'https://demoqa.com/text-box')
      cy.get('form[id="userForm"]').within(() => {
      // scope формы
      cy.get("#userName").type("test");
      cy.get("#userEmail").type("test@mail.ru");
      cy.get("#currentAddress").type("6906 S 28th W. Ave");
      cy.get("#permanentAddress").type("kok301");
      cy.get("#submit").click();

      //! asssert
      cy.get(".border").as("block");
      cy.get("@block")
        .find("#name")
        .invoke("text")
        .should("contain", "Name:test");
    });
    cy.get(".border").within(() => {
      cy.get("#name").invoke("text").should("contain", "Name:test");
      cy.get("#email").invoke("text").should("contain", "test@mail.ru");
      cy.get ("#currentAddress").invoke('text').should('contain','6906 S 28th W. Ave');
      cy.get ("#permanentAddress").invoke('text').should('contain','kok301')
    });
  });
  it.only ('Check Box', () => {
      cy.get ('@list').find('li[id = "item-1"]').click();
      cy.url().should('contain', 'https://demoqa.com/checkbox');
      cy.get('label[for="tree-node-home"]').click()
          //.should('be.checked')
  })
});
