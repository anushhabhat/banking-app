package com.bank.loanService.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanRequest {
    private String loanNumber;
    private Double amount;
    private Double interestRate;
    private Integer termMonths;
    private Long accountId;
    private LocalDate issueDate;
    private String loanType;

}
