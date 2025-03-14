@mode:serial
Feature: Accessing a project in salesforce

    Scenario: Asserting for project information
        Given a multi-partner CR&D project with profiles exists
        When the user accesses the Project Factory project in Salesforce
        Then the user can see the project Lightning page
            | tab                     |
            | Home                    |
            | Programmes              |
            | Projects                |
            | Claims                  |
            | Accounts                |
            | Contacts                |
            | Competitions            |
            | Project Change Requests |

        And the user sees the project data
            | id                   | label          |
            | Acc_ProjectTitle__c  | Project Title  |
            | Name                 | Project ID     |
            | OwnerId              | Owner          |
            | Acc_ProjectStatus__c | Project Status |
            | Acc_ProjectNumber__c | Project Number |

        When the user clicks Edit and changes the Project Title to "Edit test"
        Then the project title is correctly saved as "Edit test"
