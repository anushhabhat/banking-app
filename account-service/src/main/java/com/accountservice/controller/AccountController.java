package com.accountservice.controller;

import com.accountservice.dto.TransactionRequest;
import com.accountservice.model.Account;
import com.accountservice.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService service;

    @PostMapping
    public Account create(@RequestBody Account account) {
        return service.create(account);
    }

    @GetMapping("/{accountNumber}")
    public Account get(@PathVariable String accountNumber) {
        return service.get(accountNumber).orElseThrow();
    }

    @PostMapping("/{accountNumber}/deposit")
    public Account deposit(@PathVariable String accountNumber, @RequestParam double amount) {
        return service.deposit(accountNumber, amount);
    }

    @PostMapping("/{accountNumber}/withdraw")
    public Account withdraw(@PathVariable String accountNumber, @RequestParam double amount) {
        return service.withdraw(accountNumber, amount);
    }

    @PostMapping("/transfer")
    public void transfer(@RequestBody TransactionRequest request) {
        service.transfer(request);
    }
}
