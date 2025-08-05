package com.bank.accountservice.controller;


import com.bank.accountservice.service.AccountService;
import com.bank.common.dto.AccountDTO;
import com.bank.common.dto.CreateAccountRequest;
import com.bank.common.dto.TransDTO;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/v1/account")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;
    
    
    @GetMapping("/{accountNumber}")
    public Optional<AccountDTO> getAccountByAccountNumber(@PathVariable(name="accountNumber") String accountNumber) {
    		return accountService.getAccountByAccountNumber(accountNumber);
    }
    @PostMapping("/debit")
    public ResponseEntity<String> debitAmount(@Valid @RequestBody TransDTO transDTO) {
        accountService.debitAccount(transDTO.getAccountNumber(), transDTO.getAmount());
        return ResponseEntity.ok("Amount debited successfully");
    }

    @PostMapping("/credit")
    public ResponseEntity<String> creditAmount(@Valid @RequestBody TransDTO transDTO) {
        accountService.creditAccount(transDTO.getAccountNumber(), transDTO.getAmount());
        return ResponseEntity.ok("Amount credited successfully");
    }
    
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AccountDTO>> getAccountsByUserId(@PathVariable(name="userId") Long userId) {
    		System.out.println("dfss");
        return ResponseEntity.ok(accountService.getAccountsByUserId(userId));
    }

    @PostMapping("/create")
    public ResponseEntity<AccountDTO> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(accountService.createAccount(request));
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteAccountsByUserId(@PathVariable(name="userId") Long userId) {
        accountService.deleteAccountsByUserId(userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{accountId}")
    public ResponseEntity<Void> deleteAccountById(@PathVariable(name="accountId") Long accountId) {
        accountService.deleteAccountById(accountId);
        return ResponseEntity.noContent().build();
    }
}