package com.example.demo.user;

import com.example.demo.user.dto.SignupRequest;
import com.example.demo.user.dto.SignupResponse;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsersController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public SignupResponse signup(@Valid @RequestBody SignupRequest req) {
        // normalize
        String email = req.getEmail();
        String username = req.getUsername();

        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "email is required");
        }
        if (username == null || username.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "username is required");
        }

        // unique email
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "email already exists");
        }

        // create user
        User u = new User();
        u.setUsername(username);
        u.setEmail(email);
        u.setWantsUpdates(req.isWantsUpdates());

        // hash password
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));

        User saved = userRepository.save(u);

        return new SignupResponse(
                saved.getId(),
                saved.getUsername(),
                saved.getEmail(),
                saved.isWantsUpdates(),
                saved.getCreatedAt()
        );
    }
}