package com.eventmanagement.controller;

import com.eventmanagement.entity.Registration;
import com.eventmanagement.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "http://localhost:5173")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(
            RegistrationService registrationService) {

        this.registrationService = registrationService;
    }

    // Register student for an event
    @PostMapping("/event/{eventId}")
    public ResponseEntity<?> registerStudent(
            @PathVariable Long eventId,
            @Valid @RequestBody Registration registration) {

        try {

            Registration savedRegistration =
                    registrationService.registerStudent(
                            eventId,
                            registration
                    );

            return ResponseEntity.ok(savedRegistration);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // Get all registrations
    @GetMapping
    public ResponseEntity<List<Registration>> getAllRegistrations() {

        return ResponseEntity.ok(
                registrationService.getAllRegistrations()
        );
    }

    // Get registrations by event
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Registration>> getRegistrationsByEvent(
            @PathVariable Long eventId) {

        return ResponseEntity.ok(
                registrationService.getRegistrationsByEvent(eventId)
        );
    }

    // Get registrations by student email
    @GetMapping("/student/{email}")
    public ResponseEntity<List<Registration>> getRegistrationsByEmail(
            @PathVariable String email) {

        return ResponseEntity.ok(
                registrationService.getRegistrationsByEmail(email)
        );
    }
}