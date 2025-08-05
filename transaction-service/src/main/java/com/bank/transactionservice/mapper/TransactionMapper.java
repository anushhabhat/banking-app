package com.bank.transactionservice.mapper;


import com.bank.common.dto.TransactionResponse;
import com.bank.transactionservice.model.Transaction;

public class TransactionMapper {

    public static TransactionResponse toResponse(Transaction transaction) {
        TransactionResponse response = new TransactionResponse();
        response.setFromUserId(transaction.getFromAccountUserId());
        response.setFromAccount(transaction.getFromAccount());
        response.setToAccount(transaction.getToAccount());
        response.setAmount(transaction.getAmount());
//        response.setFromUserId(transaction.getFromAccountUserId());
        response.setStatus(transaction.getStatus().name());
        response.setTransactionDate(transaction.getTransactionDate());
        response.setFailureReason(transaction.getFailureReason());
        return response;
    }
}
