Feature: Developer homepage
  Scenario: Content solution does nothing
    Given the user is on the developer homepage
    When the user clicks the "Content solution" tile
    Then the user sees the developer homepage
    Then the user sees 2 tiles

  Scenario: User wants to go to projects dashboard
    Given the user is on the developer homepage
    When the user clicks the "Projects" tile
    Then the user sees the projects dashboard
