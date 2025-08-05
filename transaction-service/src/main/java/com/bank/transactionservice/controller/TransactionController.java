package com.bank.transactionservice.controller;

import com.bank.common.dto.TransactionRequest;
import com.bank.common.dto.TransactionResponse;
import com.bank.transactionservice.service.TransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins= "*")
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
	
	@Autowired
    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionResponse> makeTransaction(@Valid @RequestBody TransactionRequest request) {
         TransactionResponse result = transactionService.transferAmount(request);
         return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TransactionResponse>> getTransactionByUserName(@PathVariable(name="userId") Long userId){
    		List<TransactionResponse> transaction =transactionService.getTransactionByAccount(userId);
    		return ResponseEntity.ok(transaction);
    }
}
