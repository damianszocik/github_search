/// <reference types="cypress" />

Cypress.Commands.add("mockResponses", (usersResponse, repositoriesResponse) => {
  cy.intercept(
    {
      method: "GET",
      url: `https://api.github.com/search/users*`,
    },
    usersResponse || { fixture: "users.json" }
  ).as("searchUsers");
  cy.intercept(
    {
      method: "GET",
      url: `https://api.github.com/search/repositories*`,
    },
    repositoriesResponse || { fixture: "repositories.json" }
  ).as("searchRepositories");
});
