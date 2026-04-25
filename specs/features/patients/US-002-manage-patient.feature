Feature: Patient Management
  As a system administrator
  I want to retrieve, update, and remove patient records
  So that patient data remains accurate and up to date

  Background:
    Given the patient-service is running
    And the following patient exists:
      | field          | value                  |
      | id             | a1b2c3d4-e5f6-7890-abcd-ef1234567890 |
      | firstName      | John                   |
      | lastName       | Doe                    |
      | email          | john.doe@email.com     |
      | phone          | +57-300-123-4567       |
      | birthDate      | 1990-06-15             |
      | documentType   | CC                     |
      | documentNumber | 1234567890             |

  # ─── Read ──────────────────────────────────────────────────────────────────

  Scenario: Retrieve all patients
    When I send a GET request to "/patients"
    Then the response status should be 200
    And the response body should be an array containing at least 1 patient
    And each patient should have an "id" field

  Scenario: Retrieve a patient by existing ID
    When I send a GET request to "/patients/a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    Then the response status should be 200
    And the response body should contain "firstName" equal to "John"
    And the response body should contain "email" equal to "john.doe@email.com"

  Scenario: Return 404 when patient ID does not exist
    When I send a GET request to "/patients/00000000-0000-0000-0000-000000000000"
    Then the response status should be 404
    And the response body should contain an error message

  Scenario: Return 400 when patient ID is not a valid UUID
    When I send a GET request to "/patients/not-a-uuid"
    Then the response status should be 400

  # ─── Update ────────────────────────────────────────────────────────────────

  Scenario: Update patient phone number
    Given I have update data with phone "+57-310-987-6543"
    When I send a PUT request to "/patients/a1b2c3d4-e5f6-7890-abcd-ef1234567890" with that data
    Then the response status should be 200
    And the response body should contain "phone" equal to "+57-310-987-6543"

  Scenario: Update patient blood type
    Given I have update data with bloodType "A+"
    When I send a PUT request to "/patients/a1b2c3d4-e5f6-7890-abcd-ef1234567890" with that data
    Then the response status should be 200
    And the response body should contain "bloodType" equal to "A+"

  Scenario: Return 404 when updating a non-existent patient
    Given I have valid update data
    When I send a PUT request to "/patients/00000000-0000-0000-0000-000000000000" with that data
    Then the response status should be 404

  # ─── Delete ────────────────────────────────────────────────────────────────

  Scenario: Delete an existing patient
    When I send a DELETE request to "/patients/a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    Then the response status should be 204
    And the response body should be empty
    And a subsequent GET to "/patients/a1b2c3d4-e5f6-7890-abcd-ef1234567890" should return 404

  Scenario: Return 404 when deleting a non-existent patient
    When I send a DELETE request to "/patients/00000000-0000-0000-0000-000000000000"
    Then the response status should be 404
