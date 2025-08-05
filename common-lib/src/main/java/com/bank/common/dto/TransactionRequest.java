package com.bank.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TransactionRequest {
	
	@NotNull(message = "User ID is required")
    private Long fromUserId;
	
	@Pattern(regexp = "\\d{12}", message = "Account number must be of 12 digits")
    @NotBlank(message = "Sender's account number is required")
    private String fromAccount;
	
	@Pattern(regexp = "\\d{12}", message = "Account number must be of 12 digits")
    @NotBlank(message = "Reciver's account number is required")
    private String toAccount;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;
}
