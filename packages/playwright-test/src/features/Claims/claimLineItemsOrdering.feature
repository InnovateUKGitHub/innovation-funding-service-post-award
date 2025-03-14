
@mode:serial
Feature: ACC-11952 fix list order of claim line items

    Background:: Create a project and navigate to the claim line items page
        Given a multi-partner CR&D project with profiles exists
        And the user is the "mainFcUser" user
        When the user has accessed the Costs to be claimed page
        And the user clicks the "Labour" cost category

    Scenario: Add 25 claim line items
        Given the user clicks add costs twenty five times
        When the user enters the following labour costs data:
            | description | cost |
            | 1           | 100  |
            | 2           | 100  |
            | 3           | 100  |
            | 4           | 100  |
            | 5           | 100  |
            | 6           | 100  |
            | 7           | 100  |
            | 8           | 100  |
            | 9           | 100  |
            | 10          | 100  |
            | 11          | 100  |
            | 12          | 100  |
            | 13          | 100  |
            | 14          | 100  |
            | 15          | 100  |
            | 16          | 100  |
            | 17          | 100  |
            | 18          | 100  |
            | 19          | 100  |
            | 20          | 100  |
            | 21          | 100  |
            | 22          | 100  |
            | 23          | 100  |
            | 24          | 100  |
            | 25          | £100 |
        And the user clicks save and return to claim
        Then the labour labour costs claimed should be "£2,500.00"
        And the overhead cost should be "£500.00"

    Scenario: Add 4 claim line items to the previously created line items
        And the user is the "mainFcUser" user
        And the user has accessed the Costs to be claimed page
        And the user clicks the "Labour" cost category
        Then the use sees the claim line item table below:
            | description | cost |
            | 1           | 100  |
            | 2           | 100  |
            | 3           | 100  |
            | 4           | 100  |
            | 5           | 100  |
            | 6           | 100  |
            | 7           | 100  |
            | 8           | 100  |
            | 9           | 100  |
            | 10          | 100  |
            | 11          | 100  |
            | 12          | 100  |
            | 13          | 100  |
            | 14          | 100  |
            | 15          | 100  |
            | 16          | 100  |
            | 17          | 100  |
            | 18          | 100  |
            | 19          | 100  |
            | 20          | 100  |
            | 21          | 100  |
            | 22          | 100  |
            | 23          | 100  |
            | 24          | 100  |
            | 25          | 100  |
        And the user creates additional line items below:
            | description | cost |
            | 26          | 100  |
            | 27          | 100  |
            | 28          | 100  |
            | 29          | 100  |
        And the user clicks save and return to claim
        Then the labour labour costs claimed should be "£2,900.00"
        And the overhead cost should be "£580.00"

    Scenario: Verify the additional the claim line items
        And the user is the "mainFcUser" user
        And the user has accessed the Costs to be claimed page
        And the user clicks the "Labour" cost category
        Then the use sees the claim line item table below:
            | description | cost |
            | 1           | 100  |
            | 2           | 100  |
            | 3           | 100  |
            | 4           | 100  |
            | 5           | 100  |
            | 6           | 100  |
            | 7           | 100  |
            | 8           | 100  |
            | 9           | 100  |
            | 10          | 100  |
            | 11          | 100  |
            | 12          | 100  |
            | 13          | 100  |
            | 14          | 100  |
            | 15          | 100  |
            | 16          | 100  |
            | 17          | 100  |
            | 18          | 100  |
            | 19          | 100  |
            | 20          | 100  |
            | 21          | 100  |
            | 22          | 100  |
            | 23          | 100  |
            | 24          | 100  |
            | 25          | 100  |
            | 26          | 100  |
            | 27          | 100  |
            | 28          | 100  |
            | 29          | 100  |
        And the user creates additional line items below:
            | description | cost |
            | 30          | 100  |
            | 31          | 100  |
            | 32          | 100  |
            | 33          | 100  |
        And the user clicks save and return to claim
        Then the labour labour costs claimed should be "£3,300.00"
        And the overhead cost should be "£660.00"

    Scenario: Verify all the claim line items are in order
        And the user is the "mainFcUser" user
        And the user has accessed the Costs to be claimed page
        And the user clicks the "Labour" cost category
        Then the use sees the claim line item table below:
            | description | cost |
            | 1           | 100  |
            | 2           | 100  |
            | 3           | 100  |
            | 4           | 100  |
            | 5           | 100  |
            | 6           | 100  |
            | 7           | 100  |
            | 8           | 100  |
            | 9           | 100  |
            | 10          | 100  |
            | 11          | 100  |
            | 12          | 100  |
            | 13          | 100  |
            | 14          | 100  |
            | 15          | 100  |
            | 16          | 100  |
            | 17          | 100  |
            | 18          | 100  |
            | 19          | 100  |
            | 20          | 100  |
            | 21          | 100  |
            | 22          | 100  |
            | 23          | 100  |
            | 24          | 100  |
            | 25          | 100  |
            | 26          | 100  |
            | 27          | 100  |
            | 28          | 100  |
            | 29          | 100  |
            | 30          | 100  |
            | 31          | 100  |
            | 32          | 100  |
            | 33          | 100  |



