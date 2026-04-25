Feature: Appointment Confirmation
  As a clinic administrator
  I want to confirm pending appointments
  So that patients receive an email confirmation and the slot is officially reserved

  Background:
    Given the appointments-service is running
    And an appointment with id "e5f6a7b8-c9d0-1234-efgh-345678901234" exists
    And the appointment has status "PENDING"
    And the appointment has patientEmail "john.doe@email.com"

  # ─── Happy path ────────────────────────────────────────────────────────────

  Scenario: Successfully confirm a PENDING appointment
    When I send a PATCH request to "/appointments/e5f6a7b8-c9d0-1234-efgh-345678901234/confirm"
    Then the response status should be 200
    And the response body should contain "status" equal to "CONFIRMED"
    And the response body should contain "id" equal to "e5f6a7b8-c9d0-1234-efgh-345678901234"
    And a confirmation email should be sent to "john.doe@email.com"
    And a domain event "event.appointment.confirmed" should be published to RabbitMQ

  # ─── Business rule violations ──────────────────────────────────────────────

  Scenario: Reject confirmation of an already CONFIRMED appointment
    Given the appointment has status "CONFIRMED"
    When I send a PATCH request to "/appointments/e5f6a7b8-c9d0-1234-efgh-345678901234/confirm"
    Then the response status should be 409
    And the response body should contain an error message about invalid status transition
    And no email should be sent

  Scenario: Reject confirmation of a CANCELLED appointment
    Given the appointment has status "CANCELLED"
    When I send a PATCH request to "/appointments/e5f6a7b8-c9d0-1234-efgh-345678901234/confirm"
    Then the response status should be 409
    And the response body should contain an error message about invalid status transition
    And no email should be sent

  Scenario: Reject confirmation of a COMPLETED appointment
    Given the appointment has status "COMPLETED"
    When I send a PATCH request to "/appointments/e5f6a7b8-c9d0-1234-efgh-345678901234/confirm"
    Then the response status should be 409
    And no email should be sent

  # ─── Not found ─────────────────────────────────────────────────────────────

  Scenario: Return 404 when confirming a non-existent appointment
    When I send a PATCH request to "/appointments/00000000-0000-0000-0000-000000000000/confirm"
    Then the response status should be 404
    And no email should be sent

  # ─── Reschedule ────────────────────────────────────────────────────────────

  Scenario: Successfully reschedule a CONFIRMED appointment
    Given the appointment has status "CONFIRMED"
    When I send a PUT request to "/appointments/e5f6a7b8-c9d0-1234-efgh-345678901234/reschedule" with body:
      """
      { "newAppointmentTime": "2026-05-15T10:00:00.000Z" }
      """
    Then the response status should be 200
    And the response body should contain "appointmentTime" equal to "2026-05-15T10:00:00.000Z"

  Scenario: Reject reschedule with missing newAppointmentTime
    When I send a PUT request to "/appointments/e5f6a7b8-c9d0-1234-efgh-345678901234/reschedule" with body:
      """
      {}
      """
    Then the response status should be 400
    And the response body should contain a validation error for "newAppointmentTime"

  # ─── Complete ──────────────────────────────────────────────────────────────

  Scenario: Mark a CONFIRMED appointment as completed
    Given the appointment has status "CONFIRMED"
    When I send a PATCH request to "/appointments/e5f6a7b8-c9d0-1234-efgh-345678901234/complete" with body:
      """
      { "notes": "Patient presented with mild fever. Prescribed ibuprofen." }
      """
    Then the response status should be 200
    And the response body should contain "status" equal to "COMPLETED"

  Scenario: Mark a CONFIRMED appointment as completed without notes
    Given the appointment has status "CONFIRMED"
    When I send a PATCH request to "/appointments/e5f6a7b8-c9d0-1234-efgh-345678901234/complete" with body:
      """
      {}
      """
    Then the response status should be 200
    And the response body should contain "status" equal to "COMPLETED"
