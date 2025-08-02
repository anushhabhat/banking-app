package com.accountservice.service;

import com.accountservice.dto.TransactionRequest;
import com.accountservice.model.Account;
import com.accountservice.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepo;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public Account create(Account account) {
        return accountRepo.save(account);
    }

    public Optional<Account> get(String accountNumber) {
        return accountRepo.findByAccountNumber(accountNumber);
    }

    public Account deposit(String accountNumber, double amount) {
        Account acc = get(accountNumber).orElseThrow();
        acc.setBalance(acc.getBalance() + amount);
        accountRepo.save(acc);
        kafkaTemplate.send("transactions-topic", "Deposited: " + amount + " to " + accountNumber);
        return acc;
    }

    public Account withdraw(String accountNumber, double amount) {
        Account acc = get(accountNumber).orElseThrow();
        if (acc.getBalance() < amount) throw new RuntimeException("Insufficient funds");
        acc.setBalance(acc.getBalance() - amount);
        accountRepo.save(acc);
        kafkaTemplate.send("transactions-topic", "Withdrawn: " + amount + " from " + accountNumber);
        return acc;
    }

    public void transfer(TransactionRequest tx) {
        withdraw(tx.getFromAccount(), tx.getAmount());
        deposit(tx.getToAccount(), tx.getAmount());
        kafkaTemplate.send("transactions-topic", "Transferred " + tx.getAmount() + " from " + tx.getFromAccount() + " to " + tx.getToAccount());
    }
    
    
}
