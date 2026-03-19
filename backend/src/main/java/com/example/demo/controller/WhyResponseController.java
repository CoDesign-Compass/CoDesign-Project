package com.example.demo.controller;

import com.example.demo.entity.WhyResponse;
import com.example.demo.repository.WhyResponseRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/why")
@CrossOrigin
public class WhyResponseController {

    private final WhyResponseRepository repository;

    public WhyResponseController(WhyResponseRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public WhyResponse submit(@RequestBody WhyResponse response) {
        return repository.save(response);
    }
}