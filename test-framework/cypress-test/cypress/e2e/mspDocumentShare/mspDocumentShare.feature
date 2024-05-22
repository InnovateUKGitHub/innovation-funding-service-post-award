Feature: MSP Document Share
  Background: Project Setup
    Given a standard CR&D project exists

  Scenario: Uploading a document
    Given the user is the FC
    And the user is on the MSP document share
    When the user uploads a file named "very silly fc file.txt" with no type
    Then the file can be downloaded from the user's partner documents
    And the file matches what was uploaded

  Scenario Outline: Invalid file names
    Given the user is the FC
    And the user is on the MSP document share
    When the user uploads a file named <filename> with no type
    Then the file is rejected because <reasoning>

    Examples:
      | filename                                                                                                 | reasoning                   |
      | "aksdjhjadhshdsakhkadshjkadshjkdashjhdakhkdshjkahdshdsakjhdsjkhdasjkhdajskhjksdhjkdsahjkdashjkhads.pptx" | it is too long              |
      | "Yoshi Commits Tax Fraud.nds"                                                                            | it has the wrong extension  |
      | "James May: Cheese.pptx"                                                                                 | it has forbidden characters |
      | ".pptx"                                                                                                  | it has no name              |

  Scenario Outline: Role visibility
    Given the user is <role>
    And the user is on the MSP document share
    Then the user <can-or-cannot> see the "Access Control" input
    And the user can see <documents>

    Examples:
      | role   | can-or-cannot | documents               |
      | the FC | cannot        | their partner documents |
      | the MO | can           | all documents           |
# | a PMFC Hybrid | cannot        | their partner documents |
