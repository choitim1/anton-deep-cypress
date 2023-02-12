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
it("should do replace prompt", () => {
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

  //! also working
  // cy.window().then((window) => {
  //   cy.stub(window, "prompt").returns("XYZ").as("replacedWindowPrompt");
  // });

  cy.get("@section").find("button").click();
  cy.get("@replacedWindowPrompt").should("have.been.called");
  cy.get("@section")
    .find("button")
    .invoke("css", "background-color")
    .should("eq", "rgb(255, 0, 0)");
});

it("should do replace button click", () => {
  cy.get("section[data-cy=replace-button-click]").as("section");
  //! когда нет тега <a>
  cy.window().then((window) => {
    return cy
      .stub()
      .callsFake(() => {
        //console.log("we have implemented own button click function");
        window.location = "https://demo.realworld.io/";
      })
      .as("fakeClick");
  });

  cy.get("@fakeClick").then((fake) => {
    return cy
      .get("@section")
      .find("button")
      .invoke("off", "click")
      .invoke("on", "click", fake)
      .click();
  });

  cy.get("@fakeClick").should("have.been.called");
  cy.title().should("contain", "Conduit");
});
it("should do open conduit signup in iframe", () => {
  // only for demonstration `its`
  const iframes = [
    {
      contentDocument: {
        body: "<p>Hello from body of iframe document</p>",
      },
    },
  ];
  cy.wrap(iframes).its("0.contentDocument.body").should("not.be.empty");

  cy.get("section[data-cy=open-conduit-in-iframe]").as("section");
  cy.get("@section")
    .find("iframe")
    .its("0.contentDocument.body")
    .should("not.be.empty")
    .as("conduit");
  cy.get("@conduit").find('.navbar a[href$="/register"]').click();
  cy.get("@conduit").find(".auth-page h1").should("have.text", "Sign up");
});
it.only("should do check hello from user", () => {
  cy.get("section[data-cy=hello-from-user]").as("section");
  //cy.get("@section").find("user-web-component").as("user");
  cy.get("@section").find("user-web-component").shadow().as("user");
  cy.get("@user")
    .find("p.hello")
    .invoke("text", "ello1")
    // .then((text) => {
    //   cy.log(text);
    // })
    // cy.get('p').invoke('text').then((text) => {
    //   const newText = text.replace('old text', 'new text');
    //   cy.get('p').type(newText);
    // });
    .should("contain.text", "ello1");
});
it("should do change DOM", () => {
  cy.get("section[data-cy=change-dom]").as("section").scrollIntoView();
  cy.get("@section").find("p").as("message");
  cy.get("@message").invoke("css", "background-color", "rgb(0, 128, 0)");
  cy.get("@message").should("have.css", "background-color", "rgb(0, 128, 0)");
  // wait just for demo
  cy.wait(2000);
  cy.get("@message").invoke("css", "background-color", "rgb(128, 0, 0)");
  cy.get("@message").should("have.css", "background-color", "rgb(128, 0, 0)");

  const phone = "+7 920 736-12-49";
  cy.window().invoke("callMe", phone);

  cy.get("@section").should(
    "contain",
    '<a href="tel:' + phone + '">' + phone + "</a>"
  );
});
