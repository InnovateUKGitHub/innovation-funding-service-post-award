Feature: Developer homepage
  Scenario: Content solution does nothing
    Given I am on the developer homepage
    When I select the "Content solution" tile
    Then I should see the developer homepage
    Then I should see 2 tiles

  Scenario: User wants to go to projects dashboard
    Given I am on the developer homepage
    When I select the "Projects" tile
    Then I should see the projects dashboard

  Scenario: Switching users
    Given I am an FC
    Given I am on the developer homepage
    When I select the "User Switcher" details dropdown
    Then I should be logged in as "NEWCY.autoimport.austria@innovateuk.gov.uk"
