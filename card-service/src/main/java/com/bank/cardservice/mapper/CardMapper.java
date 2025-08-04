package com.bank.cardservice.mapper;

import java.time.format.DateTimeFormatter;

import com.bank.cardservice.model.Card;
import com.bank.common.dto.CardResponseDTO;

public class CardMapper {
	static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/yy");
	public static CardResponseDTO toDTO(Card card){
		return CardResponseDTO.builder()
				.id(card.getId())
				.cvv(card.getCvvNumber())
				.cardType(card.getCardType().name())
				.cardName(card.getCardName())
				.cardExpiry(card.getCardExpiry().format(formatter))
				.cardIssuerCompany(card.getCardIssuer().name())
				.cardNumber(card.getCardNumber())
				.build();				
				
	}
}
