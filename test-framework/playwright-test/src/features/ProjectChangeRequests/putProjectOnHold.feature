@mode:serial
Feature: Put a project on hold

  Background:
    Given a standard CR&D project exists
    And the user is a project manager
    And the user is on the project overview
    When the user selects the "Project change requests" tile
    Then the project change request page is displayed

  Scenario: Submitting an incomplete PCR request triggers an error
    Given the user sees the project request page
    And the user clicks create request without selecting a PCR
    Then an error message should be displayed
  #Add one more step

  Scenario: Verify that the user can put a project on hold
    Given the user sees the project request page
    And the following guidance texts are visible:
      | Label Text                  | Acc PCR guidance                                                                                                                                                                 |
      | Reallocate project costs    | This allows you to move costs from one category to another.                                                                                                                      |
      | Remove a partner            | Use this when a partner is leaving the project and is ready to submit their final claim.                                                                                         |
      | Add a partner               | This allows you to add a new partner to a project. When adding a new partner to replace an existing one, also use 'Remove a partner' to remove the existing one.                 |
      | Change project scope        | Use this to update the public project description and the internal project summary.                                                                                              |
      | Change project duration     | This allows you to request an extension or reduction to your project's duration.                                                                                                 |
      | Change a partner's name     | Use when a partner organisation's name has changed. If a partner is being replaced, use ‘Remove a partner’ to delete the old one and ‘Add a partner’ to add the new one.         |
      | Put project on hold         | This allows you to suspend a project for a specific period. You cannot submit any claims, costs, drawdown requests or raise project change requests when the project is on hold. |
      | Approve a new subcontractor | If you are requesting a change in subcontractor, please select this option.                                                                                                      |
    # | Manage team members         | This allows you to add a new project team member or to change the role of an existing team member.                                                                               |

    When the user completes the request to put a project on hold
    And the user clicks submit
    Then the request should be submitted successfully

  #Todo: Update the step above to save and return to request and then create another scenario to edit and submit the PCR

  Scenario: Verify that MO can query a PCR
    Given the user is a monitoring officer
    And the user is on the project overview
    When the user selects the "Project change requests" tile
    Then the user sees the following table
      | request_number | types               | started         | status                          | last_updated    | action |
      | 1              | Put project on hold | submission date | Submitted to Monitoring Officer | submission date | Review |
    When the user queries the PCR request
    And the user submits the project change request
    Then the user should see the following table
      | request_number | types               | started         | status                     | last_updated    | action |
      | 1              | Put project on hold | submission date | Queried to Project Manager | submission date | View   |


  Scenario: PM can resubmit a PCR
    Given the user is a project manager
    And the user is on the project overview
    When the user selects the "Project change requests" tile
    Then the user should see the following queried request table
      | request_number | types               | started         | status                     | last_updated    | action |
      | 1              | Put project on hold | submission date | Queried to Project Manager | submission date | Edit   |
    When the user replies to the query to put the project on hold
    Then the request should be succesfully submitted
    When the user navigates back to the pcr dashboard
    Then the user sees the table below
      | request_number | types               | started         | status                          | last_updated    | action |
      | 1              | Put project on hold | submission date | Submitted to Monitoring Officer | submission date | View   |

#Todo
# Scenario: MO can send PCR for approval
#   Given the user is a monitoring officer
#   And the user is on the project overview
#   When the user selects the "Project change requests" tile
#   Then the user sees the following table
#     | request_number | types               | started         | status                          | last_updated    | action |
#     | 1              | Put project on hold | submission date | Submitted to Monitoring Officer | submission date | Review |
#   When the user reviews the PCR request
#   And the user sends the project change request for approval
#   Then the user should see the following table
#     | request_number | types               | started         | status                     | last_updated    | action |
#     | 1              | Put project on hold | submission date | Submitted to Innovate UK   | submission date | View   |

# Scenario: Innovate lead queries the PCR
