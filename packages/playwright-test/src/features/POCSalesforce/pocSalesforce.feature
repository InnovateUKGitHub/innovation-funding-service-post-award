@mode:serial
Feature: Playwright Salesforce POC
    Scenario: Running a test
        Given there is a CRnD Project with twelve Approved Claims
            | fields               | value                                                                                                                                                                                       |
            | AwardRate            | 100                                                                                                                                                                                         |
            | CapLimit             | 70                                                                                                                                                                                          |
            | CompetitionType      | CR&D                                                                                                                                                                                        |
            | OrganisationType     | Industrial                                                                                                                                                                                  |
            | CostCategoriesData   | 'Subcontracting','Labour','Materials','Travel and subsistence'                                                                                                                              |
            | CostCategoryArray    | 'Labour','Subcontracting','Labour','Labour','Materials','Materials','Materials','Materials','Materials','Materials','Materials','Materials','Materials','Materials','Materials','Materials' |
            | PeriodNumberArray    | '2','2','8','11','1','2','3','4','5','6','7','8','9','10','11','12'                                                                                                                         |
            | ValueArray           | '101000','110000','100600','105000','103995','135000','100100','100200','150000','150000','510000','150000','150000','150000','510000','150000'                                             |
            | IARStatusCounter     | '5','6','7'                                                                                                                                                                                 |
            | ReviewTeamSetCounter | '1','2'                                                                                                                                                                                     |
        And the user accesses the project in Salesforce
        And the Project is deleted
#When the user opens period 2
#Then the "Period 2" claim will have status "Draft"

#Then that the Claims Participant and Project calculations are correct
#And that the Queues have been correctly assigned to the Claims