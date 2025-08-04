package com.bank.common.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardRequestDTO {

    @NotNull(message = "Card type is required")
    private String cardType;

    @NotNull(message = "Card Name is required")
    private String cardName; 

    @NotNull(message = "Card Issuer is Required")
    private String cardIssuerCompany;

    @NotNull(message = "Account Number is required")
    @Pattern(regexp = "\\d{12}", message = "Account number must be of 12 digits")
    private String accountNumber;
}
