Feature: Doctor Profile Creation
  As a clinic administrator
  I want to register a doctor profile with their specialty
  So that patients can find and book appointments with them

  Background:
    Given the doctor-service is running
    And the following specialty exists:
      | id   | b2c3d4e5-f6a7-8901-bcde-f12345678901 |
      | name | Cardiology                           |

  # ─── Happy path ────────────────────────────────────────────────────────────

  Scenario: Successfully create a doctor profile with required fields
    Given I have the following doctor data:
      | field         | value                          |
      | firstName     | Maria                          |
      | lastName      | Garcia                         |
      | email         | maria.garcia@clinic.com        |
      | phone         | +57-310-987-6543               |
      | licenseNumber | MED-2024-001                   |
      | specialtyId   | b2c3d4e5-f6a7-8901-bcde-f12345678901 |
    When I send a POST request to "/doctors" with that data
    Then the response status should be 201
    And the response body should contain a UUID field "id"
    And the response body should contain "licenseNumber" equal to "MED-2024-001"
    And a domain event "event.doctor.profile-created" should be published to RabbitMQ

  Scenario: Successfully create a doctor profile with optional bio
    Given I have valid doctor data with bio "Cardiologist with 10 years of experience."
    When I send a POST request to "/doctors" with that data
    Then the response status should be 201
    And the response body should contain "bio" equal to "Cardiologist with 10 years of experience."

  # ─── Specialty validation ──────────────────────────────────────────────────

  Scenario: Reject doctor creation when specialty does not exist
    Given I have valid doctor data with specialtyId "00000000-0000-0000-0000-000000000000"
    When I send a POST request to "/doctors" with that data
    Then the response status should be 404
    And the response body should contain an error message about specialty not found
    And no domain event should be published

  # ─── Duplicate prevention ──────────────────────────────────────────────────

  Scenario: Reject doctor creation with a duplicate license number
    Given a doctor with licenseNumber "MED-2024-001" already exists
    When I send a POST request to "/doctors" with licenseNumber "MED-2024-001"
    Then the response status should be 409
    And no domain event should be published

  # ─── Validation errors ─────────────────────────────────────────────────────

  Scenario Outline: Reject doctor creation when a required field is missing
    Given I have valid doctor data but without the "<field>" field
    When I send a POST request to "/doctors" with that data
    Then the response status should be 400
    And the response body should contain a validation error for "<field>"

    Examples:
      | field         |
      | firstName     |
      | lastName      |
      | email         |
      | phone         |
      | licenseNumber |
      | specialtyId   |

  Scenario: Reject doctor creation with an invalid specialtyId format
    Given I have valid doctor data with specialtyId "not-a-uuid"
    When I send a POST request to "/doctors" with that data
    Then the response status should be 400
    And the response body should contain a validation error for "specialtyId"

  # ─── Specialty CRUD ────────────────────────────────────────────────────────

  Scenario: Create a new medical specialty
    When I send a POST request to "/specialties" with body:
      """
      { "name": "Neurology", "description": "Brain and nervous system" }
      """
    Then the response status should be 201
    And the response body should contain a UUID field "id"
    And the response body should contain "name" equal to "Neurology"

  Scenario: List all specialties
    When I send a GET request to "/specialties"
    Then the response status should be 200
    And the response body should be an array
    And the array should contain at least the "Cardiology" specialty
