package com.example.demo.submission;

import com.example.demo.entity.HowResponse;
import com.example.demo.entity.WhyResponse;
import com.example.demo.model.Tag;
import com.example.demo.model.UserProfile;
import com.example.demo.repository.HowResponseRepository;
import com.example.demo.repository.IssueRepository;
import com.example.demo.repository.UserProfileRepository;
import com.example.demo.repository.WhyResponseRepository;
import com.example.demo.submission.dto.CreateSubmissionRequest;
import com.example.demo.submission.dto.MonthlySubmissionCountResponse;
import com.example.demo.submission.dto.SubmissionTrendPointResponse;
import com.example.demo.submission.dto.UpdateThanksRequest;
import com.example.demo.submission.dto.SubmitSubmissionResponse;
import com.example.demo.submission.dto.WordCloudTermResponse;
import com.example.demo.user.GiftEmailService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Stream;
import java.util.stream.Collectors;

@Service
public class SubmissionService {
    private static final int WORD_CLOUD_LIMIT = 80;
    private static final Set<String> STOP_WORDS = new HashSet<>(Arrays.asList(
            "a", "an", "and", "are", "as", "at", "be", "been", "but", "by", "for", "from",
            "has", "have", "he", "her", "hers", "him", "his", "i", "if", "in", "into", "is",
            "it", "its", "me", "my", "of", "on", "or", "our", "ours", "she", "so", "that",
            "the", "their", "theirs", "them", "they", "this", "to", "us", "was", "we", "were",
            "what", "when", "where", "which", "who", "why", "with", "you", "your", "yours"
    ));

    private final SubmissionRepository repo;
    private final IssueRepository issueRepository;
    private final UserProfileRepository userProfileRepository;
    private final WhyResponseRepository whyResponseRepository;
    private final HowResponseRepository howResponseRepository;
    private final GiftEmailService giftEmailService;

    public SubmissionService(
            SubmissionRepository repo,
            IssueRepository issueRepository,
            UserProfileRepository userProfileRepository,
            WhyResponseRepository whyResponseRepository,
            HowResponseRepository howResponseRepository,
            GiftEmailService giftEmailService
    ){
        this.repo = repo;
        this.issueRepository = issueRepository;
        this.userProfileRepository = userProfileRepository;
        this.whyResponseRepository = whyResponseRepository;
        this.howResponseRepository = howResponseRepository;
        this.giftEmailService = giftEmailService;
    }

    @Transactional
    public Submission createDraft(CreateSubmissionRequest req) {
        Submission s = new Submission();
        s.setIssueId(req.getIssueId());
        s.setStatus(Submission.Status.DRAFT);
        return repo.save(s);
    }


    @Transactional
    public SubmitSubmissionResponse submit(Long id) {
        Submission s = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("SUBMISSION_NOT_FOUND"));

        if (s.getStatus() == Submission.Status.SUBMITTED) {
            return new SubmitSubmissionResponse(
                    s.getId(),
                    s.getStatus().name(),
                    s.getSubmittedAt()
            );
        }

        s.setStatus(Submission.Status.SUBMITTED);
        s.setSubmittedAt(LocalDateTime.now());

        repo.save(s);

        return new SubmitSubmissionResponse(
                s.getId(),
                s.getStatus().name(),
                s.getSubmittedAt()
        );
    }

    @Transactional
    public Submission linkAccount(Long submissionId, Long userId) {
        Submission s = repo.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("SUBMISSION_NOT_FOUND"));

        if (userId == null) {
            throw new IllegalArgumentException("USER_ID_REQUIRED");
        }

        s.setUserId(userId);
        return repo.save(s);
    }

    @Transactional
    public Submission updateThanksInfo(Long id, UpdateThanksRequest req) {
        Submission s = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("SUBMISSION_NOT_FOUND"));

        String email = req.getEmail();
        boolean hasEmail = (email != null && !email.trim().isEmpty());
        boolean needsEmail = req.isWantsVoucher() || req.isWantsUpdates();

        if (needsEmail && !hasEmail) {
            throw new IllegalArgumentException("EMAIL_REQUIRED");
        }

        s.setEmail(hasEmail ? email.trim() : null);
        s.setWantsVoucher(req.isWantsVoucher());
        s.setWantsUpdates(req.isWantsUpdates());

        return repo.save(s);
    }

    public List<Submission> getEmailSubscribers() {
        return repo.findByEmailIsNotNullOrderByCreatedAtDesc();
    }

    public void sendGiftEmailToSubmission(Long id, String voucherCode, String template) {
        Submission s = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("SUBMISSION_NOT_FOUND"));
        String email = s.getEmail();
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("EMAIL_REQUIRED");
        }
        giftEmailService.sendGiftEmail(email.trim(), email.trim(), voucherCode, template);
    }

    public void sendUpdateEmailToSubmission(Long id, Long issueId, String template) {
        Submission s = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("SUBMISSION_NOT_FOUND"));
        String email = s.getEmail();
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("EMAIL_REQUIRED");
        }
        com.example.demo.entity.Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("ISSUE_NOT_FOUND"));
        giftEmailService.sendUpdateEmail(email.trim(), email.trim(), issue, template);
    }

    public long getTotalSubmissions() {
        return repo.countSubmittedForExistingIssues();
    }

    public long getTotalSubmissionsByIssue(Long issueId) {
        if (issueId == null) {
            throw new IllegalArgumentException("ISSUE_ID_REQUIRED");
        }
        return repo.countByIssueIdAndStatus(issueId, Submission.Status.SUBMITTED);
    }

    public Double getAverageResponseSecondsByIssue(Long issueId) {
        if (issueId == null) {
            throw new IllegalArgumentException("ISSUE_ID_REQUIRED");
        }

        Double avgSeconds = repo.findAverageResponseSecondsByIssueId(issueId);
        return avgSeconds == null ? 0D : avgSeconds;
    }

    public List<MonthlySubmissionCountResponse> getMonthlySubmittedCounts(int months) {
        int windowSize = Math.max(1, months);
        YearMonth currentMonth = YearMonth.now();
        YearMonth startMonth = currentMonth.minusMonths(windowSize - 1L);

        Map<YearMonth, Long> monthlyCounts = new LinkedHashMap<>();
        for (int i = 0; i < windowSize; i++) {
            YearMonth month = startMonth.plusMonths(i);
            monthlyCounts.put(month, 0L);
        }

        List<Object[]> rows = repo.findMonthlySubmittedCounts();
        for (Object[] row : rows) {
            if (row == null || row.length < 2 || row[0] == null || row[1] == null) {
                continue;
            }

            LocalDateTime monthStart = ((java.sql.Timestamp) row[0]).toLocalDateTime();
            YearMonth month = YearMonth.from(monthStart);

            if (monthlyCounts.containsKey(month)) {
                monthlyCounts.put(month, ((Number) row[1]).longValue());
            }
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        List<MonthlySubmissionCountResponse> result = new ArrayList<>();
        for (Map.Entry<YearMonth, Long> entry : monthlyCounts.entrySet()) {
            result.add(new MonthlySubmissionCountResponse(
                    entry.getKey().format(formatter),
                    entry.getValue()
            ));
        }

        return result;
    }

    public List<SubmissionTrendPointResponse> getIssueSubmissionTrend(
            Long issueId,
            String granularity,
            int points
    ) {
        if (issueId == null) {
            throw new IllegalArgumentException("ISSUE_ID_REQUIRED");
        }

        String normalized = granularity == null ? "month" : granularity.toLowerCase();
        return switch (normalized) {
            case "day" -> getDailyTrend(issueId, points);
            case "month" -> getMonthlyTrend(issueId, points);
            default -> throw new IllegalArgumentException("INVALID_GRANULARITY");
        };
    }

    private List<SubmissionTrendPointResponse> getMonthlyTrend(Long issueId, int points) {
        int windowSize = Math.max(1, points);
        YearMonth currentMonth = YearMonth.now();
        YearMonth startMonth = currentMonth.minusMonths(windowSize - 1L);

        Map<YearMonth, Long> monthlyCounts = new LinkedHashMap<>();
        for (int i = 0; i < windowSize; i++) {
            YearMonth month = startMonth.plusMonths(i);
            monthlyCounts.put(month, 0L);
        }

        List<Object[]> rows = repo.findMonthlySubmittedCountsByIssueId(issueId);
        for (Object[] row : rows) {
            if (row == null || row.length < 2 || row[0] == null || row[1] == null) {
                continue;
            }

            LocalDateTime monthStart = ((java.sql.Timestamp) row[0]).toLocalDateTime();
            YearMonth month = YearMonth.from(monthStart);

            if (monthlyCounts.containsKey(month)) {
                monthlyCounts.put(month, ((Number) row[1]).longValue());
            }
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        List<SubmissionTrendPointResponse> result = new ArrayList<>();
        for (Map.Entry<YearMonth, Long> entry : monthlyCounts.entrySet()) {
            result.add(new SubmissionTrendPointResponse(
                    entry.getKey().format(formatter),
                    entry.getValue()
            ));
        }
        return result;
    }

    private List<SubmissionTrendPointResponse> getDailyTrend(Long issueId, int points) {
        int windowSize = Math.max(1, points);
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(windowSize - 1L);

        Map<LocalDate, Long> dailyCounts = new LinkedHashMap<>();
        for (int i = 0; i < windowSize; i++) {
            LocalDate day = startDate.plusDays(i);
            dailyCounts.put(day, 0L);
        }

        List<Object[]> rows = repo.findDailySubmittedCountsByIssueId(issueId);
        for (Object[] row : rows) {
            if (row == null || row.length < 2 || row[0] == null || row[1] == null) {
                continue;
            }

            LocalDate day = ((java.sql.Timestamp) row[0]).toLocalDateTime().toLocalDate();
            if (dailyCounts.containsKey(day)) {
                dailyCounts.put(day, ((Number) row[1]).longValue());
            }
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        List<SubmissionTrendPointResponse> result = new ArrayList<>();
        for (Map.Entry<LocalDate, Long> entry : dailyCounts.entrySet()) {
            result.add(new SubmissionTrendPointResponse(
                    entry.getKey().format(formatter),
                    entry.getValue()
            ));
        }
        return result;
    }

    public String generateIssueProfileRawDataCsv(Long issueId) {
        if (issueId == null) {
            throw new IllegalArgumentException("ISSUE_ID_REQUIRED");
        }

        RawDataContext context = buildRawDataContext(issueId);

        StringBuilder csv = new StringBuilder();
        csv.append('\uFEFF');
        csv.append("issueId,submissionId,tagLabel\n");

        for (Submission submission : context.submissions) {
            UserProfile profile = context.profilesBySubmissionId.get(String.valueOf(submission.getId()));
            List<String> tagLabels = profile == null || profile.getSelectedTags() == null
                    ? Collections.emptyList()
                    : profile.getSelectedTags().stream()
                    .map(Tag::getLabel)
                    .map(this::safe)
                    .filter(v -> !v.isBlank())
                    .sorted()
                    .toList();

            if (tagLabels.isEmpty()) {
                appendCsvRow(csv, List.of(
                        String.valueOf(context.issueId),
                        String.valueOf(submission.getId()),
                        ""
                ));
            } else {
                for (String tagLabel : tagLabels) {
                    appendCsvRow(csv, List.of(
                            String.valueOf(context.issueId),
                            String.valueOf(submission.getId()),
                            tagLabel
                    ));
                }
            }
        }

        return csv.toString();
    }

    public String generateIssueWhyRawDataCsv(Long issueId) {
        if (issueId == null) {
            throw new IllegalArgumentException("ISSUE_ID_REQUIRED");
        }

        RawDataContext context = buildRawDataContext(issueId);

        StringBuilder csv = new StringBuilder();
        csv.append('\uFEFF');
        csv.append("issueId,whyResponseId,stance,answer1,answer2,answer3,answer4,answer5\n");

        for (WhyResponse why : context.whyResponses) {
            appendCsvRow(csv, List.of(
                    String.valueOf(context.issueId),
                    String.valueOf(why.getId()),
                    safe(why.getStance()),
                    safe(why.getAnswer1()),
                    safe(why.getAnswer2()),
                    safe(why.getAnswer3()),
                    safe(why.getAnswer4()),
                    safe(why.getAnswer5())
            ));
        }

        return csv.toString();
    }

    public String generateIssueHowRawDataCsv(Long issueId) {
        if (issueId == null) {
            throw new IllegalArgumentException("ISSUE_ID_REQUIRED");
        }

        RawDataContext context = buildRawDataContext(issueId);

        StringBuilder csv = new StringBuilder();
        csv.append('\uFEFF');
        csv.append("issueId,howResponseId,answer1,answer2,answer3,answer4,answer5\n");

        for (HowResponse how : context.howResponses) {
            appendCsvRow(csv, List.of(
                    String.valueOf(context.issueId),
                    String.valueOf(how.getId()),
                    safe(how.getAnswer1()),
                    safe(how.getAnswer2()),
                    safe(how.getAnswer3()),
                    safe(how.getAnswer4()),
                    safe(how.getAnswer5())
            ));
        }

        return csv.toString();
    }

    public List<WordCloudTermResponse> getIssueWhyWordCloud(Long issueId) {
        if (issueId == null) {
            throw new IllegalArgumentException("ISSUE_ID_REQUIRED");
        }

        RawDataContext context = buildRawDataContext(issueId);
        List<String> answers = context.whyResponses.stream()
                .flatMap(response -> Stream.of(
                        response.getAnswer1(),
                        response.getAnswer2(),
                        response.getAnswer3(),
                        response.getAnswer4(),
                        response.getAnswer5()
                ))
                .toList();

        return buildWordCloudTerms(answers);
    }

    public List<WordCloudTermResponse> getIssueHowWordCloud(Long issueId) {
        if (issueId == null) {
            throw new IllegalArgumentException("ISSUE_ID_REQUIRED");
        }

        RawDataContext context = buildRawDataContext(issueId);
        List<String> answers = context.howResponses.stream()
                .flatMap(response -> Stream.of(
                        response.getAnswer1(),
                        response.getAnswer2(),
                        response.getAnswer3(),
                        response.getAnswer4(),
                        response.getAnswer5()
                ))
                .toList();

        return buildWordCloudTerms(answers);
    }

    public List<WordCloudTermResponse> getIssueProfileWordCloud(Long issueId) {
        if (issueId == null) {
            throw new IllegalArgumentException("ISSUE_ID_REQUIRED");
        }

        String shareId = issueRepository.findById(issueId)
                .map(i -> i.getShareId())
                .orElseThrow(() -> new IllegalArgumentException("ISSUE_NOT_FOUND"));

        List<Object[]> rows = userProfileRepository.findProfileTagCountsByShareId(shareId);

        return rows.stream()
                .filter(row -> row != null && row.length >= 2)
                .map(row -> {
                    String label = safe(row[0] == null ? "" : String.valueOf(row[0])).trim();
                    int value = row[1] instanceof Number ? ((Number) row[1]).intValue() : 0;
                    return new WordCloudTermResponse(label, value);
                })
                .filter(term -> !term.label().isBlank() && term.value() > 0)
                .limit(WORD_CLOUD_LIMIT)
                .toList();
    }

    private RawDataContext buildRawDataContext(Long issueId) {
        String shareId = issueRepository.findById(issueId)
                .map(i -> i.getShareId())
                .orElseThrow(() -> new IllegalArgumentException("ISSUE_NOT_FOUND"));
        String safeShareId = safe(shareId);

        List<Submission> submissions = repo.findByIssueIdOrderByCreatedAtDesc(issueId)
                .stream()
                .filter(submission -> submission.getStatus() == Submission.Status.SUBMITTED)
                .toList();
        List<String> submissionIds = submissions.stream()
                .map(Submission::getId)
                .map(String::valueOf)
                .toList();

        Map<String, UserProfile> profilesBySubmissionId = userProfileRepository.findAllById(submissionIds)
                .stream()
                .collect(Collectors.toMap(UserProfile::getSubmissionId, p -> p));

        List<WhyResponse> whyResponses = whyResponseRepository.findByShareId(shareId);
        List<HowResponse> howResponses = howResponseRepository.findByShareId(shareId);

        return new RawDataContext(
                issueId,
                safeShareId,
                submissions,
                profilesBySubmissionId,
                whyResponses,
                howResponses
        );
    }

    private record RawDataContext(
            Long issueId,
            String safeShareId,
            List<Submission> submissions,
            Map<String, UserProfile> profilesBySubmissionId,
            List<WhyResponse> whyResponses,
            List<HowResponse> howResponses
    ) {}

    private List<WordCloudTermResponse> buildWordCloudTerms(List<String> answers) {
        if (answers == null || answers.isEmpty()) {
            return List.of();
        }

        Map<String, Integer> counts = new HashMap<>();

        for (String answer : answers) {
            if (answer == null || answer.isBlank()) {
                continue;
            }

            String[] tokens = answer
                    .toLowerCase(Locale.ROOT)
                    .split("[^\\p{L}\\p{N}]+");

            for (String token : tokens) {
                String normalized = token == null ? "" : token.trim();
                if (normalized.length() < 2 || STOP_WORDS.contains(normalized)) {
                    continue;
                }
                counts.merge(normalized, 1, Integer::sum);
            }
        }

        return counts.entrySet().stream()
                .sorted(
                        Comparator.<Map.Entry<String, Integer>>comparingInt(Map.Entry::getValue)
                                .reversed()
                                .thenComparing(Map.Entry::getKey)
                )
                .limit(WORD_CLOUD_LIMIT)
                .map(entry -> new WordCloudTermResponse(entry.getKey(), entry.getValue()))
                .toList();
    }

    private void appendCsvRow(StringBuilder csv, List<String> values) {
        List<String> row = values == null ? Collections.emptyList() : values;
        for (int i = 0; i < row.size(); i++) {
            if (i > 0) {
                csv.append(',');
            }
            csv.append(escapeCsv(row.get(i)));
        }
        csv.append('\n');
    }

    private String escapeCsv(String value) {
        String text = value == null ? "" : value;
        String escaped = text.replace("\"", "\"\"");
        return "\"" + escaped + "\"";
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private String stringify(LocalDateTime value) {
        return value == null ? "" : value.toString();
    }

}
