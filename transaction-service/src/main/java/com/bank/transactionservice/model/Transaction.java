package com.bank.transactionservice.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "TRANSACTION")
@Data
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "from_account")
    private String fromAccount;

    @Column(name = "to_account")
    private String toAccount;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "from_account_user_id")
    private Long fromAccountUserId;
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private TransactionStatus status;


    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;
    
    private String failureReason="No Error";

    public enum TransactionStatus {
        SUCCESS, FAILED
    }
}
