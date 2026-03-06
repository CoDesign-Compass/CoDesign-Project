package com.example.demo.controller;

import com.example.demo.dto.CreateIssueRequest;
import com.example.demo.dto.IssueResponse;
import com.example.demo.service.IssueService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class IssueController {

  private final IssueService issueService;

  public IssueController(IssueService issueService) {
      this.issueService = issueService;
  }

  @PostMapping("/issues")
  @ResponseStatus(HttpStatus.CREATED)
  public IssueResponse createIssue(@RequestBody CreateIssueRequest request) {
      return issueService.createIssue(request);
  }

  @GetMapping("/issues")
  public List<IssueResponse> getAllIssues() {
      return issueService.getAllIssues();
  }

  @GetMapping("/issues/{issueId}")
  public IssueResponse getIssueById(@PathVariable Long issueId) {
      return issueService.getIssueById(issueId);
  }

  @GetMapping("/share/{shareId}")
  public IssueResponse getIssueByShareId(@PathVariable String shareId) {
      return issueService.getIssueByShareId(shareId);
  }
}
