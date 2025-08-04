package com.bank.accountservice.service;


import com.bank.accountservice.config.CardClient;
import com.bank.accountservice.model.Account;
import com.bank.accountservice.repository.AccountRepository;
import com.bank.common.dto.AccountDTO;
import com.bank.common.dto.CreateAccountRequest;
import com.bank.userservice.model.User;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private static final SecureRandom random = new SecureRandom();
    @Autowired
    private CardClient cardClient;
    
    public Optional<AccountDTO> getAccountByAccountNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
        		.map(this::convertToDTO);        
    }
    
    
    public List<AccountDTO> getAccountsByUserId(Long userId) {
        List<Account> accounts = accountRepository.findByUserId(userId);
        return accounts.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public AccountDTO createAccount(CreateAccountRequest request) {
        // Validate account type
        Account.AccountType accountType;
        try {
            accountType = Account.AccountType.valueOf(request.getAccountType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid account type: " + request.getAccountType());
        }

        // Check account limit (max 3 accounts per user)
//        List<Account> userAccounts = accountRepository.findByUserId(request.getUserId());
//        if (userAccounts.size() >= 3) {
//            throw new IllegalStateException("User already has the maximum of 3 accounts");
//        }

        // Check for duplicate account type
        if (accountRepository.existsByUserIdAndAccountType(request.getUserId(), accountType)) {
            throw new IllegalStateException("User already has an account of type " + accountType);
        }

        // Generate random 12-digit account number
        String accountNumber;
        do {
            accountNumber = generateAccountNumber();
        } while (accountRepository.existsByAccountNumber(accountNumber));

        Account account = new Account();
        User user = new User();
        user.setId(request.getUserId());
        account.setUser(user);
        account.setAccountType(accountType);
        account.setAccountNumber(accountNumber);
        account.setBalance(request.getInitialBalance());
        account.setAadhaarNumber(request.getAadhaarNumber());
        account.setAddress(request.getAddress());
        account.setState(request.getState());
        account.setPinCode(request.getPinCode());
        account = accountRepository.save(account);

        return convertToDTO(account);
    }

    @Transactional
    public void deleteAccountsByUserId(Long userId) {
        accountRepository.deleteByUserId(userId);
    }

    @Transactional
    public void deleteAccountById(Long accountId) {
        if (!accountRepository.existsById(accountId)) {
            throw new IllegalArgumentException("Account with ID " + accountId + " not found");
        }
        cardClient.deleteCardsByAccountNumber(accountId);
        accountRepository.deleteById(accountId);
    }

    private AccountDTO convertToDTO(Account account) {
        AccountDTO dto = new AccountDTO();
        dto.setId(account.getId());
        dto.setUserId(account.getUser().getId());
        dto.setAccountType(account.getAccountType().name());
        dto.setAccountNumber(account.getAccountNumber());
        dto.setBalance(account.getBalance());
        dto.setAadhaarNumber(account.getAadhaarNumber());
        dto.setAddress(account.getAddress());
        dto.setState(account.getState());
        dto.setPinCode(account.getPinCode());
        return dto;
    }

    private String generateAccountNumber() {
        StringBuilder accountNumber = new StringBuilder();
        for (int i = 0; i < 12; i++) {
            accountNumber.append(random.nextInt(10));
        }
        return accountNumber.toString();
    }
}