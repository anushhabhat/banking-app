package com.bank.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardResponseDTO {
    private Long id;
    private String cardNumber;
    private String cardName;
    private String cardExpiry;
    private String cardIssuerCompany;
    private String cvv;
    private String cardType;
}
