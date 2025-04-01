@mode:serial

Feature: Reallocate project costs
    Scenario: Creating and validating Reallocate costs
        Given a multi-partner CR&D project with profiles exists
        And the user is the "pmUser" user
        And the user has navigated to the project change request page
        And the user creates a "Reallocate project costs" PCR
        And the user clicks the "Reallocate project costs" PCR type
        Then the user will see the Reallocate project costs PCR page
            | Partner                     | Total eligible costs | Remaining costs | Remaining grant | New total eligible costs | New remaining costs | New remaining grant |
            | Hedge's Primary Ltd. (Lead) | £79,560,000.00       | £79,560,000.00  | £39,780,000.00  | £79,560,000.00           | £79,560,000.00      | £39,780,000.00      |
            | Hedge's Secondary Ltd.      | £14,400.00           | £14,400.00      | £7,200.00       | £14,400.00               | £14,400.00          | £7,200.00           |
        And the user will see the Reallocate costs footer totals
            | Partner        | Total eligible costs | Remaining costs | Remaining grant | New total eligible costs | New remaining costs | New remaining grant |
            | Project totals | £79,574,400.00       | £79,574,400.00  | £39,787,200.00  | £79,574,400.00           | £79,574,400.00      | £39,787,200.00      |

        When the user clicks "Hedge's Primary Ltd. (Lead)" in the reallocate costs table
        Then the user will see partner costs for "Hedge's Primary Ltd."
            | Cost category          | Total eligible costs | Costs claimed |
            | Labour                 | £7,800,000.00        | £0.00         |
            | Overheads              | £1,560,000.00        | £0.00         |
            | Materials              | £7,800,000.00        | £0.00         |
            | Capital usage          | £7,800,000.00        | £0.00         |
            | Subcontracting         | £7,800,000.00        | £0.00         |
            | Travel and subsistence | £7,800,000.00        | £0.00         |
            | Other costs            | £7,800,000.00        | £0.00         |
            | Other costs 2          | £7,800,000.00        | £0.00         |
            | Other costs 3          | £7,800,000.00        | £0.00         |
            | Other costs 4          | £7,800,000.00        | £0.00         |
            | Other costs 5          | £7,800,000.00        | £0.00         |
        And the user will see the Summary of project costs
            | Total eligible costs | New total eligible costs | Difference costs | Total remaining grant | New total remaining grant | Difference grant |
            | £79,574,400.00       | £79,574,400.00           | £0.00            | £39,787,200.00        | £39,787,200.00            | £0.00            |
        And the user will see "Save and return to reallocate project costs" button

    #This can be run independently.
    Scenario Outline: Validating partner costs fields
        Given a multi-partner CR&D project with profiles exists
        And the user is the "pmUser" user
        And the user has navigated to the project change request page
        And the user accesses the "Reallocate project costs" PCR

        When the user enters "<Data>" into the "<Field>" field
        Then the user will see a "<Validation>" message

        Examples:
            | Data          | Field                  | Validation                                                    |
            |               | Labour                 | Enter new total eligible costs.                               |
            | -1            | Overheads              | New total eligible costs must be £0.00 or more.               |
            | 9999999999999 | Materials              | New total eligible costs must be £999,999,999,999.00 or less. |
            | lorem         | Capital usage          | New total eligible costs must be a number.                    |
            | $1000         | Subcontracting         | New total eligible costs must be in pounds (£).               |
            | *&            | Travel and subsistence | New total eligible costs must be a number.                    |
            | 100-          | Other costs            | New total eligible costs must be a valid currency.            |
            | 300.333       | Labour                 | New total eligible costs must be 2 decimal places or fewer.   |

    # This can be run independently.
    Scenario: Checking for accurate calculation in partner costs
        Given a multi-partner CR&D project with profiles exists
        And the user is the "pmUser" user
        And the user has navigated to the existing Reallocate project costs PCR
        And the user clicks "Hedge's Primary Ltd. (Lead)" in the reallocate costs table

        When the user makes changes to the partner costs
            | Cost category          | New cost   | Costs reallocated |
            | Labour                 | 1500000.02 | -£6,299,999.98    |
            | Overheads              | 1259999.99 | -£300,000.01      |
            | Materials              | 1500000.07 | -£6,299,999.93    |
            | Capital usage          | 7800000.02 | £0.02             |
            | Subcontracting         | 7800000.07 | £0.07             |
            | Travel and subsistence | 7800000.07 | £0.07             |
            | Other costs            | 7800000.02 | £0.02             |
        Then the user will see the updated totals in the footer
            | Cost category  | Total eligible costs | Costs claimed | New total eligible costs | Costs reallocated |
            | Partner totals | £79,560,000.00       | £0.00         | £66,660,000.26           | -£12,899,999.74   |
        And the user will see the Summary of project costs
            | Total eligible costs | New total eligible costs | Difference costs | Total remaining grant | New total remaining grant | Difference grant |
            | £79,574,400.00       | £66,674,400.26           | -£12,899,999.74  | £39,787,200.00        | £33,337,200.13            | -£6,449,999.87   |

        When the user clicks the "Save and return to reallocate project costs" button
        Then the user will see the Reallocate project costs PCR page
            | Partner                     | Total eligible costs | Remaining costs | Remaining grant | New total eligible costs | New remaining costs | New remaining grant |
            | Hedge's Primary Ltd. (Lead) | £79,560,000.00       | £79,560,000.00  | £39,780,000.00  | £66,660,000.26           | £66,660,000.26      | £33,330,000.13      |
            | Hedge's Secondary Ltd.      | £14,400.00           | £14,400.00      | £7,200.00       | £14,400.00               | £14,400.00          | £7,200.00           |
        And the user will see the Reallocate costs footer totals
            | Partner        | Total eligible costs | Remaining costs | Remaining grant | New total eligible costs | New remaining costs | New remaining grant |
            | Project totals | £79,574,400.00       | £79,574,400.00  | £39,787,200.00  | £66,674,400.26           | £66,674,400.26      | £33,337,200.13      |
        And the user will see "£6,449,999.87" remaining grant surplus warning message

        When the user clicks "Hedge's Secondary Ltd." in the reallocate costs table
        And the user makes changes to the partner costs
            | Cost category                              | New cost   | Costs reallocated |
            | Directly incurred - staff                  | 1076199.98 | £1,074,999.98     |
            | Directly incurred - travel and subsistence | 1076199.98 | £1,074,999.98     |
            | Directly incurred - equipment              | 1076199.98 | £1,074,999.98     |
            | Directly incurred - other costs            | 1076199.98 | £1,074,999.98     |
            | Directly allocated - investigations        | 1076199.98 | £1,074,999.98     |
            | Directly allocated - estates costs         | 1076199.98 | £1,074,999.98     |
            | Directly allocated - other costs           | 1076199.98 | £1,074,999.98     |
            | Indirect costs - investigations            | 1076199.98 | £1,074,999.98     |
            | Exceptions - staff                         | 1076199.98 | £1,074,999.98     |
            | Exceptions - travel and subsistence        | 1076199.98 | £1,074,999.98     |
            | Exceptions - equipment                     | 1076199.98 | £1,074,999.98     |
            | Exceptions - other costs                   | 1076199.97 | £1,074,999.97     |
        Then the user will see the updated totals in the footer
            | Cost category  | Total eligible costs | Costs claimed | New total eligible costs | Costs reallocated |
            | Partner totals | £14,400.00           | £0.00         | £12,914,399.75           | £12,899,999.75    |
        And the user will see the Summary of project costs
            | Total eligible costs | New total eligible costs | Difference costs | Total remaining grant | New total remaining grant | Difference grant |
            | £79,574,400.00       | £79,574,400.01           | £0.01            | £39,787,200.00        | £39,787,200.01            | £0.01            |

        When the user clicks the "Save and return to reallocate project costs" button
        Then the user will see the Reallocate project costs PCR page
            | Partner                     | Total eligible costs | Remaining costs | Remaining grant | New total eligible costs | New remaining costs | New remaining grant |
            | Hedge's Primary Ltd. (Lead) | £79,560,000.00       | £79,560,000.00  | £39,780,000.00  | £66,660,000.26           | £66,660,000.26      | £33,330,000.13      |
            | Hedge's Secondary Ltd.      | £14,400.00           | £14,400.00      | £7,200.00       | £12,914,399.75           | £12,914,399.75      | £6,457,199.88       |
        And the user will see the Reallocate costs footer totals
            | Partner        | Total eligible costs | Remaining costs | Remaining grant | New total eligible costs | New remaining costs | New remaining grant |
            | Project totals | £79,574,400.00       | £79,574,400.00  | £39,787,200.00  | £79,574,400.01           | £79,574,400.01      | £39,787,200.01      |
        And the user will see "£0.01" grant exceeded warning message

        When the user marks as complete and saves
        Then the user will see the grant moving over financial year validation message

        When the user enters "0" in the Grant moving over financial year
        And the user marks as complete and saves
        Then the user will see a validation message advising of exceeded grant

        When the user clicks "Hedge's Secondary Ltd." in the reallocate costs table
        And the user updates "Exceptions - other costs" to "1076199.96"
        And the user clicks the "Save and return to reallocate project costs" button
        Then no grant warning messages will be displayed

        When the user unchecks "I agree with this change."
        And the user clicks the "Save and return to request" button
        Then the request page will show "Reallocate project costs" as "Incomplete"

        When the user clicks the "Reallocate project costs" PCR type
        And the user enters "0" in the Grant moving over financial year
        And the user marks as complete and saves
        Then the request page will show "Reallocate project costs" as "Complete"

    #This can be run independently.
    Scenario: Submitting a reallocate costs PCR
        Given a multi-partner CR&D project with profiles exists
        And the user is the "pmUser" user
        And the user has navigated to the existing Reallocate project costs PCR
        And the Reallocate project costs PCR is in the Complete state
        When the user completes the reasons section
        And the user clicks Submit request
        Then the user will see the submitted page for "Reallocate project costs"

    # This can be run independently.
    Scenario: Reviewing Reallocate project costs PCR
        Given a multi-partner CR&D project with profiles exists
        And the user is the "mspUser" user
        And the user has navigated to the project change request page
        And the user accesses the PCR with status "Submitted to Monitoring Officer"

        And the user clicks the "Reallocate project costs" PCR type
        Then the user will see the project-level review page for Reallocate project costs
            | Partner                     | Total eligible costs | New total eligible costs | Difference costs | Funding level | New funding level | Remaining grant | New remaining grant | Difference grant |
            | Hedge's Primary Ltd. (Lead) | £79,560,000.00       | £66,660,000.26           | -£12,899,999.74  | 50.00%        | 50.00%            | £39,780,000.00  | £33,330,000.13      | -£6,449,999.87   |
            | Hedge's Secondary Ltd.      | £14,400.00           | £12,914,399.74           | £12,899,999.74   | 50.00%        | 50.00%            | £7,200.00       | £6,457,199.87       | £6,449,999.87    |
            | Project totals              | £79,574,400.00       | £79,574,400.00           | £0.00            | 50.00%        | 50.00%            | £39,787,200.00  | £39,787,200.00      | £0.00            |

        When the user clicks "Hedge's Primary Ltd. (Lead)" in the reallocate costs table
        Then they will see the "Hedge's Primary Ltd." costs page
            | Cost category          | Total eligible costs | New total eligible costs | Costs reallocated |
            | Labour                 | £7,800,000.00        | £1,500,000.02            | -£6,299,999.98    |
            | Overheads              | £1,560,000.00        | £1,259,999.99            | -£300,000.01      |
            | Materials              | £7,800,000.00        | £1,500,000.07            | -£6,299,999.93    |
            | Capital usage          | £7,800,000.00        | £7,800,000.02            | £0.02             |
            | Subcontracting         | £7,800,000.00        | £7,800,000.07            | £0.07             |
            | Travel and subsistence | £7,800,000.00        | £7,800,000.07            | £0.07             |
            | Other costs            | £7,800,000.00        | £7,800,000.02            | £0.02             |
            | Other costs 2          | £7,800,000.00        | £7,800,000.00            | £0.00             |
            | Other costs 3          | £7,800,000.00        | £7,800,000.00            | £0.00             |
            | Other costs 4          | £7,800,000.00        | £7,800,000.00            | £0.00             |
            | Other costs 5          | £7,800,000.00        | £7,800,000.00            | £0.00             |
            | Partner totals         | £79,560,000.00       | £66,660,000.26           | -£12,899,999.74   |

        When the user clicks "Hedge's Secondary Ltd." in the reallocate costs table
        Then they will see the "Hedge's Secondary Ltd." costs page
            | Cost category                              | Total eligible costs | New total eligible costs | Costs reallocated |
            | Directly incurred - staff                  | £1,200.00            | £1,076,199.98            | £1,074,999.98     |
            | Directly incurred - travel and subsistence | £1,200.00            | £1,076,199.98            | £1,074,999.98     |
            | Directly incurred - equipment              | £1,200.00            | £1,076,199.98            | £1,074,999.98     |
            | Directly incurred - other costs            | £1,200.00            | £1,076,199.98            | £1,074,999.98     |
            | Directly allocated - investigations        | £1,200.00            | £1,076,199.98            | £1,074,999.98     |
            | Directly allocated - estates costs         | £1,200.00            | £1,076,199.98            | £1,074,999.98     |
            | Directly allocated - other costs           | £1,200.00            | £1,076,199.98            | £1,074,999.98     |
            | Indirect costs - investigations            | £1,200.00            | £1,076,199.98            | £1,074,999.98     |
            | Exceptions - staff                         | £1,200.00            | £1,076,199.98            | £1,074,999.98     |
            | Exceptions - travel and subsistence        | £1,200.00            | £1,076,199.98            | £1,074,999.98     |
            | Exceptions - equipment                     | £1,200.00            | £1,076,199.98            | £1,074,999.98     |
            | Exceptions - other costs                   | £1,200.00            | £1,076,199.98            | £1,074,999.98     |
            | Partner totals                             | £14,400.00           | £12,914,399.74           | £12,899,999.74    |


#TODO in ACC-11996
# Query from MO to PM and have PM include a Change remaining grant. Then review again asserting for this change as MO.
# Submit to IUK
# Query from IUK
# Resubmit and approve in IUK

