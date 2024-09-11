@mode:serial
Feature: Put a project on hold

  Background: 
    Given a standard CR&D project exists
    And the user is a project manager
    And the user is on the project overview
    When the user selects the "Project change requests" tile
    Then the project change request page is displayed 

  Scenario: Verify that the user can put a project on hold
    Given the user sees the project request page
    And the following guidance texts are visible:
      | Label Text                 | Acc PCR guidance                                                                |
      | Reallocate project costs   | This allows you to move costs from one category to another.               |
      | Remove a partner           | Use this when a partner is leaving the project and is ready to submit their final claim. |
      | Add a partner              | This allows you to add a new partner to a project. When adding a new partner to replace an existing one, also use 'Remove a partner' to remove the existing one. |
      | Change project scope       | Use this to update the public project description and the internal project summary. |
      | Change project duration    | This allows you to request an extension or reduction to your project's duration. |
      | Change a partner's name    | Use when a partner organisation's name has changed. If a partner is being replaced, use ‘Remove a partner’ to delete the old one and ‘Add a partner’ to add the new one. |
      | Put project on hold        | This allows you to suspend a project for a specific period. You cannot submit any claims, costs, drawdown requests or raise project change requests when the project is on hold. |
      | Approve a new subcontractor | If you are requesting a change in subcontractor, please select this option. |

    When the user completes the request to put a project on hold
    And the user clicks submit 
    Then the request should be submitted successfully 

 # Scenario: User must select atleast one PCR type
   # Given the user clicks create request without selecting a PCR
   # Then an error message should be displayed

    
# Scenario: Verify guidance texts and checkboxes
#    Given the user sees the project request page
 #  And the user clicks create request   Then the following guidance texts should be visibl      | Label Text                | Inner HTML                                                                 |
 #     | Reallocate project costs   | This allows you to move costs from one category to another.               |
 #     | Remove a partner           | Use this when a partner is leaving the project and is ready to submit their final claim. |
 #     | Add a partner              | This allows you to add a new partner to a project. When adding a new partner to replace an existing one, also use 'Remove a partner' to remove the existing one. |
 #     | Change project scope       | Use this to update the public project description and the internal project summary. |
  #    | Change project duration    | This allows you to request an extension or reduction to your project's duration. |
  #    | Change a partner's name    | Use when a partner organisation's name has changed. If a partner is being replaced, use ‘Remove a partner’ to delete the old one and ‘Add a partner’ to add the new one. |
  #    | Put project on hold        | This allows you to suspend a project for a specific period. You cannot submit any claims, costs, drawdown requests or raise project change requests when the project is on hold. |
 #     | Approve a new subcontractor | If you are requesting a change in subcontractor, please select this option. |

   



    
   
    