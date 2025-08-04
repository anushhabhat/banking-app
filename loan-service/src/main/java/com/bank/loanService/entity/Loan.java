package com.bank.loanService.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "loans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String loanNumber;

    private Double amount;

    private Double interestRate;

    private Integer termMonths;

    private Long accountId;

    private LocalDate issueDate;

    @Column(nullable = false)
    private String loanType;

    @Column(nullable = false)
    private String status; // values: ACTIVE, CLOSED

}
