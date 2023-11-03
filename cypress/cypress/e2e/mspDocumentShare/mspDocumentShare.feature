Feature: MSP Document Share
  Scenario: Uploading a document
    Given the user is an FC of a single partner KTP project
    And the user is on the MSP document share
    When the user uploads "README.md" renamed as "very silly fc file.txt" as type "Collaboration agreement"
    Then the file "very silly fc file.txt" can be downloaded from the user's partner documents
    And the file matches "README.md" on disk

  Scenario Outline: Role visibility
    Given the user is <role> of a single partner KTP project
    And the user is on the MSP document share
    Then the user <can-or-cannot> see the "Access Control" input
    And the user can see <documents>

    Examples:
      | role          | can-or-cannot | documents               |
      | an FC         | cannot        | their partner documents |
      | a PMFC Hybrid | cannot        | their partner documents |
      | an MO         | can           | all documents           |
