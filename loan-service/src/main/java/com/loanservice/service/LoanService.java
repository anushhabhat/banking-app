package com.loanservice.service;

import com.loanservice.model.Loan;
import com.loanservice.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository repo;
    private final KafkaTemplate<String, String> kafka;

    public Loan createLoan(Loan loan) {
        loan.setIssuedDate(LocalDate.now());
        Loan saved = repo.save(loan);
        kafka.send("loans-topic", "Loan issued to: " + loan.getAccountNumber() + " amount: " + loan.getAmount());
        return saved;
    }

    public List<Loan> getLoansByAccount(String accountNumber) {
        return repo.findByAccountNumber(accountNumber);
    }
}
