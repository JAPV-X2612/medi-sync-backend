Feature: Appointment Request
  As a registered patient
  I want to request an appointment with a doctor
  So that I can receive medical attention at a specific time

  Background:
    Given the appointments-service is running
    And the following patient exists with id "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    And the following doctor exists with id "c3d4e5f6-a7b8-9012-cdef-123456789012"
    And the doctor has an available slot on "2026-05-10T09:00:00.000Z"

  # ─── Happy path ────────────────────────────────────────────────────────────

  Scenario: Successfully request a new appointment
    Given I have the following appointment data:
      | field           | value                                       |
      | patientId       | a1b2c3d4-e5f6-7890-abcd-ef1234567890        |
      | patientName     | John Doe                                    |
      | patientEmail    | john.doe@email.com                          |
      | doctorId        | c3d4e5f6-a7b8-9012-cdef-123456789012        |
      | doctorName      | Dr. Maria Garcia                            |
      | appointmentTime | 2026-05-10T09:00:00.000Z                    |
      | reason          | Annual check-up                             |
    When I send a POST request to "/appointments" with that data
    Then the response status should be 201
    And the response body should contain a UUID field "id"
    And the response body should contain "status" equal to "PENDING"
    And the response body should contain "appointmentTime" equal to "2026-05-10T09:00:00.000Z"

  Scenario: Successfully request an appointment with an optional scheduleId
    Given I have valid appointment data with scheduleId "d4e5f6a7-b8c9-0123-defg-234567890123"
    When I send a POST request to "/appointments" with that data
    Then the response status should be 201
    And the response body should contain "status" equal to "PENDING"

  # ─── Validation errors ─────────────────────────────────────────────────────

  Scenario Outline: Reject appointment request when a required field is missing
    Given I have valid appointment data but without the "<field>" field
    When I send a POST request to "/appointments" with that data
    Then the response status should be 400
    And the response body should contain a validation error for "<field>"

    Examples:
      | field           |
      | patientId       |
      | patientName     |
      | patientEmail    |
      | doctorId        |
      | doctorName      |
      | appointmentTime |
      | reason          |

  Scenario: Reject appointment with invalid patientId format
    Given I have valid appointment data with patientId "not-a-uuid"
    When I send a POST request to "/appointments" with that data
    Then the response status should be 400
    And the response body should contain a validation error for "patientId"

  Scenario: Reject appointment with invalid appointmentTime format
    Given I have valid appointment data with appointmentTime "not-a-date"
    When I send a POST request to "/appointments" with that data
    Then the response status should be 400
    And the response body should contain a validation error for "appointmentTime"

  Scenario: Reject appointment with reason exceeding 500 characters
    Given I have valid appointment data with reason of 501 characters
    When I send a POST request to "/appointments" with that data
    Then the response status should be 400

  # ─── Read ──────────────────────────────────────────────────────────────────

  Scenario: List all appointments
    Given at least one appointment exists
    When I send a GET request to "/appointments"
    Then the response status should be 200
    And the response body should be an array

  Scenario: Get appointment by ID
    Given an appointment with id "e5f6a7b8-c9d0-1234-efgh-345678901234" exists
    When I send a GET request to "/appointments/e5f6a7b8-c9d0-1234-efgh-345678901234"
    Then the response status should be 200
    And the response body should contain "id" equal to "e5f6a7b8-c9d0-1234-efgh-345678901234"

  Scenario: Return 404 for non-existent appointment
    When I send a GET request to "/appointments/00000000-0000-0000-0000-000000000000"
    Then the response status should be 404

  Scenario: List appointments by patient
    Given an appointment exists for patient "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    When I send a GET request to "/appointments/patient/a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    Then the response status should be 200
    And every appointment in the response should have "patientId" equal to "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
