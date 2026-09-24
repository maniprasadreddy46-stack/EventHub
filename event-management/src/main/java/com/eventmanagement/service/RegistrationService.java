package com.eventmanagement.service;

import com.eventmanagement.entity.Event;
import com.eventmanagement.entity.Registration;
import com.eventmanagement.repository.EventRepository;
import com.eventmanagement.repository.RegistrationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;

    public RegistrationService(
            RegistrationRepository registrationRepository,
            EventRepository eventRepository) {

        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
    }

    // Register student for an event
    public Registration registerStudent(
            Long eventId,
            Registration registration) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new RuntimeException("Event not found"));

        // Check whether student already registered
        boolean alreadyRegistered =
                registrationRepository.findAll()
                        .stream()
                        .anyMatch(existing ->
                                existing.getEvent() != null
                                && existing.getEvent()
                                        .getId()
                                        .equals(eventId)
                                && existing.getEmail() != null
                                && existing.getEmail()
                                        .equalsIgnoreCase(
                                                registration.getEmail()
                                        )
                        );

        if (alreadyRegistered) {
            throw new RuntimeException(
                    "You are already registered for this event."
            );
        }

        registration.setEvent(event);

        return registrationRepository.save(registration);
    }

    // Get all registrations
    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    // Get registrations for a particular event
    public List<Registration> getRegistrationsByEvent(
            Long eventId) {

        return registrationRepository.findAll()
                .stream()
                .filter(registration ->
                        registration.getEvent() != null
                        && registration.getEvent()
                                .getId()
                                .equals(eventId))
                .toList();
    }

    // Get registrations for a particular student
    public List<Registration> getRegistrationsByEmail(
            String email) {

        return registrationRepository.findAll()
                .stream()
                .filter(registration ->
                        registration.getEmail() != null
                        && registration.getEmail()
                                .equalsIgnoreCase(email))
                .toList();
    }

    // Delete registrations when an event is deleted
    public void deleteRegistrationsByEvent(Long eventId) {

        List<Registration> registrations =
                registrationRepository.findAll()
                        .stream()
                        .filter(registration ->
                                registration.getEvent() != null
                                && registration.getEvent()
                                        .getId()
                                        .equals(eventId))
                        .toList();

        registrationRepository.deleteAll(registrations);
    }
}