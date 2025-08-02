package com.accountservice.repository;

import com.accountservice.model.TransactionLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionLogRepository extends JpaRepository<TransactionLog, Long> {
}
