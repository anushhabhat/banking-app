package com.bank.cardservice.config;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.bank.common.dto.AccountDTO;

import java.util.Optional;

@FeignClient(name = "account-service")
public interface AccountClient {

	@GetMapping("/api/v1/account/{accountNumber}")
    Optional<AccountDTO> getAccountByAccountNumber(@PathVariable("accountNumber") String accountNumber);
}