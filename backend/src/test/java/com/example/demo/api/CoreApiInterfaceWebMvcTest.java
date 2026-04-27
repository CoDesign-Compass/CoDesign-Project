package com.example.demo.api;

import com.example.demo.controller.IssueController;
import com.example.demo.dto.CreateIssueRequest;
import com.example.demo.dto.IssueResponse;
import com.example.demo.entity.Issue;
import com.example.demo.entity.IssueState;
import com.example.demo.service.IssueService;
import com.example.demo.submission.Submission;
import com.example.demo.submission.SubmissionController;
import com.example.demo.submission.SubmissionService;
import com.example.demo.submission.dto.CreateSubmissionRequest;
import com.example.demo.submission.dto.SubmitSubmissionResponse;
import com.example.demo.user.GiftEmailService;
import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import com.example.demo.user.UsersController;
import com.example.demo.repository.IssueRepository;
import com.example.demo.user.dto.LoginRequest;
import com.example.demo.user.dto.SignupRequest;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {
        UsersController.class,
        IssueController.class,
        SubmissionController.class
})
@TestPropertySource(properties = {
        "ADMIN_EMAIL=admin@test.com",
        "ADMIN_PASSWORD=secret"
})
@Tag("api")
@Tag("regression")
class CoreApiInterfaceWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private IssueRepository issueRepository;

    @MockBean
    private GiftEmailService giftEmailService;

    @MockBean
    private IssueService issueService;

    @MockBean
    private SubmissionService submissionService;

    // -------- Users API (/api/users/signup, /api/users/login) --------

    @Test
    void signupApiSuccessReturnsCreatedPayload() throws Exception {
        SignupRequest request = new SignupRequest();
        request.setUsername("alice");
        request.setEmail("alice@test.com");
        request.setPassword("pass123");
        request.setWantsUpdates(true);

        when(userRepository.existsByEmailIgnoreCase("alice@test.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            ReflectionTestUtils.setField(user, "id", 1L);
            ReflectionTestUtils.setField(user, "createdAt", LocalDateTime.parse("2026-04-27T10:15:30"));
            return user;
        });

        mockMvc.perform(post("/api/users/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.email").value("alice@test.com"))
                .andExpect(jsonPath("$.wantsUpdates").value(true));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertThat(captor.getValue().isWantsGift()).isFalse();
    }

    @Test
    void signupApiConflictWhenEmailExists() throws Exception {
        SignupRequest request = new SignupRequest();
        request.setUsername("alice");
        request.setEmail("alice@test.com");
        request.setPassword("pass123");

        when(userRepository.existsByEmailIgnoreCase("alice@test.com")).thenReturn(true);

        mockMvc.perform(post("/api/users/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("409 CONFLICT \"email already exists\""));
    }

    @Test
    void loginApiSupportsAdminAndRejectsMissingPassword() throws Exception {
        LoginRequest admin = new LoginRequest();
        admin.setEmail("admin@test.com");
        admin.setPassword("secret");

        mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(admin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("ADMIN"));

        LoginRequest bad = new LoginRequest();
        bad.setEmail("user@test.com");
        bad.setPassword(" ");

        mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bad)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid request body"))
                .andExpect(jsonPath("$.fields.password").exists());
    }

    @Test
    void usersSendUpdateEmailApiCoversSuccessAndServiceUnavailable() throws Exception {
        when(giftEmailService.isConfigured()).thenReturn(true);

        User user = new User();
        ReflectionTestUtils.setField(user, "id", 5L);
        user.setUsername("alice");
        user.setEmail("alice@test.com");
        when(userRepository.findById(5L)).thenReturn(Optional.of(user));

        Issue issue = new Issue();
        issue.setIssueId(77L);
        issue.setShareId("share-77");
        issue.setIssueContent("Road safety");
        issue.setConsentText("consent");
        issue.setState(IssueState.ACTIVE);
        issue.setPublishedAt(OffsetDateTime.parse("2026-04-27T10:15:30+00:00"));
        when(issueRepository.findById(77L)).thenReturn(Optional.of(issue));

        mockMvc.perform(post("/api/users/5/send-update-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"issueId\":77,\"template\":\"Hi\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sent").value(true))
                .andExpect(jsonPath("$.issueId").value(77));

        when(giftEmailService.isConfigured()).thenReturn(false);
        mockMvc.perform(post("/api/users/5/send-update-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"issueId\":77,\"template\":\"Hi\"}"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("503 SERVICE_UNAVAILABLE \"Update email is not configured on the server.\""));
    }

    // -------- Issue API (/api/issues) --------

    @Test
    void issueCreateAndGetByIdApisReturnExpectedPayload() throws Exception {
        CreateIssueRequest request = new CreateIssueRequest();
        request.setIssueContent("Road safety");
        request.setConsentText("I agree");

        IssueResponse created = new IssueResponse(
                11L,
                "share-11",
                "Road safety",
                "I agree",
                IssueState.ACTIVE,
                OffsetDateTime.parse("2026-04-27T10:15:30+00:00")
        );
        when(issueService.createIssue(any(CreateIssueRequest.class))).thenReturn(created);
        when(issueService.getIssueById(11L)).thenReturn(created);

        mockMvc.perform(post("/api/issues")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.issueId").value(11L))
                .andExpect(jsonPath("$.shareId").value("share-11"));

        mockMvc.perform(get("/api/issues/11"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.issueContent").value("Road safety"));
    }

    @Test
    void issueListAndDeleteApisWork() throws Exception {
        IssueResponse item = new IssueResponse(
                12L,
                "share-12",
                "Public transport",
                "Consent",
                IssueState.ACTIVE,
                OffsetDateTime.parse("2026-04-27T10:15:30+00:00")
        );
        when(issueService.getAllIssues()).thenReturn(List.of(item));

        mockMvc.perform(get("/api/issues"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].issueId").value(12L));

        mockMvc.perform(delete("/api/issues/12"))
                .andExpect(status().isNoContent())
                .andExpect(content().string(""));

        verify(issueService).deleteIssue(12L);
    }

    @Test
    void issueShareAndEditApisReturnExpectedPayload() throws Exception {
        CreateIssueRequest editReq = new CreateIssueRequest();
        editReq.setIssueContent("Updated content");
        editReq.setConsentText("Updated consent");

        IssueResponse response = new IssueResponse(
                13L,
                "share-13",
                "Updated content",
                "Updated consent",
                IssueState.ACTIVE,
                OffsetDateTime.parse("2026-04-27T10:15:30+00:00")
        );
        when(issueService.getIssueByShareId("share-13")).thenReturn(response);
        when(issueService.updateIssue(eq(13L), any(CreateIssueRequest.class))).thenReturn(response);

        mockMvc.perform(get("/api/share/share-13"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.issueId").value(13L));

        mockMvc.perform(post("/api/issues/13/edit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(editReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.issueContent").value("Updated content"));
    }

    // -------- Submission API (/api/submissions) --------

    @Test
    void submissionCreateAndSubmitApisReturnExpectedPayload() throws Exception {
        CreateSubmissionRequest request = new CreateSubmissionRequest();
        request.setIssueId(20L);

        Submission draft = new Submission();
        draft.setIssueId(20L);
        draft.setStatus(Submission.Status.DRAFT);
        ReflectionTestUtils.setField(draft, "id", 100L);

        SubmitSubmissionResponse submitted = new SubmitSubmissionResponse(
                100L,
                "SUBMITTED",
                LocalDateTime.parse("2026-04-27T10:15:30")
        );

        when(submissionService.createDraft(any(CreateSubmissionRequest.class))).thenReturn(draft);
        when(submissionService.submit(100L)).thenReturn(submitted);

        mockMvc.perform(post("/api/submissions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(100L))
                .andExpect(jsonPath("$.status").value("DRAFT"));

        mockMvc.perform(post("/api/submissions/100/submit"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUBMITTED"));
    }

    @Test
    void submissionSendGiftEmailApiMapsBusinessErrors() throws Exception {
        doThrow(new IllegalArgumentException("EMAIL_REQUIRED"))
                .when(submissionService)
                .sendGiftEmailToSubmission(eq(100L), eq("VC-001"), eq("template"));

        mockMvc.perform(post("/api/submissions/100/send-gift-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"voucherCode\":\"VC-001\",\"template\":\"template\"}"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("400 BAD_REQUEST \"EMAIL_REQUIRED\""));

        doThrow(new IllegalStateException("mail not configured"))
                .when(submissionService)
                .sendGiftEmailToSubmission(eq(101L), eq("VC-001"), eq("template"));

        mockMvc.perform(post("/api/submissions/101/send-gift-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"voucherCode\":\"VC-001\",\"template\":\"template\"}"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("503 SERVICE_UNAVAILABLE \"mail not configured\""));
    }

    @Test
    void submissionSendGiftEmailApiReturnsValidationErrorForBlankFields() throws Exception {
        mockMvc.perform(post("/api/submissions/100/send-gift-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"voucherCode\":\"\",\"template\":\"\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void submissionLinkAccountAndThanksApisWork() throws Exception {
        Submission linked = new Submission();
        ReflectionTestUtils.setField(linked, "id", 200L);
        linked.setIssueId(20L);
        linked.setUserId(99L);
        linked.setStatus(Submission.Status.DRAFT);
        when(submissionService.linkAccount(200L, 99L)).thenReturn(linked);

        Submission updated = new Submission();
        ReflectionTestUtils.setField(updated, "id", 200L);
        updated.setIssueId(20L);
        updated.setEmail("thanks@test.com");
        updated.setWantsVoucher(true);
        updated.setWantsUpdates(true);
        updated.setStatus(Submission.Status.DRAFT);
        when(submissionService.updateThanksInfo(eq(200L), any(com.example.demo.submission.dto.UpdateThanksRequest.class))).thenReturn(updated);

        mockMvc.perform(post("/api/submissions/200/link-account")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userId\":99}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(99L));

        mockMvc.perform(patch("/api/submissions/200/thanks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"thanks@test.com\",\"wantsVoucher\":true,\"wantsUpdates\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("thanks@test.com"))
                .andExpect(jsonPath("$.wantsVoucher").value(true));
    }

    @Test
    void submissionCountApiRoutesByIssueIdPresence() throws Exception {
        when(submissionService.getTotalSubmissions()).thenReturn(9L);
        when(submissionService.getTotalSubmissionsByIssue(20L)).thenReturn(4L);

        mockMvc.perform(get("/api/submissions/count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").value(9L));

        mockMvc.perform(get("/api/submissions/count").param("issueId", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").value(4L));
    }
}
