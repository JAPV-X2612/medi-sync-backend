Feature: Patient Registration
  As a new patient
  I want to register in the MediSync system
  So that I can book appointments with specialist doctors

  Background:
    Given the patient-service is running
    And the database has no existing patients

  # ─── Happy path ────────────────────────────────────────────────────────────

  Scenario: Successfully register a patient with all required fields
    Given I have the following patient data:
      | field          | value                  |
      | firstName      | John                   |
      | lastName       | Doe                    |
      | email          | john.doe@email.com     |
      | phone          | +57-300-123-4567       |
      | birthDate      | 1990-06-15             |
      | documentType   | CC                     |
      | documentNumber | 1234567890             |
    When I send a POST request to "/patients" with that data
    Then the response status should be 201
    And the response body should contain a UUID field "id"
    And the response body should contain "email" equal to "john.doe@email.com"
    And a domain event "event.patient.registered" should be published to RabbitMQ
    And the event payload should contain the patient's id and email

  Scenario: Successfully register a patient with optional blood type
    Given I have valid patient data with bloodType "O+"
    When I send a POST request to "/patients" with that data
    Then the response status should be 201
    And the response body should contain "bloodType" equal to "O+"

  Scenario Outline: Register patients with all valid document types
    Given I have valid patient data with documentType "<documentType>"
    When I send a POST request to "/patients" with that data
    Then the response status should be 201

    Examples:
      | documentType |
      | CC           |
      | TI           |
      | CE           |
      | PASSPORT     |

  # ─── Duplicate prevention ──────────────────────────────────────────────────

  Scenario: Reject registration with a duplicate email
    Given a patient with email "john.doe@email.com" already exists
    When I send a POST request to "/patients" with email "john.doe@email.com"
    Then the response status should be 409
    And the response body should contain an error message about duplicate email
    And no domain event should be published

  # ─── Validation errors ─────────────────────────────────────────────────────

  Scenario Outline: Reject registration when a required field is missing
    Given I have valid patient data but without the "<field>" field
    When I send a POST request to "/patients" with that data
    Then the response status should be 400
    And the response body should contain a validation error for "<field>"

    Examples:
      | field          |
      | firstName      |
      | lastName       |
      | email          |
      | phone          |
      | birthDate      |
      | documentType   |
      | documentNumber |

  Scenario: Reject registration with an invalid document type
    Given I have valid patient data with documentType "DNI"
    When I send a POST request to "/patients" with that data
    Then the response status should be 400
    And the response body should contain a validation error for "documentType"

  Scenario: Reject registration with firstName exceeding 100 characters
    Given I have valid patient data with firstName of 101 characters
    When I send a POST request to "/patients" with that data
    Then the response status should be 400
