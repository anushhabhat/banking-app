package com.bank.common.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long fromUserId;
    private String fromAccount;
    private String toAccount;
    private BigDecimal amount;
    private String status;
    private LocalDateTime transactionDate;
    private String failureReason="No Error";
}
