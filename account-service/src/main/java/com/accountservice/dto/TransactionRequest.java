package com.accountservice.dto;

import lombok.Data;

@Data
public class TransactionRequest {
    private String fromAccount;
    private String toAccount;
    private Double amount;
}
