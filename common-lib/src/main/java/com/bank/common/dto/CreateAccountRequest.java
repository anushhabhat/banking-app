package com.bank.common.dto;


import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateAccountRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Account type is required")
    private String accountType;

    @NotNull(message = "Initial balance is required")
    @DecimalMin(value = "0.00", inclusive = true, message = "Initial balance should be greater than or equal to 0")
    private BigDecimal initialBalance;

    @NotBlank(message = "Aadhaar number is required")
    private String aadhaarNumber;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Pin code is required")
    private String pinCode;
}
