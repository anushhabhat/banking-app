package com.bank.loanService.service;

import org.springframework.stereotype.Service;

import com.bank.loanService.dto.LoanRequest;
import com.bank.loanService.dto.LoanResponse;
import com.bank.loanService.entity.Loan;
import com.bank.loanService.repository.LoanRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LoanService {

    private final LoanRepository repository;

    public LoanService(LoanRepository repository) {
        this.repository = repository;
    }

    public LoanResponse issueLoan(LoanRequest request) {
        Loan loan = Loan.builder()
                .loanNumber(request.getLoanNumber())
                .amount(request.getAmount())
                .interestRate(request.getInterestRate())
                .termMonths(request.getTermMonths())
                .accountId(request.getAccountId())
                .issueDate(request.getIssueDate())
                .loanType(request.getLoanType())
                .status("ACTIVE")
                .build();

        return toResponse(repository.save(loan));
    }

    public LoanResponse getLoanByNumber(String loanNumber) {
        Loan loan = repository.findByLoanNumber(loanNumber)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        return toResponse(loan);
    }

    public List<LoanResponse> getAllLoans() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private LoanResponse toResponse(Loan loan) {
        return LoanResponse.builder()
                .id(loan.getId())
                .loanNumber(loan.getLoanNumber())
                .amount(loan.getAmount())
                .interestRate(loan.getInterestRate())
                .termMonths(loan.getTermMonths())
                .accountId(loan.getAccountId())
                .loanType(loan.getLoanType())
                .status(loan.getStatus())
                .build();
    }

    public double calculateEmi(String loanNumber) {
        Loan loan = repository.findByLoanNumber(loanNumber)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        double P = loan.getAmount();
        double R = loan.getInterestRate() / 12 / 100;
        int N = loan.getTermMonths();

        double emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
        return Math.round(emi * 100.0) / 100.0;
    }

    public String closeLoan(String loanNumber) {
        Loan loan = repository.findByLoanNumber(loanNumber)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if ("CLOSED".equalsIgnoreCase(loan.getStatus())) {
            return "Loan is already closed";
        }

        loan.setStatus("CLOSED");
        repository.save(loan);
        return "Loan closed successfully";
    }


}
