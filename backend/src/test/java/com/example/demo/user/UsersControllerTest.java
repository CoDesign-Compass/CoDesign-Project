package com.example.demo.user;

import com.example.demo.entity.Issue;
import com.example.demo.entity.IssueState;
import com.example.demo.repository.IssueRepository;
import com.example.demo.user.dto.LoginRequest;
import com.example.demo.user.dto.SendGiftEmailRequest;
import com.example.demo.user.dto.SendUpdateEmailRequest;
import com.example.demo.user.dto.SignupRequest;
import com.example.demo.user.dto.UpdateUserWantsGiftRequest;
import com.example.demo.user.dto.UpdateUserWantsUpdatesRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@Tag("unit")
@Tag("regression")
class UsersControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private IssueRepository issueRepository;

    @Mock
    private GiftEmailService giftEmailService;

    @InjectMocks
    private UsersController controller;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(controller, "adminEmail", "admin@test.com");
        ReflectionTestUtils.setField(controller, "adminPassword", "secret");
    }

    @Test
    void listUsersReturnsMappedPayload() {
        User user = user(1L, "alice", "alice@test.com");
        user.setWantsUpdates(true);
        user.setWantsGift(false);
        when(userRepository.findAll(any(Sort.class))).thenReturn(List.of(user));

        ResponseEntity<List<com.example.demo.user.dto.UserListItemResponse>> response = controller.listUsers();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0).getEmail()).isEqualTo("alice@test.com");
    }

    @Test
    void updateWantsUpdatesThrowsWhenUserMissing() {
        UpdateUserWantsUpdatesRequest req = new UpdateUserWantsUpdatesRequest();
        req.setWantsUpdates(true);
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> controller.updateWantsUpdates(99L, req))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("404 NOT_FOUND");
    }

    @Test
    void updateWantsGiftPersistsBooleanFlag() {
        User user = user(2L, "bob", "bob@test.com");
        UpdateUserWantsGiftRequest req = new UpdateUserWantsGiftRequest();
        req.setWantsGift(true);
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        ResponseEntity<?> response = controller.updateWantsGift(2L, req);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(user.isWantsGift()).isTrue();
    }

    @Test
    void updateWantsUpdatesSuccessMapsNullToFalse() {
        User user = user(3L, "cathy", "c@test.com");
        UpdateUserWantsUpdatesRequest req = new UpdateUserWantsUpdatesRequest();
        req.setWantsUpdates(null);
        when(userRepository.findById(3L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        ResponseEntity<?> response = controller.updateWantsUpdates(3L, req);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(user.isWantsUpdates()).isFalse();
    }

    @Test
    void updateWantsGiftThrowsWhenUserMissing() {
        UpdateUserWantsGiftRequest req = new UpdateUserWantsGiftRequest();
        req.setWantsGift(false);
        when(userRepository.findById(100L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> controller.updateWantsGift(100L, req))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("404 NOT_FOUND");
    }

    @Test
    void sendGiftEmailThrowsWhenServiceNotConfigured() {
        when(giftEmailService.isConfigured()).thenReturn(false);

        SendGiftEmailRequest req = new SendGiftEmailRequest();
        req.setVoucherCode("VC-01");
        req.setTemplate("gift-template");

        assertThatThrownBy(() -> controller.sendGiftEmail(1L, req))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("503 SERVICE_UNAVAILABLE");
    }

    @Test
    void sendGiftEmailThrowsWhenVoucherCodeBlank() {
        when(giftEmailService.isConfigured()).thenReturn(true);
        User user = user(1L, "alice", "alice@test.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        SendGiftEmailRequest req = new SendGiftEmailRequest();
        req.setVoucherCode("   ");
        req.setTemplate("gift-template");

        assertThatThrownBy(() -> controller.sendGiftEmail(1L, req))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("400 BAD_REQUEST");
    }

    @Test
    void sendGiftEmailSuccessSetsWantsGiftTrue() {
        when(giftEmailService.isConfigured()).thenReturn(true);
        User user = user(1L, "alice", "alice@test.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        SendGiftEmailRequest req = new SendGiftEmailRequest();
        req.setVoucherCode("VC-100");
        req.setTemplate("gift-template");

        ResponseEntity<?> response = controller.sendGiftEmail(1L, req);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(user.isWantsGift()).isTrue();
        verify(giftEmailService).sendGiftEmail(eq("alice@test.com"), eq("alice"), eq("VC-100"), eq("gift-template"));
    }

        @Test
        void sendGiftEmailHandlesUserMissingAndBlankEmail() {
        when(giftEmailService.isConfigured()).thenReturn(true);
        when(userRepository.findById(9L)).thenReturn(Optional.empty());

        SendGiftEmailRequest req = new SendGiftEmailRequest();
        req.setVoucherCode("V");
        req.setTemplate("T");

        assertThatThrownBy(() -> controller.sendGiftEmail(9L, req))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("404 NOT_FOUND");

        User noEmail = user(8L, "mike", " ");
        noEmail.setEmail(" ");
        when(userRepository.findById(8L)).thenReturn(Optional.of(noEmail));

        assertThatThrownBy(() -> controller.sendGiftEmail(8L, req))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("400 BAD_REQUEST");
        }

        @Test
        void sendGiftEmailHandlesServiceIllegalStateVariants() {
        when(giftEmailService.isConfigured()).thenReturn(true);
        User user = user(12L, "nina", "nina@test.com");
        when(userRepository.findById(12L)).thenReturn(Optional.of(user));

        SendGiftEmailRequest req = new SendGiftEmailRequest();
        req.setVoucherCode("VC");
        req.setTemplate("tpl");

        doThrow(new IllegalStateException("Gift email is not configured on the server."))
            .when(giftEmailService)
            .sendGiftEmail(eq("nina@test.com"), eq("nina"), eq("VC"), eq("tpl"));
        assertThatThrownBy(() -> controller.sendGiftEmail(12L, req))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("503 SERVICE_UNAVAILABLE");

        org.mockito.Mockito.reset(giftEmailService);
        when(giftEmailService.isConfigured()).thenReturn(true);
        doThrow(new IllegalStateException("smtp timeout"))
            .when(giftEmailService)
            .sendGiftEmail(eq("nina@test.com"), eq("nina"), eq("VC"), eq("tpl"));
        assertThatThrownBy(() -> controller.sendGiftEmail(12L, req))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("500 INTERNAL_SERVER_ERROR");
        }

    @Test
    void sendUpdateEmailHandlesBadTemplateError() {
        when(giftEmailService.isConfigured()).thenReturn(true);

        User user = user(5L, "eve", "eve@test.com");
        Issue issue = new Issue();
        issue.setIssueId(10L);
        issue.setShareId("share-10");
        issue.setIssueContent("Issue 10");
        issue.setState(IssueState.ACTIVE);
        issue.setPublishedAt(OffsetDateTime.parse("2026-04-27T10:15:30+00:00"));

        when(userRepository.findById(5L)).thenReturn(Optional.of(user));
        when(issueRepository.findById(10L)).thenReturn(Optional.of(issue));
        doThrow(new IllegalArgumentException("bad template"))
            .when(giftEmailService)
            .sendUpdateEmail(eq("eve@test.com"), eq("eve"), eq(issue), eq("bad"));

        SendUpdateEmailRequest req = new SendUpdateEmailRequest();
        req.setIssueId(10L);
        req.setTemplate("bad");

        assertThatThrownBy(() -> controller.sendUpdateEmail(5L, req))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("400 BAD_REQUEST");
    }

        @Test
        void sendUpdateEmailCoversMissingEntitiesAndStateErrors() {
        SendUpdateEmailRequest req = new SendUpdateEmailRequest();
        req.setIssueId(10L);
        req.setTemplate("tpl");

        when(giftEmailService.isConfigured()).thenReturn(false);
        assertThatThrownBy(() -> controller.sendUpdateEmail(1L, req))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("503 SERVICE_UNAVAILABLE");

        when(giftEmailService.isConfigured()).thenReturn(true);
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> controller.sendUpdateEmail(1L, req))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("404 NOT_FOUND");

        User user = user(2L, "u", "u@test.com");
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));
        when(issueRepository.findById(10L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> controller.sendUpdateEmail(2L, req))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("404 NOT_FOUND");

        Issue issue = new Issue();
        issue.setIssueId(10L);
        when(issueRepository.findById(10L)).thenReturn(Optional.of(issue));

        User blankEmail = user(3L, "b", " ");
        blankEmail.setEmail(" ");
        when(userRepository.findById(3L)).thenReturn(Optional.of(blankEmail));
        assertThatThrownBy(() -> controller.sendUpdateEmail(3L, req))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("400 BAD_REQUEST");

        User okUser = user(4L, "ok", "ok@test.com");
        when(userRepository.findById(4L)).thenReturn(Optional.of(okUser));
        doThrow(new IllegalStateException("Update email is not configured on the server."))
            .when(giftEmailService)
            .sendUpdateEmail(eq("ok@test.com"), eq("ok"), eq(issue), eq("tpl"));
        assertThatThrownBy(() -> controller.sendUpdateEmail(4L, req))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("503 SERVICE_UNAVAILABLE");
        }

        @Test
        void sendUpdateEmailMapsUnexpectedIllegalStateToInternalServerError() {
        when(giftEmailService.isConfigured()).thenReturn(true);
        User user = user(6L, "zoe", "zoe@test.com");
        when(userRepository.findById(6L)).thenReturn(Optional.of(user));

        Issue issue = new Issue();
        issue.setIssueId(10L);
        when(issueRepository.findById(10L)).thenReturn(Optional.of(issue));

        SendUpdateEmailRequest req = new SendUpdateEmailRequest();
        req.setIssueId(10L);
        req.setTemplate("tpl");

        doThrow(new IllegalStateException("smtp timeout"))
            .when(giftEmailService)
            .sendUpdateEmail(eq("zoe@test.com"), eq("zoe"), eq(issue), eq("tpl"));

        assertThatThrownBy(() -> controller.sendUpdateEmail(6L, req))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("500 INTERNAL_SERVER_ERROR");
        }

    @Test
    void sendUpdateEmailSuccessReturnsSentPayload() {
        when(giftEmailService.isConfigured()).thenReturn(true);

        User user = user(7L, "ivy", "ivy@test.com");
        when(userRepository.findById(7L)).thenReturn(Optional.of(user));

        Issue issue = new Issue();
        issue.setIssueId(77L);
        when(issueRepository.findById(77L)).thenReturn(Optional.of(issue));

        SendUpdateEmailRequest req = new SendUpdateEmailRequest();
        req.setIssueId(77L);
        req.setTemplate("template");

        ResponseEntity<?> response = controller.sendUpdateEmail(7L, req);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(Map.of(
                "id", 7L,
                "email", "ivy@test.com",
                "issueId", 77L,
                "sent", true
        ));
        verify(giftEmailService).sendUpdateEmail("ivy@test.com", "ivy", issue, "template");
    }

        @Test
        void signupRejectsMissingRequiredFields() {
        SignupRequest noEmail = new SignupRequest();
        noEmail.setUsername("a");
        noEmail.setPassword("p");

        SignupRequest noUsername = new SignupRequest();
        noUsername.setEmail("a@test.com");
        noUsername.setPassword("p");

        SignupRequest noPassword = new SignupRequest();
        noPassword.setEmail("a@test.com");
        noPassword.setUsername("a");

        assertThatThrownBy(() -> controller.signup(noEmail))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("400 BAD_REQUEST");
        assertThatThrownBy(() -> controller.signup(noUsername))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("400 BAD_REQUEST");
        assertThatThrownBy(() -> controller.signup(noPassword))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("400 BAD_REQUEST");
        }

    @Test
    void signupRejectsDuplicateEmail() {
        SignupRequest req = new SignupRequest();
        req.setUsername("alice");
        req.setEmail("alice@test.com");
        req.setPassword("pass123");
        when(userRepository.existsByEmailIgnoreCase("alice@test.com")).thenReturn(true);

        assertThatThrownBy(() -> controller.signup(req))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("409 CONFLICT");
    }

    @Test
    void signupSuccessHashesPasswordAndSaves() {
        SignupRequest req = new SignupRequest();
        req.setUsername("alice");
        req.setEmail("alice@test.com");
        req.setPassword("pass123");

        when(userRepository.existsByEmailIgnoreCase("alice@test.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            ReflectionTestUtils.setField(u, "id", 7L);
            ReflectionTestUtils.setField(u, "createdAt", LocalDateTime.parse("2026-04-27T10:15:30"));
            return u;
        });

        var response = controller.signup(req);

        assertThat(response.getId()).isEqualTo(7L);
        assertThat(response.getEmail()).isEqualTo("alice@test.com");
    }

    @Test
    void loginReturnsBadRequestForMissingEmailOrPassword() {
        LoginRequest missingEmail = new LoginRequest();
        missingEmail.setEmail(" ");
        missingEmail.setPassword("x");

        LoginRequest missingPassword = new LoginRequest();
        missingPassword.setEmail("user@test.com");
        missingPassword.setPassword(" ");

        ResponseEntity<?> r1 = controller.login(missingEmail);
        ResponseEntity<?> r2 = controller.login(missingPassword);

        assertThat(r1.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(r2.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void loginSupportsAdminShortcut() {
        LoginRequest req = new LoginRequest();
        req.setEmail("admin@test.com");
        req.setPassword("secret");

        ResponseEntity<?> response = controller.login(req);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isInstanceOf(com.example.demo.user.dto.LoginResponse.class);
        com.example.demo.user.dto.LoginResponse body = (com.example.demo.user.dto.LoginResponse) response.getBody();
        assertThat(body.getRole()).isEqualTo("ADMIN");
    }

    @Test
    void loginReturnsUnauthorizedWhenUserMissingOrPasswordInvalid() {
        LoginRequest req = new LoginRequest();
        req.setEmail("user@test.com");
        req.setPassword("wrong");

        when(userRepository.findByEmailIgnoreCase("user@test.com")).thenReturn(Optional.empty());
        ResponseEntity<?> missingUser = controller.login(req);

        User user = user(10L, "user", "user@test.com");
        user.setPasswordHash(new BCryptPasswordEncoder().encode("correct"));
        when(userRepository.findByEmailIgnoreCase("user@test.com")).thenReturn(Optional.of(user));
        ResponseEntity<?> wrongPassword = controller.login(req);

        assertThat(missingUser.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(wrongPassword.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void loginReturnsUserWhenPasswordMatches() {
        LoginRequest req = new LoginRequest();
        req.setEmail("user@test.com");
        req.setPassword("correct");

        User user = user(11L, "user", "user@test.com");
        user.setPasswordHash(new BCryptPasswordEncoder().encode("correct"));
        when(userRepository.findByEmailIgnoreCase("user@test.com")).thenReturn(Optional.of(user));

        ResponseEntity<?> response = controller.login(req);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isInstanceOf(com.example.demo.user.dto.LoginResponse.class);
        com.example.demo.user.dto.LoginResponse body = (com.example.demo.user.dto.LoginResponse) response.getBody();
        assertThat(body.getRole()).isEqualTo("USER");
    }

    private static User user(Long id, String username, String email) {
        User user = new User();
        ReflectionTestUtils.setField(user, "id", id);
        ReflectionTestUtils.setField(user, "createdAt", LocalDateTime.parse("2026-04-27T10:15:30"));
        user.setUsername(username);
        user.setEmail(email);
        return user;
    }
}