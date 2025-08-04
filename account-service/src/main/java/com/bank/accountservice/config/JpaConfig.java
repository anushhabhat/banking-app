package com.bank.accountservice.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@EntityScan(basePackages = {"com.bank.accountservice.model", "com.bank.userservice.model"})
public class JpaConfig {
}