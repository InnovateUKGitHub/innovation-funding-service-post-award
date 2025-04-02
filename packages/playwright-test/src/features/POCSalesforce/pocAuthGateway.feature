@mode:serial
Feature: Proof of concept for Authorisation Gateway automation
    Scenario: Accessing auth gateway
        Given the salesforce user is logged in as "agiln@capconfig.com"
        And the user navigates to Authorisation Gateway
        And user navigate to Authorisation gateway object
