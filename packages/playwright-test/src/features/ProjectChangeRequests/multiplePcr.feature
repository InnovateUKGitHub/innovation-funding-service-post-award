@mode:serial
Feature: Adding multiple PCRs to a single request

    Background:
        Given a multi-partner CR&D project exists
        And the user is the "pmUser" user
        And the user has navigated to the project change request page

    Scenario: Adding all PCR types
        When the user adds all PCR types to the request
            | PCR                         |
            | Reallocate project costs    |
            | Remove a partner            |
            | Add a partner               |
            | Change project scope        |
            | Change project duration     |
            | Change a partner's name     |
            | Put project on hold         |
            | Approve a new subcontractor |
        Then the Request page will show all PCR types as "To do"
            | PCR                         |
            | Reallocate project costs    |
            | Remove a partner            |
            | Add a partner               |
            | Change project scope        |
            | Change project duration     |
            | Change a partner's name     |
            | Put project on hold         |
            | Approve a new subcontractor |

        When the user clicks into each PCR in turn
            | PCR                         |
            | Reallocate project costs    |
            | Remove a partner            |
            | Add a partner               |
            | Change project scope        |
            | Change project duration     |
            | Change a partner's name     |
            | Put project on hold         |
            | Approve a new subcontractor |
        Then they will arrive lastly at the "Approve a new subcontractor" page

    Scenario: Deleting the existing PCR
        Given the user can see the existing PCR in "Draft with Project Manager"
            | PCR                         |
            | Reallocate project costs    |
            | Remove a partner            |
            | Add a partner               |
            | Change project scope        |
            | Change project duration     |
            | Change a partner's name     |
            | Put project on hold         |
            | Approve a new subcontractor |

        When the user clicks the Delete link
        Then the user will see the Delete PCR page
            | PCR                         |
            | Reallocate project costs    |
            | Remove a partner            |
            | Add a partner               |
            | Change project scope        |
            | Change project duration     |
            | Change a partner's name     |
            | Put project on hold         |
            | Approve a new subcontractor |

        When the user clicks the Delete request button
        Then the PCR will no longer exist