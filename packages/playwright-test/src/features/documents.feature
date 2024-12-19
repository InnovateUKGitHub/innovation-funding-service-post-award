@mode:serial
Feature: Documents tile
    Scenario: Testing the file component as PM
        Given a multi-partner CR&D project exists
        And the user is the "pmUser" user
        And the user has navigated to the project documents page
        When the user uploads a file in the documents area
        Then a document table will be visible

    Scenario: Testing the file component as MO
        Given a multi-partner CR&D project exists
        And the user is the "mspUser" user
        When the user has navigated to the project documents page
        Then the user can see an MO-specific documents page

        When the MO uploads a file intended for IUK only
        And the user is the "pmUser" user
        Then the PM user cannot see the file

        When the PM uploads a file
        And the user is the "mspUser" user
        Then the MO can see the file uploaded

        When the MO uploads a file intended for Hedge's Primary Ltd.
        And the user is the "secondaryFcUser" user
        Then the FC from a different partner cannot see the file

        When the FC from the secondary partner uploads a file
        And the user is the "pmUser" user
        Then the PM cannot see the secondary partner's file