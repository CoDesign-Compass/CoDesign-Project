package com.example.demo.dashboard.service;

import com.example.demo.dashboard.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Dashboard 业务服务
 * 负责获取和计算问卷分析数据
 */
@Service
public class DashboardService {

    /**
     * 获取问卷仪表板的关键指标
     * @return 包含总答题人数、完成率、平均问题数等的指标数据
     */
    public QuestionnaireMetricsDTO getQuestionnaireMetrics() {
        // TODO: 从数据库实际数据计算
        Map<String, Long> questionCoverage = new HashMap<>();
        questionCoverage.put("q1", 1248L);
        questionCoverage.put("q2", 1089L);
        questionCoverage.put("q3", 967L);
        questionCoverage.put("q4", 845L);
        questionCoverage.put("q5", 723L);

        QuestionnaireMetricsDTO metrics = new QuestionnaireMetricsDTO(
            1248L,      // 总答题人数
            87.3,       // 完成率 %
            4.2,        // 平均问卷数
            questionCoverage
        );
        metrics.setTrend("+12.5%");
        metrics.setTrendUp(true);

        return metrics;
    }

    /**
     * 获取特定问题的选项分布
     * @param questionId 问题ID
     * @return 包含选项及其计数和百分比的分布数据
     */
    public QuestionDistributionDTO getQuestionDistribution(String questionId) {
        // TODO: 从数据库查询真实数据
        List<QuestionOptionDTO> options = new ArrayList<>();
        
        switch (questionId.toLowerCase()) {
            case "question1":
                options.add(new QuestionOptionDTO("Option A", 450L, 36));
                options.add(new QuestionOptionDTO("Option B", 380L, 30));
                options.add(new QuestionOptionDTO("Option C", 280L, 22));
                options.add(new QuestionOptionDTO("Option D", 138L, 12));
                break;
            case "question2":
                options.add(new QuestionOptionDTO("Yes", 654L, 60));
                options.add(new QuestionOptionDTO("No", 435L, 40));
                break;
            case "question3":
                options.add(new QuestionOptionDTO("Very Satisfied", 290L, 30));
                options.add(new QuestionOptionDTO("Satisfied", 387L, 40));
                options.add(new QuestionOptionDTO("Neutral", 193L, 20));
                options.add(new QuestionOptionDTO("Dissatisfied", 97L, 10));
                break;
            default:
                options.add(new QuestionOptionDTO("No data", 0L, 0));
        }

        long totalCount = options.stream()
            .mapToLong(QuestionOptionDTO::getCount)
            .sum();

        return new QuestionDistributionDTO(
            questionId,
            "Q: " + questionId.toUpperCase(),
            options,
            totalCount
        );
    }

    /**
     * 获取答题路径分布数据
     * @return 不同路径的答题人数分布
     */
    public List<RespondentPathDTO> getRespondentPaths() {
        // TODO: 从数据库计算真实路径数据
        List<RespondentPathDTO> paths = new ArrayList<>();

        String[] questions = {"Q1", "Q2", "Q3", "Q4", "Q5"};
        int[][] pathData = {
            {320, 280, 450, 198},
            {280, 320, 380, 109},
            {250, 290, 320, 107},
            {220, 250, 280, 95},
            {190, 210, 240, 83}
        };

        for (int i = 0; i < questions.length; i++) {
            Map<String, Long> distribution = new HashMap<>();
            distribution.put("Path A", (long) pathData[i][0]);
            distribution.put("Path B", (long) pathData[i][1]);
            distribution.put("Path C", (long) pathData[i][2]);
            distribution.put("Path D", (long) pathData[i][3]);
            
            paths.add(new RespondentPathDTO(questions[i], distribution));
        }

        return paths;
    }

    /**
     * 获取问题列表（支持分页和分类）
     * @param theme 主题过滤（可选）
     * @param pageable 分页信息
     * @return 问题列表分页数据
     */
    public Page<QuestionSummaryDTO> getQuestions(String theme, Pageable pageable) {
        // TODO: 从数据库查询真实数据
        List<QuestionSummaryDTO> allQuestions = generateMockQuestions();

        // 按主题过滤
        List<QuestionSummaryDTO> filtered = allQuestions;
        if (theme != null && !theme.equals("All")) {
            filtered = allQuestions.stream()
                .filter(q -> q.getTheme().equals(theme))
                .toList();
        }

        // 手动分页
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), filtered.size());
        
        List<QuestionSummaryDTO> pageContent = filtered.subList(start, end);
        return new PageImpl<>(pageContent, pageable, filtered.size());
    }

    /**
     * 获取问卷漏斗分析数据
     * @return 各步骤的答题人数和脱落率
     */
    public List<FunnelStepDTO> getFunnelAnalysis() {
        // TODO: 从数据库计算真实数据
        List<FunnelStepDTO> steps = new ArrayList<>();

        long[] respondents = {1248, 1089, 967, 845, 723};
        double[] dropRates = {0, 12.7, 11.2, 12.6, 14.4};

        for (int i = 0; i < 5; i++) {
            double percentage = (respondents[i] / 1248.0) * 100;
            steps.add(new FunnelStepDTO(
                "Q" + (i + 1),
                respondents[i],
                respondents[i],
                dropRates[i],
                percentage
            ));
        }

        return steps;
    }

    /**
     * 获取所有问题的主题列表
     * @return 主题列表
     */
    public List<String> getThemes() {
        return Arrays.asList("All", "Transportation", "Housing & Living", 
                           "Food & Consumption", "Digital Life", "Entertainment & Leisure");
    }

    // ===== 辅助方法 =====

    private List<QuestionSummaryDTO> generateMockQuestions() {
        // TODO: 替换为从数据库查询
        List<QuestionSummaryDTO> questions = new ArrayList<>();
        String[] themes = {"Transportation", "Housing & Living", "Food & Consumption", "Digital Life", "Entertainment & Leisure"};
        String[] questions_text = {
            "What's your main way to get to work/school?",
            "What matters most to you in your living environment?",
            "What is your most common way of eating?",
            "What type of apps do you use most often?",
            "What is your favorite way to spend free time?"
        };

        for (int i = 0; i < 5; i++) {
            long reached = Math.max(300, 1248 - i * 12);
            double reachRate = Math.max(30, 100 - i * 0.7);
            
            questions.add(new QuestionSummaryDTO(
                "Q" + (i + 1),
                questions_text[i % questions_text.length],
                themes[i % themes.length],
                reached,
                reachRate,
                (i * 10) + " min ago"
            ));
        }

        return questions;
    }
}
