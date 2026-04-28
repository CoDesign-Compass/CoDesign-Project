package com.example.demo.service;

import com.example.demo.dto.AIProcessedDataDto;
import com.example.demo.entity.HowResponse;
import com.example.demo.entity.Issue;
import com.example.demo.entity.IssueState;
import com.example.demo.entity.WhyResponse;
import com.example.demo.repository.HowResponseRepository;
import com.example.demo.repository.IssueRepository;
import com.example.demo.repository.WhyResponseRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AIDataProcessingServiceTest {

    @Mock
    private IssueRepository issueRepository;

    @Mock
    private WhyResponseRepository whyResponseRepository;

    @Mock
    private HowResponseRepository howResponseRepository;

    @InjectMocks
    private AIDataProcessingService aiDataProcessingService;

    @Test
    void prepareSubmissionForAiCleansTextAndFiltersMeaninglessAnswers() {
        Issue issue = new Issue();
        issue.setIssueId(1L);
        issue.setShareId("share123");
        issue.setIssueContent("  Improve   bus access  ");
        issue.setState(IssueState.ACTIVE);

        WhyResponse whyResponse = new WhyResponse();
        whyResponse.setShareId("share123");
        whyResponse.setStance("  support  ");
        whyResponse.setAnswer1("idk");
        whyResponse.setAnswer2("  because the current route is slow  ");
        whyResponse.setAnswer3("123");
        whyResponse.setAnswer4("!!!");
        whyResponse.setAnswer5("  better access for commuters  ");

        HowResponse howResponse = new HowResponse();
        howResponse.setShareId("share123");
        howResponse.setAnswer1("  add more direct routes  ");
        howResponse.setAnswer2("na");

        when(issueRepository.findByShareId("share123")).thenReturn(Optional.of(issue));
        when(whyResponseRepository.findTopByShareIdOrderByCreatedAtDesc("share123")).thenReturn(Optional.of(whyResponse));
        when(howResponseRepository.findTopByShareIdOrderByCreatedAtDesc("share123")).thenReturn(Optional.of(howResponse));

        AIProcessedDataDto result = aiDataProcessingService.prepareSubmissionForAI("share123");

        assertThat(result.getShareId()).isEqualTo("share123");
        assertThat(result.getIssueContent()).isEqualTo("Improve bus access");
        assertThat(result.getStance()).isEqualTo("support");
        assertThat(result.getWhy()).extracting("questionIndex").containsExactly(2, 5);
        assertThat(result.getWhy()).extracting("answer").containsExactly(
                "because the current route is slow",
                "better access for commuters"
        );
        assertThat(result.getHow()).extracting("questionIndex").containsExactly(1);
        assertThat(result.getHow()).extracting("answer").containsExactly("add more direct routes");
        assertThat(result.getMergedWhyText()).isEqualTo("because the current route is slow better access for commuters");
        assertThat(result.getMergedHowText()).isEqualTo("add more direct routes");
    }

    @Test
    void prepareSubmissionForAiFailsWhenIssueDoesNotExist() {
        when(issueRepository.findByShareId("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> aiDataProcessingService.prepareSubmissionForAI("missing"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Issue not found for shareId: missing");
    }

    @Test
    void prepareSubmissionForAiHandlesNullAndNonMeaningfulInputs() {
        Issue issue = new Issue();
        issue.setShareId("share-null");
        issue.setIssueContent(null);

        WhyResponse whyResponse = new WhyResponse();
        whyResponse.setShareId("share-null");
        whyResponse.setStance("   ");
        whyResponse.setAnswer1("i don't know");
        whyResponse.setAnswer2("??");
        whyResponse.setAnswer3("12");
        whyResponse.setAnswer4("ok");
        whyResponse.setAnswer5(null);

        HowResponse howResponse = new HowResponse();
        howResponse.setShareId("share-null");
        howResponse.setAnswer1("none");
        howResponse.setAnswer2("use better signs");

        when(issueRepository.findByShareId("share-null")).thenReturn(Optional.of(issue));
        when(whyResponseRepository.findTopByShareIdOrderByCreatedAtDesc("share-null")).thenReturn(Optional.of(whyResponse));
        when(howResponseRepository.findTopByShareIdOrderByCreatedAtDesc("share-null")).thenReturn(Optional.of(howResponse));

        AIProcessedDataDto result = aiDataProcessingService.prepareSubmissionForAI("share-null");

        assertThat(result.getIssueContent()).isNull();
        assertThat(result.getStance()).isNull();
        assertThat(result.getWhy()).isEmpty();
        assertThat(result.getHow()).extracting("questionIndex").containsExactly(2);
        assertThat(result.getMergedWhyText()).isEmpty();
        assertThat(result.getMergedHowText()).isEqualTo("use better signs");
    }
}