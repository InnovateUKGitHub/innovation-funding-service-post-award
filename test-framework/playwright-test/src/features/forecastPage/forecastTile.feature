Feature: Forecast Tile
  Scenario: Viewing the forecast page
    Given a standard CR&D project exists
    And the user is on the project forecasts
    When the user selects the project forecast for "Hedge's Consulting Ltd."
    Then the user sees the project forecast for "Hedge's Consulting Ltd."
