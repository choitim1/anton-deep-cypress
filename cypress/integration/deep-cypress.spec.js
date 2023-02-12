beforeEach(() => {
  cy.visit("http://localhost:3000/apps/deep-cypress.html");
});

it("should do long like", () => {
  cy.get("section[data-cy=long-like]").as("section");
  cy.get("@section").find("button").click();
  //cy.get('@section').find('[data-cy=success]', {timeout: 5000})
  cy.get("@section").find("[data-cy=success]");
});

it("should do find child in tree", () => {
  cy.get("section[data-cy=child-in-tree]").as("section");
  cy.get("@section").find("button").click();
  cy.get("@section")
    .find("[data-cy=daddy] [data-cy=child]")
    .should("be.visible");
  // cy.get('@section').find('[data-cy=daddy]').should('be.visible')
  //
  cy.get("@section")
    .find("[data-cy=daddy]")
    .should("not.contain", "Loading")
    .find("[data-cy=child]")
    .should("be.visible");
  //Если нам потребуется в Cypress переходить между различными сайтами, нам нужно отключить данную политику безопасности.
  //Добавь в файл cypress.json:
  // "chromeWebSecurity": false
});

it("should do open conduit by link", () => {
  cy.get("section[data-cy=open-conduit-by-link]").as("section");
  cy.get("@section").find("a").invoke("removeAttr", "target").click();
  cy.title().should("contain", "Conduit");
});
it("should do open conduit in window", () => {
  cy.get("section[data-cy=open-conduit-in-window]").as("section");
  // ! что этот код делает?
  cy.window().then((window) => {
    cy.stub(window, "open").callsFake((url) => {
      //concole.log("we have implemented own window.open function");
      window.location = url;
    });
  });
  cy.get("@section").find("button").click();
  cy.title().should("contain", "Conduit");
});
it.only("should do replace prompt", () => {
  cy.get("section[data-cy=replace-prompt]").as("section");

  cy.window().then((window) => {
    cy.stub(window, "prompt")
      .callsFake((message) => {
        console.log("we have implemented own window.prompt function");
        console.log(message);
        return "XYZ";
      })
      .as("replacedWindowPrompt");
  });

  cy.get("@section").find("button").click();
  cy.get("@replacedWindowPrompt").should("have.been.called");
  cy.get("@section")
    .find("button")
    .invoke("css", "background-color")
    .should("eq", "rgb(255, 0, 0)");
});
