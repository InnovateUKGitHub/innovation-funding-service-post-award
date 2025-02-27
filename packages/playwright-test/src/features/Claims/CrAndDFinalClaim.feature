@mode:serial
Feature: Commercial claim in Final Claim state
    Scenario: Submitting Final Claim
        Given a multi-partner CR&D project in Final Claim exists
        And the user is the "mainFcUser" user
        And the user is on the claims dashboard
        When the user clicks "Edit" on the claim line
        Then the user will see the Final Claim notification
        And the user will see the Final claim Costs to be claimed page
            | Category               | Total eligible costs | Eligible costs claimed to date | Costs claimed this period | Remaining eligible costs |
            | Labour                 | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Overheads              | £1,560,000.00        | £0.00                          | £0.00                     | £1,560,000.00            |
            | Materials              | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Capital usage          | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Subcontracting         | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Travel and subsistence | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Other costs            | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Other costs 2          | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Other costs 3          | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Other costs 4          | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Other costs 5          | £7,800,000.00        | £0.00                          | £0.00                     | £7,800,000.00            |
            | Total                  | £79,560,000.00       | £0.00                          | £0.00                     | £79,560,000.00           |

        When the user updates all costs for the final claim
            | Category               | Cost       |
            | Labour                 | 7800000.00 |
            | Overheads              | 1560000    |
            | Materials              | 7800000.00 |
            | Capital usage          | 7800000.00 |
            | Subcontracting         | 7800000.00 |
            | Travel and subsistence | 7800000.00 |
            | Other costs            | 7800000.00 |
            | Other costs 2          | 7800000.00 |
            | Other costs 3          | 7800000.00 |
            | Other costs 4          | 7800000.00 |
            | Other costs 5          | 7800000.00 |
        And the user accesses the Claim documents page
        Then the user will see the Final Claim notification
        And the user will see Project Completion Form guidance
        And the user will see the Final claim documents page

        When the user accesses the Summary page from the Documents page
        Then the user will see the Final claim summary page

        When the user clicks the "Submit claim" button
        Then the user will be advised of missing Project Completion Form

        When the user uploads a PCF and then attempts to submit
        Then an IAR validation message is displayed

        When the user clicks Save and return to claims
        And the user navigates through to the Claim documents page
        And the user uploads an Independent Accountant's Report
        And the user uploads 10 documents
        And the user accesses the Summary page from the Documents page
        Then the user will see all files displayed on the Summary page
            | File name     | Type                            |
            | testfile.txt  | Claim evidence                  |
            | testfile.rtf  | Claim evidence                  |
            | testfile.ppt  | Claim evidence                  |
            | testfile.pdf  | Claim evidence                  |
            | testfile.odt  | Claim evidence                  |
            | testfile.odp  | Claim evidence                  |
            | testfile.xps  | Claim evidence                  |
            | testfile.csv  | Claim evidence                  |
            | testfile.xlsx | Claim evidence                  |
            | T.doc         | Claim evidence                  |
            | IAR.doc       | Independent accountant’s report |
            | PCF.doc       | Project completion form         |
        When the user attempts to submit the claim
        Then the claim will have the status "Submitted to Monitoring Officer"
