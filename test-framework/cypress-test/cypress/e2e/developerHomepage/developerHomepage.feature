Feature: Developer homepage
  The developer homepage is the landing page to acc-developer

  Background: The user has accessed the first page in acc-dev
    Given the user is on the developer homepage
    Then the page header is "Home"
    Then the user sees 2 tiles

  Scenario: Content solution does nothing
    When the user clicks the "Content solution" tile
    Then the user sees the developer homepage
    Then the user sees 2 tiles

  Scenario: User wants to go to projects dashboard
    When the user clicks the "Projects" tile
    Then the user sees the projects dashboard
