Feature: Appointment Cancellation
  As a patient or clinic administrator
  I want to cancel a scheduled appointment
  So that the time slot is freed up for other patients

  Background:
    Given the appointments-service is running
    And an appointment with id "e5f6a7b8-c9d0-1234-efgh-345678901234" exists

  # ─── Happy path ────────────────────────────────────────────────────────────

  Scenario: Successfully cancel a PENDING appointment
    Given the appointment has status "PENDING"
    When I send a PATCH request to "/appointments/e5f6a7b8-c9d0-1234-efgh-345678901234/cancel"
    Then the response status should be 200
    And the response body should contain "status" equal to "CANCELLED"
    And the response body should contain "id" equal to "e5f6a7b8-c9d0-1234-efgh-345678901234"

  Scenario: Successfully cancel a CONFIRMED appointment
    Given the appointment has status "CONFIRMED"
    When I send a PATCH request to "/appointments/e5f6a7b8-c9d0-1234-efgh-345678901234/cancel"
    Then the response status should be 200
    And the response body should contain "status" equal to "CANCELLED"

  # ─── Business rule violations ──────────────────────────────────────────────

  Scenario: Reject cancellation of an already CANCELLED appointment
    Given the appointment has status "CANCELLED"
    When I send a PATCH request to "/appointments/e5f6a7b8-c9d0-1234-efgh-345678901234/cancel"
    Then the response status should be 409
    And the response body should contain an error message about invalid status transition

  Scenario: Reject cancellation of a COMPLETED appointment
    Given the appointment has status "COMPLETED"
    When I send a PATCH request to "/appointments/e5f6a7b8-c9d0-1234-efgh-345678901234/cancel"
    Then the response status should be 409
    And the response body should contain an error message about invalid status transition

  # ─── Not found ─────────────────────────────────────────────────────────────

  Scenario: Return 404 when cancelling a non-existent appointment
    When I send a PATCH request to "/appointments/00000000-0000-0000-0000-000000000000/cancel"
    Then the response status should be 404

  # ─── Status transition diagram (informational) ─────────────────────────────
  #
  #   PENDING ──confirm──► CONFIRMED ──complete──► COMPLETED
  #      │                    │
  #      └──cancel──► CANCELLED ◄──cancel──┘
  #
  # Valid transitions:
  #   PENDING   → CONFIRMED  (confirm)
  #   PENDING   → CANCELLED  (cancel)
  #   CONFIRMED → COMPLETED  (complete)
  #   CONFIRMED → CANCELLED  (cancel)
  #   CONFIRMED → CONFIRMED  (reschedule — same status, new time)
  #
  # Invalid transitions (409):
  #   CANCELLED → any
  #   COMPLETED → any
