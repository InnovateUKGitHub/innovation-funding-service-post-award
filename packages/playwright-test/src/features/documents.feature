@mode:serial
Feature: Documents tile
    Scenario: Testing the file component as PM
        Given a multi-partner CR&D project exists
        And the user is the "pmUser" user
        And the user has navigated to the project documents page
        When the user uploads a file in the documents area
        Then a document table will be visible
