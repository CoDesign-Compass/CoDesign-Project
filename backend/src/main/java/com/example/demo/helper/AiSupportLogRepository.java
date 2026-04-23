package com.example.demo.helper;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AiSupportLogRepository extends JpaRepository<AiSupportLog, Long> {
}
