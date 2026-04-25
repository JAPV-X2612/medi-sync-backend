Feature: Doctor Schedule Management
  As a clinic administrator
  I want to define weekly availability slots for each doctor
  So that patients can see when doctors are available for appointments

  Background:
    Given the doctor-service is running
    And the following doctor exists:
      | id            | c3d4e5f6-a7b8-9012-cdef-123456789012 |
      | firstName     | Maria                                |
      | lastName      | Garcia                               |
      | licenseNumber | MED-2024-001                         |

  # ─── Create schedule ───────────────────────────────────────────────────────

  Scenario: Add a Monday morning schedule slot
    Given I have the following schedule data:
      | field           | value                                |
      | doctorId        | c3d4e5f6-a7b8-9012-cdef-123456789012 |
      | dayOfWeek       | 1                                    |
      | startTime       | 08:00                                |
      | endTime         | 12:00                                |
      | slotDurationMin | 30                                   |
    When I send a POST request to "/schedules" with that data
    Then the response status should be 201
    And the response body should contain a UUID field "id"
    And the response body should contain "dayOfWeek" equal to 1
    And the response body should contain "slotDurationMin" equal to 30

  Scenario Outline: Add schedule slots for every day of the week
    Given I have schedule data for dayOfWeek "<day>" with valid times
    When I send a POST request to "/schedules" with that data
    Then the response status should be 201

    Examples:
      | day |
      | 0   |
      | 1   |
      | 2   |
      | 3   |
      | 4   |
      | 5   |
      | 6   |

  # ─── Read schedules ────────────────────────────────────────────────────────

  Scenario: Retrieve all schedules for a doctor
    Given the doctor has one schedule slot on Monday
    When I send a GET request to "/doctors/c3d4e5f6-a7b8-9012-cdef-123456789012/schedules"
    Then the response status should be 200
    And the response body should be an array containing at least 1 schedule
    And each schedule should contain "doctorId" equal to "c3d4e5f6-a7b8-9012-cdef-123456789012"

  # ─── Delete schedule ───────────────────────────────────────────────────────

  Scenario: Delete an existing schedule slot
    Given the doctor has a schedule with id "d4e5f6a7-b8c9-0123-defg-234567890123"
    When I send a DELETE request to "/schedules/d4e5f6a7-b8c9-0123-defg-234567890123"
    Then the response status should be 204
    And the response body should be empty

  Scenario: Return 404 when deleting a non-existent schedule
    When I send a DELETE request to "/schedules/00000000-0000-0000-0000-000000000000"
    Then the response status should be 404

  # ─── Validation errors ─────────────────────────────────────────────────────

  Scenario: Reject schedule with dayOfWeek out of range
    Given I have schedule data with dayOfWeek 7
    When I send a POST request to "/schedules" with that data
    Then the response status should be 400
    And the response body should contain a validation error for "dayOfWeek"

  Scenario: Reject schedule with slotDurationMin below minimum
    Given I have schedule data with slotDurationMin 4
    When I send a POST request to "/schedules" with that data
    Then the response status should be 400
    And the response body should contain a validation error for "slotDurationMin"

  Scenario: Reject schedule with slotDurationMin above maximum
    Given I have schedule data with slotDurationMin 481
    When I send a POST request to "/schedules" with that data
    Then the response status should be 400
    And the response body should contain a validation error for "slotDurationMin"

  Scenario: Reject schedule when doctor does not exist
    Given I have schedule data with doctorId "00000000-0000-0000-0000-000000000000"
    When I send a POST request to "/schedules" with that data
    Then the response status should be 404
    And the response body should contain an error message about doctor not found
