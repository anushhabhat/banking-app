package com.bank.loanService.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanResponse {
    private Long id;
    private String loanNumber;
    private Double amount;
    private Double interestRate;
    private Integer termMonths;
    private Long accountId;
    private String loanType;
    private String status;

}
