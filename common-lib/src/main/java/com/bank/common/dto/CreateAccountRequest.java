package com.bank.common.dto;

import java.math.BigDecimal;



import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateAccountRequest {

	@NotNull
    private Long userId;
    @NotBlank
    private String accountType;
    @NotNull
    @DecimalMin(value ="0.00", inclusive = true ,message = "Initial balance should be greater then 0")
    private BigDecimal initialBalance;
    @NotBlank
    private String aadhaarNumber;
    @NotBlank
    private String address;
    @NotBlank
    private String state;
    @NotBlank
    private String pinCode;
}