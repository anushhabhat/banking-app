package com.bank.cardservice.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name="card")
public class Card {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "cardName", nullable = false)
	private String cardName;

	@Column(name = "cardExpiry", nullable = false)
	private LocalDate cardExpiry;

	@Column(name = "cardNumber", nullable = false)
	private String cardNumber;
	
	@Column(name = "cvvNumber", nullable = false)
	private String cvvNumber;

	@Enumerated(EnumType.STRING)
	@Column(name = "cardType", nullable = false)
	private CardType cardType;
	
	@Enumerated(EnumType.STRING)
	@Column(name="cardIssuer",nullable = false)
	private CardIssuer cardIssuer;
	
	
	@Column(name = "account_number", nullable = false, length = 12)
    private Long account;

	// Enum for cardType
	public enum CardType {
		DEBIT, CREDIT
	}
	public enum CardIssuer{
		MASTERCARD, RUPAY, VISA
	}
}
