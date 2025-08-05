package com.bank.common.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransDTO {
	@NotNull(message = "Account Number is required")
    @Pattern(regexp = "\\d{12}", message = "Account number must be of 12 digits")
	String accountNumber;
	
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
	BigDecimal amount;
}
