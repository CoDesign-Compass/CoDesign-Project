package com.example.demo.dashboard.controller;

import com.example.demo.dashboard.dto.*;
import com.example.demo.dashboard.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Dashboard REST Controller
 * 提供问卷分析和数据看板的 API 接口
 */
@RestController
@RequestMapping("/api/v1/analytics")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    /**
     * 获取仪表板关键指标
     * @return 包含总答题人数、完成率等指标
     */
    @GetMapping("/dashboard/metrics")
    public ResponseEntity<QuestionnaireMetricsDTO> getDashboardMetrics() {
        QuestionnaireMetricsDTO metrics = dashboardService.getQuestionnaireMetrics();
        return ResponseEntity.ok(metrics);
    }

    /**
     * 获取特定问题的选项分布
     * @param questionId 问题ID (如 "question1", "question2" 等)
     * @return 包含选项计数和百分比的分布数据
     */
    @GetMapping("/questions/{questionId}/distributions")
    public ResponseEntity<QuestionDistributionDTO> getQuestionDistribution(
            @PathVariable String questionId) {
        QuestionDistributionDTO distribution = dashboardService.getQuestionDistribution(questionId);
        return ResponseEntity.ok(distribution);
    }

    /**
     * 获取答题路径分布数据
     * @return 所有问题的答题路径分布
     */
    @GetMapping("/respondent-paths")
    public ResponseEntity<List<RespondentPathDTO>> getRespondentPaths() {
        List<RespondentPathDTO> paths = dashboardService.getRespondentPaths();
        return ResponseEntity.ok(paths);
    }

    /**
     * 获取问题列表（支持分页和主题分类）
     * @param theme 主题过滤 (可选，默认 "All")
     * @param page 页码 (从 1 开始)
     * @param pageSize 每页数量 (默认 5)
     * @return 分页的问题列表
     */
    @GetMapping("/questions")
    public ResponseEntity<Map<String, Object>> getQuestions(
            @RequestParam(required = false, defaultValue = "All") String theme,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int pageSize) {
        
        // 将前端的 page 转换为 PageRequest (0-based)
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<QuestionSummaryDTO> questions = dashboardService.getQuestions(theme, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", questions.getContent());
        response.put("currentPage", questions.getNumber() + 1);  // 转换回 1-based
        response.put("totalPages", questions.getTotalPages());
        response.put("totalElements", questions.getTotalElements());
        response.put("pageSize", pageSize);

        return ResponseEntity.ok(response);
    }

    /**
     * 获取问卷漏斗分析数据
     * @return 各步骤的答题人数和脱落率
     */
    @GetMapping("/funnel")
    public ResponseEntity<List<FunnelStepDTO>> getFunnelAnalysis() {
        List<FunnelStepDTO> funnel = dashboardService.getFunnelAnalysis();
        return ResponseEntity.ok(funnel);
    }

    /**
     * 获取所有可用的主题列表
     * @return 主题列表
     */
    @GetMapping("/themes")
    public ResponseEntity<List<String>> getThemes() {
        List<String> themes = dashboardService.getThemes();
        return ResponseEntity.ok(themes);
    }

    /**
     * 健康检查端点
     * @return 服务状态
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Dashboard Analytics API");
        return ResponseEntity.ok(response);
    }
}
