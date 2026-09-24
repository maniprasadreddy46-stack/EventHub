package com.eventmanagement.controller;

import com.eventmanagement.entity.User;
import com.eventmanagement.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Register
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {

        try {
            User registeredUser = userService.registerUser(user);

            // Do not send password back to frontend
            registeredUser.setPassword(null);

            return ResponseEntity.ok(registeredUser);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody User loginRequest) {

        Optional<User> user = userService.loginUser(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        if (user.isPresent()) {

            User loggedInUser = user.get();

            // Do not send password back to frontend
            loggedInUser.setPassword(null);

            return ResponseEntity.ok(loggedInUser);
        }

        return ResponseEntity
                .status(401)
                .body("Invalid email or password");
    }
}