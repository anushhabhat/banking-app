package com.loanservice.controller;

import com.loanservice.model.Loan;
import com.loanservice.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService service;

    @PostMapping
    public Loan create(@RequestBody Loan loan) {
        return service.createLoan(loan);
    }

    @GetMapping("/{accountNumber}")
    public List<Loan> getLoans(@PathVariable String accountNumber) {
        return service.getLoansByAccount(accountNumber);
    }
}
