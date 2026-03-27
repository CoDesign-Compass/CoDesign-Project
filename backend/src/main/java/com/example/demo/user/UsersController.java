package com.example.demo.user;

import com.example.demo.user.dto.SignupRequest;
import com.example.demo.user.dto.SignupResponse;
import com.example.demo.user.dto.LoginRequest;
import com.example.demo.user.dto.LoginResponse;
import com.example.demo.user.dto.UserListItemResponse;
import com.example.demo.user.dto.UpdateUserWantsUpdatesRequest;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UsersController {

  private final UserRepository userRepository;
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


  @Value("${ADMIN_EMAIL:hello@purposemediacbr.au}")
  private String adminEmail;

  @Value("${ADMIN_PASSWORD:admin123}")
  private String adminPassword;

  public UsersController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @GetMapping
  public ResponseEntity<List<UserListItemResponse>> listUsers() {
    List<UserListItemResponse> payload = userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
        .stream()
        .map(u -> new UserListItemResponse(
            u.getId(),
            u.getUsername(),
            u.getEmail(),
            u.isWantsUpdates(),
            u.getCreatedAt()
        ))
        .toList();

    return ResponseEntity.ok()
        .cacheControl(CacheControl.noStore())
        .body(payload);
  }

  @PatchMapping("/{id}/wants-updates")
  public ResponseEntity<?> updateWantsUpdates(
      @PathVariable Long id,
      @Valid @RequestBody UpdateUserWantsUpdatesRequest req
  ) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found"));

    user.setWantsUpdates(Boolean.TRUE.equals(req.getWantsUpdates()));
    User saved = userRepository.save(user);

    return ResponseEntity.ok(Map.of(
        "id", saved.getId(),
        "wantsUpdates", saved.isWantsUpdates()
    ));
  }

  @PostMapping("/signup")
  @ResponseStatus(HttpStatus.CREATED)
  public SignupResponse signup(@Valid @RequestBody SignupRequest req) {
    String email = req.getEmail();
    String username = req.getUsername();

    if (email == null || email.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "email is required");
    }
    if (username == null || username.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "username is required");
    }
    if (req.getPassword() == null || req.getPassword().isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "password is required");
    }

    if (userRepository.existsByEmailIgnoreCase(email)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "email already exists");
    }

    User u = new User();
    u.setUsername(username);
    u.setEmail(email);
    u.setWantsUpdates(req.isWantsUpdates());
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

  @PostMapping("/login")
  public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
    String email = req.getEmail() == null ? null : req.getEmail().trim();
    String password = req.getPassword();

    if (email == null || email.isBlank()) {
      return ResponseEntity.badRequest().body(java.util.Map.of("message", "email is required"));
    }
    if (password == null || password.isBlank()) {
      return ResponseEntity.badRequest().body(java.util.Map.of("message", "password is required"));
    }

    // ✅ admin shortcut（不依赖数据库）
    if (email.equalsIgnoreCase(adminEmail) && password.equals(adminPassword)) {
      return ResponseEntity.ok(new LoginResponse(
          -1L, "Admin", adminEmail, "ADMIN"
      ));
    }

    var userOpt = userRepository.findByEmailIgnoreCase(email);
    if (userOpt.isEmpty()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(java.util.Map.of("message", "Invalid email or password"));
    }

    var user = userOpt.get();
    String hash = user.getPasswordHash();
    if (hash == null || !passwordEncoder.matches(password, hash)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(java.util.Map.of("message", "Invalid email or password"));
    }

    return ResponseEntity.ok(new LoginResponse(
        user.getId(),
        user.getUsername(),
        user.getEmail(),
        "USER"
    ));
  }
}
