package com.example.demo.controller;

import com.example.demo.entity.HowResponse;
import com.example.demo.repository.HowResponseRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/how")
@CrossOrigin
public class HowResponseController {

    private final HowResponseRepository repository;

    public HowResponseController(HowResponseRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public HowResponse submit(@RequestBody HowResponse response) {
        return repository.save(response);
    }
}