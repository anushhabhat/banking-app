package com.bank.loanService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bank.loanService.entity.Loan;

import java.util.Optional;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    Optional<Loan> findByLoanNumber(String loanNumber);
}
