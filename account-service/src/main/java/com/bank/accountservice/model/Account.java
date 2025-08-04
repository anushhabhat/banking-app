package com.bank.accountservice.model;

import java.math.BigDecimal;

import com.bank.userservice.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Column;
import lombok.Data;

@Entity
@Data
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(
    	    name = "user_id",
    	    nullable = false,
    	    foreignKey = @ForeignKey(name = "FK_ACCOUNT_USER", foreignKeyDefinition = "FOREIGN KEY (user_id) REFERENCES USERSERVICE(id) ON DELETE CASCADE")
    	)
    	private User user;


    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    @Column(unique = true, nullable = false, length = 12)
    private String accountNumber;

    private BigDecimal balance;

    private String aadhaarNumber;
    private String address;
    private String state;
    private String pinCode;

    public enum AccountType {
        SAVINGS, CURRENT, SALARY
    }
}