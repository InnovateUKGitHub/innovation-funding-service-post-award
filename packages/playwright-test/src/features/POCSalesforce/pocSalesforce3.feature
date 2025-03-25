@mode:serial
Feature: Playwright Salesforce POC
    Scenario: Running a test
        Given there is a Competition created using the UI
        And there is a Project created using the UI
        And Contacts and Participants are added by the UI
        And Stattdate added and Project status changed to Live using the UI
        And AwardRate and CapLimit updated using UI then Claim Shell batch job ran using Apex
        And Profiles have been updated using Apex
            | fields               | value                                                                                                                                                                                       |
            | AwardRate            | 100                                                                                                                                                                                         |
            | CapLimit             | 70                                                                                                                                                                                          |
            | CompetitionType      | CR&D                                                                                                                                                                                        |
            | OrganisationType     | Industrial                                                                                                                                                                                  |
            | CostCategoriesData   | 'Subcontracting','Labour','Materials','Travel and subsistence'                                                                                                                              |
            | CostCategoryArray    | 'Labour','Subcontracting','Labour','Labour','Materials','Materials','Materials','Materials','Materials','Materials','Materials','Materials','Materials','Materials','Materials','Materials' |
            | PeriodNumberArray    | '1','1','8','11','1','2','3','4','5','6','7','8','9','10','11','12'                                                                                                                         |
            | ValueArray           | '101000','110000','100600','105000','103995','13500','100100','100200','150000','150000','510000','150000','150000','150000','510000','150000'                                              |
            | IARStatusCounter     | '5','6','7'                                                                                                                                                                                 |
            | ReviewTeamSetCounter | '1','2'                                                                                                                                                                                     |
        And claims have been added and Approved using the UI
        And claims have been added and Approved by APEX

