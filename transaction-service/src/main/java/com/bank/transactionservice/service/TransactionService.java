package com.bank.transactionservice.service;

import com.bank.common.dto.TransDTO;
import com.bank.common.dto.TransactionRequest;
import com.bank.common.dto.TransactionResponse;
import com.bank.transactionservice.config.AccountClient;
import com.bank.transactionservice.exception.TransactionNotFoundException;
import com.bank.transactionservice.mapper.TransactionMapper;
import com.bank.transactionservice.model.Transaction;
import com.bank.transactionservice.model.Transaction.TransactionStatus;
import com.bank.transactionservice.repository.TransactionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import feign.FeignException;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {
	@Autowired
	private final AccountClient accountClient;
	@Autowired
	private final TransactionRepository transactionRepository;

	public Transaction getTransactionById(Long id) {
		return transactionRepository.findById(id)
				.orElseThrow(() -> new TransactionNotFoundException("Transaction with ID " + id + " not found"));
	}

	public Transaction getTransactionByUserId(Long id) {
		return transactionRepository.findById(id)
				.orElseThrow(() -> new TransactionNotFoundException("Transaction with ID " + id + " not found"));
	}

	@Transactional
	public TransactionResponse transferAmount(TransactionRequest request) {
		StringBuilder sb = new StringBuilder();
		Transaction transaction = new Transaction();
		transaction.setFromAccountUserId(request.getFromUserId());
		transaction.setFromAccount(request.getFromAccount());
		transaction.setFromAccount(request.getFromAccount());
		transaction.setToAccount(request.getToAccount());
		transaction.setAmount(request.getAmount());
		transaction.setTransactionDate(LocalDateTime.now());
		
		try {
	        accountClient.debitAmount(new TransDTO(request.getFromAccount(), request.getAmount()));

	        try {
	            accountClient.creditAmount(new TransDTO(request.getToAccount(), request.getAmount()));
	            transaction.setStatus(TransactionStatus.SUCCESS);

	        } catch (FeignException creditEx) {
	            accountClient.creditAmount(new TransDTO(request.getFromAccount(), request.getAmount())); // rollback
	            transaction.setStatus(TransactionStatus.FAILED);
	            String cleanError = extractErrorMessage(creditEx.contentUTF8());
	            sb.append("Credit Error: ").append(cleanError);
	        }

	    } catch (FeignException debitEx) {
	        transaction.setStatus(TransactionStatus.FAILED);
	        String cleanError = extractErrorMessage(debitEx.contentUTF8());
	        sb.append("Debit Error: ").append(cleanError);
	    }

	    transaction.setFailureReason(sb.toString());
	    transaction = transactionRepository.save(transaction);

	    return TransactionMapper.toResponse(transaction);
	}
	private String extractErrorMessage(String responseBody) {
	    try {
	        ObjectMapper mapper = new ObjectMapper();
	        JsonNode root = mapper.readTree(responseBody);
	        if (root.has("error")) {
	            return root.get("error").asText();
	        }
	    } catch (Exception e) {
	        return "Unknown error format";
	    }
	    return "No error field found";
	}


	public List<TransactionResponse> getTransactionByAccount(Long userId) {
		List<Transaction> transactions = transactionRepository.findByFromAccountUserId(userId);

		return transactions.stream().sorted(Comparator.comparing(Transaction::getTransactionDate).reversed())
				.map(TransactionMapper::toResponse).collect(Collectors.toList());
	}
}
