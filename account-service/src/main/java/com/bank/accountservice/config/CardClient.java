package com.bank.accountservice.config;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "card-service")
public interface CardClient {

    @DeleteMapping("/api/v1/cards/account/{accountId}")
    void deleteCardsByAccountNumber(@PathVariable("accountId") Long accountId);
}