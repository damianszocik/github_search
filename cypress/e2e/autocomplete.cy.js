import usersResponse from "../fixtures/users.json";
import repositoriesResponse from "../fixtures/repositories.json";

describe("github users & repositories autocomplete search", () => {
  const combinedResultsLength =
    usersResponse.items.length + repositoriesResponse.items.length;

  it("displays min chars required hint for search value length < 3", () => {
    cy.mockResponses();
    cy.visit("http://127.0.0.1:5173/");
    cy.contains("Type at least 3 chars to get suggestions").should("exist");
    cy.get("[data-testid=searchInput]").type("m");
    cy.contains("Type at least 3 chars to get suggestions").should("exist");
    cy.get("[data-testid=searchInput]").type("d");
    cy.contains("Type at least 3 chars to get suggestions").should("exist");
    cy.get("[data-testid=searchInput]").type("n");
    cy.contains("Type at least 3 chars to get suggestions").should("not.exist");
  });
  it("displays results for search value length > 3", () => {
    cy.mockResponses();
    cy.visit("http://127.0.0.1:5173/");
    cy.contains("Type at least 3 chars to get suggestions").should("exist");
    cy.get("[data-testid=searchInput]").type("m");
    cy.contains("Type at least 3 chars to get suggestions").should("exist");
    cy.get("[data-testid=searchInput]").type("d");
    cy.contains("Type at least 3 chars to get suggestions").should("exist");
    cy.get("[data-testid=searchInput]").type("n");
    cy.wait("@searchUsers");
    cy.wait("@searchRepositories");
    cy.get("[data-testid=autocompleteItem]").should(
      "have.length",
      combinedResultsLength
    );
  });
  it("calls for max 50 results per request - 100 combined", () => {
    cy.mockResponses();
    cy.visit("http://127.0.0.1:5173/");
    cy.contains("Type at least 3 chars to get suggestions").should("exist");
    cy.get("[data-testid=searchInput]").type("mdn");
    cy.wait("@searchUsers").its("request.url").should("include", "per_page=50");
    cy.wait("@searchRepositories")
      .its("request.url")
      .should("include", "per_page=50");
  });

  it("results are displayed in alphabetical order", () => {
    cy.mockResponses();
    cy.visit("http://127.0.0.1:5173/");
    cy.contains("Type at least 3 chars to get suggestions").should("exist");
    cy.get("[data-testid=searchInput]").type("mdn");
    cy.get("[data-testid=autocompleteItem]").then((autocompleteItems) => {
      autocompleteItems.each((itemIndex, autocompleteItem, items) => {
        if (itemIndex > 0) {
          const prevItemContent = autocompleteItems[itemIndex - 1].innerText;
          const currentElementContent = autocompleteItem.innerText;
          expect(
            prevItemContent.localeCompare(currentElementContent)
          ).to.be.lessThan(1);
        }
      });
    });
  });

  it("display loading spinner when fetching data", () => {
    cy.mockResponses();
    cy.visit("http://127.0.0.1:5173/");
    cy.get("[data-testid=loadingSpinner]").should("not.be.visible");
    cy.get("[data-testid=searchInput]").type("mdn");
    cy.get("[data-testid=loadingSpinner]").should("be.visible");
    cy.wait("@searchUsers");
    cy.wait("@searchRepositories");
    cy.get("[data-testid=loadingSpinner]").should("be.visible");
  });

  it("display requests errors messages", () => {
    cy.mockResponses(
      { statusCode: 500, body: { message: "users search response error" } },
      {
        statusCode: 500,
        body: { message: "repositories search response error" },
      }
    );

    cy.visit("http://127.0.0.1:5173/");
    cy.get("[data-testid=searchInput]").type("mdn");
    cy.wait("@searchUsers");
    cy.wait("@searchRepositories");
    cy.contains("Failed to fetch users: users search response error").should(
      "exist"
    );
    cy.contains(
      "Failed to fetch repositories: repositories search response error"
    ).should("exist");
  });

  it("display no results message", () => {
    cy.mockResponses(
      {
        total_count: 0,
        incomplete_results: false,
        items: [],
      },
      {
        total_count: 0,
        incomplete_results: false,
        items: [],
      }
    );

    cy.visit("http://127.0.0.1:5173/");
    cy.get("[data-testid=searchInput]").type("mdn");
    cy.wait("@searchUsers");
    cy.wait("@searchRepositories");
    cy.contains("No results").should("exist");
  });

  it("navigates through results using arrows", () => {
    cy.mockResponses();
    cy.visit("http://127.0.0.1:5173/");
    cy.get("[data-testid=searchInput]").type("mdn");
    cy.wait("@searchUsers");
    cy.wait("@searchRepositories");
    cy.get("[data-testid=autocompleteItem]")
      .first()
      .should("have.css", "font-weight", "500");
    cy.get("[data-testid=autocompleteItem]")
      .eq(1)
      .should("have.css", "font-weight", "300");
    cy.get("[data-testid=searchInput]").type("{downArrow}");
    cy.get("[data-testid=autocompleteItem]")
      .first()
      .should("have.css", "font-weight", "300");
    cy.get("[data-testid=autocompleteItem]")
      .eq(1)
      .should("have.css", "font-weight", "500");

    cy.get("[data-testid=searchInput]").type(
      "{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}"
    );
    cy.get("[data-testid=autocompleteItem]")
      .eq(11)
      .should("have.css", "font-weight", "500");
    cy.get("[data-testid=autocompleteItem]")
      .first()
      .should("have.css", "font-weight", "300");
    cy.get("[data-testid=searchInput]").type(
      "{upArrow}{upArrow}{upArrow}{upArrow}{upArrow}{upArrow}{upArrow}{upArrow}{upArrow}{upArrow}{upArrow}"
    );
    cy.get("[data-testid=autocompleteItem]")
      .first()
      .should("have.css", "font-weight", "500");
  });

  it("closes suggestions list using esc key", () => {
    cy.mockResponses();
    cy.visit("http://127.0.0.1:5173/");
    cy.get("[data-testid=searchInput]").type("mdn");
    cy.wait("@searchUsers");
    cy.wait("@searchRepositories");
    cy.get("[data-testid=autocompleteItem]").should(
      "have.length",
      combinedResultsLength
    );
    cy.get("[data-testid=searchInput]").type("{esc}");
    cy.get("[data-testid=autocompleteItem]").should("not.exist");
  });

  it("opens suggestions list using down arrow", () => {
    cy.mockResponses();
    cy.visit("http://127.0.0.1:5173/");
    cy.get("[data-testid=searchInput]").type("mdn");
    cy.wait("@searchUsers");
    cy.wait("@searchRepositories");
    cy.get("[data-testid=autocompleteItem]").should(
      "have.length",
      combinedResultsLength
    );
    cy.get("[data-testid=searchInput]").type("{esc}");
    cy.get("[data-testid=autocompleteItem]").should("not.exist");
    cy.get("[data-testid=searchInput]").type("{downArrow}");
    cy.get("[data-testid=autocompleteItem]").should("exist");
    cy.get("[data-testid=autocompleteItem]").should(
      "have.length",
      combinedResultsLength
    );
  });
  it("toggles suggestions list visibility using expand button", () => {
    cy.mockResponses();
    cy.visit("http://127.0.0.1:5173/");
    cy.get("[data-testid=searchInput]").type("mdn");
    cy.wait("@searchUsers");
    cy.wait("@searchRepositories");
    cy.get("[data-testid=autocompleteItem]").should(
      "have.length",
      combinedResultsLength
    );
    cy.get("[data-testid=expandButton]").click({ force: true });
    cy.get("[data-testid=autocompleteItem]").should("not.exist");
    cy.get("[data-testid=expandButton]").click({ force: true });
    cy.get("[data-testid=autocompleteItem]").should(
      "have.length",
      combinedResultsLength
    );
  });

  it("opens new tab with enter key", () => {
    cy.mockResponses();
    cy.visit("http://127.0.0.1:5173/", {
      onBeforeLoad(win) {
        cy.stub(win, "open").as("openNewTab");
      },
    });
    cy.get("[data-testid=searchInput]").type("mdn");
    cy.wait("@searchUsers");
    cy.wait("@searchRepositories");
    cy.get("[data-testid=autocompleteItem]").should(
      "have.length",
      combinedResultsLength
    );
    cy.get("[data-testid=searchInput]").type("{downArrow}{downArrow}{enter}");
    cy.get("@openNewTab").should(
      "be.calledWith",
      "https://github.com/mdn/browser-compat-data",
      "_blank"
    );
  });

  it("opens new tab with mouse click", () => {
    cy.mockResponses();
    cy.visit("http://127.0.0.1:5173/", {
      onBeforeLoad(win) {
        cy.stub(win, "open").as("openNewTab");
      },
    });
    cy.get("[data-testid=searchInput]").type("mdn");
    cy.wait("@searchUsers");
    cy.wait("@searchRepositories");
    cy.get("[data-testid=autocompleteItem]").should(
      "have.length",
      combinedResultsLength
    );
    cy.get("[data-testid=autocompleteItem]").eq(2).click();
    cy.get("@openNewTab").should(
      "be.calledWith",
      "https://github.com/mdn/browser-compat-data",
      "_blank"
    );
  });
});
