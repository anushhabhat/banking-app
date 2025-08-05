package com.bank.transactionservice.config;

import java.math.BigDecimal;
import java.util.Optional;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bank.common.dto.AccountDTO;
import com.bank.common.dto.TransDTO;

@FeignClient(name="account-service")
public interface AccountClient {
	@GetMapping("/api/v1/account/{accountNumber}")
    Optional<AccountDTO> getAccountByAccountNumber(@PathVariable("accountNumber") String accountNumber);

	
	@PostMapping("/api/v1/account/debit")
    void debitAmount(@RequestBody TransDTO transDTO);

    @PostMapping("/api/v1/account/credit")
    void creditAmount(@RequestBody TransDTO transDTO);
}

