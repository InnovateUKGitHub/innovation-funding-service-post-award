@mode:serial
#This test is as a result of ACC-11702
Feature: Manage team member with missing Finance contact
    Scenario: Accessing Manage Team Member PCR page
        Given a project without an FC exists
        And the PM has logged in and created a PCR
        When the user creates a "Manage team members" PCR
        Then the "Replace finance contact" button should not exist