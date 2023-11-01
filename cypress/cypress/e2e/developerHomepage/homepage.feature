Feature: Developer homepage
  Scenario: Content solution does nothing
    Given they are on the developer homepage
    When they select the "Content solution" tile
    Then they should see the developer homepage
    Then they should see 2 tiles

  Scenario: User wants to go to projects dashboard
    Given they are on the developer homepage
    When they select the "Projects" tile
    Then they should see the projects dashboard
