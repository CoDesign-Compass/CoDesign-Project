package com.example.demo.user;

import com.example.demo.user.dto.SignupRequest;
import com.example.demo.user.dto.SignupResponse;
import com.example.demo.user.dto.LoginRequest;
import com.example.demo.user.dto.LoginResponse;
import com.example.demo.user.dto.UserListItemResponse;
import com.example.demo.user.dto.UpdateUserWantsUpdatesRequest;
import com.example.demo.user.dto.SendGiftEmailRequest;
import com.example.demo.user.dto.UpdateUserWantsGiftRequest;

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
  private final GiftEmailService giftEmailService;
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


  @Value("${ADMIN_EMAIL:hello@purposemedia.cbr.au}")
  private String adminEmail;

  @Value("${ADMIN_PASSWORD:admin123}")
  private String adminPassword;

  public UsersController(UserRepository userRepository, GiftEmailService giftEmailService) {
    this.userRepository = userRepository;
    this.giftEmailService = giftEmailService;
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
            u.isWantsGift(),
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

  @PostMapping("/{id}/send-gift-email")
  public ResponseEntity<?> sendGiftEmail(
      @PathVariable Long id,
      @Valid @RequestBody SendGiftEmailRequest req
  ) {
    if (!giftEmailService.isConfigured()) {
      throw new ResponseStatusException(
          HttpStatus.SERVICE_UNAVAILABLE,
          "Gift email is not configured on the server."
      );
    }

    User user = userRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found"));

    String toEmail = user.getEmail();
    if (toEmail == null || toEmail.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "user email is required");
    }

    String voucherCode = req.getVoucherCode().trim();
    if (voucherCode.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "voucherCode is required");
    }

    try {
      giftEmailService.sendGiftEmail(
          toEmail.trim(),
          user.getUsername(),
          voucherCode,
          req.getTemplate()
      );
      user.setWantsGift(true);
      userRepository.save(user);
    } catch (IllegalStateException ex) {
      if ("Gift email is not configured on the server.".equals(ex.getMessage())) {
        throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, ex.getMessage());
      }
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    return ResponseEntity.ok(Map.of(
        "id", user.getId(),
        "email", user.getEmail(),
        "sent", true
    ));
  }

  @PatchMapping("/{id}/wants-gift")
  public ResponseEntity<?> updateWantsGift(
      @PathVariable Long id,
      @Valid @RequestBody UpdateUserWantsGiftRequest req
  ) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found"));

    user.setWantsGift(Boolean.TRUE.equals(req.getWantsGift()));
    User saved = userRepository.save(user);

    return ResponseEntity.ok(Map.of(
        "id", saved.getId(),
        "wantsGift", saved.isWantsGift()
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
    u.setWantsGift(false);
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
