package com.bank.common.dto;
import java.math.BigDecimal;

import lombok.Data;

@Data
public class AccountDTO {
    private Long id;
    private Long userId;
    private String accountType;
    private String accountNumber;
    private BigDecimal balance;
    private String aadhaarNumber;
    private String address;
    private String state;
    private String pinCode;
}
