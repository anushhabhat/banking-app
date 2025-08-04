package com.bank.loanService.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bank.loanService.dto.LoanRequest;
import com.bank.loanService.dto.LoanResponse;
import com.bank.loanService.service.LoanService;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService service;

    public LoanController(LoanService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<LoanResponse> issueLoan(@RequestBody LoanRequest request) {
        return ResponseEntity.ok(service.issueLoan(request));
    }

    @GetMapping("/{loanNumber}")
    public ResponseEntity<LoanResponse> getLoan(@PathVariable String loanNumber) {
        return ResponseEntity.ok(service.getLoanByNumber(loanNumber));
    }

    @GetMapping
    public ResponseEntity<List<LoanResponse>> getAllLoans() {
        return ResponseEntity.ok(service.getAllLoans());
    }

    @GetMapping("/{loanNumber}/emi")
    public ResponseEntity<Double> getEmi(@PathVariable String loanNumber) {
        return ResponseEntity.ok(service.calculateEmi(loanNumber));
    }

    @PutMapping("/{loanNumber}/close")
    public ResponseEntity<String> closeLoan(@PathVariable String loanNumber) {
        return ResponseEntity.ok(service.closeLoan(loanNumber));
    }

}
